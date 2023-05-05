csv = $.ajax({type: "GET", url: "stipend-us.csv", async: false}).responseText
data = $.csv.toArrays(csv)
for (i = 0; i < data.length; i++) {
    data[i][1] = Number(data[i][1])
    data[i][2] = Number(data[i][2])
    data[i][3] = Number(data[i][3])
    data[i][4] = Number(data[i][4])
}

function is_subtract_living() {
    return $("#living-wage").is(":checked")
}

function use_pre_qual() {
    return $("#pre-qual").is(":checked")
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

function sort_and_display() {
    $("#ranking").find("tbody").html("")

    data.sort(function(a, b) {
        if (is_subtract_living())
            return (get_stipend(b) - get_fee(b) - get_living_cost(b)) - (get_stipend(a) - get_fee(a) - get_living_cost(a))
        else
            return get_stipend(b) - get_stipend(a)
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
                .append($("<td>").text((get_stipend(data[i])-get_fee(data[i])-get_living_cost(data[i])).toLocaleString("en-US")).attr("align", "right").attr("style", style))
        )
    }
}

$("#overlay-loading").hide()

sort_and_display(false)

$("#living-wage").on("click", function() {
    sort_and_display()
})

$("#pre-qual").on("click", function() {
    sort_and_display()
})
$("#post-qual").on("click", function() {
    sort_and_display()
})
