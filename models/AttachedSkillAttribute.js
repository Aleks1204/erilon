/**
 * Created by artemk on 2/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var AttachedSkillAttribute = sequelize.define("AttachedSkillAttribute", {
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                AttachedSkillAttribute.belongsTo(models.Attribute);
                AttachedSkillAttribute.belongsTo(models.AttachedSkill);
            }
        }
    });

    return AttachedSkillAttribute;
};