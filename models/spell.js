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
        experience: DataTypes.INTEGER,
        effect: DataTypes.TEXT,
        description: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Spell.belongsTo(models.AttachedSkill, {foreignKeyConstraint: true});
            }
        }
    });

    return Spell;
};