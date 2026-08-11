---
name: lucy-report
description: Send this seller's outcome numbers back to the Lucy store so skills can be ranked on real results. Use when the seller says "send my report", "report my numbers", "lucy report card", "how did my week go", or on the weekly schedule. Counts meetings booked and opportunities piped, attributes them to the skills that were running, and reports aggregates only, never names.
---

# Lucy Report Card

The store can only rank skills honestly if it knows what actually happened. That data lives on each seller's machine, so each machine has to send it.

Runs weekly. Takes about a minute.

## What you are counting

For the period since the last report (default: the last 7 days):

| Number | Where it comes from |
|---|---|
| Contacts touched | the seller's contact repository, rows with a touch date in the period |
| Meetings booked | accepted invites and confirmed meetings with external attendees |
| Meetings held | calendar, minus cancellations and no-shows |
| No-shows | scheduled, external attendee did not attend |
| Declines | explicit declines and negative replies |
| Replies | any human reply from a prospect, positive or not |
| Opps piped | the seller's CRM or opportunity tracker, opportunities created in the period |

Get these from the sources named in `SELLER-CONFIG.md`. If a source is missing, report the numbers you can stand behind and mark the rest `null`. **Never estimate.** A guessed number that gets averaged into a store-wide ranking is worse than a gap.

Every number must be traceable to a named source. If you cannot say where a figure came from, do not send it.

## Attribution: which skills get the credit

List the skills that were actually installed and running during the period, from this machine, not from what the store thinks the seller has. Run `lucy-sync` step 2 if you are unsure.

Then be honest about what attribution is worth here:

- You are recording that these skills were **in use** while these outcomes happened.
- You are **not** proving any skill caused any outcome. There is no control group, sample sizes are tiny, and a good week might just be a good week.
- Do not attempt per-skill causal claims. Report the pairing and let volume accumulate.

If the seller installed or removed a skill mid-period, say so in `notes`. That is the single most useful thing for interpreting the numbers later.

## What you send

Write `<clone>/fleet/reports/<slug>-<YYYY-WW>.json`:

```json
{
  "period": "2026-W33",
  "seller_slug": "s7f3",
  "company": "Brightcove",
  "role": "BDR",
  "lucy_version": "1.0.0",
  "skills_running": ["prospecting-engine", "human-messaging", "warm-opener"],
  "counts": {
    "contacts_touched": 187,
    "meetings_booked": 9,
    "meetings_held": 6,
    "no_shows": 2,
    "declines": 41,
    "replies": 23,
    "opps_piped": 1
  },
  "sources": {
    "meetings_booked": "Google Calendar + invite log",
    "opps_piped": "Salesforce via BigQuery",
    "declines": "Google Calendar responses"
  },
  "notes": "Installed warm-opener on day 3 of the period."
}
```

### Privacy, which is not negotiable

The store is a **public** repo.

- Use `seller_slug`, a short opaque handle from the config. Never a name, never an email.
- Never a prospect name, company, or email. Not even in `notes`.
- Never a deal value or account name.
- Counts only. No row-level data, ever.

The seller's own full numbers stay on their machine, where they can see them in detail. What leaves is a handful of integers.

If the seller says they would rather not send numbers at all, that is fine. Skip it, note it once, do not nag. A store built on coerced data would be worse than one built on less.

## Sending it

Commit and push as in `lucy-sync` step 5. If the push fails for lack of access, draft the JSON as a Slack message to the store channel instead and tell the seller to send it. Do not ask for a token.

## What the seller sees

Show them their own week first, in full, with names and detail, because that is the part useful to them:

```
Week of Aug 4 (W33)
  187 contacts touched, 9 booked, 6 held, 2 no-shows, 1 opp
  Booking rate 4.8%, up from 3.9% last week
  Running: prospecting-engine, human-messaging, warm-opener (added Wed)

Sent to the store: counts only, no names. Your slug is s7f3.
```

Then one line on what went to the store, so there is never any doubt about what was shared.

## Hard rules

- Never estimate a number. Gaps are `null` and are named as gaps.
- Every figure traces to a named source or it does not go.
- No names, no companies, no emails, no deal values leave the machine.
- No causal claims about individual skills.
- Opting out is always allowed and never nagged.
