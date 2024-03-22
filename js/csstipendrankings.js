csv = $.ajax({ type: "GET", url: "stipend-us.csv", async: false }).responseText
data = $.csv.toArrays(csv)
data = data.slice(1) // Remove header
console.log(data)
uni_and_cost_of_living = [];
for (i = 0; i < data.length; i++) {
    data[i][1] = Number(data[i][1]) // pre_qual stipend
    data[i][2] = Number(data[i][2]) // after_qual stipend
    data[i][3] = Number(data[i][3]) // living cost
    data[i][4] = Number(data[i][4]) // fee
    data[i][5] = data[i][5].trimStart() // public/private
    data[i][6] = data[i][6].trimStart() // summer funding guarantee
    data[i][7] = Number(data[i][7]) // pre_qual stipend
    data[i][8] = Number(data[i][8]) // after_qual stipend
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

function get_living_cost(arr) {
    return arr[3]
}

function get_university(arr) {
    return arr[0]
}

function get_university_type(arr) {
    return arr[5]
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
                    .append($("<td>").text(get_university(temp_data[i])).append(namefix).append(namefix2).attr("style", institution_style))
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
                    .append($("<td>").text(get_university(temp_data[i])).append(namefix).append(namefix2).attr("style", institution_style))
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

function do_sort() {
    sort_on_column(get_sort_by(), is_low_to_high());
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
    event.preventDefault();
})
