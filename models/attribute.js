/**
 * Created by shmublon on 7/30/15.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Attribute = sequelize.define("Attribute", {
        name: DataTypes.STRING,
        action_level_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Attribute.hasMany(models.RaceAttribute);
                Attribute.hasMany(models.PersonageAttribute);
                Attribute.hasMany(models.MeritAttribute);
                Attribute.hasMany(models.MeritAttributeAttachedSkill);
            }
        }
    });

    return Attribute;
};

