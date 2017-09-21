
const initNavbar = function () {
    hide_all();
    show_home();
};

const hide_all = function () {
    $("#browser").hide();
    $("#playlists").hide();
    $("#home").hide();
};

const show_home = function () {
    hide_all();
    $("#home").show();
};

const show_browser = function () {
    hide_all();
    $("#browser").show();
};

const show_playlists = function () {
    hide_all();
    $("#playlists").show();
};