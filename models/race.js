/**
 * Created by shmublon on 7/30/15.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Race = sequelize.define("Race", {
        name: DataTypes.STRING,
        max_age: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Race.hasMany(models.Personage)
            }
        }
    });

    return Race;
};

