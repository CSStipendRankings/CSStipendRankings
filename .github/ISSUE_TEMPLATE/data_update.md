---
name: Stipend Data Update
about: Add or update stipend data for an institution. AI-assisted submissions are encouraged.
title: "[Data Update]: "
labels: data-update, needs-triage
assignees: mjc0608, jiong-zhu, pyjhzwh, eltsai, TonyZhangND
---

> **You don't have to fill this in by hand.** Drop your offer letter, payroll record, department funding page, or any other source into ChatGPT / Claude / your favorite LLM and ask it to "fill in the CSStipendRankings issue template". Paste the result here. You can also `@claude` in a comment after submitting and the [Claude PR Assistant](../blob/main/.github/workflows/claude.yml) will draft a CSV pull request for maintainers to review.
>
> Please **always include a source link or attach the (redacted) source document** so we can verify before merging.
>
> Duplicate the block below for each institution you want to add or update.

---

## Institution name:

* [ ] This updates an existing institution.

- **Annual Stipend Amount (USD, both Pre-Qualification and Post-Qualification if different)**:

- **Summer Stipend Amount (USD, if different from the academic-year rate)**:

- **Annual Out-of-pocket Fees (and Health Insurance) Charged by University (USD)**:

- **Summer Funding Guarantee**: (yes / no / partial / don't know)

- **Public or Private**:

- **Department Address (street, city, state, ZIP)**:

  > Used to look up the county FIPS code for the living-wage join. Skip if the institution is already in `university-fips.csv`.

- **Living wage data (only needed if the county isn't already in our living-wage CSVs)**:

  - [MIT Living Wage Calculator](https://livingwage.mit.edu/) — `Typical Expenses → Required annual income before taxes → 1 Adult & 0 Children`:
  - [EPI Family Budget Calculator](https://www.epi.org/resources/budget/) — 1 adult, 0 children:

- **Source of the stipend / fee data** (offer letter, official page, payroll record, etc. — link or attach a redacted copy):

- **Additional comments (optional)**:
