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
    fellowship_data[i][3] = data[0][3] // living cost
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
function get_institue_type_selected() {
    retStr = jQuery("#institute_types").find(":selected").val();

    return retStr
}


function get_summer_funding(arr) {
    return arr[6]
}

function get_stipend(arr) {
    if (use_pre_qual())
        return arr[1]
    else
        return arr[2]
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
        return arr[9];
    else
        return arr[10];
}

function sort_on_column(col, desc_or_asc) {
    $("#ranking").find("tbody").html("")

    temp_data = [];
    for (var i = 0; i < data.length; i++) {
        temp_data.push(data[i]);
    }
    for (var i = 0; i < fellowship_data.length; i++) {
        temp_data.push(fellowship_data[i]);
    }
    console.log(temp_data)

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
            institution_style = "color:orange"
        if (i == 0)
            namefix = " &#129351;"
        else if (i == 1)
            namefix = " &#129352;"
        else if (i == 2)
            namefix = " &#129353;"

        namefix2 = ""
        summer_funding = get_summer_funding(temp_data[i])
        summer_funding_style = ""
        if (summer_funding == "N" || summer_funding == "No")
            summer_funding_style = "color:red"
        else if (summer_funding == "Y" || summer_funding == "Yes")
            namefix2 = $("<span>").text(" summer").attr("class", "areaname systems-area")
        else if (summer_funding == "X2")
            namefix2 = $("<span>").text(" summer").attr("class", "areaname systems-area").append($("<small>").text("x2"))

        stipendfix = ""
        if (is_verified(temp_data[i]) == "Yes")
            stipendfix = $("<span>").attr("class", "iconify").attr("data-icon", "material-symbols:verified-rounded").attr("style", "color: #0197f6;")

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
// $(".select-university-trigger").on("change", do_change_CoL(this.value))

// $("#pre-qual").on("click", function() {
//     sort_and_display()
// })
// $("#post-qual").on("click", function() {
//     sort_and_display()
// })
