/**
 * Created by artemk on 2/23/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritFlaw = sequelize.define("MeritFlaw", {
        presentAbsent: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                MeritFlaw.belongsTo(models.Flaw);
                MeritFlaw.belongsTo(models.Merit);
            }
        }
    });

    return MeritFlaw;
};