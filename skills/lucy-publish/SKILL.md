---
name: lucy-publish
description: Publish a skill to the Lucy store so every other seller can install it. Use when the seller says "publish this skill", "share this with the team", "add this to Lucy", "put this in the store", or when lucy-sync has found a local-only skill worth sharing. Also use to push an improved version of a skill that already exists in the store.
---

# Lucy Publish

Take something this seller built and put it where everyone else can get it.

## Step 0: the data check, before anything else

You are publishing to a **public** repo. Read every file of the candidate skill in full and refuse outright if it contains:

- a real person's name, email address, or phone number
- a company name in the context of being a prospect, target, customer, or account
- contact lists, master repositories, invite logs, blocklists, do-not-contact lists
- any individual's booking or pipeline numbers
- API keys, tokens, or passwords
- internal URLs, record IDs, or CRM object IDs

Placeholders are fine. `{COMPANY}`, `jane.doe@example.com`, `Example Corp`. Real ones are not.

If you find something, do not publish. Show the seller each line, offer to genericise it, and only continue once the file is clean. Say plainly: this repo is public, so anything that goes up can be read by anyone including competitors.

This check is not optional and cannot be skipped on the seller's assurance that it is fine.

## Step 1: understand what is being published

Establish:

- the skill folder and every file in it
- whether it is new to the store, or a change to a skill already there
- who wrote it, and at which company
- what it does, in one sentence a seller from another product would understand
- when it should trigger

If the skill has no `description` in its frontmatter, or the description would not fire on the phrases a seller would actually use, fix it now. A good skill nobody triggers is a wasted skill.

## Step 2: decide core or optional

- **core** — every seller should have it. Missing it is a defect, and `lucy-sync` will offer to install it by default.
- **optional** — good, but role-specific or a matter of taste.

Default to **optional**. Promoting something to core changes ten people's setup, so that is the store owner's call, not the author's. Say so, and note in the announcement that it is proposed as core if the author thinks it should be.

## Step 3: put it in the store

Sync the mirror first (`lucy-sync` step 1), then:

1. Copy the skill folder into `<clone>/skills/<name>/`.
2. Add its entry to `<clone>/registry/meta.json`: title, summary, why, status, roles, author, company, added date. Match the tone of the entries already there. Plain, specific, no marketing.
3. Run `<clone>/scripts/package.sh`. This rebuilds `registry/skills.json` with fresh hashes and rebuilds the `.skill` install files in `dist/`.
4. Add a `CHANGELOG.md` entry under the current version. What was added or changed, and by whom.
5. Commit and push:

```
git -C "<clone>" add -A && git -C "<clone>" commit -m "publish: <name> (<author>)" && git -C "<clone>" push
```

**If the push fails for lack of write access**, that is the common case. Do not ask for a token. Instead:

- package the skill on its own as a `.skill` file in the seller's working folder
- draft a Slack message to the store channel with the file attached and the registry entry pasted in, addressed to the store owner
- tell the seller exactly what to do: send the draft, and the owner merges it

Either way the skill reaches the team the same day.

## Step 4: announce it

Draft, never send. The seller sends.

Keep it to four lines. What it does, who it helps, one concrete example of it working, and the install line. No hype, no emoji walls, no "excited to share."

```
New skill in Lucy: Cold Call Recap

Turns a cold-call transcript into the follow-up email plus the calendar invite,
using the transcript and the CRM record rather than a template.

Used it on a call yesterday. The draft needed one edit.

Install: <store URL>#cold-call-recap  (or say "sync lucy")
```

Note what the example does not contain: no prospect company, no colleague's name. The
announcement goes in Slack, but the registry entry it is based on goes in a public repo, so
keep both clean.

If the skill is being proposed as core, add one line saying so and tagging the store owner for the call.

## Step 5: tell the author what happens next

Two sentences. Where it landed, and that adoption and outcome numbers will start appearing in the store once people install it and `lucy-report` has run for a couple of weeks. Set the expectation that early numbers are a story, not proof.

## Hard rules

- The data check runs first, every time, in full. No exceptions, no assurances accepted.
- Author attribution stays on the entry. People build more when their name is on it.
- Announcements are drafted, never sent.
- Never mark your own skill core.
- Never publish someone else's skill without saying it is theirs.
