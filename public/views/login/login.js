"use strict";

var app = angular.module("loginApp", []);

app.controller("loginController", function ($scope, $http, $window) {
    $scope.login = function () {
        $http.get('/isPlayerExist/' + $scope.nickName).
        success(function (result) {
            if (result.status == 'OK') {
                $window.location.href = '/views/user_personage_manager.html?id=' + result.player.id;
            } else {
                $http.post('/players', {
                    name: $scope.nickName
                }).success(function (result) {
                    $window.location.href = '/views/user_personage_manager.html?id=' + result.player.id;
                });
            }
        });
    };

    function createPersonage(name) {

    }
});