/**
 * Created by artemk on 2/11/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/personageTriggerSkills', function(req, res) {
    models.PersonageTriggerSkill.findAll({
        include: [ models.TriggerSkill ]
    }).then(function(personageTriggerSkills) {
        return res.send({personageTriggerSkills:personageTriggerSkills});
    });
});

router.get('/personageTriggerSkillsByPersonageId/:id', function(req, res) {
    models.PersonageTriggerSkill.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [ models.TriggerSkill ]
    }).then(function(personageTriggerSkills) {
        return res.send({data:personageTriggerSkills});
    });
});

router.post('/personageTriggerSkills', function(req, res) {
    models.PersonageTriggerSkill.create({
        PersonageId: req.body.personage_id,
        TriggerSkillId: req.body.trigger_skill_id,
        currentLevel: req.body.currentLevel,
        talented: req.body.talented,
        tutored: req.body.tutored
    }).then(function(personageTriggerSkill) {
        res.send({ status: 'CREATED', personageTriggerSkill:personageTriggerSkill})
    });
});

router.delete('/personageTriggerSkills/:id', function (req, res){
    models.PersonageTriggerSkill.findById(req.params.id).then(function (personageTriggerSkills) {
        if(!personageTriggerSkills) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return personageTriggerSkills.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;