
showSongsOfPlaylist = function (id, name) {
    $("#playlist_table tr").remove();
    var url = "/api/songs_of_playlists/?playlist=" + id;
    var table = document.getElementById("playlist_table");

    var row = table.insertRow(-1);
    var cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.innerHTML = '<h3>' + name + '</h3>';

    $.getJSON(url, function(result){
        $.each(result, function(num, field){
            var row = table.insertRow(-1); // always insert at the end

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

            cell1.innerHTML = '<button class="table_btn" onclick="playPlaylist(' + id + ',' + num + ')">' +
                '<div class="glyphicon glyphicon-play"></div></button>';
            cell2.innerHTML = field.name;
            cell3.innerHTML = field.album.album_name;
            cell4.innerHTML = field.artist.artist_name;
            cell5.innerHTML = '<a href="/download/' + field.path + '"><i class="glyphicon glyphicon-download"></i></a>'+
            '<button class="no_style"><i class="glyphicon glyphicon-shopping-cart" data-toggle="modal" data-target="#email_sender"></i></button>'+
            '<button class="no_style"><i class="glyphicon glyphicon-trash"></i></button>';
        });
    });
};

load_playlists = function () {
    var is_staff = $("#is_staff").val() == "True";
    $("#playlist_list tr").remove();
    var list_table = document.getElementById("playlist_list");
    $.getJSON("/api/playlists", function(result){
        $.each(result, function(i, field){
            var row = list_table.insertRow(0);

            var cell = row.insertCell(0);
            cell.innerHTML = '<button class="no_button playlist_name" ' +
                'onclick="showSongsOfPlaylist('+ field.id + ', \'' + field.playlist_name + '\')">' + field.playlist_name +
                '</button><br><button class="btn btn-outline-secondary btn-sm btn-block" ' +
                'onclick="showAndPlayPlaylist('+ field.id + ', \'' + field.playlist_name + '\')">Play playlist</button>';
            if (is_staff){
                cell.innerHTML += '<button class="btn btn-outline-secondary btn-sm btn-block" data-toggle="modal" ' +
                    'data-target="#user_selector" onclick="setPlaylistId('+ field.id + ')">Add playlist to user</button>';
            }
            cell.innerHTML += '<br>';
        })
    });
};

showAndPlayPlaylist = function (id, name) {
    showSongsOfPlaylist(id, name);
    playPlaylist(id, 0);
};

setPlaylistId = function (id) {
    $('input[name="song_id"]').val(id);
};

addUserToPlaylist = function (user_id){
    playlist_id=$('input[name="song_id"]').val();
    $.getJSON("/api/add_user_to_playlist/?playlist_id="+playlist_id+"&user_id="+ user_id, function(result) {});
    $("#"+ user_id).attr("class","user_btn_selected").button('refresh');
};

list_users = function (){
    $("#all_user_list tr").remove();
    var users_table = document.getElementById("all_user_list");
    playlist_id=$('input[name="song_id"]').val();

    $.getJSON("/api/users", function(result) {
        $.each(result, function (i, field) {
            console.log(field);
            var row = users_table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = '<button class="user_btn" id="'+field.id+'" onclick="addUserToPlaylist('+field.id+')"><strong>' + field.username + '</strong></button>'
        })
    })
};

$(document).ready(function() {
    load_playlists();
    list_users();
});


