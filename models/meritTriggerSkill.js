/**
 * Created by artemk on 2/21/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritTriggerSkill = sequelize.define("MeritTriggerSkill", {
        level: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                MeritTriggerSkill.belongsTo(models.TriggerSkill);
                MeritTriggerSkill.belongsTo(models.Merit);
            }
        }
    });

    return MeritTriggerSkill;
};
