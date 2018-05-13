let playlists;
let usersArray = [];
let currentPlaylistId;
let currentPlaylistName;
let addUserTooltip;
// Code the the Playlists menu
// TODO add a new playlist button
// TODO add function to download a playlist as a .zip file


$(document).ready(function() {
    // I don't know how to template JS files...
    // Matyi: Do not use templates. You will tie the frontend to the backend which is baad
    id = $("#playlist_id").val();
    showSongsOfPlaylist(id);
});


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
                    cell3.style.width = "20%";
            const cell4 = row.insertCell(3);
                    cell4.style.width = "20%";
            const cell5 = row.insertCell(4);
                    cell5.style.width = "20%";

            cell1.innerHTML = ` <a href=# onclick="playPlaylist('${id}','${num}')">
                                <i class="material-icons">play_arrow</i></a>`;
            cell2.innerHTML = song.name;
            cell3.innerHTML = song.album.album_name;
            cell4.innerHTML = song.artist.artist_name;
            cell5.innerHTML =
                `<a href="/download/${song.path}"><i class="glyphicon glyphicon-download"></i></a>`;
        });
    });
};

const downloadPlaylist = function () {
    console.log('dl dl dl');
    currentPlaylistId;

};



