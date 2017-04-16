/**
 * Created by artemk on 2/10/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/skillLevels', function(req, res) {
    models.SkillLevel.findAll().then(function(skillLevels) {
        return res.send({skillLevels:skillLevels});
    });
});

router.post('/skillLevels', function(req, res) {
    models.SkillLevel.create({
        TriggerSkillId: req.body.TriggerSkillId,
        cost: req.body.cost,
        level: req.body.level,
        description: req.body.description
    }).then(function(skillLevel) {
        res.send({ status: 'CREATED', skillLevel:skillLevel})
    });
});

router.get('/skillLevelsByTriggerSkillId/:id', function(req, res) {
    models.SkillLevel.findAll({
        where: {
            TriggerSkillId: req.params.id
        }
    }).then(function(skillLevels) {
        return res.send({data:skillLevels});
    });
});

router.delete('/skillLevels/:id', function (req, res){
    models.SkillLevel.findById(req.params.id).then(function (skillLevels) {
        if(!skillLevels) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return skillLevels.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
