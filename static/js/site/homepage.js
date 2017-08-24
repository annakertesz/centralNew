/**
 * Created by annakertesz on 8/13/17.
 */
load_artists = function () {
    var albums = document.getElementById("all_albums");
    $.getJSON("/api/artists/", function (result) {
        $.each(result, function (i, artist) {
            var album_container = $("<div>", {"class": "artist_albums_container"});
            album_container.append(
                '<button class="container_artist_title" onclick="show_clicked_albums(\'/api/songs/?artist=' + artist.id + '\')">' +
                '<h3>' + artist.artist_name + '</h3></button>');
             $.getJSON("/api/albums/?artist=" + artist.id, function (result) {
                $.each(result, function (i, album) {
                    album_container.append
                    ('<button class="no_style" onclick="show_clicked_albums(\'/api/songs/?album=' + album.id + '\')">' +
                        '<figure class="album_of_artist">' +
                            '<img src="/media/covers/' + album.cover + '.jpg" />' +
                            ' <figcaption>'+album.album_name + '</figcaption>' +
                        '</figure></button>');
                });
             });
            $("#all_albums").append(album_container);
        })
    });
};

show_clicked_albums = function(url){
    show_browser();
    filter_table(url);

};

$(document).ready(function() {
    load_artists()
});