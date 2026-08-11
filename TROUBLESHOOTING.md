# Troubleshooting & FAQ

Answers to everything adopters have actually hit. Check here before asking anyone.

## Setup

**"Onboard me" doesn't do anything.** The plugin's skills load when Claude matches your words. Say exactly "onboard me" or "set up prospecting." If still nothing, confirm the plugin shows as installed and enabled in your settings.

**Claude says my email or calendar isn't connected.** Connect them in your Claude connector settings, then rerun onboarding. Onboarding verifies by making a real call, not by asking you — if it fails, the connector genuinely isn't working.

**I don't have a CRM connected.** You can run without one, but you lose the self-collision screen — the check that stops you from emailing an account your company already has a live deal with. That mistake is the most damaging one in the field data (prospects replying "we're already talking to your colleague" burns both of you). Get a CRM or an exported blocklist in place early.

**I have no prospect list.** Onboarding creates an empty repository. Ask Claude to help mine targets from your CRM, a conference attendee list, or a market segment — then vet before staging. Never stage unvetted contacts.

## Daily operation

**My drafts disappeared / doubled.** Known mail-tool behavior. The skills already verify counts 5 minutes after creation, but if you see it: ask Claude to "list drafts and reconcile against today's manifest." Trust the draft list over memory — always.

**A scheduled task didn't run.** Tasks run while the Claude app is open; if it was closed at fire time, the task runs on next launch. Also click "Run now" once on each new task to pre-approve its tool permissions, or runs can stall silently on a permission prompt.

**Statuses in my repository look wrong or missing.** Write-backs can drop rows. The skills verify a sample after writing, but if the repository and reality disagree, tell Claude "reconcile the repository against my sent mail and calendar for the last N days."

**Two prospects got offered the same slot.** Should never happen for BDR holds (unique slot rule). For AE day-0 emails it's allowed by design — nothing is reserved until an invite fires, and the day-2 task re-verifies the slot before any invite is created.

**A prospect declined the hold — now what?** Nothing manual. The EOD clear deletes the hold and drafts one ask-why reply. A decline is an answer: never re-invite, never counter-pitch (0-for-5 in field data). "Stop" means do-not-contact, permanently.

**A prospect replied and I haven't answered.** Drop everything and answer today. The costliest failures on record were interested humans who wrote back and got silence — including one who proposed their own meeting time. Every skill surfaces "owed replies" at the top of its report for exactly this reason.

**Someone no-showed.** Not a no. The next morning, draft an empathy reconnect (followup-noshow skill). Recoveries convert — 3-for-3 when the seller owned the miss plainly.

## Role and config

**I changed roles (BDR → AE, AE → CSM).** Edit one line in SELLER-CONFIG.md §0 and tell Claude "my role changed." In-flight contacts finish on the old motion; new staging uses the new one. Swap your scheduled tasks for the new role's set (templates are in the onboarding skill's references).

**Drafts don't sound like me.** Paste 2-3 more real sent emails into config §7 and tell Claude what specifically rings false (greeting, formality, sentence length). Restage one draft to test. Voice lives in the config, not in the skills.

**I want to change the sequence rules (touch count, wait days, windows).** The engine skill defines the sequences; your config defines volume, hours, and exclusions. Change the config freely. Think hard before changing the engine's rules — the 3-touch ceiling, the two-window limit, and the no-counter-pitch rule all exist because the alternative measurably failed.

## Philosophy questions people ask

**Why can't Claude just send the emails?** The draft-review-send loop is the quality gate. It's also what keeps one bad automated day from burning a hundred relationships. Non-negotiable.

**Why only ONE personal artifact per email?** One converted in minutes across field testing. Two produced "these messages are a little creepy" and a permanent do-not-contact. The line between researched and surveilled is one artifact wide.

**Why does an accepted meeting get no reminder?** An accept is a commitment; a reminder reopens the decision and hands them an exit ramp. You just show up.

**Why do AEs wait 2 days before the invite?** AEs own the relationship from first touch. The email-first sequence trades a little speed for a first impression that doesn't start with an unsolicited hold — and silence, not offense, was the invite-first motion's biggest cost (34% of invites got no response at all).
