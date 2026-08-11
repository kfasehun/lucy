# Lucy upload backend

The store's **Publish a skill** form (on the website) sends an uploaded skill here. This
Worker validates it, then opens a **Pull Request** against `kfasehun/lucy`. Nothing ever
lands on `main` automatically — a human reviews and merges every upload.

It runs on **Cloudflare Workers**, not on GitHub Pages (Pages can't run code). The source is
[`upload-worker.js`](upload-worker.js), version-controlled here so it can be reviewed.

Deploying is a one-time, ~10-minute job. You need a (free) Cloudflare account and the ability
to create a GitHub token. **The token and passphrase are secrets — set them in Cloudflare, and
never commit them or paste them into chat.**

---

## 1. Create the GitHub token (fine-grained PAT)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Resource owner:** your account. **Repository access:** *Only select repositories* → `lucy`.
3. **Repository permissions:**
   - **Contents** → *Read and write*
   - **Pull requests** → *Read and write*
4. Set an expiry you're comfortable rotating (e.g. 90 days). Generate, and copy the `github_pat_…`
   value. You'll paste it into Cloudflare in step 3 — nowhere else.

> Least privilege on purpose: this token can open PRs on `lucy` and nothing else. If it ever
> leaks, revoke it in the same screen and generate a new one.

## 2. Create the Worker

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Create Worker**.
2. Name it e.g. `lucy-upload`. Deploy the default, then **Edit code**.
3. Delete the sample code, paste the entire contents of [`upload-worker.js`](upload-worker.js),
   and **Deploy**.

## 3. Add the secrets and settings

Worker → **Settings → Variables and Secrets**.

**Secrets** (click *Encrypt* so they're write-only):

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | the `github_pat_…` from step 1 |
| `UPLOAD_PASSPHRASE` | a passphrase you share with the team (e.g. in the store channel) |

**Plain variables** (optional — the Worker defaults to these already):

| Name | Default |
|---|---|
| `REPO_OWNER` | `kfasehun` |
| `REPO_NAME` | `lucy` |
| `BASE_BRANCH` | `main` |
| `ALLOWED_ORIGINS` | `https://kfasehun.github.io,http://127.0.0.1:8787,http://localhost:8787` |

**Deploy** again so the secrets take effect. Copy the Worker URL — it looks like
`https://lucy-upload.<your-subdomain>.workers.dev`.

## 4. Point the site at the Worker

In [`registry/meta.json`](../registry/meta.json), set the `upload` field under `product`:

```json
"product": {
  ...
  "upload": "https://lucy-upload.<your-subdomain>.workers.dev"
}
```

Then rebuild and publish the site:

```bash
bash scripts/package.sh
git add -A && git commit -m "Enable skill uploads" && git push
```

Once GitHub Pages redeploys, the **Publish a skill** button submits real PRs. Until `upload`
is set, the form still loads but shows "Uploads aren't switched on yet" and stays disabled.

---

## Test it

1. Open the store, click **Publish a skill**.
2. Drop a throwaway `SKILL.md` (with `name:` and `description:` frontmatter), fill the fields,
   enter the passphrase, and submit.
3. You should get a PR link. Open it, confirm the files landed under `skills/<name>/`, then
   **close the PR** (don't merge the test).

Quick endpoint check from a terminal (should return `{"ok":true,...}`):

```bash
curl https://lucy-upload.<your-subdomain>.workers.dev
```

## What the Worker enforces

Server-side, regardless of what the browser allowed:

- **Passphrase** must match `UPLOAD_PASSPHRASE` (constant-time compare).
- **Slug** `^[a-z0-9][a-z0-9-]{1,48}$`, and the folder name must equal the SKILL.md `name:`.
- **No overwriting** existing core/system skills (reserved list in the source).
- **No data files** (`.csv`, `.xlsx`, `.tsv`, `.sqlite`, …) and **no bulk emails** (>5 in a file).
- **Size caps:** 512 KB/file, 1 MB total, 30 files max.
- Requires a `SKILL.md` with `name:` + `description:` frontmatter.
- Writes `skills/<name>/…` **and** best-effort adds a `registry/meta.json` entry (always
  `status: optional`), then opens the PR. The reviewer runs `scripts/package.sh` before merging.

## Rotating / disabling

- **Rotate the passphrase:** change `UPLOAD_PASSPHRASE` in Cloudflare and tell the team.
- **Rotate the token:** revoke on GitHub, generate a new one, update `GITHUB_TOKEN`.
- **Turn uploads off entirely:** set `product.upload` back to `""` in `meta.json`, rebuild, push.
  (Optionally delete the Worker.)
