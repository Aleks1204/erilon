/**
 * Created by artemk on 2/17/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/meritAttributeAttachedSkills', function (req, res) {
    models.MeritAttributeAttachedSkill.findAll({
        include: [
            models.Attribute,
            models.Merit
        ]
    }).then(function (meritAttributeAttachedSkills) {
        return res.send({meritAttributeAttachedSkills: meritAttributeAttachedSkills});
    });
});

router.get('/meritAttributeAttachedSkillsByMeritId/:id', function (req, res) {
    models.MeritAttributeAttachedSkill.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            models.Attribute,
            models.AttachedSkill,
            models.Merit
        ]
    }).then(function (meritAttributeAttachedSkills) {
        return res.send({meritAttributeAttachedSkills: meritAttributeAttachedSkills});
    });
});

router.post('/meritAttributeAttachedSkills', function (req, res) {
    models.MeritAttributeAttachedSkill.create({
        MeritId: req.body.merit_id,
        AttributeId: req.body.attribute_id,
        AttachedSkillId: req.body.attached_skill_id,
        value: req.body.value
    }).then(function (meritAttributeAttachedSkill) {
        res.send({status: 'CREATED', meritAttributeAttachedSkill: meritAttributeAttachedSkill})
    });
});

router.delete('/meritAttributeAttachedSkills/:id', function (req, res) {
    models.MeritAttributeAttachedSkill.findById(req.params.id).then(function (meritAttributeAttachedSkills) {
        if (!meritAttributeAttachedSkills) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return meritAttributeAttachedSkills.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
