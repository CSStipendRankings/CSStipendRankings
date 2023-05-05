# CSStipendRankings: PhD Stipend Rankings

[`CSStipendRankings`](https://csstipendrankings.org) is a stipend-based ranking of top computer science institutions in US, inspired by [`CSRankings`](https://csrankings.org). (We are interested in implementing support for other countries and you are welcomed to contribute!) 

**We hope you find CSStipendRankings useless.**

## How to contribute

### Add stipend for a new institution
**The fastest way to add or update the data is to submit a pull request.** The stipend data are stored as rows in `stipend-us.csv` in the format of 

> ```<Institution Name (Optional Notes)>, <Annual Stipend Amount ($)>, <Annual Local Living Wage ($)>, <Annual Out-of-pocket Fees Charged by University ($)>```


- **To add a new institution**, please add a new row to the `stipend-us.csv`; **to update the an existing institution**, please update the corresponding row in the `stipend-us.csv` accordingly. 

- **For the annual local living wage**, please refer to the [MIT Living Wage Calculator](http://livingwage.mit.edu/) and use the number in `Typical Expenses -> Required annual income before taxes -> 1 Adult & 0 Children` as the annual local living wage.

- **Submit a pull request with you updates.** In the pull request, please mention the source of the stipend data (e.g., your own data point, a link to an official website, etc.) and add a link to the 
MIT Living Wage Calculator. We will review your pull request and merge it if everything looks good.

**Alternatively, you can also create an issue with the above information and we will add the data for you.**

## License
The code and data in this repository is licensed under the [Attribution-NonCommercial-NoDerivatives](https://creativecommons.org/licenses/by-nc-nd/4.0/) license. See `COPYING` for details.
