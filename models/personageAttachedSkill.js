/**
 * Created by artemk on 2/9/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageAttachedSkill = sequelize.define("PersonageAttachedSkill", {
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                PersonageAttachedSkill.belongsTo(models.AttachedSkill);
                PersonageAttachedSkill.belongsTo(models.Personage);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'personage_attached_skills_personage_id',
                method: 'BTREE',
                fields: ['PersonageId']
            }
        ]
    });

    return PersonageAttachedSkill;
};