/**
 * Created by artemk on 2/2/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageInherent = sequelize.define("PersonageInherent", {
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                PersonageInherent.belongsTo(models.Inherent);
                PersonageInherent.belongsTo(models.Personage);
            }
        }
    });

    return PersonageInherent;
};