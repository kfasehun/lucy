# SELLER CONFIG — the one file that makes this yours

Every skill in this kit reads from this file before every run. You can fill it out by hand, but the faster path is to say **"onboard me"** and let Claude interview you and write it for you.

## 0. My role (this changes the whole sequence)

- Role: {BDR | AE | CSM/AM}
- What that means here:
  - **BDR** — you book meetings and hand off the relationship. You run INVITE-FIRST: cover email + a real calendar hold in the same touch. Maximum throughput, scheduling friction removed up front.
  - **AE** — you own the relationship from first touch. You run EMAIL-FIRST: a context-rich email offering two windows (nothing held), then follow-up + invite only after 2 business days of silence. A bad first impression is a lost account, not a lost meeting.
  - **CSM/AM** — you grow existing customers. You run RELATIONSHIP-FIRST: every touch leads with something true about their account (usage, a feature that fits their stack, a renewal window), never a cold hold, ever.
- If your role changes later, change this one line and tell Claude "my role changed." Nothing else needs a rebuild.

## 1. Who I am

- Name: {Your full name}
- Title: {Your title}
- Company: {Your Bending Spoons company — Brightcove, StreamYard, WeTransfer, Evernote, Meetup, ...}
- Email: {you@company.com}
- Phone: {+1 ...}
- Signature block (exactly as it should appear, name bold):

```
**{Your Name}**
{Title}
{email} | {phone}
{Company} | {address line}
```

## 2. What I sell

- Product in one sentence a stranger understands: {...}
- The 2-3 problems it kills: {problem 1}, {problem 2}, {problem 3}
- Proof points (real, verifiable, that you are allowed to cite): {2-3 named customers or stats}
- What changed recently that makes NOW a reason to talk: {new pricing, new feature, acquisition, your arrival in the territory}
- Cross-sell lanes (Bending Spoons specific): {other BSP products your customers plausibly need — e.g. Brightcove customers → StreamYard Enterprise for live, WeTransfer Enterprise for file workflows. Leave blank if not applicable.}

## 3. Who I sell to

For each target persona, one line on what they own and what keeps them up at night:

- {Persona 1}: owns {X}, hurts when {Y}
- {Persona 2}: owns {X}, hurts when {Y}
- {Persona 3}: owns {X}, hurts when {Y}

Target company profile: {industry, size range, geography}
Hard exclusions: {competitors, partners, accounts with open deals, existing customers unless dormant, internal blocklists, strategic accounts owned by named colleagues}

## 4. My diagnostic questions (one per persona, used in first-touch emails)

A good diagnostic question is answerable in one sentence and exposes the gap your product fills.

- {Persona 1}: "{...}"
- {Persona 2}: "{...}"
- {Persona 3}: "{...}"

## 5. Calendar rules

- Meeting length: {default 30 min for BDR holds, 20 min for AE asks — state the duration that matches the actual ask}
- My working slot windows: {e.g. Mon-Fri 9:30 AM - 4:30 PM my time}
- Days I never book: {...}
- Hold expiry: 5 business days silent = dead, delete it quietly (but NEVER within 24-48h of the slot — a silent deletion that close puts a prospect in an empty meeting room)
- Timezone: always state times in THE PROSPECT'S timezone
- AE two-window rule: first-touch emails offer exactly TWO windows, on non-adjacent days, 3-10 business days out. Two is a choice; three is a scheduling task.

## 6. Volume and pipeline flex

- Daily staging target: {e.g. 40 for BDR, 40 flexing down for AE, 10 for CSM}
- AE/CSM flex rule: active deals needing action today outrank new booking. 0-2 deals = full target; 3-5 = ~60%; 6+ = ~40% and say which deals caused the reduction. Booking never stops entirely.

## 7. Voice calibration

Paste 2-3 of your best real sent emails here so Claude drafts in your voice, not a template voice:

```
{paste email 1}
```

```
{paste email 2}
```

## 8. CRM / data screen (the self-collision guard)

- CRM or data source: {Salesforce / HubSpot / BigQuery / none}
- Rule: before staging ANY contact, verify the account has no open opportunity, no active owner relationship, and is not already a customer being worked. The most damaging objection class in the field data was prospects saying "we're already talking to your colleague" — because the sender never checked.
- How to check: {the exact query or lookup for your company}
- Identity check: verify every contact still works there before drafting (a quick web search). Roughly 40% of CRM-sourced contacts are stale.
