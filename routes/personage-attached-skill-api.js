/**
 * Created by artemk on 2/9/16.
 */
/**
 * Created by artemk on 2/8/16.
 */

var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/personageAttachedSkills', function (req, res) {
    models.PersonageAttachedSkill.findAll({
        include: [
            {
                model: models.AttachedSkill,
                include: [models.Spell]
            }
        ]
    }).then(function (personageAttachedSkills) {
        return res.send({personageAttachedSkills: personageAttachedSkills});
    });
});

router.get('/personageAttachedSkillsByPersonageId/:id', function (req, res) {
    models.PersonageAttachedSkill.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [
            {
                model: models.AttachedSkill,
                include: [models.Spell]
            }
        ]
    }).then(function (personageAttachedSkills) {
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        return res.send({data: personageAttachedSkills});
    });
});

router.post('/personageAttachedSkills', function (req, res) {
    models.PersonageAttachedSkill.create({
        PersonageId: req.body.personage_id,
        AttachedSkillId: req.body.attachedSkill_id,
        value: req.body.value
    }).then(function (personageAttachedSkill) {
        res.send({status: 'CREATED', personageAttachedSkill: personageAttachedSkill})
    });
});

router.delete('/personageAttachedSkills/:id', function (req, res) {
    models.PersonageAttachedSkill.findById(req.params.id).then(function (personageAttachedSkills) {
        if (!personageAttachedSkills) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return personageAttachedSkills.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
