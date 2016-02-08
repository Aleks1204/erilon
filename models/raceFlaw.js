/**
 * Created by artemk on 2/8/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var RaceFlaw = sequelize.define("RaceFlaw", {}, {
        classMethods: {
            associate: function(models) {
                RaceFlaw.belongsTo(models.Flaw);
                RaceFlaw.belongsTo(models.Race);
            }
        }
    });

    return RaceFlaw;
};

