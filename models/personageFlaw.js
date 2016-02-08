/**
 * Created by artemk on 2/8/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageFlaw = sequelize.define("PersonageFlaw", {
        unremovable: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                PersonageFlaw.belongsTo(models.Flaw);
                PersonageFlaw.belongsTo(models.Personage);
            }
        }
    });

    return PersonageFlaw;
};
