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
	title: { type: Sequelize.STRING },
	artist: { type: Sequelize.STRING },
	album: { type: Sequelize.STRING },
	// length: { type: Sequelize.INTEGER },
	genre: { type: Sequelize.STRING },
	art: { type: Sequelize.STRING },
	mp3: { type: Sequelize.STRING }
});

// Creates database table for Song.
// Note: "force: true" will delete the table if it already exists to not cause duplicate values
Song.sync({ force: true }).then(function () {
	var initSongs = init();
	// Loads array of songs at once in single method and returns all songs inserted
	return Song.bulkCreate(initSongs);
	/* Equivalent to:
	for (var i = 0; i < initialSongs.length; i++) {
		var song = initialSongs[i];
		Song.create({
			title: song.title,
			artist: song.artist,
			length: song.length,
			album: song.album,
			genre: song.genre,
			art: song.art,
			mp3: song.mp3
		});
	}
	*/
}).then(function (songs) {
	// After inserting all initial songs into database, loop over and print out the titles
	for (var i = 0; i < songs.length; i++) {
		console.log(songs[i].mp3);
	}
})





//////////////////////////////////////////////////////
// Server endpoint setup							//
//////////////////////////////////////////////////////
// Server listens to port 3000
app.listen(3000, (request, response) => {
	console.log("Server is listening on port 3000. Go to http://localhost:3000/");
});

// Root web app endpoint
app.get("/", (request, response) => {
	response.render("library", {
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
 * Define the route to add a song to the library. We are posted the name, artist, album,
 * length of the song, and genre.
 * If the inputs are valid, create a new song objects and inserts it into the database.
 * Redirect to the library (to re-render the page)
 * If the inputs are not valid, render the error page.
 */
app.post('/songs/add', function (request, response) {
	let inputTitle = request.body.title;
	let inputArtist = request.body.artist;
	let inputAlbum = request.body.album;
	// let inputLength = parseInt(request.body.length);
	let inputGenre = request.body.genre;
	let inputArt = request.body.art;
	let inputMp3 = request.body.mp3;

	if (inputTitle.length > 0 && 
		inputArtist.length > 0 && 
		inputAlbum.length > 0 && 
		inputGenre.length > 0 && 
		inputArt.length > 0 && 
		inputMp3.length > 0 ) {
		// Creates a new row in our database with the input data then reloads http://localhost:3000/library
		// to see the new list of songs

		Song.create({
			title: inputTitle,
			artist: inputArtist,
			album: inputAlbum,
			genre: inputGenre,
			art: inputArt,
			mp3: inputMp3
		}).then(function () {
			response.redirect('/library');
		});
	} else {
		console.log("You tried to add an invalid song into the library.");
		response.redirect('/error');
	}
// 
});

/**
 * Delete a song by its title. We defined a variable in our route, and express puts its
 * into request.params.album,, since we named the variable 'title' in the route path.
 * We first find the song object in the database by finding by title, then we remove
 * that object in the database table and redirect to /library.
 */
app.get('/songs/delete/:title', function (request, response) {
	// Get one song where the title matches the one from the parameter in the URL
	// then delete that song from the database and redirect to /library to see 
	// the updated list of songs
	Song.find({
		where: {
			title: request.params.title
		}
	}).then(function(song) {
		return song.destroy();
	}).then(function() {
		response.redirect('/library');		
	})
});

app.get('/songs/add-time/:title', function (request, response) {
	// Get one book where the title matches the one from the parameter in the URL
	// then delete that book from the database and redirect to /library to see 
	// the updated list of books
	console.log("trying to work...");
	var getting = "/media/" + document.getElmentById("play-button").getAttribute("mp3");
	var mySound = new Audio(getting);
    var time = mySound.duration; // => duration, in seconds
    var min = Math.trunc(time/60);
    var sec = time%60;

	Song.find({
		where: {
			title: request.params.title
		}
	}).then(function(song) {
		song.time = min + ":" + sec;
		console.log("got data!");
		return;
	}).then(function() {
		response.redirect('/library');		
	})
});

// my attempt with multiple parameters
// app.get(['/songs/delete/:title/', '/songs/delete/:artist/'], function (request, response) {
// 	// Get one song where the title matches the one from the parameter in the URL
// 	// then delete that song from the database and redirect to /library to see 
// 	// the updated list of songs
// 	Song.find({
// 		where: {
// 			// title: request.params.title,
// 			artist: request.params.artist
// 		}
// 	}).then(function(song) {
// 		return song.destroy();
// 	}).then(function() {
// 		response.redirect('/library');		
// 	})

// });

function init() {
	/*
	 * Songs from musopen.org
	 */
	var initSongs = [
		{
			title: "Moonlight Sonata - I. Adagio sostenuto",
			artist: "Beethoven, performed by Paul Pitman",
			album: "None",
			genre: "Classical",
			art: "yosemite_bg.jpg",
			mp3: "Sonata No. 14 in C Sharp Minor Moonlight, Op. 27 No. 2 - I. Adagio sostenuto.mp3"
		},

		{
			title: "Moonlight Sonata - II. Allegretto",
			artist: "Beethoven, performed by Paul Pitman",
			album: "None",
			genre: "Classical",
			art: "yosemite_bg.jpg",
			mp3: "Sonata No. 14 in C Sharp Minor Moonlight, Op. 27 No. 2 - II. Allegretto.mp3"
		},

		{
			title: "Moonlight Sonata - III. Presto",
			artist: "Beethoven, performed by Paul Pitman",
			album: "None",
			genre: "Classical",
			art: "yosemite_bg.jpg",
			mp3: "Sonata No. 14 in C Sharp Minor Moonlight, Op. 27 No. 2 - III. Presto.mp3"
		}
	];

	return initSongs;
}

