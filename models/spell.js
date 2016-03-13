/**
 * Created by artemk on 3/7/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Spell = sequelize.define("Spell", {
        name: DataTypes.STRING,
        additional_schools: DataTypes.STRING,
        complexity: DataTypes.INTEGER,
        creating_complexity: DataTypes.INTEGER,
        mana: DataTypes.INTEGER,
        instant: DataTypes.BOOLEAN,
        mana_support: DataTypes.INTEGER,
        mana_sup_time: DataTypes.STRING,
        experience: DataTypes.INTEGER,
        effect: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Spell.belongsTo(models.AttachedSkill, {foreignKeyConstraint: true});
            }
        }
    });

    return Spell;
};