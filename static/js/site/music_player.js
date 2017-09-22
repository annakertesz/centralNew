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
    musicPlayer.css('flex-basis', '0px'); //need to set opacity, Wavesurfer breaks if I use hide() :(
    musicPlayer.css('padding-top', '0px'); //need to set opacity, Wavesurfer breaks if I use hide() :(

    wavesurfer.on('ready', function () {
        musicPlayer.css('flex-basis', '50px');
        musicPlayer.css('padding-top', '10px');
        if (playlist.length >0) {
            $("#music-player-next-song").show();
            $("#music-player-prev-song").show();
        }
        $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-pause");
        wavesurfer.play();
        resetTableIcons();
        isWaveSurferLoading = false;

        var jsmediatags = window.jsmediatags;
        // it would be much nicer to read the binary loaded by Wavesurfer, but it might not be possible
        // jsmediatags requires that I enter the full URL!! (http://blabla)
        jsmediatags.read(window.location.origin + musicPlayerMediaURL, {
            onSuccess: function(tag) {
                 var artwork = $('#music-player-artwork');
                 var image = tag.tags.picture;
                 if (image) {
                     var base64String = "";
                     for (var i = 0; i < image.data.length; i++) {
                         base64String += String.fromCharCode(image.data[i]);
                     }
                     var base64 = "data:image/jpeg;base64," + window.btoa(base64String);
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

    // Recalculate waweform on window resize
    $(window).resize(function() {
        if (musicPlayerMediaURL !== null && isWaveSurferLoading === false) {
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

// do not call this from other files!
const _loadAndPlaySong = function (filename) {
    $("#music-player-next-song").hide();
    $("#music-player-prev-song").hide();
    $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-transfer");
    musicPlayerMediaURL = '/media/' + filename;
    wavesurfer.load(musicPlayerMediaURL);
    isWaveSurferLoading = true;
};

const onPlayPauseClick = function () {
    if (!isWaveSurferLoading) { // do not change icons if its currently loading
        if (wavesurfer.isPlaying()) {
            $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-play");
        } else {
            $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-pause");
        }
        wavesurfer.playPause();
    }
};

const playPlaylist = function (id, from) {
    const url = "/api/songs_of_playlists/?playlist=" + id;
    playlist = [];
    playlistPos = from;
    $.getJSON(url, function(result){
        $.each(result, function(i, field){
            playlist.push(field.path);
        });
        _loadAndPlaySong(playlist[playlistPos]);
    });
};

const playNextOnPlaylist = function () {
    if (playlist.length > 0) {
        playlistPos++;
        if (playlistPos === playlist.length) {
            playlistPos = 0;
        }
        _loadAndPlaySong(playlist[playlistPos]);
    }
};

const playPrevOnPlaylist = function () {
    if (playlist.length > 0) {
        playlistPos--;
        if (playlistPos < 0) {
            playlistPos = playlist.length - 1;
        }
        _loadAndPlaySong(playlist[playlistPos]);
    }
};