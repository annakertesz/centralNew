/**
 * Created by annakertesz on 6/17/17.
 */

 var hide_all = function () {
        $("#browser").hide();
        $("#playlists").hide();
    };
    
    var show_browser = function () {
        hide_all();
        $("#browser").show()
    };
    
    var show_playlists = function () {
        hide_all();
        $("#playlists").show()
    };

$(document).ready(function() {
    

    hide_all();
});