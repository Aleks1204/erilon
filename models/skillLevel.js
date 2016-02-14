/**
 * Created by artemk on 2/10/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var SkillLevel = sequelize.define("SkillLevel", {
        cost: DataTypes.INTEGER,
        level: DataTypes.INTEGER,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                SkillLevel.belongsTo(models.TriggerSkill);
            }
        }
    });

    return SkillLevel;
};