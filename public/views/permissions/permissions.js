/**
 * Created by artemk on 4/16/16.
 */
"use strict";

app.controller("permissionsController", function ($scope, $http, $cookies) {
    $scope.playerId = $cookies.getObject('playerId');
    $http.get('/players/' + $scope.playerId).
    success(function (data) {
        $scope.player = data.player;
    });

    $scope.hasDeletePermission = function (dictionaryName) {
        return hasPermission(dictionaryName, 'delete');
    };

    $scope.hasCreatePermission = function (dictionaryName) {
        return hasPermission(dictionaryName, 'create');
    };

    function hasPermission(name, action) {
        var access = false;
        angular.forEach($scope.player.Role.RolePermissions, function (RolePermission) {
            if (RolePermission.Permission.name == action + name + 'Dictionary') {
                access = true;
            }
        });
        return access;
    }
});
