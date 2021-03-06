/**
 * Created by artemk on 2/8/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Flaw = sequelize.define("Flaw", {
        name: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        unremovable: DataTypes.BOOLEAN,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        permanent_bonus: DataTypes.STRING,
        situation_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Flaw.hasMany(models.RaceFlaw);
                Flaw.hasMany(models.PersonageFlaw);
                Flaw.hasMany(models.MeritFlaw);
            }
        }
    });

    return Flaw;
};
