/**
 * Created by artemk on 1/29/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var RaceMerit = sequelize.define("RaceMerit", {
        race_default: DataTypes.BOOLEAN,
        race_cost: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                RaceMerit.belongsTo(models.Merit);
                RaceMerit.belongsTo(models.Race);
            }
        }
    });

    return RaceMerit;
};