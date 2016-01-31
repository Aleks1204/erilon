/**
 * Created by artemk on 1/29/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Merit = sequelize.define("Merit", {
        name: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        description: DataTypes.STRING,
        action_level_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Merit.hasMany(models.RaceMerit);
            }
        }
    });

    return Merit;
};
