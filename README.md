# CSStipendRankings: PhD Stipend Rankings

[`CSStipendRankings` (https://csstipendrankings.org)](https://csstipendrankings.org) is a stipend-based ranking of top-paying computer science departments in the United States, inspired by [`CSRankings`](https://csrankings.org). We may expand to include other countries in the future, and we welcome your contributions!

**We hope you find CSStipendRankings useful towards getting your institution to pay a living wage.**

## How to contribute

**First of all, thank you for your interest in contributing to CSStipendRankings! We welcome contributions from everyone.** Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

### The easiest way: open an issue and `/opencode`

Open the [stipend data issue template](https://github.com/CSStipendRankings/CSStipendRankings/issues/new/choose) and describe what you know — a link to your department's funding page, an offer letter or payroll PDF (with personal info redacted), or just the numbers. Then `/opencode` in a comment on the issue, and the [OpenCode PR Assistant workflow](.github/workflows/opencode.yml) will draft the CSV change as a pull request for maintainers to review. If you have a source document link or can upload a (redacted) copy, we can add a verified checkmark on the website — it's optional, but encouraged.

### Editing the CSVs directly

If you prefer to edit by hand, the data lives in a few small CSV files at the repo root:

| File | What it stores |
| --- | --- |
| `stipend-us.csv` | Per-institution stipend, fee, labels, and verification info. **Does not** contain the living wage anymore — that's looked up via FIPS. |
| `university-fips.csv` | Maps each institution to its address, county, state, and county FIPS code. Add a new row here whenever you add a new institution. |
| `epi-living-cost.csv` | Per-county annual budget from the [EPI Family Budget Calculator](https://www.epi.org/resources/budget/) (1 adult, 0 children). Keyed by FIPS. |
| `fellowship-us.csv` | Stipend amounts for major fellowships. |

`stipend-us.csv` columns, in order:

| # | Header | What goes in it |
| --- | --- | --- |
| 1 | `institution` | Institution name (with optional parenthetical notes), wrapped in `"`s. |
| 2 | `pre_qual stipend` | **12-month**, pre-tax USD pre-qualification stipend that ≥80% of PhD students receive. |
| 3 | `after_qual stipend` | Same rule, for the post-qualification stipend. Repeat the pre-qual value if they're identical. |
| 4 | `fee` | Annual out-of-pocket fees + health insurance charged by the university (USD). |
| 5 | `public/private` | `public` or `private`. |
| 6 | `labels` | Space-separated tags. Always include exactly one `summer-*` tag (`summer-gtd`, `summer-partial-gtd=N`, `summer-no-gtd`, or `summer-unknown`). Other recognized tags: `varies`, `no-guarantee`, `striking`, `cpt-fee`, `survey=<URL>`. Unknown strings are silently ignored by the frontend. |
| 7 | `pre_qual summer` | Summer portion of the pre-qual 12-month total (USD integer), or `Unknown`. The frontend uses this together with the summer-guarantee label to compute the guaranteed-only view. |
| 8 | `after_qual summer` | Same, for the post-qualification stipend. |
| 9 | `pre_qual verified` | `Yes`, `Y12`, or `No`, optionally followed by a space and a source URL when verified. |
| 10 | `post_qual verified` | Same, for the post-qualification stipend. |

- Use the same institution name as on [CSRankings.org](https://csrankings.org/).
- **All stipend and cost figures are 12-month, pre-tax USD.** The annual stipend is the minimum amount that at least 80% of PhD students (including international students) receive, excluding internships and other outside income. Summer is reported separately in columns 7–8 — do **not** subtract it from the annual figure based on the summer guarantee; the frontend handles that.
- For a brand-new institution, also add a row to `university-fips.csv`. The county FIPS code can be looked up via the [Census geocoder](https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress).
- If that county doesn't already appear in `epi-living-cost.csv`, add it. Use the 1-adult/0-children value from the EPI Family Budget Calculator.
- **Submit a pull request with your updates.** Please mention the source of the data (your own offer letter, an official page, etc.) in the PR description.

### Update website content

This project is a community effort, and we welcome improvements through pull requests. Before submitting a pull request, **please first preview your changes locally** by running

```
python3 -m http.server
```

in the root directory of this repository and then open `http://localhost:8000` in your browser.

### To raise issues or comments

We believe issues and comments should be discussed and resolved publicly on GitHub for transparency.
**If you believe any data is inaccurate or have additional comments,
please open an [issue](https://github.com/CSStipendRankings/CSStipendRankings/issues/new/choose) or a [pull request](https://github.com/CSStipendRankings/CSStipendRankings/pulls).**

**The maintainers will <i>not</i> respond to private messages sent to their personal accounts regarding this website.**

## License
Frontend (i.e., CSS and HTML) of this website is based on code licensed from [CSRankings](https://github.com/emeryberger/CSrankings) by [Emery Berger](https://emeryberger.com/).
Data and non-CSRankings code in this repository is owned by its [contributors](https://github.com/CSStipendRankings/CSStipendRankings/contributors), and licensed under the [Attribution-NonCommercial-NoDerivatives](https://creativecommons.org/licenses/by-nc-nd/4.0/) license. See `LICENSE` for details.

## Disclaimer
CSStipendRankings is designed to highlight stipend situations across various institutions, based on user-submitted information. We try our best to verify their accuracy, but **we cannot guarantee they are correct or up-to-date**. **Ultimately, while we hope you find this information useful, this should not be used as the primary basis for grad school decisions. We advocate users to do their own research before making life decisions.**

THIS SOFTWARE AND INFORMATION IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND
      ANY EXPRESS OR IMPLIED WARRANTIES,
      INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
      DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
      SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
      SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
      WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
      OF
      THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
