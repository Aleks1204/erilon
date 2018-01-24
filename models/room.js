/**
 * Created by artemk on 4/14/16.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Room = sequelize.define("Room", {
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Room.hasMany(models.Personage);
                Room.belongsTo(models.Player);
            }
        }
    });

    return Room;
};