var show_artists = function () {
    $("#artist_list").toggle();
};

var show_album = function () {
    $("#album_list").toggle();
};


filter_table = function (url) {
        var is_staff = $("#is_staff").val();
        $("#song_table tr").remove();
        var table = document.getElementById("song_table");
        $.getJSON(url, function(result){
            $.each(result, function(i, song_field){
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                cell1.className = "col-md-1";
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                if (is_staff){
                    cell2.className = "col-md-8";
                    cell4.className = "col-md-2";
                }
                else {
                    cell2.className = "col-md-9";
                    cell4.className = "col-md-1";
                }


                cell3.className = "col-md-1";



                cell1.innerHTML = '<button class="btn btn-primary" onclick="onPlayStopClick(\'' + song_field.path + '\', this)">' +
                    '<div class="table_play_icon glyphicon glyphicon-play"></div></button></td>';
                cell2.innerHTML = '<p>'+song_field.artist.artist_name+'</br><strong>'+song_field.name+'</strong></p>';

                $.getJSON("/api/playlists/", function (result) {
                    var new_playlist_str = "<button class='new_playlist_btn no_button' value='"+song_field.id+"'>new playlist</button>";
                    var popover_str ="<ul>";
                    $.each(result, function (i, playlist_field) {
                        var attribute_list = playlist_field.id + "," + song_field.id;
                        popover_str += "<button class='popover_btn no_button' value='"+attribute_list+"'>"+playlist_field.playlist_name+"</button>";
                    });
                    popover_str += "</ul>";
                     cell3.innerHTML =
                        '<a tabindex="0" role="button" data-html="true" data-placement="left" data-toggle="popover" data-trigger="focus" ' +
                        'title="'+new_playlist_str+'" data-content="'+ popover_str + '">Add to playlist</a>';
                    $('[data-toggle="popover"]').popover();
                });
                cell4.innerHTML ='<a href="/download/?path=' + song_field.path + '"><i class="glyphicon glyphicon-download icon"></i></a>'+
                        "<i class='glyphicon glyphicon-shopping-cart icon'></i>";
                if (is_staff){
                    cell4.innerHTML = '<a href="/download/?path=' + song_field.path + '"><i class="glyphicon glyphicon-download icon"></i></a>'+
                        "<i class='glyphicon glyphicon-shopping-cart icon'></i>"+
                        '<a href="#"><i class="glyphicon glyphicon-edit icon"></i></a>' +
                        '<a href="#"><i class="glyphicon glyphicon-trash icon"></i></a>';
                }
            });
        });
    };

onPlayStopClick = function (filename, hostingDiv) {
    play(filename);
    resetTableIcons();
    // set the current icon to buffer
    $(hostingDiv).find(".table_play_icon").attr("class","table_play_icon glyphicon glyphicon-transfer");
};

// find all icons and set them to the play graphic. This is to reset any other previous icons when the user clicks quickly
resetTableIcons = function () {
    $(".table_play_icon").each(function (i, el) {
        $(el).attr("class","table_play_icon glyphicon glyphicon-play");
     });
};

$(document).ready(function() {

    // alert("ops");
    $(document).on("click", ".popover_btn", function() {
            attributes = $(this).val().split(",");
            var playlist_id=attributes[0];
            var song_id=attributes[1];
            var url = "/api/add_song_to_playlist/?playlist=" + playlist_id + "&song=" + song_id;
            $.getJSON(url, function(result){
                $.each(result, function(i, field){
                })
        });
    });
    
    $(document).on("click", ".new_playlist_btn", function () {
        var song_id= $(this).val();
        $("#create_playlist").val(song_id);
        $(".playlist_modal").show();
    });

    $(document).on("click", "#create_playlist", function () {
        var song_id= $(this).val();
        var playlist_name = $("#new_playlist_input").val();
        var playlist_id = -1;
        var url = "/api/add_new_playlist/?name=" + playlist_name;
        $.getJSON(url, function (result) {
                playlist_id=result;
                url = "/api/add_song_to_playlist/?playlist=" + playlist_id + "&song=" + song_id;
                $.getJSON(url, function(result){
                    $.each(result, function(i, field){
                        console.log(field.id)
                    })
            });

        });
        $(".playlist_modal").hide();
    });

    $(document).on("click", "#cancel", function () {
        $(".playlist_modal").hide();
    })

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
    filter_table('/api/songs');
});