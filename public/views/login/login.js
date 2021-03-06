"use strict";

var app = angular.module("loginApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("loginController", function ($scope, $http, $window, $localStorage) {
    $http.get('/attributes').then(function (response) {
        $scope.attribues = response.data.data;
    });
    $scope.login = function () {
        $http.get('/isPlayerExist/' + $scope.nickName.toLowerCase()).then(function onSuccess(response) {
            if (response.data.status === 'OK') {
                $localStorage.playerId = response.data.player.id;
                $window.location.href = '/views/user_personage_manager.html?id=' + response.data.player.id;
            } else {
                $http.post('/players', {
                    role_id: 2,
                    name: $scope.nickName.toLowerCase()
                }).then(function (response) {
                    angular.forEach($scope.attribues, function (attribute) {
                        $http.post('/playerAttributes', {
                            player_id: response.data.player.id,
                            attribute_id: attribute.id,
                            position: 0
                        });
                    });
                    $localStorage.playerId = response.data.player.id;
                    $window.location.href = '/views/user_personage_manager.html?id=' + response.data.player.id;
                });
            }
        }, function onError(response) {
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

    $('#validation-name').focus();

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
//TEst again