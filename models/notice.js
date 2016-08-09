"use strict";

module.exports = function(sequelize, DataTypes) {
    var Notice = sequelize.define("Notice", {
        name: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Notice.belongsTo(models.Personage);
            }
        },
        indexes: [
            // A BTREE index
            {
                name: 'notice_personage_id',
                method: 'BTREE',
                fields: ['PersonageId']
            }
        ]
    });

    return Notice;
};
