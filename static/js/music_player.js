play = function (filename) {
        $("#play_btn").hide();
        $("#stop_btn").show();
        console.log(filename);

        wavesurfer.load('/media/' + filename);
        wavesurfer.play();
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
    $("#play_btn").show();
    $("#stop_btn").hide();
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'lightgrey',
        progressColor: 'dimgrey',
        height: 30,
        barHeight: 0.5,
        barWidth: 1,
        hideScrollbar: true
    });

});
