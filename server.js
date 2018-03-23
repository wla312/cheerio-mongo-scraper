// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");


// scraping tools
// need to use request somewhere...
// var request = require("request");
// what about using axios instead? I feel like that counts...
var axios = require("axios");
var cheerio = require("cheerio");

// require all models
var db = require("./models");

// set port
var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cheeriomongoscraper";

console.log("Using database " + MONGODB_URI);

// initialize express
var app = express();

// configure middleware
// use morgan logger for logging requests
app.use(logger("dev"));
// use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// set mongoose to leverage built in JavaScript ES6 Promises
// connect to the mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
	useMongoClient: true
});

// ROUTES
// remove any unsaved articles from the db...
app.get("/clean", function(req, res){
	// db.Article
	// 	.remove({ saved: false })
	// 	.then(function(dbArticles){
	// 		// if any articles are found, send them to the client
			res.send("Database updated.");
	// 	})
	// 	.catch(function(err){
	// 		// if an error occurs, send it back to the client
	// 		res.json(err);
	// 	});
});

// GET route for scraping fastcompany
app.get("/scrape", function(req, res){
	console.log('WE HIT THE /Scrape ++++++++');
	// first grab the body of the html with request
	axios.get("https://fastcompany.com/").then(function(response){
		// then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);

		// now, grab every element with the `article` class...
		$("article").each(function(i, element){
			// save an empty result object
			var result = {};

			// add the text and href of every link, and save them as properties of the result object
			result.title = $(this)
				.children("a")
				.attr("title");

			articleLink = $(this)
				.children("a")
				.attr("href");

			// because some of the links are missing the full path...
			if (articleLink.charAt(0) === "/") {
				articleLink = "https://www.fastcompany.com" + articleLink;
				result.link = articleLink;
			}
			else {
				result.link = articleLink;
			}

			// use the Article link to see if document exists...
			// also tried Article title...
			// this isn't really working as it should... there are still duplicates getting created

			// db.Article.update({ link: result.link }, result, { new: true, upsert: true, setDefaultsOnInsert: true }, function(err, doc){
			// 	// testing
			// 	console.log(doc);

			// });

			

			db.Article
			.find({title: result.title})
			.limit(1)
			.then(function(check){

				console.log('this is our check -----', check);
				console.log('this is our result.title ----', result.title);

				// if no document/result is found...
				// if(check.length == 0) {
				// 	// create a new Article using the `result` object built from scraping
					// db.Article
					// .create(result)
					// .then(function(dbArticle){
					// 	console.log('we just saved this guy ---', dbArticle);
					// 	// if we were able to successfully scrape and save an Article, send a message to the client
					// 	// res.send("Scrape Complete");
					// })
					// .catch(function(err){
					// 	// if an error occurred, send it to the client
					// 	res.json(err);
					// });
				// };
			});
		});
		res.send("Scrape Complete");
	});
});

// GET route for getting all Articles from the db
app.get("/articles", function(req, res){
	// grab every document in the Articles collection
	db.Article
		.find({})
		.then(function(dbArticle){
			// if we were able to successfully find Articles, send them back to the client
			res.json(dbArticle);
		})
		.catch(function(err){
			// if an error occurred, send it to the client
			res.json(err);
		});
});

// GET route for saved articles
app.get("/savedArticles", function(req, res){
	db.Article
		.find({ saved: true })
		.then(function(dbArticles){
			// if any articles are found, send them to the client
			res.json(dbArticles);
		})
		.catch(function(err){
			// if an error occurs, send it back to the client
			res.json(err);
		});
});

// GET route for grabbing a specific Article by id, populate it with its' note
app.get("/articles/:id", function(req, res){
	// using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	db.Article
		.findOne({ _id: req.params.id })
		// .. and populate all of the notes associated with it
		.populate("note")
		.then(function(dbArticle){
			// if we were able to successfully find an Article with the given id, send it back to the client
			res.json(dbArticle);
		})
		.catch(function(err){
			// if an error occurred, send it to the client
			res.json(err);
		});
});

// POST route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res){
	// create a new note and pass the req.body to the entry
	db.Note
		.create(req.body)
		.then(function(dbNote){
			return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
		})
		.then(function(dbArticle){
			// if able to successfully update an Article, send it back to the client
			res.json(dbArticle);
		})
		.catch(function(err){
			// if an error occurred, send it to the client
			res.json(err);
		});
});

// POST route for saving/unsaving an article
app.post("/save", function(req, res){
	db.Article
		.findOneAndUpdate({ _id: req.body.id }, { saved: req.body.saved }, { new: true })
		.then(function(dbArticle){
			// send the article back to the client
			res.json(dbArticle);
		})
		.catch(function(err){
			// if an error occurs, send it back to the client
			res.json(err);
		});
});



// start the server
app.listen(PORT, function(){
	console.log("App running on port " + PORT);
});