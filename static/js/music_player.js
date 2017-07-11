var isWaveSurferLoading = false;

play = function (filename) {
    console.log('loading ' + filename);
    $("#play_btn").find(".player_play_btn_graphic").attr("class","player_play_btn_graphic glyphicon glyphicon-transfer");
    wavesurfer.load('/media/' + filename);
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
            console.log(songs_to_play);
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
    });

});
