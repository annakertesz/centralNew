var isWaveSurferLoading = false;
var musicPlayerMediaURL;

play = function (filename) {
    $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-transfer");
    musicPlayerMediaURL = '/media/' + filename;
    wavesurfer.load(musicPlayerMediaURL);
    isWaveSurferLoading = true;
};

onPlayPauseClick = function () {
    if (!isWaveSurferLoading) { // do not change icons if its currently loading
        if (wavesurfer.isPlaying()) {
            $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-play");
        }
        else {
            $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-pause");
        }
        wavesurfer.playPause();
    }
};

play_playlist = function (id) {
    $("#musicplayer_list tr").remove();
    var url = "/api/songs_of_playlists/?playlist=" + id;
    var songs_to_play = [];
    var table = document.getElementById("musicplayer_list");
    $.getJSON(url, function(result){
        $.each(result, function(i, field){
            songs_to_play.push(field.path);
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            
            cell1.innerHTML = field.name;
            cell2.innerHTML = field.album.album_name;
            cell3.innerHTML = field.artist.artist_name;

        });
    });
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

        jsmediatags = window.jsmediatags;
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

});
