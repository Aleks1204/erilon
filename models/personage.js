/**
 * Created by shmublon on 7/30/15.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var Personage = sequelize.define("Personage", {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        generated: DataTypes.BOOLEAN,
        experience: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Personage.belongsTo(models.Race, {foreignKeyConstraint: true});
                Personage.hasMany(models.PersonageAttribute);
            }
        }
    });

    return Personage;
};

