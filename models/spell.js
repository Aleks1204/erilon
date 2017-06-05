/**
 * Created by artemk on 3/7/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
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
        description: DataTypes.TEXT,
        modification_needed: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                Spell.belongsTo(models.AttachedSkill, {foreignKeyConstraint: true});
                Spell.hasMany(models.PersonageSpell);
                Spell.hasMany(models.Spell);
                Spell.belongsTo(models.Spell, {as: 'BaseSpell', foreignKey: 'SpellId', constraints: false});
            }
        }
    });

    return Spell;
};