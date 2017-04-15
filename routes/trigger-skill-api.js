/**
 * Created by artemk on 2/10/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/triggerSkills', function(req, res) {
    models.TriggerSkill.create({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        cost: req.body.cost,
        difficult: req.body.difficult
    }).then(function(triggerSkill) {
        res.send({ status: 'CREATED', triggerSkill:triggerSkill })
    });
});

router.get('/triggerSkills', function(req, res) {
    models.TriggerSkill.findAll({
        include: [models.SkillLevel]
    }).then(function(triggerSkills) {
        return res.send({data:triggerSkills});
    });
});

router.get('/triggerSkills/:id', function(req, res) {
    models.TriggerSkill.findById(req.params.id, {
        include: [models.SkillLevel]
    }).then(function (triggerSkill) {
        if(!triggerSkill) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', triggerSkill: triggerSkill });
    });
});

router.put('/triggerSkills/:id', function (req, res){
    models.TriggerSkill.findById(req.params.id).then(function (triggerSkill) {
        if(!triggerSkill) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        triggerSkill.name = req.body.name;
        triggerSkill.cost = req.body.cost;
        triggerSkill.description = req.body.description;
        triggerSkill.category = req.body.category;
        triggerSkill.difficult = req.body.difficult;

        return triggerSkill.update({
            name: req.body.name,
            cost: req.body.cost,
            description: req.body.description,
            category: req.body.category,
            difficult: req.body.difficult
        }).then(function(triggerSkill) {
            res.send({ status: 'UPDATED', triggerSkill:triggerSkill })
        });
    });
});

router.delete('/triggerSkills/:id', function (req, res){
    models.TriggerSkill.findById(req.params.id).then(function (triggerSkill) {
        if(!triggerSkill) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return triggerSkill.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
