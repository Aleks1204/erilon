/**
 * Created by artemk on 3/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageSpell = sequelize.define("PersonageSpell", {
        level: DataTypes.INTEGER,
        tutored: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                PersonageSpell.belongsTo(models.Spell);
                PersonageSpell.belongsTo(models.Personage);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'personage_search_personage_spells',
                method: 'BTREE',
                fields: ['level', 'tutored']
            }
        ]
    });

    return PersonageSpell;
};