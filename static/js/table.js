var show_artists = function () {
    $("#artist_list").toggle();
};

var show_album = function () {
    $("#album_list").toggle();
};

$(document).ready(function() {


    var album_list = document.getElementById("album_list");
    
    $("#artist_list").hide();
    $("#album_list").hide();

    $.getJSON("/api/albums", function(result){
        $.each(result, function(i, field){
            $("#album_list").append('<li><button class="no_button" onclick="filter_table(\'/api/songs/?album=' + field.id + '\')">' + field.album_name + '</button></li>');
        })
    });

    $.getJSON("/api/artists", function(result){
        $.each(result, function(i, field){
            $("#artist_list").append('<li><button class="no_button" onclick="filter_table(\'/api/songs/?album=' + field.id + '\')">' + field.artist_name + '</button></li>');
        })
    });


    search = function () {
        keywords = document.getElementById('search_field');
        filter_table('/api/songs/?keywords=' + keywords.value);

    };
    
    
    filter_table = function (url) {
        $("#song_table tr").remove();
        var table = document.getElementById("song_table");
        $.getJSON(url, function(result){
            $.each(result, function(i, field){
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);

                cell1.innerHTML = '<button id="play" class="btn btn-primary" onclick="play(\'' + field.path + '\')">' +
                    '<i class="glyphicon glyphicon-play"></i></button></td>';
                cell2.innerHTML = field.name;
                cell3.innerHTML = field.album.album_name;
                cell4.innerHTML = field.artist.artist_name;
                cell5.innerHTML = "<i class='glyphicon glyphicon-download'></i>";
                cell5.innerHTML = '<a href="/download/?path=' + field.path + '"><i class="glyphicon glyphicon-download"></a>';
                cell6.innerHTML = "<i class='glyphicon glyphicon-shopping-cart'></i>";
                cell7.innerHTML = "<button class=\"no_button\" id=\"addtoplaylist\">add to playlist</button>";
            });
        });
    };

    filter_table('/api/songs');

});