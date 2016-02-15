/**
 * Created by artemk on 2/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritAttribute = sequelize.define("MeritAttribute", {
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                MeritAttribute.belongsTo(models.Attribute);
                MeritAttribute.belongsTo(models.Merit);
            }
        }
    });

    return MeritAttribute;
};