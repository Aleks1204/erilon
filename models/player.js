/**
 * Created by artemk on 4/12/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Player = sequelize.define("Player", {
        name: DataTypes.STRING,
        avatar: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Player.hasMany(models.Personage);
                Player.hasMany(models.Room);
                Player.belongsTo(models.Role, {foreignKeyConstraint: true});
            }
        }
    });

    return Player;
};
