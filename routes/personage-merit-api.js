/**
 * Created by artemk on 1/30/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/personageMerits', function (req, res) {
    models.PersonageMerit.findAll({
        include: [
            {
                model: models.Merit,
                include: [
                    {
                        model: models.MeritAttachedSkill,
                        include: [models.AttachedSkill]
                    }, {
                        model: models.MeritAttribute,
                        include: [models.Attribute]
                    }, {
                        model: models.MeritAttributeAttachedSkill,
                        include: [
                            models.AttachedSkill,
                            models.Attribute
                        ]
                    }, {
                        model: models.MeritTriggerSkill,
                        include: [models.TriggerSkill]
                    }, {
                        model: models.MeritInherent,
                        include: [models.Inherent]
                    }, {
                        model: models.MeritFlaw,
                        include: [models.Flaw]
                    }, {
                        model: models.MeritMerit,
                        include: [
                            {
                                model: models.Merit, as: 'MeritPrerequisite'
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(function (personageMerits) {
        return res.send({personageMerits: personageMerits});
    });
});

router.get('/personageMeritsByPersonageId/:id', function (req, res) {
    models.PersonageMerit.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [
            {
                model: models.Merit,
                include: [
                    {
                        model: models.MeritAttachedSkill,
                        include: [models.AttachedSkill]
                    }, {
                        model: models.MeritAttribute,
                        include: [models.Attribute]
                    }, {
                        model: models.MeritAttributeAttachedSkill,
                        include: [
                            models.AttachedSkill,
                            models.Attribute
                        ]
                    }, {
                        model: models.MeritTriggerSkill,
                        include: [models.TriggerSkill]
                    }, {
                        model: models.MeritInherent,
                        include: [models.Inherent]
                    }, {
                        model: models.MeritFlaw,
                        include: [models.Flaw]
                    }, {
                        model: models.MeritMerit,
                        include: [
                            {
                                model: models.Merit, as: 'MeritPrerequisite'
                            }
                        ]
                    }
                ]
            }
        ]
    }).then(function (personageMerits) {
        return res.send({personageMerits: personageMerits});
    });
});

router.post('/personageMerits', function (req, res) {
    models.PersonageMerit.create({
        PersonageId: req.body.personage_id,
        MeritId: req.body.merit_id,
        unremovable: req.body.unremovable
    }).then(function (personageMerit) {
        res.send({status: 'CREATED', personageMerit: personageMerit})
    });
});

router.delete('/personageMerits/:id', function (req, res) {
    models.PersonageMerit.findById(req.params.id).then(function (personageMerits) {
        if (!personageMerits) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return personageMerits.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;