/**
 * Created by artemk on 4/16/16.
 */
"use strict";

function hasPermission(name, action, role) {
    var access = false;

    angular.forEach(role.RolePermissions, function (RolePermission) {
        if (RolePermission.Permission.name === action + name + 'Dictionary') {
            access = true;
        }
    });

    return access;
}

function hasActionPermission(actionName, role) {
    var access = false;

    angular.forEach(role.RolePermissions, function (RolePermission) {
        if (RolePermission.Permission.name === actionName) {
            access = true;
        }
    });

    return access;
}
