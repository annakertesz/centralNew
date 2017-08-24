
show_song_of_playlist = function (id) {
    // alert('0');
    $("#playlist_table tr").remove();
    url = "/api/songs_of_playlists/?playlist=" + id;
    var table = document.getElementById("playlist_table");
    $.getJSON(url, function(result){
        $.each(result, function(i, field){
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.className = "col-md-1";
            var cell2 = row.insertCell(1);
            cell2.className = "col-md-3";
            var cell3 = row.insertCell(2);
            cell3.className = "col-md-2";
            var cell4 = row.insertCell(3);
            cell4.className = "col-md-2";
            var cell5 = row.insertCell(4);
            cell5.className = "col-md-1";

            cell1.innerHTML = '<button id="play" class="table_btn" onclick="play(\'' + field.path + '\')">' +
                '<div class="glyphicon glyphicon-play"></div></button></td>';
            cell2.innerHTML = field.name;
            cell3.innerHTML = field.album.album_name;
            cell4.innerHTML = field.artist.artist_name;
            cell5.innerHTML = '<button class="no_button" id="addtoplaylist"><i class="glyphicon glyphicon-download"></i></button>'+
            '<button class="no_button" id="addtoplaylist"><i class="glyphicon glyphicon-shopping-cart"></i></button>'+
            '<button class="no_button" id="addtoplaylist"><i class="glyphicon glyphicon-trash icon"></i></button>';
        });
    });
};

$(document).ready(function() {
    var list_table = document.getElementById("playlist_list");
    $.getJSON("/api/playlists", function(result){
        $.each(result, function(i, field){
            var row = list_table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.className = "col-md-1";
            var cell2 = row.insertCell(1);
            cell1.className = "col-md-2";
            cell1.innerHTML = '<button id="play" class="table_btn" onclick="play_playlist('+ field.id +')">' +
                '<div class="glyphicon glyphicon-play"></div></button>';
            cell2.innerHTML = '<button class="no_button playlist_name" onclick="show_song_of_playlist('+ field.id + ')">' + field.playlist_name;

        })
    });

    show_song_of_playlist(1);

});
