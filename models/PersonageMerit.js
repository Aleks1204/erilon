/**
 * Created by artemk on 1/29/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageMerit = sequelize.define("PersonageMerit", {
        unremovable: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                PersonageMerit.belongsTo(models.Merit);
                PersonageMerit.belongsTo(models.Personage);
            }
        }
    });

    return PersonageMerit;
};