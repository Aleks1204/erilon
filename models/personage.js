/**
 * Created by shmublon on 7/30/15.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Personage = sequelize.define("Personage", {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        max_age: DataTypes.INTEGER,
        generated: DataTypes.BOOLEAN,
        experience: DataTypes.INTEGER,
        avatar: DataTypes.STRING,
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Personage.belongsTo(models.Race, {foreignKeyConstraint: true});
                Personage.belongsTo(models.Player, {foreignKeyConstraint: true});
                Personage.belongsTo(models.Room);
                Personage.hasMany(models.PersonageAttribute);
                Personage.hasMany(models.PersonageMerit);
                Personage.hasMany(models.PersonageInherent);
                Personage.hasMany(models.PersonageFlaw);
                Personage.hasMany(models.PersonageAttachedSkill);
                Personage.hasMany(models.PersonageTriggerSkill);
                Personage.hasMany(models.PersonageSpell);
                Personage.hasMany(models.Notice);
            }
        }
    });

    return Personage;
};

