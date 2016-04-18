/**
 * Created by artemk on 4/16/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var RolePermission = sequelize.define("RolePermission", {
    }, {
        classMethods: {
            associate: function(models) {
                RolePermission.belongsTo(models.Role);
                RolePermission.belongsTo(models.Permission);
            }
        }
    });

    return RolePermission;
};
