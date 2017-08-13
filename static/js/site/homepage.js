/**
 * Created by annakertesz on 8/13/17.
 */
load_artists = function () {
    var albums = document.getElementById("all_albums");
    $.getJSON("/api/artists/", function (result) {
        $.each(result, function (i, artist) {
            var album_container = $("<div>", {id: "foo", "class": "a"});
            album_container.append("<h3>" + artist.artist_name + "</h3>");
            $("#all_albums").append(album_container);
        })
    });
};

$(document).ready(function() {
    load_artists()
});