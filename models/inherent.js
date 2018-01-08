/**
 * Created by artemk on 2/2/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Inherent = sequelize.define("Inherent", {
        name: DataTypes.STRING,
        probability: DataTypes.INTEGER,
        min_limit: DataTypes.INTEGER,
        max_limit: DataTypes.INTEGER,
        description: DataTypes.STRING,
        permanent_bonus: DataTypes.STRING,
        situation_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Inherent.hasMany(models.PersonageInherent);
                Inherent.hasMany(models.RaceInherent);
                Inherent.hasMany(models.MeritInherent);
            }
        }
    });

    return Inherent;
};
