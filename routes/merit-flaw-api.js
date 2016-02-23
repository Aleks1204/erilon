/**
 * Created by artemk on 2/23/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/meritFlaws', function (req, res) {
    models.MeritFlaw.findAll({
        include: [
            models.Flaw,
            models.Merit
        ]
    }).then(function (meritFlaws) {
        return res.send({meritFlaws: meritFlaws});
    });
});

router.get('/meritFlawsByMeritId/:id', function (req, res) {
    models.MeritFlaw.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            models.Flaw,
            models.Merit
        ]
    }).then(function (meritFlaws) {
        return res.send({meritFlaws: meritFlaws});
    });
});

router.post('/meritFlaws', function (req, res) {
    models.MeritFlaw.create({
        MeritId: req.body.merit_id,
        FlawId: req.body.flaw_id,
        presentAbsent: req.body.presentAbsent
    }).then(function (meritFlaw) {
        res.send({status: 'CREATED', meritFlaw: meritFlaw})
    });
});

router.delete('/meritFlaws/:id', function (req, res) {
    models.MeritFlaw.findById(req.params.id).then(function (meritFlaws) {
        if (!meritFlaws) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return meritFlaws.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;