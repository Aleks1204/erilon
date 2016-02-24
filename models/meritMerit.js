/**
 * Created by artemk on 2/24/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritMerit = sequelize.define("MeritMerit", {
        presentAbsent: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function(models) {
                MeritMerit.belongsTo(models.Merit, {as: 'MeritPrerequisite', foreignKey: 'PrerequisiteMeritId', constraints: false});
                MeritMerit.belongsTo(models.Merit, {foreignKey: 'MeritId', constraints: false});
            }
        }
    });

    return MeritMerit;
};