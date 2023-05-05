csv = $.ajax({type: "GET", url: "stipend-us.csv", async: false}).responseText
data = $.csv.toArrays(csv)
for (i = 0; i < data.length; i++) {
    data[i][1] = Number(data[i][1]) // stipend
    data[i][2] = Number(data[i][2]) // fee
    data[i][3] = Number(data[i][3]) // living cost
}

function sort_on_column(col, desc_or_asc) {
    $("#ranking").find("tbody").html("")

    data.sort(function(a, b) {
        // desc
        if(desc_or_asc == true)
        {
            return b[col] - a[col]
        }
        // asc
        else{
            return a[col] - b[col]
        }
    })

    console.log(data)

    for (i = 0; i < data.length; i++) {
	style = ""
	if (data[i][1] < data[i][2])
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
                .append($("<td>").text(data[i][0]).append(namefix))
                .append($("<td>").text(data[i][1].toLocaleString("en-US")).attr("align", "right"))
                .append($("<td>").text(data[i][3].toLocaleString("en-US")).attr("align", "right"))
                .append($("<td>").text(data[i][2].toLocaleString("en-US")).attr("align", "right"))
                .append($("<td>").text((data[i][1] - data[i][2] - data[i][3]).toLocaleString("en-US")).attr("align", "right").attr("style", style))
        )
    }
}

$("#overlay-loading").hide()

// // Find the first th element in the table header
// var firstHeader = $('table th:first');
// // Trigger a click event on the first header
// firstHeader.trigger('click');
sort_on_column(0, true)

var $sortable = $('.sort-indicator');

$sortable.on('click', function(){
  
  var $this = $(this);
  var col = $this.index();
  var asc = $this.hasClass('asc');
  var desc = $this.hasClass('desc');
  $sortable.removeClass('asc').removeClass('desc');
  if (desc || (!asc && !desc)) {
    $this.addClass('asc');
    sort_on_column(col, false);
  } else {
    $this.addClass('desc');
    sort_on_column(col, true);
  }
  // remove 'clicked' class from other elements
  $sortable.not($this).removeClass('clicked');
  // change color
  $this.addClass('clicked');
  
});