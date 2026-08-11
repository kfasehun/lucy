/**
 * Lucy — skill upload Worker (Cloudflare Workers)
 *
 * Accepts a self-generated skill from the store's upload form, re-validates it
 * server-side (the browser's checks are a convenience, not a gate), then opens a
 * Pull Request against the store repo. It never commits to `main` directly — a
 * human reviews every upload before the team's `sync lucy` can pick it up.
 *
 * This file is version-controlled for review. It runs on Cloudflare, not on
 * GitHub Pages. See backend/README.md for deploy steps.
 *
 * Required secrets (set in the Cloudflare dashboard → Worker → Settings → Variables):
 *   GITHUB_TOKEN       fine-grained PAT for kfasehun/lucy: Contents R/W + Pull requests R/W
 *   UPLOAD_PASSPHRASE  the shared passphrase uploaders must enter
 *
 * Optional plain vars (defaults shown):
 *   REPO_OWNER = "kfasehun"
 *   REPO_NAME  = "lucy"
 *   BASE_BRANCH = "main"
 *   ALLOWED_ORIGINS = "https://kfasehun.github.io,http://127.0.0.1:8787,http://localhost:8787"
 */

const LIMITS = {
  maxFiles: 30,
  maxFileBytes: 512 * 1024,   // 512 KB per file
  maxTotalBytes: 1024 * 1024, // 1 MB total
  maxEmails: 5,               // more than this in one file reads like a contact list
};

// New uploads may never overwrite the system/core skills. Renaming to an
// existing skill has to go through git review, not the open endpoint.
const RESERVED = new Set([
  "lucy-sync", "lucy-publish", "lucy-report",
  "prospecting-engine", "prospecting-onboarding", "human-messaging",
  "objection-handler", "followup-noshow", "warm-opener", "call-needs-assessment",
]);

const DATA_EXT = /\.(csv|tsv|xlsx?|xlsm|numbers|parquet|db|sqlite)$/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,48}$/;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET") return json({ ok: true, service: "lucy-upload" }, 200, cors);
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, cors);

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Body must be JSON." }, 400, cors);
    }

    // ---- passphrase gate ----
    if (!env.UPLOAD_PASSPHRASE) return json({ error: "Server missing UPLOAD_PASSPHRASE." }, 500, cors);
    if (!timingSafeEqual(String(payload.passphrase || ""), env.UPLOAD_PASSPHRASE)) {
      return json({ error: "Wrong passphrase." }, 401, cors);
    }

    // ---- validate ----
    const v = validateSubmission(payload);
    if (v.error) return json({ error: v.error }, 400, cors);
    const skill = v.skill;

    // ---- open the PR ----
    try {
      const result = await openPullRequest(skill, payload.submitter, env);
      return json({ ok: true, pr: result.html_url, number: result.number }, 200, cors);
    } catch (e) {
      return json({ error: "Could not open the pull request: " + (e && e.message || e) }, 502, cors);
    }
  },
};

/* ------------------------------------------------------------------ */
/* validation                                                          */
/* ------------------------------------------------------------------ */
function validateSubmission(p) {
  const s = p && p.skill;
  if (!s || typeof s !== "object") return { error: "Missing skill payload." };

  const name = String(s.name || "").trim();
  if (!SLUG_RE.test(name)) return { error: "Skill name must be a slug: lowercase letters, numbers and dashes (2–49 chars)." };
  if (RESERVED.has(name)) return { error: `“${name}” is a core skill already in the store. Pick a different name for a new skill.` };

  const files = Array.isArray(s.files) ? s.files : [];
  if (!files.length) return { error: "No files in the upload." };
  if (files.length > LIMITS.maxFiles) return { error: `Too many files (max ${LIMITS.maxFiles}).` };

  let total = 0;
  const seen = new Set();
  const clean = [];
  let skillMd = null;

  for (const f of files) {
    const path = String(f && f.path || "").replace(/\\/g, "/").trim();
    if (!path) return { error: "A file is missing its path." };
    if (path.startsWith("/") || path.includes("..") || path.includes("\0"))
      return { error: `Unsafe file path: ${path}` };
    if (DATA_EXT.test(path))
      return { error: `Data files are not allowed in the store (${path}). Skills and empty templates only.` };
    if (seen.has(path)) return { error: `Duplicate file: ${path}` };
    seen.add(path);

    const encoding = f.encoding === "base64" ? "base64" : "utf8";
    const raw = String(f.content || "");
    const bytes = encoding === "base64" ? Math.floor(raw.length * 3 / 4) : utf8Bytes(raw);
    if (bytes > LIMITS.maxFileBytes) return { error: `${path} is too large (max ${LIMITS.maxFileBytes / 1024} KB).` };
    total += bytes;
    if (total > LIMITS.maxTotalBytes) return { error: `Upload is too large in total (max ${LIMITS.maxTotalBytes / 1024} KB).` };

    if (encoding === "utf8") {
      const emails = (raw.match(EMAIL_RE) || []).length;
      if (emails > LIMITS.maxEmails)
        return { error: `${path} contains ${emails} email addresses — that looks like contact data, which never goes in this public repo.` };
    }

    const base = path.split("/").pop().toLowerCase();
    if (base === "skill.md" && !path.slice(0, -"skill.md".length).includes("/")) skillMd = raw;
    clean.push({ path, encoding, content: raw });
  }

  if (skillMd == null) return { error: "Every skill needs a SKILL.md at its root." };
  const fm = frontmatter(skillMd);
  if (!fm.name) return { error: "SKILL.md frontmatter is missing a `name:`." };
  if (!fm.description) return { error: "SKILL.md frontmatter is missing a `description:` (the when-to-use line)." };
  if (fm.name.trim() !== name)
    return { error: `The folder name “${name}” must match the SKILL.md \`name: ${fm.name.trim()}\`.` };

  // Metadata for registry/meta.json. Community uploads are always "optional".
  const roles = Array.isArray(s.roles)
    ? s.roles.filter(r => ["BDR", "AE", "CSM"].includes(r))
    : [];
  const meta = {
    title: cap(String(s.title || name), 80),
    summary: cap(String(s.summary || ""), 400),
    why: cap(String(s.why || ""), 200),
    status: "optional",
    roles,
    author: cap(String(s.author || "Community"), 80),
    company: cap(String(s.company || ""), 80),
  };

  return { skill: { name, files: clean, meta } };
}

/* ------------------------------------------------------------------ */
/* GitHub: create branch, commit files (+ meta.json entry), open PR    */
/* ------------------------------------------------------------------ */
async function openPullRequest(skill, submitter, env) {
  const owner = env.REPO_OWNER || "kfasehun";
  const repo = env.REPO_NAME || "lucy";
  const base = env.BASE_BRANCH || "main";
  const api = `https://api.github.com/repos/${owner}/${repo}`;

  const gh = async (path, init = {}) => {
    const r = await fetch(api + path, {
      ...init,
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept": "application/vnd.github+json",
        "User-Agent": "lucy-upload-worker",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    if (!r.ok) throw new Error(`GitHub ${init.method || "GET"} ${path} → ${r.status} ${await r.text()}`);
    return r.json();
  };

  // 1. base commit + tree
  const ref = await gh(`/git/ref/heads/${base}`);
  const baseSha = ref.object.sha;
  const baseCommit = await gh(`/git/commits/${baseSha}`);
  const baseTree = baseCommit.tree.sha;

  // 2. blobs for the skill files
  const treeItems = [];
  for (const f of skill.files) {
    const blob = await gh(`/git/blobs`, {
      method: "POST",
      body: JSON.stringify(
        f.encoding === "base64"
          ? { content: f.content, encoding: "base64" }
          : { content: f.content, encoding: "utf-8" }
      ),
    });
    treeItems.push({ path: `skills/${skill.name}/${f.path}`, mode: "100644", type: "blob", sha: blob.sha });
  }

  // 3. best-effort: add the registry/meta.json entry so the PR is near-complete
  let metaNote = "⚠️ Could not auto-add a registry/meta.json entry — a maintainer should add one.";
  try {
    const metaFile = await gh(`/contents/registry/meta.json?ref=${base}`);
    const metaJson = JSON.parse(b64decode(metaFile.content));
    metaJson.skills = metaJson.skills || {};
    if (!metaJson.skills[skill.name]) {
      metaJson.skills[skill.name] = {
        ...skill.meta,
        added: today(),
      };
      const blob = await gh(`/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: JSON.stringify(metaJson, null, 2) + "\n", encoding: "utf-8" }),
      });
      treeItems.push({ path: "registry/meta.json", mode: "100644", type: "blob", sha: blob.sha });
      metaNote = "✅ Added a `registry/meta.json` entry (status: optional).";
    } else {
      metaNote = `⚠️ \`${skill.name}\` already has a registry entry — left it untouched.`;
    }
  } catch (e) {
    metaNote += " (" + (e && e.message || e) + ")";
  }

  // 4. new tree + commit
  const newTree = await gh(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree: treeItems }),
  });
  const branch = `upload/${skill.name}-${Date.now()}`;
  const commit = await gh(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: `Add skill: ${skill.name} (community upload)`,
      tree: newTree.sha,
      parents: [baseSha],
    }),
  });

  // 5. branch ref → PR
  await gh(`/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commit.sha }),
  });

  const who = submitter ? String(submitter).slice(0, 80) : "someone via the store upload form";
  const body = [
    `**${skill.meta.title}** (\`${skill.name}\`) was uploaded by ${who}.`,
    ``,
    skill.meta.summary || "_No summary provided._",
    ``,
    `${metaNote}`,
    ``,
    `### Before merging`,
    `- [ ] Read the SKILL.md — does it do what it claims, and is it safe for the whole team to auto-install?`,
    `- [ ] Confirm there is **no** prospect data, contact list, or individual numbers.`,
    `- [ ] Adjust the \`registry/meta.json\` entry if needed (roles, summary, core vs optional).`,
    `- [ ] Run \`scripts/package.sh\` and commit the result so the store rebuilds.`,
    ``,
    `_Opened automatically by the Lucy upload Worker. Files landed under \`skills/${skill.name}/\`._`,
  ].join("\n");

  return gh(`/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: `Add skill: ${skill.name}`,
      head: branch,
      base,
      body,
      maintainer_can_modify: true,
    }),
  });
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS ||
    "https://kfasehun.github.io,http://127.0.0.1:8787,http://localhost:8787")
    .split(",").map(s => s.trim());
  const ok = allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}
function frontmatter(text) {
  const out = {};
  if (!text.startsWith("---")) return out;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return out;
  for (const line of text.slice(3, end).split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (m) out[m[1].toLowerCase()] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function utf8Bytes(s) { return new TextEncoder().encode(s).length; }
function cap(s, n) { return s.length > n ? s.slice(0, n) : s; }
function b64decode(s) { return atob(s.replace(/\n/g, "")); }
function today() { return new Date().toISOString().slice(0, 10); }
