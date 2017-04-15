/**
 * Created by artemk on 2/9/16.
 */

var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/attachedSkills', function (req, res) {
    models.AttachedSkill.create({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        difficult: req.body.difficult,
        theoretical: req.body.theoretical,
        default_skill: req.body.default_skill,
        spells_connected: req.body.spells_connected
    }).then(function (attachedSkill) {
        res.send({status: 'CREATED', attachedSkill: attachedSkill})
    });
});

router.get('/attachedSkills', function (req, res) {
    models.AttachedSkill.findAll({
        include: [
            models.Spell
        ]
    }).then(function (attachedSkills) {
        return res.send({data: attachedSkills});
    });
});

router.get('/attachedSkills/:id', function (req, res) {
    models.AttachedSkill.findById(req.params.id, {
        include: [
            models.Spell
        ]
    }).then(function (attachedSkill) {
        if (!attachedSkill) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', attachedSkill: attachedSkill});
    });
});

router.put('/attachedSkills/:id', function (req, res) {
    models.AttachedSkill.findById(req.params.id).then(function (attachedSkill) {
        if (!attachedSkill) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        attachedSkill.name = req.body.name;
        attachedSkill.category = req.body.category;
        attachedSkill.description = req.body.description;
        attachedSkill.difficult = req.body.difficult;
        attachedSkill.theoretical = req.body.theoretical;
        attachedSkill.default_skill = req.body.default_skill;
        attachedSkill.spells_connected = req.body.spells_connected;
        return attachedSkill.update({
            name: req.body.name,
            category: req.body.category,
            difficult: req.body.difficult,
            description: req.body.description,
            theoretical: req.body.theoretical,
            default_skill: req.body.default_skill,
            spells_connected: req.body.spells_connected
        }).then(function (attachedSkill) {
            res.send({status: 'UPDATED', attachedSkill: attachedSkill})
        });
    });
});

router.delete('/attachedSkills/:id', function (req, res) {
    models.AttachedSkill.findById(req.params.id).then(function (attachedSkill) {
        if (!attachedSkill) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return attachedSkill.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;