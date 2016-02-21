/**
 * Created by artemk on 2/21/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/meritTriggerSkills', function(req, res) {
    models.MeritTriggerSkill.findAll({
        include: [
            models.TriggerSkill,
            models.Merit
        ]
    }).then(function(meritTriggerSkills) {
        return res.send({meritTriggerSkills:meritTriggerSkills});
    });
});

router.get('/meritTriggerSkillsByMeritId/:id', function(req, res) {
    models.MeritTriggerSkill.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            models.TriggerSkill,
            models.Merit
        ]
    }).then(function(meritTriggerSkills) {
        return res.send({meritTriggerSkills:meritTriggerSkills});
    });
});

router.post('/meritTriggerSkills', function(req, res) {
    models.MeritTriggerSkill.create({
        MeritId: req.body.merit_id,
        TriggerSkillId: req.body.attached_skill_id,
        level: req.body.level
    }).then(function(meritTriggerSkill) {
        res.send({ status: 'CREATED', meritTriggerSkill:meritTriggerSkill})
    });
});

router.delete('/meritTriggerSkills/:id', function (req, res){
    models.MeritTriggerSkill.findById(req.params.id).then(function (meritTriggerSkills) {
        if(!meritTriggerSkills) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return meritTriggerSkills.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
