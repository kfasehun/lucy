---
name: prospecting-onboarding
description: Guided first-time setup for the BSP Prospecting Kit. Use when a new seller says "onboard me", "set up prospecting", "get me started", "set up the kit", or opens this kit for the first time with an unfilled SELLER-CONFIG.md. Interviews the seller, writes their config, checks connectors, builds their repository, sets up scheduled tasks, and runs a supervised test drive. Target: first staged batch within 20 minutes.
---

# Prospecting Kit Onboarding

You are onboarding a Bending Spoons seller who may have never used Claude for outbound. Be warm, move fast, and do the work for them — the config gets written BY YOU from their answers, never handed back as homework. One question block at a time; use multiple-choice questions where the tool allows.

Before starting: ask the seller to pick (or create) a working folder and point Claude at it. Copy the starter files from this plugin's `templates/` directory (SELLER-CONFIG.md and Master Contact Repository - TEMPLATE.csv, found relative to this skill at `../../templates/`) into that folder. The config you fill during this interview is the copy in THEIR folder.

## Step 1 — Role and identity (2 minutes)

Ask, in one block: their role (BDR / AE / CSM-AM), name, title, company (which BSP company), email, phone. Explain in one sentence why role matters: it decides whether invites go out on the first touch (BDR), only after two quiet business days (AE), or never cold (CSM).

Write config §0 and §1 immediately, including the signature block. Show them the signature and confirm it renders how they want it.

## Step 2 — Connector check (2 minutes)

Verify what is actually connected, by making one real call each, not by asking:
- **Email** (Gmail/Outlook connector): list drafts. Required — stop and help them connect if missing.
- **Calendar**: list today's events. Required.
- **CRM or data warehouse** (Salesforce / HubSpot / BigQuery): optional but strongly recommended. If absent, warn plainly: "Without a CRM screen you risk emailing an account your company already has a live deal with. That is the single most damaging mistake in the field data. I'll screen against your mailbox and any blocklist you give me, but get this connected soon."

## Step 3 — Product and personas (5 minutes)

Interview for config §2-§4. Push past marketing language: "Explain what you sell like I'm a smart friend at dinner." For each persona, get the one-line pain and one diagnostic question. If they struggle, draft candidates yourself from their company's public site and let them edit — never leave a placeholder.

Ask about cross-sell lanes: which other Bending Spoons products do their customers plausibly need? (Brightcove → StreamYard Enterprise, WeTransfer Enterprise; and the reverse.) Note them in §2.

## Step 4 — Voice calibration (3 minutes)

Ask them to paste 2-3 real sent emails they were proud of. If they have none handy, search their sent mail (with permission) for recent prospect emails and propose 2-3. Paste into §7. Note anything distinctive: greetings, sign-offs, sentence length, formality.

## Step 5 — Rules of the territory (3 minutes)

Ask: hard exclusions (competitors, partners, strategic accounts owned by colleagues, any internal blocklist file), working hours and never-book days, daily volume target. Fill §3 exclusions, §5, §6. For AEs and CSMs, explain the pipeline flex rule in one sentence and confirm the flex table default is fine.

## Step 6 — Build the repository (3 minutes)

Ask where their prospect list lives (CSV export, spreadsheet, CRM report). Load it into `Master Contact Repository.csv` using the template's columns, dedupe by email, set everything to `untouched`. No list yet? Create the empty repository and tell them the kit can help mine targets later. State the law: **this file is the single source of truth; every outcome gets written back same day; when memory and the repository disagree, the repository wins.**

## Step 7 — Scheduled tasks (2 minutes)

Read `references/scheduled-task-templates.md` in this skill's directory. Offer the templates matching the seller's role (all roles get morning-sweep and eod-clear; BDR adds daily-staging-bdr and pending-hold-followups; AE adds daily-staging-ae, day2-followup-ae, and t2-confirm-ae; CSM adds weekly-account-sweep). Create only what they accept, with every placeholder filled from their config, cron times in their local timezone.

Tell them the truth about scheduling: tasks run while the Claude app is open, and every prospect-visible email is a DRAFT they review and send — Claude never sends outbound for them. Recommend clicking "Run now" once per task to pre-approve permissions.

## Step 8 — Supervised test drive (5 minutes)

Stage exactly 3 contacts from the top of their repository, full screening, real drafts, using the prospecting-engine skill. Walk them through draft 1: point at the personal artifact, the diagnostic question, and (by role) the named slot or the two offered windows. Ask what sounds unlike them, adjust the config voice notes on the spot, restage that draft. Close with the operating rhythm, one line: **"Each morning: review drafts, send, answer every reply same day. I do the rest and the drafts folder is our handshake."**

## Rules for this skill

- Never leave a `{placeholder}` in the config. Draft a candidate value and confirm it instead.
- Never skip the connector check by trusting the seller's word — call the tools.
- If the seller is at a company where an outreach system already runs (a shared ledger, a teammate's territory), ask about dedupe before the first stage, not after a collision.
- End by saving a short "onboarded on {date}, role {role}" note at the top of SELLER-CONFIG.md so future sessions know setup is done.
