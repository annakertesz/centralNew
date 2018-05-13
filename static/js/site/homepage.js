
const loadArtists = function () {
    $.getJSON("/api/artists/", function (result) {
        $.each(result, function (i, artist) {
            const album_container = $("<div>");
            // The big artist title bar
            album_container.append(
//            <h2 class="featurette-heading">First featurette heading. <span
//                        class="text-muted">It'll blow your mind.</span></h2>
                '<a class="container_artist_titlea" onclick="show_clicked_albums(\'/api/songs/?artist=' + artist.id + '\')">' +
                '<h2 class="featurette-heading">' + artist.artist_name + '</h2></a>');
            $.getJSON("/api/albums/?artist=" + artist.id, function (result) {
                // The album pictures
                $.each(result, function (i, album) {
                    album_container.append
                    ('<div class="album_of_artist"><a class="featurette-image img-fluid mx-auto" onclick="show_clicked_albums(\'/api/songs/?album=' + album.id + '\')"><div class="hovereffect">' +
                        '<img class="img-responsive img-thumbnail" src="/media/covers/' + album.cover + '.jpg" alt=""/>' +
                            '<div class="overlay">' +
                            '<h2>'+album.album_name + '</h2></div>' +
                        '</div></a></div>');
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
