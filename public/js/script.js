plyr.setup($(), {});

function setOverlayDisplay(show) {
    document.getElementById('overlay').style.display = show ? "block" : "none";
}

function clearForm() {
    document.getElementById('addsong_title').value = "";
    document.getElementById('addsong_artist').value = "";
    document.getElementById('addsong_album').value = "";
    // document.getElementById('addsong_length').value = "";
    document.getElementById('addsong_genre').value = "";
    document.getElementById('addsong_art').value = "";
    document.getElementById('addsong_mp3').value = "";
}

function setLocation(url) {
    window.location = url;
}

function playSong(songURL, songTitle, songArtist) { 
	var playURL = '/media/' + songURL;
  var currTitle = songTitle;
  var currArtist = songArtist;

  var source = '<p class="center">' + currTitle + ' - ' + currArtist + '</p>';
  source += '<div id="audio_player">';
  source += '<audio id="audio_player_mp3" controls="controls">';
  source += '<source id="audio_player_mp3" src="' + playURL + '"  type="audio/mp3" />';
  source += '</audio>';
  source += '</div>';  
  source += '<script src="http://cdn.plyr.io/2.0.13/plyr.js"></script>';
  source += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>';
  source += '<script src="js/script.js"></script>';


	$('.footer').html(source);

	var aud = $('#audio_player_mp3').get(0);
	var playPromise = aud.play();

  	if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
  }
};

// attempt at using multiple params
// function deleteSong(title, artist) {
//     window.location = "/songs/delete/title";
//     window.location = "/songs/delete/artist";
//     return false;
// }
