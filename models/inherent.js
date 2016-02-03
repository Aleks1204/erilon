/**
 * Created by artemk on 2/2/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Inherent = sequelize.define("Inherent", {
        name: DataTypes.STRING,
        probability: DataTypes.DOUBLE,
        description: DataTypes.STRING,
        action_level_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Inherent.hasMany(models.PersonageInherent);
            }
        }
    });

    return Inherent;
};
