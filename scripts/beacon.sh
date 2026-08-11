#!/usr/bin/env bash
# Lucy beacon: records what THIS machine is actually running.
#
#   ./scripts/beacon.sh <seller-slug> <company> <role> <installed-skills-dir>
#
# Writes fleet/<slug>.json. Only ever that one file, so two sellers checking in
# at the same time can never conflict.
#
# This is the plumbing. The lucy-sync skill is what normally calls it, because it
# can find the installed skills directory and read the seller's config. Run it by
# hand only when debugging.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SLUG="${1:?usage: beacon.sh <slug> <company> <role> <installed-skills-dir>}"
COMPANY="${2:-unknown}"
ROLE="${3:-unknown}"
INSTALLED="${4:?need the path to the installed skills directory}"

[ -d "$INSTALLED" ] || { echo "not a directory: $INSTALLED"; exit 1; }
command -v python3 >/dev/null || { echo "python3 required"; exit 1; }

cd "$ROOT"
SLUG="$SLUG" COMPANY="$COMPANY" ROLE="$ROLE" INSTALLED="$INSTALLED" python3 - <<'PY'
import hashlib, json, os, subprocess, datetime

root = os.getcwd()
slug = os.environ["SLUG"]
installed_dir = os.environ["INSTALLED"]

def file_hash(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for c in iter(lambda: f.read(65536), b""):
            h.update(c)
    return h.hexdigest()

def folder_hash(folder):
    parts = []
    for dp, dn, fn in os.walk(folder):
        dn.sort()
        for f in sorted(fn):
            if f == ".DS_Store":
                continue
            p = os.path.join(dp, f)
            parts.append(os.path.relpath(p, folder) + ":" + file_hash(p))
    return hashlib.sha256("\n".join(parts).encode()).hexdigest()[:16]

store, local = {}, {}
store_dir = os.path.join(root, "skills")
for n in os.listdir(store_dir):
    if os.path.isdir(os.path.join(store_dir, n)):
        store[n] = folder_hash(os.path.join(store_dir, n))
for n in os.listdir(installed_dir):
    p = os.path.join(installed_dir, n)
    if os.path.isdir(p) and os.path.exists(os.path.join(p, "SKILL.md")):
        local[n] = folder_hash(p)

try:
    registry = json.load(open(os.path.join(root, "registry", "skills.json")))
    core = {s["name"] for s in registry.get("skills", []) if s.get("status") == "core"}
except Exception:
    core = set()

# Skills that come from somewhere other than Lucy. Without this, every seller looks
# like they are sitting on twenty unpublished skills when really they just have the
# standard document and scheduling ones installed.
try:
    ignore = set(json.load(open(os.path.join(root, "registry", "meta.json"))).get("ignore", []))
except Exception:
    ignore = set()
local = {n: h for n, h in local.items() if n not in ignore}

# States: current / differs / local-only / missing.
# The beacon cannot tell "outdated" from "edited locally" on its own; that needs
# the git history of each file, which lucy-sync does. Anything differing is
# reported as "differs" and refined by the skill.
states = {}
for n, h in sorted(local.items()):
    if n not in store:
        states[n] = "local-only"
    elif store[n] == h:
        states[n] = "current"
    else:
        states[n] = "differs"
for n in sorted(core - set(local)):
    states[n] = "missing"

try:
    commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"],
                            capture_output=True, text=True, timeout=10).stdout.strip()
except Exception:
    commit = None
try:
    version = json.load(open(os.path.join(root, ".claude-plugin", "plugin.json")))["version"]
except Exception:
    version = "unknown"

out = {
    "seller": slug,
    "company": os.environ["COMPANY"],
    "role": os.environ["ROLE"],
    "lucy_version": version,
    "store_commit": commit,
    "synced_at": datetime.datetime.now(datetime.timezone.utc)
                 .replace(microsecond=0).isoformat().replace("+00:00", "Z"),
    "skills": states,
}

os.makedirs(os.path.join(root, "fleet"), exist_ok=True)
path = os.path.join(root, "fleet", slug + ".json")
json.dump(out, open(path, "w"), indent=2)

counts = {}
for v in states.values():
    counts[v] = counts.get(v, 0) + 1
print("wrote fleet/%s.json  " % slug + ", ".join(f"{v} {k}" for k, v in sorted(counts.items())))
PY
