"use strict";

module.exports = function(sequelize, DataTypes) {
    var PlayerAttribute = sequelize.define("PlayerAttribute", {
        position: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                PlayerAttribute.belongsTo(models.Attribute);
                PlayerAttribute.belongsTo(models.Player);
            }
        }
    });

    return PlayerAttribute;
};
