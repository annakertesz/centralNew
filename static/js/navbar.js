/**
 * Created by annakertesz on 6/17/17.
 */

 var hide_all = function () {
        $("#browser").hide();
        $("#playlists").hide();
        $("#home").hide();
    };

    var show_home = function () {
        hide_all()
        $("#home").show();
    };
    
    var show_browser = function () {
        hide_all();
        $("#browser").show();
    };
    
    var show_playlists = function () {
        hide_all();
        $("#playlists").show();
    };

$(document).ready(function() {
    

    hide_all();
    show_home();
});