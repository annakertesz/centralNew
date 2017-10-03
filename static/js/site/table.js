let loaded_songs;
let actual_url;
let newSongId;
let addToPlaylistTooltip;

const initTable = function() {
    $(document).on("click", "#create_playlist", function () {
        const playlist_name = $("#new_playlist_input").val();
        let url = "/api/add_new_playlist/?name=" + playlist_name;
        $.getJSON(url, function (result) {
            const addUrl = "/api/add_song_to_playlist/?playlist=" + result + "&song=" + newSongId;
            $.getJSON(addUrl, function(result){
                load_playlists();
                filter_table(actual_url);
            });
        });
        $(".playlist_modal").hide();
    });

    $(document).on("click", "#cancel", function () {
        $(".playlist_modal").hide();
    });

    actual_url = '/api/songs';
    $("#search_field").keyup(function(event){
        if (event.keyCode === 13){ // Enter
            searchForSongs();
        }
    });

    $("#artist_list").hide();
    $("#album_list").hide();

    $.getJSON("/api/albums", function(result){
        $.each(result, function(i, field){
            $("#album_list").append('<li><button class="no_button" onclick="filter_table(\'/api/songs/?album=' +
                                     field.id + '\')">' + field.album_name + '</button></li>');
        })
    });
    $.getJSON("/api/artists", function(result){
        $.each(result, function(i, field){
            $("#artist_list").append('<li><button class="no_button" onclick="filter_table(\'/api/songs/?album=' +
                                      field.id + '\')">' + field.artist_name + '</button></li>');
        })
    });
    filter_table(actual_url);
    load_playlists();

    if (is_staff) {
        $.getJSON("/api/users", function(result) {
            usersArray = result;
        });
    }
};

const searchForSongs = function () {
    const keywords = document.getElementById('search_field');
    const actual_url = '/api/songs/?keywords=' + keywords.value; // TODO this might be better as a GET request here
    filter_table(actual_url);
    show_browser();
};

const filter_table = function (url) {
        actual_url = url;
        $("#song_table").find("tr").remove();
        const table = document.getElementById("song_table");
        loaded_songs = {};
        $.getJSON(url, function(result){
            $.each(result, function(i, song_field){
                loaded_songs[song_field.id] = song_field;
                const row = table.insertRow(0);
                const cell1 = row.insertCell(0);
                cell1.className = "col-md-1";
                const cell2 = row.insertCell(1);
                const cell3 = row.insertCell(2);
                const cell4 = row.insertCell(3);
                if (is_staff){
                    cell2.className = "col-md-8";
                    cell4.className = "col-md-2";
                }
                else {
                    cell2.className = "col-md-9";
                    cell4.className = "col-md-1";
                }
                cell1.innerHTML = `<button class="btn btn-primary" onclick="onPlayStopClick('${song_field.path}', this)">
                                   <div class="table_play_icon glyphicon glyphicon-play"></div></button></td>`;
                cell2.innerHTML = `<p>${song_field.artist.artist_name}</br><strong>${song_field.name}</strong></p>`;

                cell3.className = "col-md-1";
                // This button only works if load_playlists() has run!
                cell3.innerHTML = `<button role="button" onclick="showAddToPlaylistPopover(event, '${song_field.id}')"
                                           class="no_button">Add to playlist</button>`;

                cell4.innerHTML =
                        `<a href="/download/${song_field.path}"><i class="glyphicon glyphicon-download icon"></i></a>
                         <button class="glyphicon glyphicon-shopping-cart no_style icon" data-toggle="modal" data-target="#email_sender"
                                 onclick="set_email_message('${song_field.id}')"></button>`;
                if (is_staff){
                    cell4.innerHTML +=
                        `<button type="button" class="no_style" data-toggle="modal" data-target="#edit_song" 
                                onclick="edit_modal_data('${song_field.id}')"><i class="glyphicon glyphicon-edit icon"></i>
                         </button>
                         <button onclick="showDeleteSongModal('${song_field.id}','${song_field.name}')" class="no_style"><i class="glyphicon glyphicon-trash icon"></i></button>`;
                }
            });
        });
    };

const showDeleteSongModal = function(id, name) {
    const delModal = $('#confirmDeleteModal');
    delModal.modal('show');
    delModal.find('#confirmDeleteModalText').text(`Are you sure you want to delete "${name}"?`);
    delModal.find('#confirmDeleteModalDelButton').off('click').click(id, deleteSong);
};

const deleteSong = function(event) {
     $.getJSON("/api/delete_song/?id=" + event.data, function(result){
         console.log(result);
         filter_table(actual_url);
         load_playlists();
    });
};

// Add to playlist/create playlist
const showAddToPlaylistPopover = function (event, songId) {
    let popover_str = `<div class="modal-header">
                           <h4 class="modal-title">Select playlist</h4>
                       </div>`;
    popover_str += `<div class="modal-body">
                    <button class='btn btn-success' onclick="showCreatePlaylistPopup('${songId}')">New playlist</button><br><br>`;
    $.each(playlists, function (i, playlist_field) {
        popover_str += `<button class='btn btn-default' 
                        onclick="addSongToPlaylist('${playlist_field.id}', '${songId}')">${playlist_field.playlist_name}</button><br>`;
    });
    popover_str += '</div>';

    addToPlaylistTooltip = new jBox('Tooltip', {
        content: popover_str,
        target: $(event.target),
        closeOnClick: 'body', // close if clicked anywhere but the toolip
        position: {x: 'left', y: 'center'},
        outside: 'x',
        overlay:true,
        onCloseComplete: function() {
            addToPlaylistTooltip.destroy();
        }
    });
    addToPlaylistTooltip.open();
};

const showCreatePlaylistPopup = function (songId) {
    addToPlaylistTooltip.close();
    newSongId = songId;
    $(".playlist_modal").show();
};

const addSongToPlaylist = function (playlistId, songId) {
    addToPlaylistTooltip.close();
    const url = "/api/add_song_to_playlist/?playlist=" + playlistId + "&song=" + songId;
    $.getJSON(url, function(result){
        load_playlists();
    });
};

// email
let email_sender_song_id;
const set_email_message = function(id){
    email_sender_song_id = id;
};

const send_email = function () {
    const url = "/api/send_mail/?id=" + email_sender_song_id;
    $.getJSON(url, function(result){
        console.log(result);
    })
};

// play/pause songs
const onPlayStopClick = function (filename, hostingDiv) {
    playSingleSong(filename);
    resetTableIcons();
    // set the current icon to buffer
    $(hostingDiv).find(".table_play_icon").attr("class","table_play_icon glyphicon glyphicon-transfer");
};

const resetTableIcons = function () {
    // find all icons and set them to the play graphic. This is to reset any other previous icons when the user clicks quickly
    $(".table_play_icon").each(function (i, el) {
        $(el).attr("class","table_play_icon glyphicon glyphicon-play");
     });
};

// edit song
const edit_modal_data = function (id) {
    const song_field = loaded_songs[id];
    document.getElementById("edit_modal_title").innerHTML = song_field.name;
    $('input[name="edit_title"]').val(song_field.name);
    $('input[name="edit_song_id"]').val(id);
    $('input[name="edit_album"]').val(song_field.album.album_name);
    $('input[name="edit_artist"]').val(song_field.artist.artist_name);
};

const edit_modal_send_data = function(){
     const data = JSON.stringify({
        "id": $("#edit_song_id").val(),
        "title": $("#edit_title").val(),
        "album": $("#edit_album").val(),
        "artist": $("#edit_artist").val(),
        "tags": $("#edit_tags").val()});

    const xhr = new XMLHttpRequest();
    const url = "/api/edit_song/?data=" + encodeURIComponent(data);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //let json = JSON.parse(xhr.responseText);
            filter_table(actual_url);
        }
        console.log("song data edit " + data);
    };
    xhr.send(data);
};