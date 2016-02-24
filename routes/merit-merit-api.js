/**
 * Created by artemk on 2/24/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/meritMerits', function (req, res) {
    models.MeritMerit.findAll({
        include: [
            {
                model: models.Merit, as: 'MeritPrerequisite'
            }
        ]
    }).then(function (meritMerits) {
        return res.send({meritMerits: meritMerits});
    });
});

router.get('/meritMeritsByMeritId/:id', function (req, res) {
    models.MeritMerit.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            {
                model: models.Merit, as: 'MeritPrerequisite'
            }
        ]
    }).then(function (meritMerits) {
        return res.send({meritMerits: meritMerits});
    });
});

router.post('/meritMerits', function (req, res) {
    models.MeritMerit.create({
        MeritId: req.body.merit_id,
        PrerequisiteMeritId: req.body.prerequisite_merit_id,
        presentAbsent: req.body.presentAbsent
    }).then(function (meritMerit) {
        res.send({status: 'CREATED', meritMerit: meritMerit})
    });
});

router.delete('/meritMerits/:id', function (req, res) {
    models.MeritMerit.findById(req.params.id).then(function (meritMerits) {
        if (!meritMerits) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return meritMerits.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;