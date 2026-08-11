# Handoff: getting Lucy live

Everything is built and committed locally. What is left is creating the GitHub repo and
turning the website on. That has to happen from Claude Code on your own machine, because
it needs your GitHub login, and I would rather your access token never appeared in a chat.

Should take about five minutes.

## 1. Open this folder in Claude Code

Point Claude Code at the `lucy` folder and paste this:

```
This folder is a git repo with three commits already in it. Please:

1. Delete the scaffolding leftovers: .git-stale-do-not-use/, any .git-old-* folder,
   the file _t, and dist/_probe. They are junk from the environment this was built in
   and are already gitignored.
2. Replace every occurrence of REPLACE-ME with my GitHub username in these four files:
   README.md, registry/meta.json, .claude-plugin/plugin.json, skills/lucy-sync/SKILL.md
3. Run scripts/package.sh and commit everything.
4. Create a public GitHub repo called lucy under my account and push to main.
5. Enable GitHub Pages, source = main branch, /docs folder.
6. Tell me the live URL.
```

If anything about the git history looks off, there is a clean copy of the whole repo at
`lucy-1.0.0.zip` next to this folder. Unzip that instead and start from step 2.

Public is deliberate. It means nobody needs a login to browse or install, which was the
whole point. It is safe because there is no data in here, and `scripts/package.sh` fails
the build if anyone tries to add some.

## 2. Check the site

Open the URL. You should see ten skills, and a fleet section showing one machine reporting,
yours, with four skills flagged as differing from the store and four skills that only you
have. That is real data, not a placeholder.

## 3. Then, in order

**Kill the old distribution.** Unpin `bsp-prospecting-v0.2.0.plugin` from #kenny-machine.
While it is pinned, people will keep installing a version that has no way of updating itself.

**Tell everyone who already installed to uninstall the old one first.** This matters more
than it sounds. The old plugin was called `bsp-prospecting` and this one is called `lucy`.
Claude treats those as two different plugins, so anyone who installs Lucy without removing
the old one ends up with two copies of `human-messaging`, `objection-handler` and the rest
loaded at the same time, competing over which one triggers. You have exactly this problem
on your own machine right now.

**Update the Notion page.** The "Get the plugin" section still describes downloading a file
from Slack. Replace it with the store URL and the three-step install.

**Ask about the four skills only you have.** `opp-gap-audit`, `pending-hold-followup`,
`outreach-contact-repository` and `gmail-draft-cleanup` are on your machine and nowhere else.
At least the first two look like things other BDRs would want. Say `publish this skill` for
each one you want to share.

## 4. What is not done yet

**Nobody else's machine reports in until they sync.** The fleet table shows one machine
because one machine has run the beacon. It fills up as people install `lucy-sync` and say
`sync lucy`. Until then it is honest but sparse.

**Weekly reporting needs a scheduled task.** `lucy-report` exists as a skill but nothing
calls it on a schedule yet. Once two or three sellers are on the store, set it to run
Fridays and the performance section starts filling in.

**No review gate on publishing.** Anyone with push access can change a core skill and
everyone picks it up on next sync. Fine at eight people. Revisit around twenty.

**Ranking is not really ranking yet.** With one or two sellers reporting, the performance
table is a list of numbers, not evidence. The site says so on the page, deliberately. Do not
let anyone make a decision off it until the seller count is well into double digits.

## The one rule to keep repeating

No data in this repo. Ever. No contact lists, no logs, no blocklists, no prospect names, no
individual booking numbers. Skills and empty templates only. The build script blocks the
obvious cases but it cannot read your mind.
