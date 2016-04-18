jQuery(document).ready(function () {

    /*
     Fullscreen background
     */
    $.backstretch("assets/img/backgrounds/1.jpg");

    /*
     Form validation
     */
    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });


});
