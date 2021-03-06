"use strict";

module.exports = function(sequelize, DataTypes) {
    var Notice = sequelize.define("Notice", {
        name: DataTypes.STRING,
        experience: DataTypes.INTEGER,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Notice.belongsTo(models.Personage);
            }
        }
    });

    return Notice;
};
