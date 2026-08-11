# Scheduled Task Templates, by role

During onboarding step 7, offer the tasks for the seller's role and create only what they accept. Fill every {PLACEHOLDER} from SELLER-CONFIG.md before creating. All times are the seller's local timezone. Every task prompt must be self-contained (each run starts with no memory), and every task obeys the autonomy boundary: prospect-visible emails are DRAFTS the seller sends; invites are created only per the role's sequence rules.

Placeholders: {NAME} {EMAIL} {TITLE} {COMPANY} {SIGNATURE_BLOCK} {WORKING_FOLDER} {DAILY_TARGET} {ROLE}

---

## All roles

### morning-sweep — weekdays 8:30 AM
> Run the morning sweep for {NAME} ({EMAIL}, {TITLE} at {COMPANY}). Read {WORKING_FOLDER}/SELLER-CONFIG.md and {WORKING_FOLDER}/Master Contact Repository.csv first. Scan inbox and calendar since the last business day: new accepts (headline them first), declines (log and flag for the objection-handler skill), human replies (list under "OWED REPLIES - answer today", always at the top of the report), bounces and departure auto-replies (flag for successor research), reschedule requests. Update the repository same run and verify the write landed. List today's meetings with a one-line prep note each. Never draft prospect-facing email in this task; it observes and routes.

### eod-clear — weekdays 5:30 PM
> Run the end-of-day clear for {NAME} ({EMAIL}). Read {WORKING_FOLDER}/SELLER-CONFIG.md and the repository first. Delete calendar holds that are declined or expired (5+ business days silent), quietly, no notifications - but NEVER delete a hold within 24-48 hours of its slot. For each decline with no reason given, draft ONE in-thread ask-why reply per the objection-handler skill (two honest named hypotheses, reschedule offered, explicit close-the-file option). Harvest every prospect reply verbatim into {WORKING_FOLDER}/Objections Library.md with outcome. Write all statuses back to the repository, verify a sample row, and publish the day's scoreboard: booked / pending / declined / bounced / staged.

---

## BDR (invite-first)

### daily-staging-bdr — weekdays 8:45 AM
> Stage the daily batch for {NAME} ({EMAIL}, {TITLE} at {COMPANY}), BDR invite-first motion, per the prospecting-engine skill. Read {WORKING_FOLDER}/SELLER-CONFIG.md and the repository first; run `date` to anchor day names. Target {DAILY_TARGET} contacts from the top of the untouched pool. Apply every screening gate in the engine skill (CRM self-collision check mandatory). Each cover names one unique verified slot in the prospect's timezone and states "decline and it disappears." Drafts only; verify drafts persisted 5 minutes after creation; write staged statuses back; produce the batch manifest. Close with: "Send the covers, then say 'fire the invites'."

### pending-hold-followups — weekdays 7:50 AM
> Run pending-hold follow-ups for {NAME} ({EMAIL}) per the followup-noshow skill. UNACCEPTED holds only - accepted meetings get NO reminder ever (an accept is a commitment; a reminder is an exit ramp). Day-before confirms for tomorrow's unaccepted holds, mid-life follow-ups for holds 2-3 business days old with the meeting 3+ days out. Verify live status per candidate before drafting (accepted = no draft; declined = route to objection flow; replied = flag for the seller). Cause first, then mechanics with three exits. One day-before and one mid-life per contact, ever. In-thread drafts only, one draft per thread.

---

## AE (email-first)

### daily-staging-ae — weekdays 8:45 AM
> Stage the daily Day-0 batch for {NAME} ({EMAIL}, {TITLE} at {COMPANY}), AE email-first motion, per the prospecting-engine skill. Read {WORKING_FOLDER}/SELLER-CONFIG.md and the repository first; run `date` and check holidays. PIPELINE FLEX first: count live deals with an open next step the seller owns; 0-2 = stage {DAILY_TARGET}, 3-5 = ~60%, 6+ = ~40%, and name the deals that caused any reduction. Day-0 emails offer exactly TWO windows on non-adjacent days, 3-10 business days out, in the prospect's timezone, NOTHING held, no invite, no hold language. One personal artifact per email, one diagnostic question. All screening gates apply. Drafts only; verify drafts persisted; write emailed-staging statuses back; produce the manifest. Close with: "Send the Day-0 drafts. No invites fire today - the day-2 task handles that after two quiet business days."

### day2-followup-ae — weekdays 8:15 AM
> Run the Day-2 stage of {NAME}'s ({EMAIL}) AE email-first motion per the prospecting-engine skill. Count BUSINESS days from actual send (Gmail sent mail is authoritative, not the repository; holidays push the date). Due = sent 2+ business days ago AND no human reply in-thread (check both directions, all folders) AND no bounce AND no invite yet. Anything with a reply is not a follow-up - it is an OWED REPLY; list those at the top. For each due contact: re-verify the offered window on the live calendar (filled = use window two and say so plainly), draft the in-thread follow-up under 150 words carrying NEW value then the mechanics with three exits, and QUEUE the matching invite (contact, verified slot, duration, agenda) to fire on the seller's explicit go. One draft per thread; verify drafts persisted; write statuses back. Close with: "Send the follow-ups, then tell me to fire the invites."

### t2-confirm-ae — weekdays 8:00 AM
> Run T-2 confirms for {NAME} ({EMAIL}): find calendar invites still unanswered (needsAction) whose meeting is 2 business days out. Accepted meetings get NOTHING. One confirm per contact ever - check the repository status notes for a prior confirm before drafting. Cause first (something researched and persona-specific), then the plain question: can you make it, or would you rather move it - with the move offered warmly (mechanics complaints answered same-day convert; the data says so). In-thread drafts only. Write "T-2 confirm drafted {date}" back to the repository.

---

## CSM / AM (relationship-first)

### weekly-account-sweep — Mondays 9:00 AM
> Run the weekly account sweep for {NAME} ({EMAIL}, {TITLE} at {COMPANY}), CSM relationship-first motion. Read {WORKING_FOLDER}/SELLER-CONFIG.md first. For each account in the book (repository rows the seller owns): pull current state - usage trend, entitlement headroom, renewal date, open support cases, unused paid features. Flag, in priority order: (1) renewal inside 90 days, (2) usage crossing 80% of entitlement, (3) champion job changes, (4) accounts 90+ days since last touch, (5) cross-sell lane matches from config §2 - only where account health is green. For flagged accounts, draft value notes per the prospecting-engine CSM sequence: lead with the observed fact, one soft window offer, never a cold hold. If an account has an open escalation, do not sell - flag it to the seller instead. Drafts only, write touches back to the repository.

---

## Notes for the onboarding run

- Create tasks with the scheduled-task tool, one per accepted template, cron in the seller's local time, weekdays only.
- Tell the seller plainly: tasks run while the Claude app is open; if it was closed, the task runs on next launch.
- Recommend they click "Run now" once per task to pre-approve tool permissions, so future runs never stall on prompts.
