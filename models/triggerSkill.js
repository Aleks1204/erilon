/**
 * Created by artemk on 2/10/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var TriggerSkill = sequelize.define("TriggerSkill", {
        name: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        difficult: DataTypes.BOOLEAN

    }, {
        classMethods: {
            associate: function(models) {
                TriggerSkill.hasMany(models.PersonageTriggerSkill);
                TriggerSkill.hasMany(models.SkillLevel);
                TriggerSkill.hasMany(models.MeritTriggerSkill);
            }
        }
    });

    return TriggerSkill;
};