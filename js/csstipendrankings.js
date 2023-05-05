csv = $.ajax({type: "GET", url: "stipend-us.csv", async: false}).responseText
data = $.csv.toArrays(csv)
for (i = 0; i < data.length; i++) {
    data[i][1] = Number(data[i][1]) // pre_qual stipend
    data[i][2] = Number(data[i][2]) // after_qual stipend
    data[i][3] = Number(data[i][3]) // fee
    data[i][4] = Number(data[i][4]) // living cost
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

function sort_on_column(col, desc_or_asc) {
    $("#ranking").find("tbody").html("")

    data.sort(function(a, b) {
        // desc
        if(desc_or_asc == true)
        {
            switch(col){
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
        else{
            switch(col){
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

    console.log(data)

    for (i = 0; i < data.length; i++) {
	style = ""
	if (get_stipend(data[i]) - get_fee(data[i]) < get_living_cost(data[i]))
	    style = "color:red"
	namefix = ""
	if (i == 0)
	    namefix = " &#129351;"
	else if (i == 1)
	    namefix = " &#129352;"
	else if (i == 2)
	    namefix = " &#129353;"
        $("#ranking").find("tbody").append(
            $("<tr>")
                .append($("<td>").text(i+1))
                .append($("<td>").text(get_university(data[i])).append(namefix))
                .append($("<td>").text(get_stipend(data[i]).toLocaleString("en-US")).attr("align", "right"))
                .append($("<td>").text(get_fee(data[i]).toLocaleString("en-US")).attr("align", "right"))
                .append($("<td>").text(get_living_cost(data[i]).toLocaleString("en-US")).attr("align", "right"))
                .append($("<td>").text((get_stipend(data[i])-get_fee(data[i])-get_living_cost(data[i])).toLocaleString("en-US")).append("&nbsp;&nbsp;").attr("align", "right").attr("style", style))
        )
    }
}

$("#overlay-loading").hide()

// sort on stipend by default
sort_on_column("after-fee-wage", true)

function do_sort() {
  sort_on_column(get_sort_by(), is_low_to_high());
}
$(".sort-trigger").on("click", do_sort)

// $("#pre-qual").on("click", function() {
//     sort_and_display()
// })
// $("#post-qual").on("click", function() {
//     sort_and_display()
// })
