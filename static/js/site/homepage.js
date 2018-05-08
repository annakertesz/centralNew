
const loadArtists = function () {
    $.getJSON("/api/artists/", function (result) {
        $.each(result, function (i, artist) {
            const album_container = $("<div>", {"class": "artist_albums_container"});
            // The big artist title bar
            album_container.append(
                '<button class="container_artist_title" onclick="show_clicked_albums(\'/api/songs/?artist=' + artist.id + '\')">' +
                '<h3>' + artist.artist_name + '</h3></button>');
            $.getJSON("/api/albums/?artist=" + artist.id, function (result) {
                // The album pictures
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

const show_clicked_albums = function(url){
    show_browser();
    filter_table(url);
};
