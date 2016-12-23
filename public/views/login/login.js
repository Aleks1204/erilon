"use strict";

var app = angular.module("loginApp", ['ngStorage']);

app.controller("loginController", function ($scope, $http, $window, $localStorage) {
    $scope.login = function () {
        $http.get('/isPlayerExist/' + $scope.nickName).success(function (result) {
            if (result.status == 'OK') {
                $localStorage.playerId = result.player.id;
                $window.location.href = '/views/user_personage_manager.html?id=' + result.player.id;
            } else {
                $http.post('/players', {
                    role_id: 2,
                    name: $scope.nickName
                }).success(function (result) {
                    $localStorage.playerId = result.player.id;
                    $window.location.href = '/views/user_personage_manager.html?id=' + result.player.id;
                });
            }
        });
    };

    // Add class to body for change layout settings
    $('body').addClass('single-page single-page-inverse');

    // Set Background Image for Form Block
    function setImage() {
        var imgUrl = $('.page-content-inner').css('background-image');

        $('.blur-placeholder').css('background-image', imgUrl);
    }

    function changeImgPositon() {
        var width = $(window).width(),
            height = $(window).height(),
            left = - (width - $('.single-page-block-inner').outerWidth()) / 2,
            top = - (height - $('.single-page-block-inner').outerHeight()) / 2;


        $('.blur-placeholder').css({
            width: width,
            height: height,
            left: left,
            top: top
        });
    }

    setImage();
    changeImgPositon();

    $(window).on('resize', function(){
        changeImgPositon();
    });

    // Mouse Move 3d Effect
    var rotation = function(e){
        var perX = (e.clientX/$(window).width())-0.5;
        var perY = (e.clientY/$(window).height())-0.5;
        TweenMax.to(".effect-3d-element", 0.4, { rotationY:15*perX, rotationX:15*perY,  ease:Linear.easeNone, transformPerspective:1000, transformOrigin:"center" })
    };

    if (!cleanUI.hasTouch) {
        $('body').mousemove(rotation);
    }
});