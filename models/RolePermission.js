/**
 * Created by artemk on 4/16/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var RolePermission = sequelize.define("RolePermission", {
    }, {
        classMethods: {
            associate: function(models) {
                RolePermission.belongsTo(models.Role, {unique: false});
                RolePermission.belongsTo(models.Permission, {unique: false});
            }
        }
    });

    return RolePermission;
};
