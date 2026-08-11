# fleet

One file per seller, written by that seller's own machine when they run `sync lucy`.

`<slug>.json` is the machine's current state: which version of Lucy, which commit of the
store, and the status of every skill it has loaded. `reports/<slug>-<year>-<week>.json` is
a weekly count of outcomes.

Rules that make this directory work:

- A machine only ever writes its own file. Never anyone else's. That is why there are no
  merge conflicts here.
- No names, no emails, no prospect or company names, no individual deal values. Slugs and
  integers only. This repo is public.
- The site reads these files, aggregates them, and writes the result to `docs/data/fleet.json`.
  Nothing in this directory is served to the site directly.
