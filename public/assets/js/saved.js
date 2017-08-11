getSavedArticles();

// display all the comments for this article
$("body").on("click", ".comment-button", function() {
  var id = $(this).attr("data-id");
  $(".modal-title").text("Comments for Article " + id);
  $("#comment-save").attr("data-id", id);
  $("#comment-text").empty();
  getComments(id);
  $("#comment-modal").modal("toggle");
});

// adding a new comment
$("#comment-save").on("click", function() {
  var name = $("#comment-name").val();
  var text = $("#comment-textarea").val();
  var id = $(this).attr("data-id");
  var validate = true;
  if (!name) {
    $("#name-validate").show();
    validate = false;
  }
  else if (name) {
    $("#name-validate").hide();
  }
  if (!text) {
    $("#comment-validate").show();
    validate = false;
  }
  else if (text) {
    $("#comment-validate").hide();
  }
  if (validate) {
    var comment = {
      author: name,
      body: text
    }
    $.post("/articles/comment/" + id, comment, function(data) {
      //clear the boxes after comment is submitted
      $("#comment-name").val("");
      $("#comment-textarea").val(""); 
      getComments(id);
    });   
  }
});

// Delete comment
$("body").on("click", ".delete-comment", function() {
  var id = $(this).parent().attr("data-id");
  var articleId = $(this).closest("#comment-text").attr("data-id");
  $.ajax({
    url: "/articles/comment/" + id,
    type: "DELETE",
    data: {id: articleId}
  }).done(function() {
    getComments(articleId);
  });
});

// Remove article from saved
$("body").on("click", ".save-button", function() {
  var id = $(this).attr("data-id")
  var saved = $(this).attr("value");
  var data = { saved: saved }
  $.post("/articles/saved/" + id, data, function(data) {
    getSavedArticles();
  });
});

// Get saved articles
function getSavedArticles() {
  $.get("/articles/saved", function(data) {
    $("#saved-articles").empty();
    if (data.length === 0) {
      var panelBody = $("<div>").addClass("panel-body");
      var newDiv = $("<div>").addClass("panel panel-default article-div");
      var summary = $("<h4>").addClass("summary text-center").text("You have no saved articles.");
      panelBody.append(summary);
      newDiv.append(panelBody);
      $("#saved-articles").append(newDiv);
    }
    else {
      data.forEach(function(val) {
        var title = $("<h4>").addClass("heading panel-heading").text(val.title);
        var link = $("<a>").attr("href", val.url).html(title);
        var saveButton = $("<button>").addClass("btn btn-danger save-button");
        saveButton.attr("type", "button").attr("data-id", val._id).attr("value", false).html('<i class="fa fa-times" aria-hidden="true"></i> Remove Article');
        var commentButton = $("<button>").addClass("btn btn-info comment-button");
        commentButton.attr("type", "button").attr("data-id", val._id).html('<i class="fa fa-commenting-o" aria-hidden="true"></i> Add Comment');
        var summary = $("<p>").addClass("summary").text(val.summary);
        var newDiv = $("<div>").addClass("panel panel-default article-div").attr("id", val._id);
        var panelHeading = $("<div>").addClass("panel-heading");
        var panelBody = $("<div>").addClass("panel-body");
        panelHeading.append(link);
        panelHeading.append(saveButton);
        panelHeading.append(commentButton);
        panelBody.append(summary);
        newDiv.append(panelHeading);
        newDiv.append(panelBody);
        $("#saved-articles").append(newDiv);
      });
    }
  });
}

// Get comments
function getComments(id) {
  $.get("/articles/" + id, function(data) {

    console.log(data.comment);

    $("#comment-text").empty();

    if (data.comment.length === 0) {
      var comments = $("<li>").addClass("list-group-item text-center").text("There are no comments for this article.");
      $("#comment-text").append(comments);
    }
    else {
        data.comment.forEach(function(val) {
        $("#comment-text").attr("data-id", id);
        var comments = $("<li>").addClass("list-group-item").attr("data-id", val._id);
        var html = "<p class='author'><strong>" + val.author + "</strong> <span id='date'>&nbsp;&nbsp;" + moment(val.createdAt).format("M/D/YYYY h:mma") + "</span></p>";
        var button = '<button type="button" class="close delete-comment" aria-label="Delete"><span aria-hidden="true">&times;</span></button>'
        var body = $("<p>").text(val.body);
        comments.append(html);
        comments.append(button);
        comments.append(body);
        $("#comment-text").append(comments);
      });
    }
  });
}