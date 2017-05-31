/**
 * Created by artemk on 2/9/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var AttachedSkill = sequelize.define("AttachedSkill", {
        name: DataTypes.STRING,
        category: DataTypes.STRING,
        spells_connected: DataTypes.BOOLEAN,
        description: DataTypes.STRING,
        difficult: DataTypes.BOOLEAN,
        theoretical: DataTypes.BOOLEAN,
        default_skill: DataTypes.BOOLEAN

    }, {
        classMethods: {
            associate: function(models) {
                AttachedSkill.hasMany(models.PersonageAttachedSkill);
                AttachedSkill.hasMany(models.MeritAttachedSkill);
                AttachedSkill.hasMany(models.MeritAttributeAttachedSkill);
                AttachedSkill.hasMany(models.Spell);
                AttachedSkill.hasMany(models.AttachedSkillAttribute);
            }
        }
    });

    return AttachedSkill;
};