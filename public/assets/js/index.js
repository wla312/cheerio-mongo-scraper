// click on the 'Latest' button
$("#get-articles").click(function(){
	// delete any unsaved records in MongoDB
	$.ajax({
		method: "GET",
		url: "/clean"
	})
	// With that done, use ajax to trigger a new scrape
	.done(function(){
		$.ajax({
			method: "GET",
			url: "/scrape"
		})
		// with that done, add the articles to the page...
		.done(function(){
			$("#articles").empty();

			// grab the articles as json...
			$.getJSON("/articles", function(data){

				console.log("Inside getJSON");
				console.log(data);
				// for each one...
				for (var i = 0; i < data.length; i++){
					// display the information on the page
					$("#articles").append("<div class='panel panel-default article' data-id='" + data[i]._id + "'>"
						+ "<div class='row'><div class='col-md-8'>"
						+ "<h4>" + data[i].title + "</h4>"
						+ "<a href='" + data[i].link + "' target='_blank'>Link to Article Source</a>"
						+ "</div><div class='col-md-4'>"
						+ "<button class='save-article btn btn-primary pull-right' data-id='" + data[i]._id + "'>Save</button>"
						+ "</div></div></div>"
					);

					if (data[i].saved) {
						// disable the save button
						var articleSelector = ".save-article[data-id='" + data[i]._id + "']";
						$(articleSelector).attr("disabled", "disabled");
						$(articleSelector).text("Saved");
					};
				}
			});
		});
	});
});

// click on 'save-article' button(s)...
$(document).on("click", ".save-article", function(){
	// grab the id associated with the article
	var thisId = $(this).attr("data-id");
	console.log(thisId);

	$(this).text("Saved");
	$(this).attr("disabled", "disabled");

	// POST request to change the article to saved
	$.ajax({
		method: "POST",
		url: "/save",
		data: {
			id: thisId,
			saved: true
		}

	})
	// with that done...
	.done(function(data){
		console.log(data);
	});
});





