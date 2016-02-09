/**
 * Created by artemk on 2/9/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var AttachedSkill = sequelize.define("AttachedSkill", {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        difficult: DataTypes.BOOLEAN,
        theoretical: DataTypes.BOOLEAN,
        default_skill: DataTypes.BOOLEAN

    }, {
        classMethods: {
            associate: function(models) {
                AttachedSkill.hasMany(models.PersonageAttachedSkill);
            }
        }
    });

    return AttachedSkill;
};