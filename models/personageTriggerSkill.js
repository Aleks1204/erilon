/**
 * Created by artemk on 2/10/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageTriggerSkill = sequelize.define("PersonageTriggerSkill", {
        currentLevel: DataTypes.INTEGER,
        talented: DataTypes.BOOLEAN,
        tutored: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                PersonageTriggerSkill.belongsTo(models.TriggerSkill);
                PersonageTriggerSkill.belongsTo(models.Personage);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'personage_search_personage_trigger_skills',
                method: 'BTREE',
                fields: ['currentLevel', 'talented', 'tutored']
            }
        ]
    });

    return PersonageTriggerSkill;
};