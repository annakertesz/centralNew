let is_staff;

$(document).ready(function() {
    // I don't know how to template JS files...
    is_staff = $("#is_staff").val() === "True";
    loadArtists();
    initMusicPlayer();
    initTable();
    initNavbar();
});