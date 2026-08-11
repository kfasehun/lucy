# Changelog

All notable changes to Lucy. Newest first.

## 1.0.0 — 2026-08-11

The store opens. Lucy becomes one product with one name, one version number, and a public front door.

**Added**

- `registry/skills.json`, the catalog behind the store.
- The store website in `docs/`. Browse, read, one-click install, see what changed recently.
- `lucy-sync`, `lucy-publish`, `lucy-report`: pull the latest, publish what you build, send outcomes back.
- `fleet/`, so every machine reports what it is actually running. This is what makes the version table true rather than aspirational.
- `scripts/package.sh` and `scripts/beacon.sh`.

**Changed**

- Renamed to **Lucy**. Previously shipped under two competing names, `lucy` and `bsp-prospecting`, which meant anyone who installed both had two copies of every skill loaded at once, competing to trigger.
- Distribution moves from a pinned Slack file to this repo. The Slack pin is now out of date by definition and should be removed.

**Fixed**

- The three-way version split. On 2026-08-11 the following were all live simultaneously:
  - `bsp-prospecting` **0.1.0**, 6 skills, no `warm-opener`. This was on Kenny's own machine.
  - `bsp-prospecting` **0.2.0**, the version the Notion install guide pointed people at.
  - `lucy` **1.0.0**, 7 skills including `warm-opener`, the file actually shipped to the team.
  
  Nobody, including the author, could say which version they were running or how it differed from anyone else's. One repo, one version number, and a per-machine check-in ends that.

**Known gaps**

- Skill ranking is adoption and retention only for now. Outcome-based ranking needs `lucy-report` running across enough sellers to mean anything. With single-digit users, treat outcome numbers as a story, not a statistic.
- No automated review on publish. Deliberate at this team size, revisit past roughly twenty sellers.

---

## Before 1.0.0

Lucy ran as a hand-passed `.plugin` file, pinned in Slack. Battle-tested at Brightcove across 446 audited sends. It worked, but every copy drifted the moment it landed and there was no way to see inside anyone else's.
