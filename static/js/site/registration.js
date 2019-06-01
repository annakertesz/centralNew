const showSignUpModal = function () {
    const delModal = $('#signUpModal');
    const spinner = $('#signupSpinner');
    spinner.css("visibility", "hidden");
    delModal.modal('show');
};

const validate_form = function () {
    var ok =true;
    if ($("#firstname").val()=="") {
        $("#firstnametext").css("color", "red");
        ok = false
    }
    else{
        $("#firstnametext").css("color", "black")
    }
    if ($("#lastname").val()=="") {
        $("#lastnametext").css("color", "red");
        ok = false
    } else {
        $("#lastnametext").css("color", "black")
    }
    if ($("#address").val()=="") {
        $("#addresstext").css("color", "red");
        ok = false
    } else {
        $("#addresstext").css("color", "black")
    }
    if (ok == true){
        send_signUp_email()
    }
}

const send_signUp_email = function () {
    const body = $('#signupModalBody');
    const spinner = $('#signupSpinner');
    body.css("visibility", "hidden");
    spinner.css("visibility", "visible");
    const url = "/api/send_mail/?message='name: " + $("#newusername").val() + " phone: " + $("#newphone").val() + " message: " + $("#newmessage").val() + "'";
    $.getJSON(url, function (result) {
        if (result != "success") {
            unsuccessfulSignUp();
            body.css("visibility", "visible");
        } else {
            successfulSignUp();
            body.css("visibility", "visible");
        }
    })
};

const successfulSignUp = function () {
    const delModal = $('#signUpModal');
    const sucModal = $('#successfulSignUpModal');
    delModal.modal('hide')
    sucModal.modal('show')

}

const unsuccessfulSignUp = function () {
    alert("email sent"); /*TODO: make a modal*/
    const delModal = $('#signUpModal');
    const unsucModal = $('#unsuccessfulSignUpModal');
    delModal.modal('hide')
    unsucModal.modal('show')

}

const deleteSong = function (event) {
    $.getJSON("/api/delete_song/?id=" + event.data, function (result) {
        console.log(result);
        filter_table(actual_url);
        load_playlists();
    });
};