/**
 * Created by annakertesz on 6/25/17.
 */

show_song_of_playlist = function (id) {
    $("#playlist_table tr").remove();
    url = "/api/songs_of_playlists/?playlist=" + id;
    var table = document.getElementById("playlist_table");
    $.getJSON(url, function(result){
        $.each(result, function(i, field){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);

            cell1.innerHTML = '<button id="play" class="table_btn" onclick="play(\'' + field.path + '\')">' +
                '<i class="glyphicon glyphicon-play"></i></button></td>';
            cell2.innerHTML = field.name;
            cell3.innerHTML = field.album.album_name;
            cell4.innerHTML = field.artist.artist_name;
            cell5.innerHTML = "<i class='glyphicon glyphicon-download'></i>";
            cell5.innerHTML = '<a href="/download/?path=' + field.path + '"><i class="glyphicon glyphicon-download"></a>';
            cell6.innerHTML = "<i class='glyphicon glyphicon-shopping-cart'></i>";
            cell7.innerHTML = "<button class=\"no_button\" id=\"addtoplaylist\">remove from playlist</button>";
        });
    });
};

$(document).ready(function() {
    var list_table = document.getElementById("playlist_list");
    $.getJSON("/api/playlists", function(result){
        $.each(result, function(i, field){
            var row = list_table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = '<button id="play" class="table_btn" onclick="play_playlist('+ field.id +')">' +
                '<i class="glyphicon glyphicon-play"></i></button>';
            cell2.innerHTML = '<button class="no_button playlist_name" onclick="show_song_of_playlist('+ field.id + ')">' + field.playlist_name;

        })
    });

    show_song_of_playlist(1);

});
