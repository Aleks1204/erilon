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
        }
    });

    return PersonageSpell;
};