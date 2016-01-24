/**
 * Created by shmublon on 7/30/15.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var RaceAttribute = sequelize.define("RaceAttribute", {
        base_cost: DataTypes.INTEGER,
        max_value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                RaceAttribute.belongsTo(models.Attribute);
                RaceAttribute.belongsTo(models.Race);
            }
        }
    });

    return RaceAttribute;
};
