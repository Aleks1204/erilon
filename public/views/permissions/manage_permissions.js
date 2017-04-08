/**
 * Created by artem-kalantay on 09.05.16.
 */
var app = angular.module("permissionsManagerApp", ['ngStorage']);

app.controller("permissionsManagerController", function ($scope, $http) {
    $scope.dictionaries = [
        {
            "visibleValue": "Прикрепленные навыки",
            "name": "AttachedSkill"
        }, {
            "visibleValue": "Тригерные навыки",
            "name": "TriggerSkill"
        }, {
            "visibleValue": "Достоинства",
            "name": "Merit"
        }, {
            "visibleValue": "Недостатки",
            "name": "Flaw"
        }, {
            "visibleValue": "Врожденные особенности",
            "name": "Inherent"
        }, {
            "visibleValue": "Заклинания",
            "name": "Spell"
        }, {
            "visibleValue": "Расы",
            "name": "Race"
        }, {
            "visibleValue": "Атрибуты",
            "name": "Attribute"
        }, {
            "visibleValue": "Все персонажи",
            "name": "AllPersonages"
        }
    ];

    $http.get('/roles').success(function (data) {
        $scope.roles = data.roles;
    });

    $scope.hasDeletePermissionForRole = function (dictionaryName, role) {
        return hasPermission(dictionaryName, 'delete', role);
    };

    $scope.hasCreatePermissionForRole = function (dictionaryName, role) {
        return hasPermission(dictionaryName, 'create', role);
    };

    $scope.hasEditPermissionForRole = function (dictionaryName, role) {
        return hasPermission(dictionaryName, 'edit', role);
    };

    $scope.hasViewPermissionForRole = function (dictionaryName, role) {
        return hasPermission(dictionaryName, 'view', role);
    };

    $http.get('/permissions').success(function (data) {
        $scope.permissions = data.permissions;
    });

    $scope.addRolePermission = function (role, dictionaryName, action) {
        var permissionId = null;

        angular.forEach($scope.permissions, function (permission) {
            if (permission.name == action + dictionaryName + 'Dictionary') {
                permissionId = permission.id;
                $http.post('/rolePermissions', {
                    role_id: role.id,
                    permission_id: permissionId
                }).then(function () {
                    $http.get('/roles').success(function (response) {
                        $scope.roles = response.data.roles;
                    });
                });
            }
        });
    };

    $scope.deleteRolePermission = function (role, dictionaryName, action) {
        var permissionId = null;

        angular.forEach($scope.permissions, function (permission) {
            if (permission.name == action + dictionaryName + 'Dictionary') {
                permissionId = permission.id;

                $http.get('/rolePermissions/' + role.id + '/' + permissionId).then(function (response) {
                    $http.delete('/rolePermissions/' + response.data.rolePermission.id);
                    $http.get('/roles').then(function (response) {
                        $scope.roles = response.data.roles;
                        $http.get('/roles').success(function (response) {
                            $scope.roles = response.data.roles;
                        });
                    });
                });
            }
        });
    };
});