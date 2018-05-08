let is_staff;

$(document).ready(function() {
    // I don't know how to template JS files...
    // Matyi: Do not use templates. You will tie the frontend to the backend which is baad
    is_staff = $("#is_staff").val() === "True";
    loadArtists();
    initMusicPlayer();
    initTable();
    initNavbar();
    load_playlists();
});