/**
 * Created by annakertesz on 8/13/17.
 */
load_artists = function () {
    var albums = document.getElementById("all_albums");
    $.getJSON("/api/artists/", function (result) {
        $.each(result, function (i, artist) {
            var album_container = $("<div>", {"class": "album_container"});
            album_container.append("<h3>" + artist.artist_name + "</h3>");
             $.getJSON("/api/albums/?artist=" + artist.id, function (result) {
                $.each(result, function (i, album) {
                    album_container.append
                    ('<figure><img src="/media/covers/' + album.cover + '.jpg" />' +
                        ' <figcaption>'+album.album_name + '</figcaption></figure>');
                    console.log(album.cover);
                });
             });
            $("#all_albums").append(album_container);
        })
    });
};

$(document).ready(function() {
    load_artists()
});