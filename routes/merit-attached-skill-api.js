/**
 * Created by artemk on 2/14/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/meritAttachedSkills', function(req, res) {
    models.MeritAttachedSkill.findAll({
        include: [
            models.AttachedSkill,
            models.Merit
        ]
    }).then(function(meritAttachedSkills) {
        return res.send({meritAttachedSkills:meritAttachedSkills});
    });
});

router.get('/meritAttachedSkillsByMeritId/:id', function(req, res) {
    models.MeritAttachedSkill.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            models.AttachedSkill,
            models.Merit
        ]
    }).then(function(meritAttachedSkills) {
        return res.send({meritAttachedSkills:meritAttachedSkills});
    });
});

router.post('/meritAttachedSkills', function(req, res) {
    models.MeritAttachedSkill.create({
        MeritId: req.body.merit_id,
        AttachedSkillId: req.body.attached_skill_id,
        value: req.body.value
    }).then(function(meritAttachedSkill) {
        res.send({ status: 'CREATED', meritAttachedSkill:meritAttachedSkill})
    });
});

router.delete('/meritAttachedSkills/:id', function (req, res){
    models.MeritAttachedSkill.findById(req.params.id).then(function (meritAttachedSkills) {
        if(!meritAttachedSkills) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return meritAttachedSkills.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
