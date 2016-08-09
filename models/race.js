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
                Race.hasMany(models.Personage);
                Race.hasMany(models.RaceAttribute);
                Race.hasMany(models.RaceMerit);
                Race.hasMany(models.RaceInherent);
                Race.hasMany(models.RaceFlaw);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'race_id',
                method: 'BTREE',
                fields: ['id']
            }
        ]
    });

    return Race;
};

