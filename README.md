# CSStipendRankings: PhD Stipend Rankings

[`CSStipendRankings` (https://csstipendrankings.org)](https://csstipendrankings.org) is a stipend-based ranking of top-paying computer science departments in the United States, inspired by [`CSRankings`](https://csrankings.org). We may expand to include other countries in the future, and we welcome your contributions!

**We hope you find CSStipendRankings useful towards getting your institution to pay a living wage.**

## How to contribute

**First of all, thank you for your interest in contributing to CSStipendRankings! We welcome contributions from everyone.** Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

### Add stipend for a new institution

#### Option 1
The fastest way to add or update the data is by [editing `stipend-us.csv`](https://github.com/CSStipendRankings/CSStipendRankings/edit/main/stipend-us.csv) and submit a [pull request](https://github.com/CSStipendRankings/CSStipendRankings/pulls). The stipend data are stored as rows in `stipend-us.csv` in the format of 

> ```"<Institution Name (Optional Notes)>", <Annual Stipend Amount (Pre-Qualification) ($)>, <Annual Stipend Amount (Post-Qualification) ($)>,<Annual Local Living Wage ($)>, <Annual Out-of-pocket Fees (and Health Insurance) Charged by University ($)>, <Public or Private>, <Summer Funding Guarantee>```

Please place the institution name within `"`'s. Use the name however it appears on [CSRankings.org](https://csrankings.org/).

**All stipend and cost listed should be for 12 months. Annual stipend amount is the minimal amount, pre-tax, for at least 80% of students (including international students)**, without considering additional income source (e.g., from internship).


- **To add a new institution**, please add a new row to the `stipend-us.csv`; **to update the an existing institution**, please update the corresponding row in the `stipend-us.csv` accordingly. 

- **For the annual local living wage**, please refer to the [MIT Living Wage Calculator](http://livingwage.mit.edu/) and use the number in `Typical Expenses -> Required annual income before taxes -> 1 Adult & 0 Children` as the annual local living wage.

- **Submit a pull request with your updates.** In the pull request, please mention the source of the stipend data (e.g., your own data point, a link to an official website, etc.) and add a link to the 
MIT Living Wage Calculator. We will review your pull request and merge it if everything looks good.

#### Option 2
Alternatively, you can also [submit this Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdKIAu98jSzpw97Ojec2jpEUWI4QH75Ig-5Ccz33fQwLl783w/viewform) or [create an issue](https://github.com/CSStipendRankings/CSStipendRankings/issues/new/choose) with the above information and we will add the data for you.

### Update Website Content

This project is a community effort, and we welcome improvements through pull requests. Before submitting a pull request, **please first preview your changes locally** by running 

```
python3 -m http.server
``` 

in the root directory of this repository and then open `http://localhost:8000` in your browser.

### To Raise Issues or Comments

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

