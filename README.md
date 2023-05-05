# CSStipendRankings: PhD Stipend Rankings

[`CSStipendRankings` (https://csstipendrankings.org)](https://csstipendrankings.org) is a stipend-based ranking of top computer science institutions in the United States, inspired by [`CSRankings`](https://csrankings.org). We may expand to include other countries in the future, and we welcome your contributions!

**We hope you find CSStipendRankings useful towards getting your institution to pay a living wage.**

## How to contribute

**First of all, thank you for your interest in contributing to CSStipendRankings! We welcome contributions from everyone.** Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

### Add stipend for a new institution
**The fastest way to add or update the data is by [editing `stipend-us.csv`](https://github.com/CSStipendRankings/CSStipendRankings/edit/main/stipend-us.csv) and submit a [pull request](https://github.com/CSStipendRankings/CSStipendRankings/pulls).** The stipend data are stored as rows in `stipend-us.csv` in the format of 

> ```"<Institution Name (Optional Notes)>", <Annual Stipend Amount (Pre-Qualification) ($)>, <Annual Stipend Amount (Post-Qualification) ($)>,<Annual Local Living Wage ($)>, <Annual Out-of-pocket Fees Charged by University ($)>```

*Please quote the institution name with `"` if the name contains `,` in it (e.g., `"University of Michigan, Ann Arbor"`). **All stipend and cost listed should be for 12 months. Annual stipend amount should be guaranteed minimal amount for most students (including international students)**, without considering additional income source (e.g., from internship).*


- **To add a new institution**, please add a new row to the `stipend-us.csv`; **to update the an existing institution**, please update the corresponding row in the `stipend-us.csv` accordingly. 

- **For the annual local living wage**, please refer to the [MIT Living Wage Calculator](http://livingwage.mit.edu/) and use the number in `Typical Expenses -> Required annual income before taxes -> 1 Adult & 0 Children` as the annual local living wage.

- **Submit a pull request with your updates.** In the pull request, please mention the source of the stipend data (e.g., your own data point, a link to an official website, etc.) and add a link to the 
MIT Living Wage Calculator. We will review your pull request and merge it if everything looks good.

**Alternatively, you can also [create an issue](https://github.com/CSStipendRankings/CSStipendRankings/issues/new/choose) with the above information and we will add the data for you.**

### Update Website Content

This website is purely static. Before submitting any pull requests, **please first preview your changes locally** by running `python3 -m http.server` in the root directory of this repository and then open `http://localhost:8000` in your browser.

## License
The code and data in this repository is licensed under the [Attribution-NonCommercial-NoDerivatives](https://creativecommons.org/licenses/by-nc-nd/4.0/) license. See `COPYING` for details.
