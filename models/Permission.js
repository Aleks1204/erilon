/**
 * Created by artemk on 4/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Permission = sequelize.define("Permission", {
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Permission.hasMany(models.RolePermission);
            }
        }
    });

    return Permission;
};