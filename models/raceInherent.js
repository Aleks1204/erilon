/**
 * Created by artemk on 2/3/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var RaceInherent = sequelize.define("RaceInherent", {
        race_probability: DataTypes.DOUBLE
    }, {
        classMethods: {
            associate: function(models) {
                RaceInherent.belongsTo(models.Inherent);
                RaceInherent.belongsTo(models.Race);
            }
        }
    });

    return RaceInherent;
};