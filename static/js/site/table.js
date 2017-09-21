var loaded_songs;
var actual_url;

const filter_table = function (url) {
        actual_url = url;
        let is_staff = $("#is_staff").val() === "True";
        $("#song_table").find("tr").remove();
        let table = document.getElementById("song_table");
        loaded_songs = {};
        $.getJSON(url, function(result){
            $.each(result, function(i, song_field){
                loaded_songs[song_field.id] = song_field;
                let row = table.insertRow(0);
                let cell1 = row.insertCell(0);
                cell1.className = "col-md-1";
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
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
                cell3.innerHTML = `<button role="button" data-placement="left" data-container="body" data-toggle="popover"
                                           onclick="showAddToPlaylistPopover('${song_field.id}')"
                                           data-placement="bottom" data-trigger="manual" class="no_button">Add to playlist</button>`;
                if (is_staff){
                    cell4.innerHTML =
                        `<a href="/download/?path=${song_field.path}">
                            <i class="glyphicon glyphicon-download icon"></i>
                        </a>
                        <i class="glyphicon glyphicon-shopping-cart icon"></i>
                        <button type="button" class="no_style" data-toggle="modal" data-target="#edit_song" 
                                onclick="edit_modal_data('${song_field.id}')"><i class="glyphicon glyphicon-edit icon"></i>
                        </button>
                        <a href="/api/delete/?" id="${song_field.id}"><i class="glyphicon glyphicon-trash icon"></i></a>`;
                }
                else {
                    cell4.innerHTML =
                        `<a href="/download/${song_field.path}"><i class="glyphicon glyphicon-download icon"></i></a>
                         <button class="glyphicon glyphicon-shopping-cart no_style icon" data-toggle="modal" data-target="#email_sender"
                                 onclick="set_email_message('${song_field.id}')"></button>`;
                }
            });
        });
    };

const showAddToPlaylistPopover = function (songId) {
    // TODO not working. Use function calls like in showUserSelector instead of popover crap
    let popover_str = `<div class="modal-header">
                           <h4 class="modal-title">Select playlist</h4>
                       </div>`;
    popover_str += `<div class="modal-body">
                    <button class='btn btn-success' onclick="showCreatePlaylistPopup('${songId}')">New playlist</button><br><br>`;
    $.each(playlists, function (i, playlist_field) {
        popover_str += `<button class='btn btn-default' onclick="addSongToPlaylist('${playlist_field.id}', '${songId}')">${playlist_field.playlist_name}</button><br>`;
    });
    popover_str += '</div>';

    const popovers = $('[data-toggle="popover"]');
    popovers.popover({html: true, content: popover_str });
    popovers.popover('show');
};

let newSongId;
const showCreatePlaylistPopup = function (songId) {
    $('[data-toggle="popover"]').popover('hide');
    newSongId = songId;
    $(".playlist_modal").show();
};

const addSongToPlaylist = function (playlistId, songId) {
    $('[data-toggle="popover"]').popover('hide');
    const url = "/api/add_song_to_playlist/?playlist=" + playlistId + "&song=" + songId;
    $.getJSON(url, function(result){
        load_playlists();
    });
};

const set_email_message = function(id){
     $('input[name="email_sender_song_id"]').val(id);
};

const send_email = function () {
    const url = "/api/send_mail/?id=" + $('input[name="email_sender_song_id"]').val();
    alert(url);
    $.getJSON(url, function(result){
            $.each(result, function(i, song_field){})
    })
};

const onPlayStopClick = function (filename, hostingDiv) {
    playSingleSong(filename);
    resetTableIcons();
    // set the current icon to buffer
    $(hostingDiv).find(".table_play_icon").attr("class","table_play_icon glyphicon glyphicon-transfer");
};

// find all icons and set them to the play graphic. This is to reset any other previous icons when the user clicks quickly
const resetTableIcons = function () {
    $(".table_play_icon").each(function (i, el) {
        $(el).attr("class","table_play_icon glyphicon glyphicon-play");
     });
};

const edit_modal_data = function (id) {
    let song_field = loaded_songs[id];
    document.getElementById("edit_modal_title").innerHTML = song_field.name;
    $('input[name="edit_title"]').val(song_field.name);
    $('input[name="edit_song_id"]').val(id);
    $('input[name="edit_album"]').val(song_field.album.album_name);
    $('input[name="edit_artist"]').val(song_field.artist.artist_name);
};

const edit_modal_send_data = function(){
     let data = JSON.stringify({
        "id": $("#edit_song_id").val(),
        "title": $("#edit_title").val(),
        "album": $("#edit_album").val(),
        "artist": $("#edit_artist").val(),
        "tags": $("#edit_tags").val()});
    console.log(data);
    let xhr = new XMLHttpRequest();
    let url = "/api/edit_song/?data=" + encodeURIComponent(data);
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //let json = JSON.parse(xhr.responseText);
            filter_table(actual_url);
        }
    };
    xhr.send(data);
};

const searchForSongs = function () {
    const keywords = document.getElementById('search_field');
    const actual_url = '/api/songs/?keywords=' + keywords.value;
    filter_table(actual_url);
};

$(document).ready(function() {
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

    // Make auto hiding popovers play nice with buttons inside them
    //from https://stackoverflow.com/questions/11703093/how-to-dismiss-a-twitter-bootstrap-popover-by-clicking-outside
    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false  // fix for BS 3.3.6
            }
        });
    });

    // init
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

     $.getJSON("/api/users", function(result) {
        usersArray = result;
    })
});