---
name: lucy-sync
description: Pull the newest skills from the Lucy store and install them. Use when the seller says "sync lucy", "update lucy", "am I on the latest", "what version am I running", "did anyone publish anything new", or when any other Lucy skill reports a version mismatch. Also use on first run after install to register the machine.
---

# Lucy Sync

Bring this machine up to date with the Lucy store, and tell the store what this machine is actually running.

The store is a public GitHub repo. Reading it needs no login. Do not ask the seller for a token, a password, or a key to run a sync.

## Where things live

Read `SELLER-CONFIG.md` in the seller's working folder. The `Lucy store` section gives the repo URL and the local clone path. If that section is missing, use these defaults and write them back into the config:

- repo: the URL in this skill's `STORE_URL` below
- clone path: `{WORKING_FOLDER}/.lucy-store`

`STORE_URL`: https://github.com/kfasehun/lucy

## Step 1: get the store

If the clone path does not exist:

```
git clone --depth 20 <STORE_URL> "<clone path>"
```

If it does exist:

```
git -C "<clone path>" fetch --depth 20 origin && git -C "<clone path>" reset --hard origin/HEAD
```

Use `reset --hard`, not `pull`. The clone is a read-only mirror of the store, never a working copy, so a merge conflict there is always noise. If the clone has uncommitted changes, that means someone edited the mirror by mistake: say so, then reset anyway.

No network? Say plainly that you cannot reach the store and stop. Do not fall back to a stale mirror without saying which commit it is on and how old that is.

## Step 2: work out what this machine is actually running

This is the part people get wrong. The store tells you what the seller *could* have. To know what they *do* have, read the machine.

1. List the skills currently loaded, with their file paths.
2. For every skill that also exists in `<clone>/skills/`, hash both copies and compare.
3. Classify each one:
   - **current** — hashes match the store
   - **outdated** — differs, and the store's copy is newer
   - **edited locally** — differs, and the seller's copy has changes the store does not
   - **local only** — on this machine, not in the store at all
   - **missing** — in the store marked `core`, not on this machine

For "outdated" versus "edited locally", check the store's git log for that file. If the store's copy changed after the seller last synced, it is outdated. If not, they edited it.

## Step 3: report before you touch anything

Show the seller the classification first, shortest useful form:

```
Lucy 1.0.0 (store is on 1.0.0, commit a1b2c3d)
  7 skills current
  1 outdated: human-messaging (2 changes in the store since you last synced)
  1 edited locally: objection-handler (your changes, not in the store)
  1 missing: warm-opener (core)
```

Then ask what to install. Default offer: everything outdated and everything missing that is marked `core`.

## Step 4: install

For each approved skill, install it from the clone using `save_skill` with `overwrite: true`.

**Never silently overwrite a locally edited skill.** For those, say exactly what the seller would lose and make them choose. If they want to keep their version, offer `lucy-publish` instead: their edit might be better than the store's copy, and that is how the store improves.

Never touch a `local only` skill. Mention it once, offer `lucy-publish`, move on. If they decline twice, drop it and do not raise it again.

## Step 5: check in

Write `<clone>/fleet/<seller-slug>.json` with the machine's true state:

```json
{
  "seller": "kenny",
  "company": "Brightcove",
  "role": "BDR",
  "lucy_version": "1.0.0",
  "store_commit": "a1b2c3d",
  "synced_at": "2026-08-11T14:20:00Z",
  "skills": {
    "human-messaging": "current",
    "objection-handler": "edited-locally",
    "cold-call-recap": "local-only"
  }
}
```

Only ever write the file for this seller. Never edit anyone else's. That is what keeps the fleet directory conflict-free.

Then try to push it:

```
git -C "<clone>" add fleet/<slug>.json && git -C "<clone>" commit -m "fleet: <slug> check-in" && git -C "<clone>" push
```

If the push fails for lack of access, that is expected and fine for most sellers. Do not ask for a token. Fall back: draft a Slack message to the store channel containing the JSON, tell the seller it is drafted, and note that the fleet table will update once it is posted. Reset the mirror afterwards so the failed commit does not linger.

## Hard rules

- Reading the store never requires credentials. If you find yourself about to ask for one, you have taken a wrong turn.
- Report before installing. Always.
- A locally edited skill is a signal, not a mistake. Never destroy one without an explicit yes.
- Only ever write this seller's own fleet file.
- The mirror is disposable. Nothing important is ever stored only there.
