#!/usr/bin/env bash
# Rebuilds everything the Lucy store website serves.
#
#   registry/skills.json   catalog + current hashes
#   dist/<name>.skill      one-click install files
#   docs/data/*.json       what the site reads
#   docs/dist/*.skill      what the Install button downloads
#
# Run this after adding or changing any skill, then commit the result.
# Safe to run repeatedly.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

command -v python3 >/dev/null || { echo "python3 required"; exit 1; }
command -v zip >/dev/null || { echo "zip required"; exit 1; }

echo "Lucy: packaging from $ROOT"

# Clean if we can. Some synced or mounted folders forbid deletion, in which case
# we overwrite in place and say so rather than dying.
if ! rm -rf dist docs/dist docs/data 2>/dev/null; then
  echo "  note: could not clear old build output, overwriting in place"
fi
mkdir -p dist docs/dist docs/data

# --- 1. .skill install files (a zip of the skill folder, named .skill) ---
count=0
for d in skills/*/; do
  name="$(basename "$d")"
  ( cd skills && zip -q -r "../dist/${name}.skill" "$name" -x '*.DS_Store' )
  count=$((count + 1))
done
echo "  packaged $count skills"

# --- 2. registry/skills.json: meta.json plus live hashes ---
python3 - <<'PY'
import hashlib, json, os, subprocess, datetime

root = os.getcwd()
meta = json.load(open("registry/meta.json"))

def file_hash(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def skill_hash(folder):
    """Hash of the whole skill folder, stable regardless of walk order."""
    parts = []
    for dirpath, dirnames, filenames in os.walk(folder):
        dirnames.sort()
        for fn in sorted(filenames):
            if fn == ".DS_Store":
                continue
            p = os.path.join(dirpath, fn)
            parts.append(os.path.relpath(p, folder) + ":" + file_hash(p))
    return hashlib.sha256("\n".join(parts).encode()).hexdigest()[:16]

def last_changed(folder):
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", folder],
            capture_output=True, text=True, timeout=10,
        ).stdout.strip()
        return out[:10] or None
    except Exception:
        return None

plugin = json.load(open(".claude-plugin/plugin.json"))
skills = []

for name in sorted(os.listdir("skills")):
    folder = os.path.join("skills", name)
    if not os.path.isdir(folder):
        continue
    m = meta["skills"].get(name)
    if not m:
        print(f"  WARNING: skills/{name} has no registry/meta.json entry, using fallbacks")
        m = {"title": name, "summary": "", "why": "", "status": "optional",
             "roles": [], "author": "unknown", "company": "", "added": None}
    files = sum(len(fs) for _, _, fs in os.walk(folder))
    skills.append({
        "name": name,
        "title": m.get("title", name),
        "summary": m.get("summary", ""),
        "why": m.get("why", ""),
        "status": m.get("status", "optional"),
        "roles": m.get("roles", []),
        "author": m.get("author", "unknown"),
        "company": m.get("company", ""),
        "added": m.get("added"),
        "updated": last_changed(folder),
        "files": files,
        "hash": skill_hash(folder),
        "install": f"dist/{name}.skill",
    })

out = {
    "product": meta["product"],
    "version": plugin["version"],
    "generated": datetime.datetime.now(datetime.timezone.utc)
                 .replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    "skills": skills,
}
json.dump(out, open("registry/skills.json", "w"), indent=2)
print(f"  registry: {len(skills)} skills, version {plugin['version']}")
PY

# --- 3. docs/data/fleet.json: aggregate only, no names ever ---
python3 - <<'PY'
import glob, json, os, collections, datetime

machines, reports = [], []
for p in sorted(glob.glob("fleet/*.json")):
    try:
        machines.append(json.load(open(p)))
    except Exception:
        print(f"  WARNING: could not read {p}")
for p in sorted(glob.glob("fleet/reports/*.json")):
    try:
        reports.append(json.load(open(p)))
    except Exception:
        print(f"  WARNING: could not read {p}")

# Adoption and drift, counted not named.
installed = collections.Counter()
drifted = collections.Counter()
local_only = collections.Counter()
versions = collections.Counter()

for m in machines:
    versions[m.get("lucy_version", "unknown")] += 1
    for skill, state in (m.get("skills") or {}).items():
        if state in ("current", "outdated", "edited-locally"):
            installed[skill] += 1
        if state == "edited-locally":
            drifted[skill] += 1
        if state == "local-only":
            local_only[skill] += 1

# Outcomes, summed across sellers. Never per seller.
totals = collections.Counter()
per_skill = collections.defaultdict(lambda: collections.Counter())
for r in reports:
    counts = r.get("counts") or {}
    for k, v in counts.items():
        if isinstance(v, (int, float)):
            totals[k] += v
    for skill in r.get("skills_running") or []:
        per_skill[skill]["reports"] += 1
        for k, v in counts.items():
            if isinstance(v, (int, float)):
                per_skill[skill][k] += v

out = {
    "generated": datetime.datetime.now(datetime.timezone.utc)
                 .replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    "machines_reporting": len(machines),
    "reports_received": len(reports),
    "versions": dict(versions),
    "adoption": dict(installed),
    "drift": dict(drifted),
    "unpublished": dict(local_only),
    "totals": dict(totals),
    "per_skill": {k: dict(v) for k, v in per_skill.items()},
    "caveat": "Aggregates only. Skills running alongside outcomes, not proven to cause them.",
}
os.makedirs("docs/data", exist_ok=True)
json.dump(out, open("docs/data/fleet.json", "w"), indent=2)
print(f"  fleet: {len(machines)} machines, {len(reports)} reports")
PY

# --- 4. stage for the site ---
cp registry/skills.json docs/data/skills.json
cp dist/*.skill docs/dist/ 2>/dev/null || true
if [ -f CHANGELOG.md ]; then cp CHANGELOG.md docs/CHANGELOG.md; fi

# --- 5. the rule, enforced ---
echo "Lucy: checking for data files"
bad=$(find . -path ./.git -prune -o \
  \( -name '*.csv' -o -name '*.xlsx' -o -name '*.xls' \) -print 2>/dev/null \
  | grep -v 'TEMPLATE' || true)
if [ -n "$bad" ]; then
  echo "  STOP. Data-shaped files found. This repo is public:"
  echo "$bad" | sed 's/^/    /'
  exit 1
fi
echo "  clean"
echo "Lucy: done. Review, then commit."
