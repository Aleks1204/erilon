/**
 * Created by shmublon on 7/30/15.
 */
"use strict";

var fs        = require("fs");
var path      = require("path");

if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize')
        , sequelize = null;

    if (process.env.DATABASE_URL) {
        // the application is executed on Heroku ... use the postgres database
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     match[4],
            host:     match[3],
            logging:  true //false
        })
    } else {
        // the application is executed on the local machine ... use mysql
        sequelize = new Sequelize("generatordb", "postgres", "postgres",
            {
                dialect: "postgres",
                port:    5432
            });
    }

    global.db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        Race:      sequelize.import(__dirname + '/race'),
        Personage:      sequelize.import(__dirname + '/personage')
        // add your other models here
    };

    fs.readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function(file) {
            var model = sequelize["import"](path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(function(modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });
}

module.exports = db;
