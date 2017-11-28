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

// Makes a database call to find all songs and pass them to our Handlebars view
app.get('/library', function (request, response) {
	Song.findAll().then(function (results) {
		response.render('library', {
			songs: results
		});
	});
});

/**
 * Define the route to add a book to the library. We are posted the name, artist, album,
 * length of the song, and genre.
 * If the inputs are valid, create a new song objects and inserts it into the database.
 * Redirect to the library (to re-render the page)
 * If the inputs are not valid, render the error page.
 */
app.post('/songs/add', function (request, response) {
	let inputName = request.body.name;
	let inputArtist = request.body.artist;
	let inputAlbum = request.body.album;
	let inputLength = parseInt(request.body.length);
	let inputGenre = request.body.genre;

	if (inputName.length > 0 && inputArtist.length > 0 && inputAlbum.length > 0 && inputLength > 0 && inputGenre > 0) {
		// Creates a new row in our database with the input data then reloads http://localhost:3000/library
		// to see the new list of songs
		Song.create({
			name: inputName,
			artist: inputArtist,
			album: inputAlbum,
			length: inputLength,
			genre: inputGenre
		}).then(function () {
			response.redirect('/library');
		});
	} else {
		console.log("You tried to add an invalid song into the library.");
		response.redirect('/error');
	}

});

/**
 * Delete a song by its name and artist. We defined a variable in our route, and express puts its
 * into request.params.isbn, since we named the variables 'name' and 'artist' in the route path.
 * We first find the song object in the database by finding by name and artist, then we remove
 * that object in the database table and redirect to /library.
 */
// app.get('/songs/delete/:name', function (request, response) {
// 	// Get one book where the ISBN matches the one from the parameter in the URL
// 	// then delete that book from the database and redirect to /library to see 
// 	// the updated list of books
// 	Book.find({
// 		where: {
// 			isbn: request.params.isbn
// 		}
// 	}).then(function(book) {
// 		return book.destroy();
// 	}).then(function() {
// 		response.redirect('/library');		
// 	})
// });



// function attachEventHandlers() {
// 	$('.add-musc').on('click', handleAddMusic);
// }

// function handleAddMusic(event) {
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