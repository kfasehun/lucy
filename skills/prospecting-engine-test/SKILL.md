---
name: prospecting-engine-test
description: The core outbound engine, role-aware. Use whenever the seller says "stage a batch", "run a wave", "who should we contact next", "fire the invites", "morning sweep", "pulse", or "EOD clear". Reads the seller's role from SELLER-CONFIG.md and runs the matching sequence - BDR invite-first, AE email-first, or CSM relationship-first - end to end: screening, drafting, holds, outcome logging.
---

# Prospecting Engine — Role-Aware

Read `SELLER-CONFIG.md` before every run. Read `Master Contact Repository.csv` before every run. Never target from memory. The config's **Role** field decides which sequence below runs. Everything in "Shared machinery" applies to all three.

## Sequence by role

### BDR — invite-first (throughput motion)

Touch 1 is a cover email + a real calendar hold, together, one atomic touch.

1. Cover names the exact slot: "I can send a hold for {Day, Date} at {time in THEIR timezone}. Decline and it disappears."
2. The hold fires immediately after the seller sends the cover. Never a named slot without the hold behind it — a promised slot with no invite creates a phantom meeting nobody can accept.
3. Then: pending-hold follow-ups per the followup-noshow skill, one day-before confirm max, 5-business-day expiry.

Why this works for BDRs: the relationship hands off at acceptance, so friction removal beats first-impression caution. Field rate: ~8% accept, most inside 48 business hours, many inside minutes.

### AE — email-first (relationship motion)

The invite moves from touch 1 to touch 2. Three touches, then stop.

1. **Day 0 — context email, nothing held.** One personal artifact (verifiably theirs, ONE maximum — two reads as surveillance), the researched cause, TWO offered windows on non-adjacent days ("Would either of these work... If the topic is right but neither time is, name one and I will work around it"), one diagnostic question. No hold language. Nothing on any calendar.
2. **Day +2 business days, no reply — follow-up + invite.** In the SAME thread, under 150 words, carrying NEW value (a second researched observation or the specific agenda), then the mechanics with all three exits: accept and it's yours / decline and it disappears / name a better time and it moves. The invite fires immediately behind this email at the first offered window — re-verify the slot is still free first; if it filled, use window two and say so plainly.
3. **T-2 business days before the slot, still unanswered — confirm or move.** One, ever. Cause first, then: can you make it, or would you rather move it? Never for an accepted meeting — an accept is a commitment and a reminder hands them an exit ramp.
4. Any human reply at any stage stops the sequence. The seller answers SAME DAY. The most expensive failure on record is not a bad email; it is an interested human who wrote back and got silence.

Pipeline flex: before staging, count the seller's live deals with an open next step they own, and apply the config's flex table. Report which deals caused any reduction.

### CSM/AM — relationship-first (expansion motion)

No cold holds, ever. Every touch leads with something true about THEIR account.

1. **Before any touch**: pull the account's actual state — usage trend, entitlement headroom, renewal date, open support issues, features they pay for but do not use, and any cross-sell lane from the config.
2. **Touch 1 — value note.** Lead with the observed fact ("your streams doubled since March", "the feature you asked about in the spring shipped"), then ONE soft window offer if a conversation would genuinely help. If there is an open support escalation or a renewal fight in flight, do not sell — flag it to the seller instead.
3. Cadence is quarterly-touch by default, event-driven always: renewal minus 90 days, usage crossing 80% of entitlement, a champion changing jobs, a relevant launch.
4. Cross-sell (Bending Spoons lanes in config §2) only after the core relationship is healthy.

## Role transitions

When a seller says their role changed: update config §0, leave every in-flight contact on the OLD sequence until it terminates (never re-sequence someone mid-play), start all NEW staging on the new sequence. Statuses from both motions coexist in the repository; the ladder below covers all of them.

## Status ladder (repository `Status` column)

```
untouched → staged:<batch>
  BDR path:                    AE path:                       CSM path:
  → invited:pending            → emailed:d0 <date>            → touched:<date>
    → invited:accepted           → emailed:d2 <date>
    → invited:declined             → invited:pending → ...
    → invited:expired
Shared terminals: booked | in-conversation | nurture:<reason> | bounced:<date> | do-not-contact
```

Free text may be appended after ` | `. Matchers must tolerate that and must not assume this list is exhaustive.

## Shared machinery (all roles)

**Staging** (seller says "stage N"):
1. Pull the next N untouched contacts from the top of the repository.
2. Screen every one: not already contacted (repository AND sent mail, per domain, all folders); no open deal or active relationship (CRM screen per config §8 — this is the self-collision guard, mandatory, no exceptions); not on any exclusion list; one contact per company per wave, one thread per company ever; identity verified (still works there); a real personal artifact found (no artifact = do not stage).
3. Slots/windows per the role sequence and config §5, always in the prospect's timezone, never double-booked, fresh calendar pull every time.
4. Draft per `human-messaging-SKILL.md`. Full signature, name bold (API drafts skip auto-signatures).
5. **Verify drafts 5 minutes after creating them** — list and count. Creation tools double-fire and drafts vanish. Trust the draft list over your own record.
6. Write back statuses + a batch manifest (contact, company, hook, slot/windows). Read back a sample row to confirm the write landed.

**Firing invites** (BDR after covers sent; AE at day-2): confirm the email actually sent, check bounces first (bounced = no invite), re-verify the slot on the live calendar, create the hold — title "{Prospect Company} x {Seller Company}", guests-can-modify on, video link on, description restating value + "decline and this disappears" + any recording disclosure your company requires.

**Sweeps**: morning sweep (accepts = headline immediately; declines = route to objection-handler; replies = seller answers today; update repository; list today's meetings), pulse (same, shorter window; any unaccepted hold under 2 hours out gets cancelled silently and logged), EOD clear (delete dead holds — never silently within 24-48h of the slot; log everything; publish the scoreboard; harvest every prospect reply into the objections library).

## Hard rules

1. You draft, the seller sends. Never send outbound yourself. (Invites may auto-fire only on the seller's explicit go.)
2. One live draft per thread. Never stack. Replies go IN the existing thread, searched across all mail.
3. 3 silent touches = nurture. Stop. The Kennedy Center said no at touch 5; it should never have gotten a touch 4.
4. A decline is an answer. One ask-why with two honest named hypotheses is allowed; never re-invite a hard decline; "stop" is sacred and permanent.
5. Never counter-pitch a clean no (0-for-5 in field data, hardened every no it touched). Never fake confusion about whether a message arrived.
6. Own your failures immediately and plainly — apology-first replies went 3-for-3, one produced RFP intel within the hour.
7. When the repository and memory disagree, the repository wins. When the mail tool and memory disagree, list the drafts and trust the tool.
