/**
 * Created by artemk on 2/22/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    var MeritInherent = sequelize.define("MeritInherent", {
        value: DataTypes.INTEGER,
        lessMoreEqual: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                MeritInherent.belongsTo(models.Inherent);
                MeritInherent.belongsTo(models.Merit);
            }
        }
    });

    return MeritInherent;
};