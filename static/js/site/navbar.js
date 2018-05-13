
const initNavbar = function () {
    hide_all();
    show_home();
};

const hide_all = function () {
    $("#browser").hide();
    $("#playlists").hide();
    $("#home").hide();
    $('#myCarousel').hide();
};

const show_home = function () {
    hide_all();
    $("#home").show();
        $('#myCarousel').show();
};

const show_browser = function () {  //TODO: show all + remove search field cucc
    hide_all();
    $("#browser").show();
};

const show_playlists = function () {
    hide_all();
    $("#playlists").show();
};