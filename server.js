//////////////////////////////////////////////////////
// Configure Server									//
//////////////////////////////////////////////////////
// Loads the library express which makes creating a server easy in a node application
var express = require('express');
var bodyParser = require('body-parser');

// Instantiate the "app" to start creating server endpoints
var app = express();
var path = require('path');

// expose all files in public/ to be accessible from the root of our website
app.use(express.static('public'));

// POST form data is "url-encoded", so decode that into JSON for us
app.use(bodyParser.urlencoded({ extended: true }));

// Set up where our application will look for client-side files (HTML, CSS, JS)
app.set('view engine', 'hbs');





//////////////////////////////////////////////////////
// Database methods 								//
//////////////////////////////////////////////////////
// Import Sequelize and configure it
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql', 'root', "my-secret-pw", {
	host: 'localhost',
	dialect: 'mysql'
});

// Create MySQL database connection between your server and the database
sequelize
	.authenticate()
	.then(function() {
		console.log('Connection has been established successfully.');
	})
	.catch(function(err) {
		console.error('Unable to connect to the database:', err);
	});

//////////////////////////////////////////////////////
// Database setup methods							//
//////////////////////////////////////////////////////
// Define database schema/data structure format
const Song = sequelize.define('song', {
	name: { type: Sequelize.STRING },
	artist: { type: Sequelize.STRING },
	album: { type: Sequelize.STRING },
	length: { type: Sequelize.STRING },
	genre: { type: Sequelize.STRING }
});

//////////////////////////////////////////////////////
// Server endpoint setup							//
//////////////////////////////////////////////////////
// Server listens to port 3000
app.listen(3000, (request, response) => {
	console.log("Server is listening on port 3000. Go to http://localhost:3000/");
});

// Root web app endpoint
app.get("/", (request, response) => {
	response.render("bruinplay", {
		title: "Insert Title Here",
		content: ""
	})
});

// Set up another endpoint at /ucla
app.get('/error', function (request, response) {
	response.send('The song is invalid.');
});

// function attachEventHandlers() {
// 	$('.play .play-button').on('click', handleMusicClick);
// }

// function handleMusicClick(event) {
// 	const target = $(event.target);
// 	const play = $('.play');
// 	const button = $('play-button');

// 	play.style.opacity = 0.2;
// 	button.style.opacity = 1;
// }

// function init() {
// 	var initSong = 
// 	{
// 		name: N/A
// 	}
// }