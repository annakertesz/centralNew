let playlists;
let usersArray;
let currentPlaylistId;
let currentPlaylistName;

const showSongsOfPlaylist = function (id, name) {
    currentPlaylistId = id;
    currentPlaylistName = name;
    $("#playlist_table").find("tr").remove();
    const url = "/api/songs_of_playlists/?playlist=" + id;
    const table = document.getElementById("playlist_table");

    const row = table.insertRow(-1);
    const cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.innerHTML = '<h3>' + name + '</h3>';

    $.getJSON(url, function(result){
        $.each(result, function(num, field){
            let row = table.insertRow(-1); // always insert at the end

            let cell1 = row.insertCell(0);
            cell1.className = "col-md-1";
            let cell2 = row.insertCell(1);
            cell2.className = "col-md-3";
            let cell3 = row.insertCell(2);
            cell3.className = "col-md-2";
            let cell4 = row.insertCell(3);
            cell4.className = "col-md-2";
            let cell5 = row.insertCell(4);
            cell5.className = "col-md-1";

            cell1.innerHTML = `<button class="table_btn" onclick="playPlaylist('${id}','${num}')">
                               <div class="glyphicon glyphicon-play"></div></button>`;
            cell2.innerHTML = field.name;
            cell3.innerHTML = field.album.album_name;
            cell4.innerHTML = field.artist.artist_name;
            cell5.innerHTML =
                `<a href="/download/${field.path}"><i class="glyphicon glyphicon-download"></i></a>
                <button class="no_style">
                    <i class="glyphicon glyphicon-shopping-cart" data-toggle="modal" data-target="#email_sender"></i>
                </button>
                <button class="no_style"><i class="glyphicon glyphicon-trash"></i></button>`;
        });
    });
};

// Reload the list of playlists
const load_playlists = function () {
    const is_staff = $("#is_staff").val() === "True";
    $("#playlist_list").find("tr").remove();
    const list_table = document.getElementById("playlist_list");
    $.getJSON("/api/playlists", function(result){
        playlists = result;
        $.each(playlists, function(i, field){
            const row = list_table.insertRow(-1);
            const cell = row.insertCell(0);
            cell.innerHTML =
                `<button class="no_button playlist_name"
                    onclick="showSongsOfPlaylist('${field.id}', '${field.playlist_name}')">${field.playlist_name}
                </button><br>
                <button class="btn btn-outline-secondary btn-sm btn-block"
                    onclick="showAndPlayPlaylist('${field.id}', '${field.playlist_name}')">Play playlist</button>`;
            if (is_staff){
                cell.innerHTML += `<button class="btn btn-outline-secondary btn-sm btn-block" data-toggle="addPlaylistToggle" 
                     data-trigger="manual" data-container="body" onclick="showUserSelector('${field.id}')">Add playlist to user</button>`;
            }
            cell.innerHTML += '<br>';
        });
        if (playlists.length > 0) {
            // show the first playlist if the current one was deleted
            let plId = playlists[0].id;
            let plName = playlists[0].playlist_name;
            for (let pl of playlists) {
                if (pl.id === currentPlaylistId) {
                    plId = currentPlaylistId;
                    plName = currentPlaylistName;
                    break;
                }
            }
            showSongsOfPlaylist(plId, plName);
        }
    });
};

const showAndPlayPlaylist = function (id, name) {
    showSongsOfPlaylist(id, name);
    playPlaylist(id, 0);
};

// Add User to playlist
const showUserSelector = function (playlistId) {
    let popoverContent =
        `<div>
            <div class="modal-header">
                <h4 class="modal-title">Select user</h4>
            </div>
            <div class="modal-body">`;
    $.each(usersArray, function (i, field) {
        popoverContent += `<button class="btn btn-default" 
                onclick="addUserToPlaylist('${field.id}', '${playlistId}')">${field.username}</button>`;
    });
    popoverContent += '</div></div>';
    const popover = $('[data-toggle="addPlaylistToggle"]');
    popover.popover({html: true, content: popoverContent });
    popover.popover('show');
};

const addUserToPlaylist = function (user_id, playlistId){
    $('[data-toggle="addPlaylistToggle"]').popover('hide');
    $.getJSON("/api/add_user_to_playlist/?playlist_id=" + playlistId + "&user_id="+ user_id,
        function(result) {});
};