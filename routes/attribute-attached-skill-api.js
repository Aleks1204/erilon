/**
 * Created by artemk on 2/14/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/attachedSkillAttributes', function (req, res) {
    models.AttachedSkillAttribute.findAll({
        include: [
            models.AttachedSkill,
            models.Attribute
        ]
    }).then(function (attachedSkillAttributes) {
        return res.send({attachedSkillAttributes: attachedSkillAttributes});
    });
});

router.get('/attachedSkillAttributes/:id', function (req, res) {
    models.AttachedSkillAttribute.findById(req.params.id, {
        include: [
            models.AttachedSkill,
            models.Attribute
        ]
    }).then(function (attachedSkillAttribute) {
        if (!attachedSkillAttribute) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', attachedSkillAttribute: attachedSkillAttribute});
    });
});

router.put('/attachedSkillAttributes/:id', function (req, res) {
    models.AttachedSkillAttribute.findById(req.params.id).then(function (attachedSkillAttribute) {
        if (!attachedSkillAttribute) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        attachedSkillAttribute.description = req.body.description;
        return attachedSkillAttribute.update({
            description: req.body.description
        }).then(function (attribute) {
            res.send({status: 'UPDATED', attachedSkillAttribute: attachedSkillAttribute})
        });
    });
});

router.get('/attachedSkillAttributesByAttachedSKillId/:id', function (req, res) {
    models.AttachedSkillAttribute.findAll({
        where: {
            AttachedSkillId: req.params.id
        },
        include: [
            models.AttachedSkill,
            models.Attribute
        ]
    }).then(function (attachedSkillAttributes) {
        return res.send({data: attachedSkillAttributes});
    });
});

router.post('/attachedSkillAttributes', function (req, res) {
    models.AttachedSkillAttribute.create({
        AttributeId: req.body.attribute_id,
        AttachedSkillId: req.body.attached_skill_id,
        description: req.body.description
    }).then(function (attachedSkillAttribute) {
        res.send({status: 'CREATED', attachedSkillAttribute: attachedSkillAttribute})
    });
});

router.delete('/attachedSkillAttributes/:id', function (req, res) {
    models.AttachedSkillAttribute.findById(req.params.id).then(function (attachedSkillAttributes) {
        if (!attachedSkillAttributes) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return attachedSkillAttributes.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
