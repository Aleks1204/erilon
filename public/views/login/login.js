"use strict";

var app = angular.module("loginApp", ['ngStorage']);

app.controller("loginController", function ($scope, $http, $window, $localStorage) {
    $scope.login = function () {
        $http.get('/isPlayerExist/' + $scope.nickName).
        success(function (result) {
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
});