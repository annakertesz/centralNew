// Code for the music player at the bottom

let isWaveSurferLoading = false;
let musicPlayerMediaURL;
let playlist = [];
let playlistPos;
let wavesurfer;

const initMusicPlayer = function() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'lightgrey',
        progressColor: 'dimgrey',
        height: 30,
        barHeight: 0.5,
        barWidth: 1,
        hideScrollbar: true
    });
    const musicPlayer = $('#music_player');
    // This hides the music player on loading
    musicPlayer.css('margin-bottom', '-100px');

    wavesurfer.on('ready', function () { // Called when a song is buffered and ready to play
        // show the music player
        musicPlayer.css('margin-bottom', '0px');

        if (playlist.length >0) {
            $("#music-player-next-song").show();
            $("#music-player-prev-song").show();
        }
        $("#play_btn").find(".player_play_btn_graphic").html("pause");
        wavesurfer.play();
        resetTableIcons();
        isWaveSurferLoading = false;

        let jsmediatags = window.jsmediatags;
        // jsmediatags reads the IDv2 tag from .mp3 files.
        // it would be much nicer to read the binary loaded by Wavesurfer for the artwork, but it might not be possible
        // since jsmediatags requires that I enter the full URL!! (http://blabla)
        jsmediatags.read(window.location.origin + musicPlayerMediaURL, {
            onSuccess: function(tag) {
                 let artwork = $('#music-player-artwork');
                 let image = tag.tags.picture;
                 if (image) {
                     // read the image binary data and display it
                     let base64String = "";
                     for (let i = 0; i < image.data.length; i++) {
                         base64String += String.fromCharCode(image.data[i]);
                     }
                     let base64 = "data:image/jpeg;base64," + window.btoa(base64String);
                     artwork.attr('src', base64);
                     artwork.attr('title', tag.tags.title);
                     artwork.show();
                 } else {
                     artwork.hide();
                 }
            },
            onError: function(error) {
                console.log('ID tag load error :(', error.type, error.info);
            }
        });
    });
    // Go to the next track if there is a playlist
    wavesurfer.on('finish', function () {
        playNextOnPlaylist();
    });

    // Recalculate waveform on window resize
    $(window).resize(function() {
        if (musicPlayerMediaURL !== undefined && musicPlayerMediaURL !== null && isWaveSurferLoading === false) {
            wavesurfer.empty();
            wavesurfer.drawBuffer();
        }
    });

};

const playSingleSong = function(filename) {
    playlist = [];
    playlistPos = 0;
    _loadAndPlaySong(filename);
};

// do not call this from other files, it messes up the playlist array here.
const _loadAndPlaySong = function (filename) {
    $("#music-player-next-song").hide();
    $("#music-player-prev-song").hide();
    $("#play_btn").find(".player_play_btn_graphic").html("360");
    musicPlayerMediaURL = '/media/' + filename;
    wavesurfer.load(musicPlayerMediaURL);
    isWaveSurferLoading = true;
};

const onPlayPauseClick = function () {
    if (!isWaveSurferLoading) { // do not change icons if its currently loading
        if (wavesurfer.isPlaying()) {
            $("#play_btn").find(".player_play_btn_graphic").html("play_arrow");
        } else {
            $("#play_btn").find(".player_play_btn_graphic").html("pause");
        }
        wavesurfer.playPause();
    }
};

// plays a playlist from the 'from' position
const playPlaylist = function (id, from) {
    const url = "/api/songs_of_playlists/?playlist=" + id;
    playlist = [];
    playlistPos = from;
    $.getJSON(url, function(result){
        $.each(result, function(i, field){
            playlist.push(field.song.path);
        });
        _loadAndPlaySong(playlist[playlistPos]);
    });
};

const playNextOnPlaylist = function () {
    if (playlist.length > 0) {
        playlistPos++;
        if (playlistPos === playlist.length) { // start from the beginning
            playlistPos = 0;
        }
        _loadAndPlaySong(playlist[playlistPos]);
    }
};

const playPrevOnPlaylist = function () {
    if (playlist.length > 0) {
        playlistPos--;
        if (playlistPos < 0) { // play the last song
            playlistPos = playlist.length - 1;
        }
        _loadAndPlaySong(playlist[playlistPos]);
    }
};