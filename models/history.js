/**
 * Created by artemk on 2/14/16.
 */
"use strict";

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("History", {
        key: DataTypes.STRING,
        value: DataTypes.STRING
    });
};