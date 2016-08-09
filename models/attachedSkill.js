/**
 * Created by artemk on 2/9/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var AttachedSkill = sequelize.define("AttachedSkill", {
        name: DataTypes.STRING,
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
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'personage_search_attached_skills_name',
                method: 'BTREE',
                fields: ['name']
            }, {
                name: 'personage_search_attached_skills_spells_connected',
                method: 'BTREE',
                fields: ['spells_connected']
            }, {
                name: 'personage_search_attached_skills_difficult',
                method: 'BTREE',
                fields: ['difficult']
            }, {
                name: 'personage_search_attached_skills_theoretical',
                method: 'BTREE',
                fields: ['theoretical']
            }, {
                name: 'personage_search_attached_skills_default_skill',
                method: 'BTREE',
                fields: ['default_skill']
            }
        ]
    });

    return AttachedSkill;
};