/**
 * Created by artemk on 1/29/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Merit = sequelize.define("Merit", {
        name: DataTypes.STRING,
        cost: DataTypes.INTEGER,
        creation_only: DataTypes.BOOLEAN,
        category: DataTypes.STRING,
        description: DataTypes.STRING,
        permanent_bonus: DataTypes.STRING,
        situation_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Merit.hasMany(models.RaceMerit);
                Merit.hasMany(models.PersonageMerit);
                Merit.hasMany(models.MeritAttribute);
                Merit.hasMany(models.MeritAttachedSkill);
                Merit.hasMany(models.MeritAttributeAttachedSkill);
                Merit.hasMany(models.MeritTriggerSkill);
                Merit.hasMany(models.MeritInherent);
                Merit.hasMany(models.MeritFlaw);
                Merit.hasMany(models.MeritMerit, {as: 'MeritPrerequisite', foreignKey: 'PrerequisiteMeritId'});
                Merit.hasMany(models.MeritMerit, {foreignKey: 'MeritId'});
            }
        }
    });

    return Merit;
};
