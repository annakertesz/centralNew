var isWaveSurferLoading = false;
var musicPlayerMediaURL;
var playlist = [];
var playlistPos;
var wavesurfer;

playSingleSong = function(filename) {
    playlist = [];
    playlistPos = 0;
    _loadAndPlaySong(filename);
    $("#music-player-next-song").hide();
    $("#music-player-prev-song").hide();
};

// do not call this from other files!
_loadAndPlaySong = function (filename) {
    $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-transfer");
    musicPlayerMediaURL = '/media/' + filename;
    wavesurfer.load(musicPlayerMediaURL);
    isWaveSurferLoading = true;
};

onPlayPauseClick = function () {
    if (!isWaveSurferLoading) { // do not change icons if its currently loading
        if (wavesurfer.isPlaying()) {
            $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-play");
        } else {
            $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-pause");
        }
        wavesurfer.playPause();
    }
};

$(document).ready(function() {
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'lightgrey',
        progressColor: 'dimgrey',
        height: 30,
        barHeight: 0.5,
        barWidth: 1,
        hideScrollbar: true
    });

    $('#music_player').css('opacity', '0'); //need to set opacity, Wavesurfer breaks if I use hide() :(

    wavesurfer.on('ready', function () {
        $('#music_player').css('opacity', '1');
        wavesurfer.play();
        $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-pause");
        resetTableIcons();
        isWaveSurferLoading = false;

        var jsmediatags = window.jsmediatags;
        // it would be much nicer to read the binary loaded by Wavesurfer, but it might not be possible
        // jsmediatags requires that I enter the full URL!! (http://blabla)
        jsmediatags.read(window.location.origin + musicPlayerMediaURL, {
            onSuccess: function(tag) {

                 var image = tag.tags.picture;
                 if (image) {
                     var base64String = "";
                     for (var i = 0; i < image.data.length; i++) {
                         base64String += String.fromCharCode(image.data[i]);
                     }
                     var base64 = "data:image/jpeg;base64," + window.btoa(base64String);
                     $('#music-player-artwork').attr('src',base64);
                     $('#music-player-artwork').show();
                 } else {
                     $('#music-player-artwork').hide();
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
});

playPlaylist = function (id) {
    var url = "/api/songs_of_playlists/?playlist=" + id;
    playlist = [];
    playlistPos = 0;
    $.getJSON(url, function(result){
        $.each(result, function(i, field){
            playlist.push(field.path);
        });
        playlist.reverse(); // it comes from the server in reverse order
        _loadAndPlaySong(playlist[playlistPos]);
        $("#music-player-next-song").show();
        $("#music-player-prev-song").show();
    });
};

playNextOnPlaylist = function () {
    if (playlist.length > 0) {
        playlistPos++;
        if (playlistPos === playlist.length) {
            playlistPos = 0;
        }
        _loadAndPlaySong(playlist[playlistPos]);
    }
};

playPrevOnPlaylist = function () {
    if (playlist.length > 0) {
        playlistPos--;
        if (playlistPos < 0) {
            playlistPos = playlist.length - 1;
        }
        _loadAndPlaySong(playlist[playlistPos]);
    }
};