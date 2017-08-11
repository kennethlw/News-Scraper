scrapeArticles();

$("#scrape").on("click", function() {
  $.get("/scrape", function(data) {
    $("#scrape-text").text("New articles added.");
    $("#scrape-modal").modal("toggle");
  });
});

$("body").on("click", ".save-button", function() {
  var id = $(this).attr("data-id");
  var saved = $(this).attr("value");
  var data = { saved: saved }
  $.post("/articles/saved/" + id, data, function(data) {
    scrapeArticles();
  });
});

function scrapeArticles() {
  $.get("/articles", function(data) {
    //clear the div otherwise you will have duplicates 
    $("#all-articles").empty();
    //if no articles after scraping or all articles deleted, display this message
    if (data.length === 0) {
      var panelBody = $("<div>").addClass("panel-body");
      var newDiv = $("<div>").addClass("panel panel-default article-div");
      var summary = $("<h4>").addClass("summary text-center").text("There are no articles to display. Try scraping again.");
      panelBody.append(summary);
      newDiv.append(panelBody);
      $("#all-articles").append(newDiv);
    }
    else {
      data.forEach(function(val) {

        var title = $("<h4>").addClass("heading panel-heading").text(val.title);
        var link = $("<a>").attr("href", val.url).html(title);
        var saveButton = $("<button>").addClass("btn btn-primary save-button");
        saveButton.attr("type", "button").attr("data-id", val._id).attr("value", true).text("Save Article");
        var newDiv = $("<div>").addClass("panel panel-default article-div").attr("id", val._id);
        var panelHeading = $("<div>").addClass("panel-heading");
        var panelBody = $("<div>").addClass("panel-body");
        panelHeading.append(link);
        panelHeading.append(saveButton);
        newDiv.append(panelHeading);
        newDiv.append(panelBody);
        $("#all-articles").append(newDiv);
      });
    }
  });
}