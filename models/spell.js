/**
 * Created by artemk on 3/7/16.
 */

"use strict";

module.exports = function (sequelize, DataTypes) {
    var Spell = sequelize.define("Spell", {
        name: DataTypes.STRING,
        additional_schools: DataTypes.STRING,
        complexity: DataTypes.STRING,
        creating_complexity: DataTypes.STRING,
        mana: DataTypes.STRING,
        instant: DataTypes.BOOLEAN,
        mana_support: DataTypes.STRING,
        mana_sup_time: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        effect: DataTypes.TEXT,
        description: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                Spell.belongsTo(models.AttachedSkill, {foreignKeyConstraint: true});
                Spell.hasMany(models.PersonageSpell);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'personage_search_spells_part_1',
                method: 'BTREE',
                fields: ['name', 'additional_schools', 'complexity', 'creating_complexity', 'mana']
            }, {
                name: 'personage_search_spells_part_2',
                method: 'BTREE',
                fields: ['instant', 'mana_support', 'mana_sup_time', 'cost', 'effect', 'description']
            }
        ]
    });

    return Spell;
};