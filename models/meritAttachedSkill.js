/**
 * Created by artemk on 2/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritAttachedSkill = sequelize.define("MeritAttachedSkill", {
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                MeritAttachedSkill.belongsTo(models.AttachedSkill);
                MeritAttachedSkill.belongsTo(models.Merit);
            }
        }
    });

    return MeritAttachedSkill;
};
