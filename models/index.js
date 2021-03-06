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
        // the application is executed on Heroku ...
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect:  'postgres',
            protocol: 'postgres',
            logging:  true
        })
    } else {
        // the application is executed on the local machine ...
        sequelize = new Sequelize("generatordb", "postgres", "postgres",
            {
                dialect: "postgres",
                port:    5433
            });
    }

    global.db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        Race:      sequelize.import(__dirname + '/race'),
        Personage:      sequelize.import(__dirname + '/personage'),
        Attribute:      sequelize.import(__dirname + '/attribute'),
        RaceAttribute:      sequelize.import(__dirname + '/RaceAttribute'),
        PersonageAttribute:      sequelize.import(__dirname + '/PersonageAttribute'),
        Merit:      sequelize.import(__dirname + '/Merit'),
        RaceMerit:      sequelize.import(__dirname + '/RaceMerit'),
        PersonageMerit:      sequelize.import(__dirname + '/PersonageMerit'),
        Inherent:      sequelize.import(__dirname + '/inherent'),
        PersonageInherent:      sequelize.import(__dirname + '/personageInherent'),
        RaceInherent:      sequelize.import(__dirname + '/raceInherent'),
        Flaw:      sequelize.import(__dirname + '/flaw'),
        RaceFlaw:      sequelize.import(__dirname + '/raceFlaw'),
        PersonageFlaw:      sequelize.import(__dirname + '/personageFlaw'),
        AttachedSkill:      sequelize.import(__dirname + '/attachedSkill'),
        PersonageAttachedSkill:      sequelize.import(__dirname + '/personageAttachedSkill'),
        PersonageTriggerSkill:      sequelize.import(__dirname + '/personageTriggerSkill'),
        TriggerSkill:      sequelize.import(__dirname + '/triggerSkill'),
        SkillLevel:      sequelize.import(__dirname + '/skillLevel'),
        History:      sequelize.import(__dirname + '/history'),
        MeritAttachedSkill:      sequelize.import(__dirname + '/meritAttachedSkill'),
        MeritAttribute:      sequelize.import(__dirname + '/meritAttribute'),
        MeritAttributeAttachedSkill:      sequelize.import(__dirname + '/meritAttributeAttachedSkill'),
        MeritTriggerSkill:      sequelize.import(__dirname + '/meritTriggerSkill'),
        MeritInherent:      sequelize.import(__dirname + '/meritInherent'),
        MeritFlaw:      sequelize.import(__dirname + '/meritFlaw'),
        MeritMerit:      sequelize.import(__dirname + '/meritMerit'),
        Spell:      sequelize.import(__dirname + '/spell'),
        PersonageSpell:      sequelize.import(__dirname + '/personageSpell'),
        Player:      sequelize.import(__dirname + '/player'),
        Permission:      sequelize.import(__dirname + '/Permission'),
        Role:      sequelize.import(__dirname + '/role'),
        RolePermission:      sequelize.import(__dirname + '/RolePermission'),
        Notice:      sequelize.import(__dirname + '/notice'),
        AttachedSkillAttribute: sequelize.import(__dirname + '/AttachedSkillAttribute'),
        Room: sequelize.import(__dirname + '/room')
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
