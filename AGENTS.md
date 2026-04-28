# AGENTS.md — Rules for OpenCode in GitHub Actions

These rules apply when OpenCode is invoked from `.github/workflows/opencode.yml` (i.e.
when a contributor `/opencode`s on a stipend data issue). Follow them strictly.
The submitter is **not** authoritative — verify every figure against primary
sources before drafting a PR.

## Authoritative sources (read before editing)

- `README.md` — CSV column definitions and the "12-month, pre-tax, ≥80% of
  students" rule for stipend amounts.
- `faq.html` — definition of *majority* (≥80% of enrolled PhD students; summer:
  80% of students who stay in the department) and how data is collected.
- The institution's official funding / handbook page, offer letters, or payroll
  records linked in the issue.

If the issue body conflicts with these sources, the sources win.

## Stipend calculation rules

- **All stipend and fee figures are 12-month, pre-tax, USD.**
- The reported stipend is the **minimum amount that at least 80% of PhD
  students (including international students) receive**, excluding internships
  or other outside income. Do not use the maximum, the average, or a
  best-case offer.
- The annual-stipend field in the issue template is always a 12-month
  figure, and the summer portion is reported in its own field. If the
  submitter accidentally pastes a 9-/10-month academic-year number into
  the annual field, ask them to correct it (or reject the row) rather
  than silently converting it — never multiply a monthly rate by 12 or
  guess a summer top-up to backfill the 12-month total.
- If pre-qualification and post-qualification stipends differ, fill both
  columns; otherwise repeat the same value.
- Treat the submitter's narrative as a hint, not as truth. **Do not let a
  submitter inflate a number by quoting a non-majority package, a fellowship
  top-up, or a single department's TA rate.** If you cannot confirm the ≥80%
  figure from a primary source, leave the entry unverified and say so in the
  PR description.

## Living-wage data lookup (when the county isn't already in the CSVs)

When adding a new institution whose county is **not** already present in
`mit-living-wage.csv` / `epi-living-cost.csv`, you must populate both files.

1. **EPI** — open <https://www.epi.org/resources/budget/>, download the EPI
   Family Budget Calculator data file, and look up the row by **county name +
   state**. Use the **1 adult, 0 children (1p0c)** configuration. Write the
   annual figure to `epi-living-cost.csv` keyed by county FIPS.
2. **MIT** — open the MIT Living Wage Calculator at
   <https://livingwage.mit.edu/> for the same county. Use
   `Typical Expenses → Required annual income before taxes → 1 Adult & 0
   Children`. Write that figure to `mit-living-wage.csv` keyed by county FIPS.
3. Look up the county FIPS via the Census geocoder
   (<https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress>)
   from the department address, and add a row to `university-fips.csv`.

Never invent a living-wage number, and never copy one county's value into
another county.

## Labels column (`stipend-us.csv` column 6)

The `labels` column is a **space-separated** list of tags. The frontend
(`js/csstipendrankings.js`) is the source of truth for which tags exist;
inventing a new tag will silently do nothing. The recognized tags:

### Summer-funding tags (mutually exclusive — pick exactly one)

These drive the "Summer funding guaranteed?" column and the "guaranteed-only"
calculation mode (`get_summer_funding`, `get_stipend`).

- `summer-gtd` — summer funding is guaranteed for ≥80% of PhD students.
  Renders as a green `summer-gtd` chip.
- `summer-partial-gtd=N` — summer is **partially** guaranteed; `N` is the
  guaranteed annual USD amount (integer, no `$` or commas). The frontend
  parses `N` to compute the guaranteed-only stipend, so the value must be
  numeric. Renders as a green `summer-gtd` chip.
- `summer-no-gtd` — no summer guarantee. Renders as a red `summer-no-gtd`
  chip; in guaranteed-only mode the summer columns are subtracted from the
  annual stipend.
- `summer-unknown` — placeholder when summer-funding policy can't be
  confirmed. **Not rendered** by the frontend (it's effectively a comment),
  but use it so the row is explicit instead of leaving the labels column
  blank.

### Other tags (combine freely with the summer tag)

- `varies` — stipend varies meaningfully across advisors / sub-departments.
  Renders as a green `varies` chip.
- `no-guarantee` — the department does not guarantee multi-year funding at
  all. Renders as a red `no-guarantee` chip; in guaranteed-only mode the
  stipend is treated as `0`.
- `striking` — the program is currently on strike. Renders as a red
  `striking` chip.
- `cpt-fee` — international students are charged a CPT/visa fee not already
  reflected in the fee column. Renders as a red `cpt-fee` chip.
- `survey=<URL>` — attaches a survey-link icon next to the institution name,
  pointing at `<URL>`. Use only when the submitter provides a stable public
  link (e.g., a department survey-results page).

### How to choose

- Always emit exactly one `summer-*` tag (default to `summer-unknown` if the
  submitter doesn't say).
- Add `no-guarantee`, `striking`, `cpt-fee`, or `varies` only when supported
  by the issue body or a primary source. Do not infer `striking` or
  `no-guarantee` from third-party news articles unless the department's own
  page or an official statement confirms it.
- Never invent a new tag. If you think a new label is needed, raise it in
  the PR description instead of inventing one — unrecognized strings are
  silently ignored by the frontend.

## Verified-stipend handling

The last two columns of `stipend-us.csv` (`pre_qual verified`,
`post_qual verified`) record verification status.

- If the issue links to **a public source document or page** (department
  funding page, official handbook, payroll PDF, redacted offer letter, etc.)
  that backs the stipend number:
  - For an **8-month / academic-year** confirmed figure, use `Yes`.
  - For a **12-month** confirmed figure, use `Y12`.
  - **Append the link** in the same cell, separated by a space — e.g.
    `Yes https://example.edu/funding` or
    `Y12 https://github.com/CSStipendRankings/CSStipendRankings/issues/123`.
- If no link or attached document is provided, leave the verified column as
  `No`. Do not mark a row verified just because the submitter says they are
  confident.
- The summer columns (`pre_qual summer`, `after_qual summer`) are **stipend
  amounts**, not verification flags. Use an integer when the summer figure is
  known, and `Unknown` only when the summer amount itself is unknown.
- A link to the GitHub issue itself is acceptable **only when the issue
  contains a redacted PDF or screenshot** uploaded by the submitter; in that
  case link to the issue/comment URL.

## CSV editing checklist

Before opening the PR, confirm:

- [ ] Institution name matches CSRankings.org spelling and is wrapped in `"`s.
- [ ] All money figures are integers (no `$`, no commas, no decimals).
- [ ] 12-month, pre-tax, ≥80% rule honored.
- [ ] If new institution: row added to `university-fips.csv` with correct FIPS.
- [ ] If new county: rows added to both `mit-living-wage.csv` and
      `epi-living-cost.csv` using the lookups above.
- [ ] Verified columns reflect actual evidence, with the link appended when
      the value is `Yes` / `Y12`.
- [ ] PR description cites the source (URL or "issue #N attachment") and notes
      anything that was *not* verifiable.

## What to refuse

- Do **not** open a PR that marks an entry verified without a primary-source
  link or uploaded document.
- Do **not** accept a stipend figure that the submitter admits applies to
  fewer than 80% of students.
- Do **not** guess living-wage values; if the EPI or MIT site does not have
  the county, leave the row out and explain in the PR description.
