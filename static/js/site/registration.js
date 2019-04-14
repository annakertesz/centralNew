const showSignUpModal = function() {
    const delModal = $('#signUpModal');
    delModal.modal('show');
};

const send_signUp_email = function () {
    const url = "/api/send_mail/?message='name: "+$("#newusername").val() + " phone: " + $("#newphone").val() + " message: " + $("#newmessage").val() + "'";
    $.getJSON(url, function(result){
        if (result!="success"){
            alert("Email sending service is currently unaviable. Please write an email to " + result)}
        else{
            alert("email sent")} /*TODO: make a modal*/

    })
};

const deleteSong = function(event) {
     $.getJSON("/api/delete_song/?id=" + event.data, function(result){
         console.log(result);
         filter_table(actual_url);
         load_playlists();
    });
};