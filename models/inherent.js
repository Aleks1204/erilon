/**
 * Created by artemk on 2/2/16.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var Inherent = sequelize.define("Inherent", {
        name: DataTypes.STRING,
        probability: DataTypes.INTEGER,
        min_limit: DataTypes.INTEGER,
        max_limit: DataTypes.INTEGER,
        description: DataTypes.STRING,
        action_level_bonus: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Inherent.hasMany(models.PersonageInherent);
                Inherent.hasMany(models.RaceInherent);
                Inherent.hasMany(models.MeritInherent);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'personage_search_inherents',
                method: 'BTREE',
                fields: ['name', 'probability', 'min_limit', 'max_limit', 'action_level_bonus']
            }
        ]
    });

    return Inherent;
};
