/**
 * Created by artem-kalantay on 12.05.16.
 */
"use strict";

app.controller("permissionsController", function ($scope, $http, $localStorage, $q) {
    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).success(function (data) {
        players.resolve(data);
        $scope.player = data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        $scope.hasDeletePermission = function (dictionaryName) {
            return hasPermission(dictionaryName, 'delete', data[0].player.Role);
        };

        $scope.hasCreatePermission = function (dictionaryName) {
            return hasPermission(dictionaryName, 'create', data[0].player.Role);
        };

        $scope.hasEditPermission = function (dictionaryName) {
            return hasPermission(dictionaryName, 'edit', data[0].player.Role);
        };

        $scope.hasViewPermission = function (dictionaryName) {
            return hasPermission(dictionaryName, 'view', data[0].player.Role);
        };

        $scope.deleteUserCookie = function () {
            delete $localStorage.playerId;
        };

        $scope.hasManagePermissionsAccess = function () {
            return hasActionPermission('managePermissions', data[0].player.Role)
        };
    }
});