/**
 * Created by shmublon on 7/30/15.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Race = sequelize.define("Race", {
        name: DataTypes.STRING,
        max_age: DataTypes.INTEGER,
        falling_damage_coefficient: DataTypes.INTEGER,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Race.hasMany(models.Personage);
                Race.hasMany(models.RaceAttribute);
                Race.hasMany(models.RaceMerit);
                Race.hasMany(models.RaceInherent);
                Race.hasMany(models.RaceFlaw);
            }
        }
    });

    return Race;
};

