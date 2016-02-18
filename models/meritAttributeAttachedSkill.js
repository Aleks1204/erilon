/**
 * Created by artemk on 2/17/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritAttributeAttachedSkill = sequelize.define("MeritAttributeAttachedSkill", {
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                MeritAttributeAttachedSkill.belongsTo(models.Merit);
                MeritAttributeAttachedSkill.belongsTo(models.Attribute);
                MeritAttributeAttachedSkill.belongsTo(models.AttachedSkill);
            }
        }
    });

    return MeritAttributeAttachedSkill;
};
