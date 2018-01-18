// grab the saved articles as json
$.getJSON("/savedArticles", function(data){
	// testing
	// console.log(data);
	// for each one
	for (var i = 0; i < data.length; i++){
		// display the information on the page
	    $("#savedArticles").append("<div class='panel panel-default article' data-id='" + data[i]._id + "'>"
	      + "<div class='row'><div class='col-md-8'>"
	      + "<h4>" + data[i].title + "</h4>"
	      + "<a href='" + data[i].link + "' target='_blank'>Click here for event details</a>"
	      + "</div><div class='col-md-4'>"
	      + "<button class = 'add-note btn btn-primary pull-right' data-toggle='modal' data-target='#notesmodal' data-id='" + data[i]._id + "'>Notes</button>"
	      + "<button class = 'unsave btn btn-primary pull-right' data-id='" + data[i]._id + "'>Remove</button>"
	      + "</div></div></div>"	
	    );	
	};
});

// on click of 'add-note' button
$(document).on("click", ".add-note", function(){
	// empty the notes from the note section
	$("#notes").empty();
	// save the id from the button
	var thisId = $(this).attr("data-id");

	// ajax call for the article
	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	})
	// with that done, add more information to the page
	.done(function(data){
	    console.log(data);
	    // The title of the article
	    $("#notes").append("<h4>" + data.title + "</h4>");
	    // An input to enter a new title
	    $("#notes").append("<input class='form-control' id='titleinput' name='title' placeholder='Title' >");
	    // A textarea to add a new note body
	    $("#notes").append("<textarea class='form-control' id='bodyinput' name='body' placeholder='Enter notes here'></textarea>");
	    // A button to submit a new note, with the id of the article saved to it
	    $("#notes").append("<br><button class='btn btn-primary' data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save and Close</button>");
	    // TODO: A button to delete a note
	    //$("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

	    // If there's a note in the article
	    if (data.note) {
	    	// Place the title of the note in the title input
	    	$("#titleinput").val(data.note.title);
	    	// Place the body of the note in the body textarea
	    	$("#bodyinput").val(data.note.body);
	    }		
	});
});

// when you click the 'savenote' button
$(document).on("click", "#savenote", function(){
	// grab the id assoc w/the article
	var thisId = $(this).attr("data-id");

	// POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	})
	// with that done
	.done(function(data){
		console.log(data);
		// empty the notes section
		$("#notes").empty();
	});

	// remove the values entered in the input and textarea for the note entry
	$("#titleinput").val("");
	$("#bodyinput").val("");
});

// on click of 'unsave' button
$(document).on("click", ".unsave", function(){
	// grab id assoc w/article from the button
	var thisId = $(this).attr("data-id");

	// POST to change the article to unsaved
	$.ajax({
		method: "POST",
		url: "/save",
		data: {
			id: thisId,
			saved: false
		}
	})
	.done(function(data){
		console.log(data);
	});

	// remove the article and any notes 
	var articleSelector = ".article[data-id='" + thisId + "']";
	$(articleSelector).remove();
	$("#notes").empty();
});


// deletenote button









