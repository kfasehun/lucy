# Lucy

The shared skill store for Bending Spoons sellers.

Lucy is a set of skills that runs inside Claude and books meetings: it screens accounts, drafts human messages, handles objections, recovers no-shows, and keeps a repository of every contact and outcome. It is role-aware. BDRs run invite-first, AEs run email-first, CSMs run relationship-first, all from one line in a config file.

**Browse and install: https://kfasehun.github.io/lucy/**

## Install

1. Open the store, pick a skill, click Install.
2. The file downloads. Open it in Claude and click Save skill.
3. First time only: tell Claude `onboard me`.

That is it. No zip files passed around, no asking anyone for a copy.

## What is in here

| Folder | What it holds |
|---|---|
| `skills/` | Every published skill. One folder per skill, `SKILL.md` plus any reference files. |
| `templates/` | Starter files a new seller fills in. Always ships empty or with fake sample rows. |
| `registry/skills.json` | The catalog. What each skill is, who wrote it, whether it is core, and its current hash. |
| `fleet/` | One small file per seller, written by their own machine, recording what they are actually running. |
| `docs/` | The store website. Plain HTML, no build step. |
| `dist/` | Packaged `.skill` files, what the Install button hands you. |
| `scripts/` | `package.sh` builds the dist files, `beacon.sh` writes a seller's fleet file. |

## The three system skills

These are what make the store work.

- **lucy-sync** — pulls the latest and installs it. Say `sync lucy`.
- **lucy-publish** — puts a skill you built into the store and announces it. Say `publish this skill`.
- **lucy-report** — sends your meetings booked and opps piped back to the store so skills can be ranked on real outcomes. Runs weekly on its own.

## The one hard rule

**No data in this repo. Ever.**

This repo is public. Skills and empty templates go up. What never goes up:

- contact lists, master repositories, invite logs
- account blocklists or do-not-contact lists
- prospect or customer names, emails, or notes
- anyone's individual booking numbers

Performance data is aggregate only: "6 sellers, 41 meetings booked" and never "Tony booked 4." Per-person numbers stay on the seller's own machine.

If you are about to commit a `.csv` or `.xlsx`, stop. `.gitignore` blocks the common cases but it cannot read your mind.

## Publishing a skill

Built something good? Do not sit on it.

```
publish this skill
```

Lucy copies it in, writes its registry entry, packages it, and drafts the announcement for the channel. Review the draft, send it, done.

## Contributing changes to an existing skill

Edit the file, commit, push. There is no review gate today, which is deliberate at this team size. If you are changing a **core** skill, say so in the commit message so the changelog is honest.

## Versioning

Lucy has one version number, in `.claude-plugin/plugin.json`. Individual skills carry their own version in the registry. The changelog records what moved and why.

Before this repo existed there were three versions of Lucy in circulation at once under two different names. That is the problem this repo solves. See `CHANGELOG.md`.
