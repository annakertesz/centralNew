let playlists;
let usersArray = [];
let currentPlaylistId;
let currentPlaylistName;
let addUserTooltip;
// Code the the Playlists menu
// TODO add a new playlist button
// TODO add function to download a playlist as a .zip file
const showSongsOfPlaylist = function (id, name) {
    currentPlaylistId = id;
    currentPlaylistName = name;
    $("#playlist_table").find("tr").remove();
    const url = "/api/songs_of_playlists/?playlist=" + id;
    const table = document.getElementById("playlist_table");
    $.getJSON(url, function(result){
        $("#playlist_table").find("tr").remove(); // remove again in case the user clicked very quickly
        const row = table.insertRow(-1);
        const cell = row.insertCell(0);
        cell.colSpan = 5;
        // replaces everything that's not a number or a letter with _
//        const filename = currentPlaylistName.replace(/[^a-z0-9]/gi, '_').substr(0, 40);
        cell.innerHTML = `<div style="display:flex;align-items:center"><h3 style="flex-grow:1">${name}</h3>
                          <a class="btn btn-primary" href="/api/download_playlist/?playlist_id=${currentPlaylistId}"
                             role="button">Download whole playlist</a></div>`;
                             // download="${filename}.zip" role="button">Download whole playlist</a></div>`;  "/download/${song.path}"

        $.each(result, function(num, field){
            const song = field.song;
            const idInPlaylist = field.id;
            const row = table.insertRow(-1); // always insert at the end

            const cell1 = row.insertCell(0);
            cell1.style.width = "20%";
            const cell2 = row.insertCell(1);
                    cell2.style.width = "20%";
            const cell3 = row.insertCell(2);
                    cell2.style.width = "20%";
            const cell4 = row.insertCell(3);
                    cell2.style.width = "20%";
            const cell5 = row.insertCell(4);
                    cell2.style.width = "20%";

            cell1.innerHTML = ` <a href=# onclick="playPlaylist('${id}','${num}')">
                                <i class="material-icons">play_arrow</i></a>`;
            cell2.innerHTML = song.name;
            cell3.innerHTML = song.album.album_name;
            cell4.innerHTML = song.artist.artist_name;
            cell5.innerHTML =
                `<a href="/download/${song.path}"><i class="material-icons">cloud_download</i></a>
                 <a href="" data-toggle="modal" data-target="#email_sender" onclick="set_email_message('${song.id}')">
                    <i class="material-icons">shopping_cart</i></a>
                 <a href="#" onclick="showDeleteFromPlaylistModal('${idInPlaylist}','${song.name}')">
                    <i class="material-icons">delete</i></a>`;
        });
    });
};

const downloadPlaylist = function () {
    console.log('dl dl dl');
    currentPlaylistId;

};

const showDeleteFromPlaylistModal = function (idInPlaylist, name) {
    const delModal = $('#confirmDeleteModal');
    delModal.modal('show');
    delModal.find('#confirmDeleteModalText').text(`Are you sure you want to delete "${name}" from the playlist?`);
    delModal.find('#confirmDeleteModalDelButton').off('click').click([idInPlaylist], deleteSongFromPlaylist);
};

const deleteSongFromPlaylist = function(event) {
    const idInPlaylist = event.data[0];
    console.log("del from playlist with playlist_song_id: " + idInPlaylist);
    $.getJSON("/api/delete_song_from_playlist/?playlist_song_id=" + idInPlaylist, function(result){
         console.log(result);
         load_playlists(); // TODO delete playlist if empty
    });
};

// Reload the list of playlists
const load_playlists = function () {
    $("#playlist_list").find("tr").remove();
    const list_table = document.getElementById("playlist_list");
    const row = list_table.insertRow(-1);
            const cell = row.insertCell(0);
            cell.innerHTML =
                `<button class="btn btn-outline-secondary" onclick="addEmotyPLaylistName(event)">Create new playlist</button>`;
    $.getJSON("/api/playlists", function(result){
        playlists = result;
        $.each(playlists, function(i, field){
            const row = list_table.insertRow(-1);
            const cell = row.insertCell(0);
            cell.align="left";
            cell.innerHTML =
                `<a class="playlist_name"
                    onclick="showSongsOfPlaylist('${field.id}', '${field.playlist_name}')">${field.playlist_name}
                </a><br>
                <button class="btn btn-outline-secondary btn-sm btn-block"
                    onclick="showAndPlayPlaylist('${field.id}', '${field.playlist_name}')">Play playlist</button>`;
            if (is_staff){
                cell.innerHTML += `<button class="btn btn-outline-secondary btn-sm btn-block"
                                   onclick="showUserSelector(event, '${field.id}')">Add user to playlist</button>
                                   <br>
                                   <button  data-toggle="modal" data-target="#send_in_email"
                                onclick="send_in_email('${field.id}')" class="btn btn-outline-secondary btn-sm btn-block">send in email</button>`;
            }
            cell.innerHTML += '<br>';
        });
        if (playlists.length > 0) {
            // show the first playlist if the current one was deleted
            let plId = playlists[0].id;
            let plName = playlists[0].playlist_name;
            for (let pl of playlists) {
                if (pl.id == currentPlaylistId) { // intentional type conversion!
                    plId = currentPlaylistId;
                    plName = currentPlaylistName;
                    break;
                }
            }
            showSongsOfPlaylist(String(plId), String(plName));
        }
    });
};

const showAndPlayPlaylist = function (id, name) {
    showSongsOfPlaylist(id, name);
    alert(id);
    playPlaylist(id, 0);
};

// Add User to playlist
const showUserSelector = function (event, playlistId) {
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

    addUserTooltip = new jBox('Tooltip', {
        content: popoverContent,
        target: $(event.target),
        closeOnClick: 'body', // close if clicked anywhere but the toolip
        position: {x: 'right', y: 'center'},
        outside: 'x',
        overlay:true,
        onCloseComplete: function() {
            addUserTooltip.destroy();
        }
    });
    addUserTooltip.open();
};

const addUserToPlaylist = function (user_id, playlistId){
    addUserTooltip.close();
    $.getJSON("/api/add_user_to_playlist/?playlist_id=" + playlistId + "&user_id="+ user_id,
        function(result) {});
};

const addEmotyPLaylistName = function (event) {
    let popoverContent =
        `<div>
            <div class="modal-header">
                <h4 class="modal-title">Create empty playlist</h4>
            </div>
            <div class="modal-body">
                <input id="empty__playlist_input" type="text">
                <button class="btn btn-sm" onclick="createEmptyPlaylist()">OK</button>
            </div>
        </div>`;
    addEmptyListrTooltip = new jBox('Tooltip', {
        content: popoverContent,
        target: $(event.target),
        closeOnClick: 'body', // close if clicked anywhere but the toolip
        position: {x: 'right', y: 'center'},
        outside: 'x',
        overlay:true,
        onCloseComplete: function() {
            addEmptyListrTooltip.destroy();
        }
    });
    addEmptyListrTooltip.open();
};

const createEmptyPlaylist = function () {
    const new_playlist_name = $("#empty__playlist_input").val();
    alert(new_playlist_name);
        let url = "/api/add_new_playlist/?name=" + new_playlist_name;
        $.getJSON(url, function (result) {
                load_playlists();
                filter_table(actual_url);
            });
        addEmptyListrTooltip.close();
};

const send_in_email = function (id) {
    $('input[name="sender_playlist_id"]').val(id);
};

const sender_modal_send_email = function(){
    $('input[name="sender_playlist_id"]').
};

