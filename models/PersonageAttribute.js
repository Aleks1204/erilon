/**
 * Created by shmublon on 7/30/15.
 */

"use strict";

module.exports = function(sequelize, DataTypes) {
    var PersonageAttribute = sequelize.define("PersonageAttribute", {
        value: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                PersonageAttribute.belongsTo(models.Attribute);
                PersonageAttribute.belongsTo(models.Personage);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'perosnage_attribute_personage_id',
                method: 'BTREE',
                fields: ['PersonageId']
            }
        ]
    });

    return PersonageAttribute;
};
