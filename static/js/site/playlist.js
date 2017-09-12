
showSongsOfPlaylist = function (id) {
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

            cell1.innerHTML = '<button id="play" class="table_btn" onclick="playSingleSong(\'' + field.path + '\')">' +
                '<div class="glyphicon glyphicon-play"></div></button></td>';
            cell2.innerHTML = field.name;
            cell3.innerHTML = field.album.album_name;
            cell4.innerHTML = field.artist.artist_name;
            cell5.innerHTML = '<a href="/download/' + field.path + '"><i class="glyphicon glyphicon-download"></i></a>'+
            '<button class="no_style" id="addtoplaylist"><i class="glyphicon glyphicon-shopping-cart" data-toggle="modal" data-target="#email_sender"></i></button>'+
            '<button class="no_style" id="addtoplaylist"><i class="glyphicon glyphicon-trash"></i></button>';
        });
    });
};

load_playlists = function () {
     var is_staff = $("#is_staff").val() == "true";
    $("#playlist_list tr").remove();
    var list_table = document.getElementById("playlist_list");
    $.getJSON("/api/playlists", function(result){
        $.each(result, function(i, field){
            var row = list_table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.className = "col-md-1";
            var cell2 = row.insertCell(1);
            cell2.className = "col-md-2";

            cell1.innerHTML = '<button id="play" class="table_btn" onclick="playPlaylist('+ field.id +')">' +
                '<div class="glyphicon glyphicon-play"></div></button>';
            cell2.innerHTML = '<button class="no_button playlist_name" onclick="showSongsOfPlaylist('+ field.id + ')">' + field.playlist_name + '</button>';
            if (is_staff){
                var cell3 = row.insertCell(2);
                cell3.className = "col-md-1";
                cell3.innerHTML = '<button class="no_style glyphicon glyphicon-user" data-toggle="modal" data-target="#user_selector" onclick="addUserToPlaylist('+ field.id + ')"></button>'
            }


        })
    });
};

addUserToPlaylist = function (id){

};

list_users = function (){
    var users_table = document.getElementById("all_user_list");
    $.getJSON("/api/users", function(result) {
        $.each(result, function (i, field) {
            console.log(field);
            var row = users_table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = '<input type="checkbox" name="vehicle" value="Bike">';
            cell2.innerHTML = '<h4>' + field.username + '</h4>'
        })
    })
};

$(document).ready(function() {
    load_playlists();
    list_users();
});


