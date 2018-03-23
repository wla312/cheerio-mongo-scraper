# cheerio-mongo-scraper
A web scraping application that lets users view and leave comments on the latest news. Articles are scraped from FastCompany.com using the npm package `cheerio`

The deployed app can be found [here](https://ancient-atoll-63803.herokuapp.com/).

This project uses the following npm packages:
	`express`
	`express-handlebars`
	`mongoose`
	`body-parser`
	`cheerio`
	`axios`

This project uses MongoDB and Mongoose, and in the deployed version on Heroku, an mLab (remote MongoDB database with native Heroku support) provision. 

How it Works:
	
  1. Whenever a user visits the site and clicks the 'Latest' button, the app scrapes stories from FastCompany.com, saves them to the application database (minus any duplicate articles!), and displays the following information on the page for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article source

  2. Users are also able save articles, comment on them, and revisit the saved articles later. Comments are saved to the database and associated with their articles. All stored comments are visible to every user.
