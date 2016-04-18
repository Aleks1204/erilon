/**
 * Created by artemk on 4/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Role = sequelize.define("Role", {
        name: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Role.hasMany(models.Player);
                Role.hasMany(models.RolePermission);
            }
        }
    });

    return Role;
};