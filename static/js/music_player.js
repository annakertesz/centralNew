play = function (filename) {
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

    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'snow',
        progressColor: 'grey',
        height: 64,
    });

});
