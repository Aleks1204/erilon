/**
 * Created by artemk on 1/29/16.
 */
"use strict";

module.exports = function(sequelize) {
    var PersonageMerit = sequelize.define("PersonageMerit", {
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