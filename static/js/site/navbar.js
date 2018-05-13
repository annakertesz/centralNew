
const initNavbar = function () {
    reset_all();
    show_home();
};

const reset_all = function () {
    $("#browser").hide();
    $("#playlists").hide();
    $("#home").hide();
    $('#myCarousel').hide();

    $("#show-browser").css("font-weight","Normal");
    $("#show-playlist").css("font-weight","Normal");
};

const show_home = function () {
    reset_all();
    $("#home").show();
    $('#myCarousel').show();
};

const show_browser = function () {  //TODO: show all + remove search field cucc
    reset_all();
    $("#browser").show();
    $("#show-browser").css("font-weight","Bold");
};

const show_playlists = function () {
    reset_all();
    $("#playlists").show();
    $("#show-playlist").css("font-weight","Bold");
};