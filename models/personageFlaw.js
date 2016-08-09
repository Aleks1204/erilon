/**
 * Created by artemk on 2/8/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageFlaw = sequelize.define("PersonageFlaw", {
        personage_race_default: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                PersonageFlaw.belongsTo(models.Flaw);
                PersonageFlaw.belongsTo(models.Personage);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'flaw_personage_id',
                method: 'BTREE',
                fields: ['PersonageId']
            }
        ]
    });

    return PersonageFlaw;
};
