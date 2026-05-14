university_fips_csv = $.ajax({ type: "GET", url: "university-fips.csv", async: false }).responseText
university_fips_rows = $.csv.toArrays(university_fips_csv)
university_fips_rows = university_fips_rows.slice(1) // Remove header
university_fips_map = {}
for (i = 0; i < university_fips_rows.length; i++) {
    var institution = university_fips_rows[i][0].trim()
    university_fips_map[institution] = {
        fips: university_fips_rows[i][1].trim(),
        county: university_fips_rows[i][2].trim(),
        state: university_fips_rows[i][3].trim(),
        address: university_fips_rows[i][4].trim()
    }
}

notes_csv = $.ajax({ type: "GET", url: "notes.csv", async: false }).responseText
notes_rows = $.csv.toArrays(notes_csv)
notes_rows = notes_rows.slice(1) // Remove header
notes_map = {}
for (i = 0; i < notes_rows.length; i++) {
    var institution = notes_rows[i][0].trim()
    notes_map[institution] = notes_rows[i][1].trim()
}

epi_living_wage_csv = $.ajax({ type: "GET", url: "epi-living-cost.csv", async: false }).responseText
epi_living_wage_rows = $.csv.toArrays(epi_living_wage_csv)
epi_living_wage_rows = epi_living_wage_rows.slice(1) // Remove header
epi_wage_map = {}
epi_components_map = {}
for (i = 0; i < epi_living_wage_rows.length; i++) {
    var fips = epi_living_wage_rows[i][0].trim()
    var wage = Number(epi_living_wage_rows[i][2])
    epi_wage_map[fips] = wage
    if (epi_living_wage_rows[i].length >= 10) {
        epi_components_map[fips] = {
            total: Number(epi_living_wage_rows[i][2]),
            housing: Number(epi_living_wage_rows[i][3]),
            food: Number(epi_living_wage_rows[i][4]),
            transportation: Number(epi_living_wage_rows[i][5]),
            healthcare: Number(epi_living_wage_rows[i][6]),
            other_necessities: Number(epi_living_wage_rows[i][7]),
            childcare: Number(epi_living_wage_rows[i][8]),
            taxes: Number(epi_living_wage_rows[i][9])
        }
    }
}

csv = $.ajax({ type: "GET", url: "stipend-us.csv", async: false }).responseText
data = $.csv.toArrays(csv)
data = data.slice(1) // Remove header
console.log(data)
uni_and_cost_of_living = [];
for (i = 0; i < data.length; i++) {
    data[i][1] = Number(data[i][1]) // pre_qual stipend
    data[i][2] = Number(data[i][2]) // after_qual stipend
    var uniInfo = university_fips_map[data[i][0].trim()] || {}
    var fips = uniInfo.fips || ""
    data[i].splice(3, 0, epi_wage_map[fips] || 0) // insert annual living cost at index 3
    data[i][4] = Number(data[i][4]) // fee
    data[i][5] = data[i][5].trimStart() // public/private
    data[i][6] = data[i][6].trimStart() // summer funding guarantee
    data[i][7] = Number(data[i][7]) // pre_qual summer
    data[i][8] = Number(data[i][8]) // after_qual summer
    data[i][9] = data[i][9].trimStart() // pre_qual verified
    data[i][10] = data[i][10].trimStart() // post_qual verified

    uni_and_cost_of_living.push([data[i][0], data[i][3]])
}

var sel = document.getElementById('university_locations');
uni_and_cost_of_living.sort();
for(var i = 0; i < uni_and_cost_of_living.length; i++) {
    var opt = document.createElement('option');
    opt.innerHTML = uni_and_cost_of_living[i][0];
    opt.value = uni_and_cost_of_living[i][1];
    sel.appendChild(opt);
}

fellowship_csv = $.ajax({ type: "GET", url: "fellowship-us.csv", async: false }).responseText
fellowship_data = $.csv.toArrays(fellowship_csv)
fellowship_data = fellowship_data.slice(1) // Remove header
for (i = 0; i < fellowship_data.length; i++) {
    fellowship_data[i][1] = Number(fellowship_data[i][1]) // pre_qual stipend
    fellowship_data[i][2] = Number(fellowship_data[i][2]) // after_qual stipend
    fellowship_data[i][3] = uni_and_cost_of_living[0][1] // living cost
    fellowship_data[i][4] = 0 // fee
    fellowship_data[i][5] = fellowship_data[i][5].trimStart()
    fellowship_data[i][6] = fellowship_data[i][6].trimStart()
    fellowship_data[i][7] = Number(fellowship_data[i][7]) // pre_qual summer
    fellowship_data[i][8] = Number(fellowship_data[i][8]) // after_qual summer
    fellowship_data[i][9] = fellowship_data[i][9].trimStart() // pre_qual verified
    fellowship_data[i][10] = fellowship_data[i][10].trimStart() // post_qual verified
}

function use_fellowship() {
    return $("#fellowship").is(":checked")
}

function is_subtract_living() {
    return $("#living-wage").is(":checked")
}

function use_pre_qual() {
    return $("#pre-qual").is(":checked")
}

function is_low_to_high() {
    return !$("#low-to-high").is(":checked")
}

function get_sort_by() {
    if ($("#stipend").is(":checked")) return "stipend";
    else if ($("#fees").is(":checked")) return "fees";
    else if ($("#living-cost").is(":checked")) return "living-cost";
    else if ($("#after").is(":checked")) return "after-fee-wage";
    else return "error";
}

function is_exclude_healthcare() {
    return $("#exclude-healthcare").is(":checked")
}

function is_exclude_transportation() {
    return $("#exclude-transportation").is(":checked")
}

function is_correct_tax() {
    return $("#correct-tax").is(":checked")
}

// ============================================================================
// TAX CALCULATION — adapted from tax-logic-core (MIT License)
// https://github.com/tax-logic-core/tax-logic-core
// ============================================================================

// 2025 federal income tax brackets for single filers
var FEDERAL_BRACKETS_2025 = [
    [0,      0.10],
    [11925,  0.12],
    [48475,  0.22],
    [103350, 0.24],
    [197300, 0.32],
    [250525, 0.35],
    [626350, 0.37]
];

var STD_DEDUCTION_2025 = 15000;  // 2025 standard deduction, single filer

// States with no income tax on wages
var NO_INCOME_TAX_STATES = ['AK','FL','NV','NH','SD','TN','TX','WA','WY'];

// States with flat income tax rates (2025)
var FLAT_TAX_STATES = {
    'AZ': 0.025,   'CO': 0.044,   'GA': 0.0539,
    'ID': 0.058,   'IL': 0.0495,  'IN': 0.0305,
    'KY': 0.04,    'MI': 0.0425,  'MS': 0.044,
    'NC': 0.0425,  'PA': 0.0307,  'UT': 0.0455
};

// Massachusetts: flat 5% (millionaire surcharge irrelevant for stipend range)
var MA_RATE = 0.05;

// Graduated state tax brackets for single filers (2025)
// Format: [threshold, rate]; rate applies to income from this threshold up to next
var STATE_TAX_BRACKETS = {
    'AL': [[0,0.02],[500,0.04],[3000,0.05]],
    'AR': [[0,0.02],[5099,0.04],[10299,0.044]],
    'CA': [[0,0.01],[10412,0.02],[24684,0.04],[38959,0.06],[54081,0.08],[68350,0.093],[349137,0.103],[418961,0.113],[698271,0.123],[1000000,0.133]],
    'CT': [[0,0.02],[10000,0.045],[50000,0.055],[100000,0.06],[200000,0.065],[250000,0.069],[500000,0.0699]],
    'DC': [[0,0.04],[10000,0.06],[40000,0.065],[60000,0.085],[250000,0.0925],[500000,0.0975],[1000000,0.1075]],
    'DE': [[0,0],[2000,0.022],[5000,0.039],[10000,0.048],[20000,0.052],[25000,0.0555],[60000,0.066]],
    'HI': [[0,0.014],[2400,0.032],[4800,0.055],[9600,0.064],[14400,0.068],[19200,0.072],[24000,0.076],[36000,0.079],[48000,0.0825],[150000,0.09],[175000,0.10],[200000,0.11]],
    'IA': [[0,0.044],[6210,0.0482],[31050,0.057]],
    'KS': [[0,0.031],[15000,0.0525],[30000,0.057]],
    'LA': [[0,0.0185],[12500,0.035],[50000,0.0425]],
    'MD': [[0,0.02],[1000,0.03],[2000,0.04],[3000,0.0475],[100000,0.05],[125000,0.0525],[150000,0.055],[250000,0.0575]],
    'ME': [[0,0.058],[26050,0.0675],[61600,0.0715]],
    'MN': [[0,0.0535],[31690,0.068],[104090,0.0785],[193240,0.0985]],
    'MO': [[0,0.02],[1207,0.025],[2414,0.03],[3621,0.035],[4828,0.04],[6035,0.045],[7242,0.048]],
    'MT': [[0,0.047],[20500,0.059]],
    'ND': [[0,0.0195],[44725,0.0235]],
    'NE': [[0,0.0246],[3700,0.0351],[22170,0.0501],[35730,0.0584]],
    'NJ': [[0,0.014],[20000,0.0175],[35000,0.035],[40000,0.05525],[75000,0.0637],[500000,0.0897],[1000000,0.1075]],
    'NM': [[0,0.017],[5500,0.032],[11000,0.047],[16000,0.049],[210000,0.059]],
    'NY': [[0,0.04],[8500,0.045],[11700,0.0525],[13900,0.055],[80650,0.06],[215400,0.0685],[1077550,0.0965],[5000000,0.103],[25000000,0.109]],
    'OH': [[0,0],[26050,0.02765],[100000,0.035]],
    'OK': [[0,0.0025],[1000,0.0075],[2500,0.0175],[3750,0.0275],[4900,0.0375],[7200,0.0475]],
    'OR': [[0,0.0475],[4300,0.0675],[10750,0.0875],[125000,0.099]],
    'RI': [[0,0.0375],[77450,0.0475],[176050,0.0599]],
    'SC': [[0,0],[3460,0.03],[17330,0.062]],
    'VA': [[0,0.02],[3000,0.03],[5000,0.05],[17000,0.0575]],
    'VT': [[0,0.0335],[45400,0.066],[110050,0.076],[229550,0.0875]],
    'WI': [[0,0.035],[14320,0.044],[28640,0.053],[315310,0.0765]],
    'WV': [[0,0.0236],[10000,0.0315],[25000,0.0354],[40000,0.0472],[60000,0.0512]]
};

function calc_bracket_tax(income, brackets) {
    if (income <= 0) return 0;
    var tax = 0;
    for (var i = 0; i < brackets.length; i++) {
        var limit = brackets[i][0];
        var rate = brackets[i][1];
        var next_limit = (i + 1 < brackets.length) ? brackets[i+1][0] : Infinity;
        if (income > next_limit) {
            tax += (next_limit - limit) * rate;
        } else {
            tax += Math.max(0, income - limit) * rate;
            break;
        }
    }
    return Math.max(0, tax);
}

function calc_federal_tax(income) {
    var taxable = Math.max(0, income - STD_DEDUCTION_2025);
    return calc_bracket_tax(taxable, FEDERAL_BRACKETS_2025);
}

function calc_state_tax(taxable_income, state) {
    if (!state || NO_INCOME_TAX_STATES.indexOf(state) >= 0) return 0;
    if (FLAT_TAX_STATES[state] !== undefined) return taxable_income * FLAT_TAX_STATES[state];
    if (state === 'MA') return taxable_income * MA_RATE;
    var brackets = STATE_TAX_BRACKETS[state];
    if (!brackets) return 0;
    return calc_bracket_tax(taxable_income, brackets);
}

function calc_corrected_tax(stipend, state) {
    var fed_tax = calc_federal_tax(stipend);
    var fica = stipend * 0.0765;  // 6.2% SS + 1.45% Medicare
    var taxable_income = Math.max(0, stipend - STD_DEDUCTION_2025);
    var state_tax = calc_state_tax(taxable_income, state);
    return Math.round(fed_tax + fica + state_tax);
}

function get_living_cost(arr) {
    var total = arr[3];
    var uniInfo = university_fips_map[arr[0].trim()] || {};
    var fips = uniInfo.fips || "";
    var state = uniInfo.state || "";
    var comp = epi_components_map[fips];
    if (!comp) return total;
    var adjusted = total;
    if (is_exclude_healthcare())
        adjusted -= comp.healthcare;
    if (is_exclude_transportation())
        adjusted -= comp.transportation;
    if (is_correct_tax()) {
        var stipend = get_stipend(arr);
        if (!isNaN(stipend))
            adjusted = adjusted - comp.taxes + calc_corrected_tax(stipend, state);
    }
    return adjusted;
}

function get_stipend_type() {
    if ($("#majority").is(":checked")) return "majority";
    else if ($("#guaranteed-only").is(":checked")) return "guaranteed-only";
    else if ($("#exclude-summer").is(":checked")) return "exclude-summer";
    else return "error";
}

function get_institue_type_selected() {
    retStr = jQuery("#institute_types").find(":selected").val();

    return retStr
}

function get_labels(arr) {
    return arr[6].split(" ")
}

function get_summer_funding(arr) {
    if (arr[6].includes("summer-gtd")) return "Yes"
    else if (arr[6].includes("summer-partial-gtd")) return "Partial"
    else if (arr[6].includes("summer-no-gtd")) return "No"
    else return "Unknown"
}

function get_summer_guaranteed_partial(arr) {
    labels = arr[6].split(" ")
    for (i = 0; i < labels.length; i++) {
        if (labels[i].includes("summer-partial-gtd")) {
            return Number(labels[i].split("=")[1])
        }
    }
    return NaN
}

function is_no_guarantee(arr) {
    if (arr[6].includes("no-guarantee")) return true
    else return false
}

function get_stipend_raw(arr) {
    if (use_pre_qual())
        return arr[1]
    else
        return arr[2]
}

function get_summer_raw(arr) {
    if (use_pre_qual())
        return arr[7]
    else
        return arr[8]
}

function get_stipend(arr) {
    type = get_stipend_type()
    if (type == "majority") {
        return get_stipend_raw(arr)
    } else if (type == "guaranteed-only") {
        summer_funding_status = get_summer_funding(arr)
        if (is_no_guarantee(arr)) {
            return 0
        } else if (summer_funding_status == "Yes") {
            return get_stipend_raw(arr)
        } else if (summer_funding_status == "Partial") {
            return get_stipend_raw(arr) - get_summer_raw(arr) + get_summer_guaranteed_partial(arr)
        } else if (get_summer_funding(arr) == "No") {
            return get_stipend_raw(arr) - get_summer_raw(arr)
        } else {
            return NaN
        }
    } else if (type == "exclude-summer") {
        return get_stipend_raw(arr) - get_summer_raw(arr) + Number($("#extra-summer-income").val())
    } else {
        return NaN
    }
}

function get_fee(arr) {
    return arr[4]
}

function get_university(arr) {
    return arr[0]
}

function get_university_type(arr) {
    return arr[5]
}

function get_university_tooltip(arr) {
    var info = university_fips_map[arr[0].trim()] || {}
    var tooltip = ""
    if (info.address) {
        tooltip = "Address: " + info.address + "\nCounty: " + info.county + "\nFIPS: " + info.fips
    }
    var note = notes_map[arr[0].trim()]
    if (note && note.length > 0) {
        if (tooltip.length > 0) tooltip += "\n\n"
        tooltip += "Note: " + note
    }
    return tooltip
}

function is_verified(arr) {
    if (use_pre_qual())
        return arr[9].split(" ");
    else
        return arr[10].split(" ");
}

function get_col(arr, col) {
    switch (col) {
        case "stipend":
            return get_stipend(arr)
        case "fees":
            return get_fee(arr)
        case "living-cost":
            return get_living_cost(arr)
        case "after-fee-wage":
            return (get_stipend(arr) - get_fee(arr) - get_living_cost(arr))
    }
}

// Rebuild fellowship dropdown with correct living cost values based on selected source
function sync_fellowship_dropdown() {
    var sel = document.getElementById('university_locations')
    var selectedText = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : ""
    sel.innerHTML = ""
    for (var i = 0; i < uni_and_cost_of_living.length; i++) {
        var opt = document.createElement('option')
        opt.text = uni_and_cost_of_living[i][0]
        opt.value = uni_and_cost_of_living[i][1]
        if (uni_and_cost_of_living[i][0] === selectedText) opt.selected = true
        sel.appendChild(opt)
    }
    var newVal = Number(sel.value)
    for (var i = 0; i < fellowship_data.length; i++) {
        fellowship_data[i][3] = newVal
    }
}

// Update the living cost column header tooltip based on selected source
function update_col_header() {
    var abbr = document.getElementById('living-cost-header-abbr')
    if (!abbr) return
    var base = "Annual cost of living for 1 adult with 0 children (1p0c), from the EPI Family Budget Calculator. Source: https://www.epi.org/resources/budget/"
    var notes = []
    if (is_exclude_healthcare()) notes.push("health care excluded")
    if (is_exclude_transportation()) notes.push("transportation excluded")
    if (is_correct_tax()) notes.push("tax recalculated for stipend income")
    if (notes.length > 0)
        abbr.title = base + " Adjustments: " + notes.join(", ") + "."
    else
        abbr.title = base
}

function sort_on_column(col, desc_or_asc) {
    $("#ranking").find("tbody").html("")

    temp_data_pre_filter = [];
    for (var i = 0; i < data.length; i++) {
        temp_data_pre_filter.push(data[i]);
    }
    for (var i = 0; i < fellowship_data.length; i++) {
        temp_data_pre_filter.push(fellowship_data[i]);
    }
    console.log(temp_data_pre_filter)

    temp_data = []
    for (var i = 0; i < temp_data_pre_filter.length; i++) {
        if (!isNaN(get_col(temp_data_pre_filter[i], col))) {
            temp_data.push(temp_data_pre_filter[i]);
        }
    }

    temp_data.sort(function (a, b) {
        // desc
        if (desc_or_asc == true) {
            switch (col) {
                case "stipend":
                    return get_stipend(b) - get_stipend(a)
                case "fees":
                    return get_fee(b) - get_fee(a)
                case "living-cost":
                    return get_living_cost(b) - get_living_cost(a)
                case "after-fee-wage":
                    return (get_stipend(b) - get_fee(b) - get_living_cost(b)) - (get_stipend(a) - get_fee(a) - get_living_cost(a))

            }
        }
        // asc
        else {
            switch (col) {
                case "stipend":
                    return get_stipend(a) - get_stipend(b)
                case "fees":
                    return get_fee(a) - get_fee(b)
                case "living-cost":
                    return get_living_cost(a) - get_living_cost(b)
                case "after-fee-wage":
                    return (get_stipend(a) - get_fee(a) - get_living_cost(a)) - (get_stipend(b) - get_fee(b) - get_living_cost(b))

            }
            // if (col !=5)
            //     return a[col] - b[col]
            // else
            //     return (get_stipend(a) - get_fee(a) - get_living_cost(a)) - (get_stipend(b) - get_fee(b) - get_living_cost(b))
        }
    })

    local_rank = 0

    for (i = 0; i < temp_data.length; i++) {
        style = ""
        if (get_stipend(temp_data[i]) - get_fee(temp_data[i]) < get_living_cost(temp_data[i]))
            style = "color:red"
        namefix = ""
        institution_style = ""

        if (get_university_type(temp_data[i]) == "public")
            institution_style = "color:green"
        else if (get_university_type(temp_data[i]) == "private")
            institution_style = "color:purple"
        else if (get_university_type(temp_data[i]) == "fellowship")
            institution_style = "color:blue"
        if (local_rank == 0)
            namefix = " &#129351;"
        else if (local_rank == 1)
            namefix = " &#129352;"
        else if (local_rank == 2)
            namefix = " &#129353;"

        labels = get_labels(temp_data[i])
        namefix2 = $("<span>").append("&nbsp;&nbsp;")
	    first = true
        for (k = 0; k < labels.length; k++) {
            if (labels[k] == "summer-gtd" || labels[k].includes("summer-partial-gtd")) {
                if (!first) namefix2.append(",")
                namefix2.append($("<span>").text("summer-gtd").attr("class", "areaname systems-area"))
                first = false;
	          } else if (labels[k] == "summer-no-gtd") {
                if (!first) namefix2.append(",")
                namefix2.append($("<span>").text("summer-no-gtd").attr("class", "areaname").attr("style", "color:red"))
                first = false;
            } else if (labels[k] == "varies") {
                if (!first) namefix2.append(",")
                namefix2.append($("<span>").text("varies").attr("class", "areaname systems-area"))
                first = false;
            } else if (labels[k] == "striking") {
                if (!first) namefix2.append(",")
                namefix2.append($("<span>").text("striking").attr("class", "areaname").attr("style", "color:red"))
                first = false;
            } else if (labels[k] == "no-guarantee") {
                if (!first) namefix2.append(",")
                namefix2.append($("<span>").text("no-guarantee").attr("class", "areaname").attr("style", "color:red"))
                first = false;
            } else if (labels[k] == "cpt-fee") {
                if (!first) namefix2.append(",")
                namefix2.append($("<span>").text("cpt-fee").attr("class", "areaname").attr("style", "color:red"))
                first = false;
	    }

            if (labels[k].includes("survey")) {
                survey_link = labels[k].split("=")[1]
                survey_icon = $("<span>").attr("class", "iconify").attr("data-icon", "icon-park-solid:file-question").attr("style", "color: #960018;")
                namefix2.prepend($("<a>").attr("href", survey_link).attr("target", "_blank").append(survey_icon))
                namefix2.prepend("&nbsp;")
            }
        }


        stipendfix = ""
        verified_status = is_verified(temp_data[i])
        if (verified_status.length == 1) {
            if (verified_status[0] == "Yes") {
                stipendfix = $("<span>").attr("class", "iconify").attr("data-icon", "material-symbols:verified-rounded").attr("style", "color: #a9a9a9;")
            } else if (verified_status[0] == "Y12") {
                stipendfix = $("<span>").attr("class", "iconify").attr("data-icon", "material-symbols:verified-rounded").attr("style", "color: #0197f6;")
            }
        } else if (verified_status.length == 2) {
            if (verified_status[0] == "Yes") {
                checkmark = $("<span>").attr("class", "iconify").attr("data-icon", "material-symbols:verified-rounded").attr("style", "color: #a9a9a9;")
                stipendfix = $("<a>").attr("href", verified_status[1]).attr("target", "_blank").append(checkmark)
            } else if (verified_status[0] == "Y12") {
                checkmark = $("<span>").attr("class", "iconify").attr("data-icon", "material-symbols:verified-rounded").attr("style", "color: #0197f6;")
                stipendfix = $("<a>").attr("href", verified_status[1]).attr("target", "_blank").append(checkmark)
            }
        } else {
            console.log("This is a bug. Please report it to the maintainers.")
        }

        if (use_fellowship() && get_university_type(temp_data[i]) == "fellowship") {
            global_ranking_postfix = ""
            if (get_institue_type_selected() != "all_public_private")
                global_ranking_postfix = " (" + (i + 1).toString() + ")"
            $("#ranking").find("tbody").append(
                $("<tr>")
                    .append($("<td>").text(local_rank + 1))
                    .append($("<td>").append($("<span>").text(get_university(temp_data[i])).attr("title", get_university_tooltip(temp_data[i]))).append(namefix).append(namefix2).attr("style", institution_style))
                    .append($("<td>").append(stipendfix).append("&nbsp;"+get_stipend(temp_data[i]).toLocaleString("en-US")).attr("align", "right"))
                    .append($("<td>").text(get_fee(temp_data[i]).toLocaleString("en-US")).attr("align", "right"))
                    .append($("<td>").text(get_living_cost(temp_data[i]).toLocaleString("en-US")).attr("align", "right"))
                    .append($("<td>").text((get_stipend(temp_data[i]) - get_fee(temp_data[i]) - get_living_cost(temp_data[i])).toLocaleString("en-US")).attr("align", "right").attr("style", style))
            )
            local_rank = local_rank + 1
        }

        if (get_university_type(temp_data[i]) != "fellowship" && (get_institue_type_selected() == "all_public_private" ||
            (get_institue_type_selected() == get_university_type(temp_data[i])))
        ) {
            global_ranking_postfix = ""
            if (get_institue_type_selected() != "all_public_private")
                global_ranking_postfix = " (" + (i + 1).toString() + ")"
            $("#ranking").find("tbody").append(
                $("<tr>")
                    .append($("<td>").text(local_rank + 1))
                    .append($("<td>").append($("<span>").text(get_university(temp_data[i])).attr("title", get_university_tooltip(temp_data[i]))).append(namefix).append(namefix2).attr("style", institution_style))
                    .append($("<td>").append(stipendfix).append("&nbsp;"+get_stipend(temp_data[i]).toLocaleString("en-US")).attr("align", "right"))
                    .append($("<td>").text(get_fee(temp_data[i]).toLocaleString("en-US")).attr("align", "right"))
                    .append($("<td>").text(get_living_cost(temp_data[i]).toLocaleString("en-US")).attr("align", "right"))
                    .append($("<td>").text((get_stipend(temp_data[i]) - get_fee(temp_data[i]) - get_living_cost(temp_data[i])).toLocaleString("en-US")).attr("align", "right").attr("style", style))
            )
            local_rank = local_rank + 1
        }
    }
}

$("#overlay-loading").hide()

// sort on stipend by default
sort_on_column("after-fee-wage", true)
toggle_healthcare_warning()
toggle_transportation_warning()

function toggle_healthcare_warning() {
    var banner = document.getElementById('healthcare-warning');
    if (banner) banner.style.display = is_exclude_healthcare() ? '' : 'none';
}
function toggle_transportation_warning() {
    var banner = document.getElementById('transportation-warning');
    if (banner) banner.style.display = is_exclude_transportation() ? '' : 'none';
}

function do_sort() {
    sort_on_column(get_sort_by(), is_low_to_high());
    update_col_header();
    toggle_healthcare_warning();
    toggle_transportation_warning();
}
$(".sort-trigger").on("click", do_sort)

function do_change_CoL(val){
    for (i = 0; i < fellowship_data.length; i++) {
        fellowship_data[i][3] = Number(val) // living cost
    }

    do_sort();
}

$("#rankform").on("submit", function(event) {
    do_sort();
    update_col_header();
    event.preventDefault();
})
