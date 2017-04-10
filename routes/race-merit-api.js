/**
 * Created by artemk on 1/29/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/raceMerits', function(req, res) {
    models.RaceMerit.findAll({
        include: [ models.Merit ]
    }).then(function(raceMerits) {
        return res.send({raceMerits:raceMerits});
    });
});

router.get('/raceMeritsByRaceId/:id', function(req, res) {
    models.RaceMerit.findAll({
        where: {
            RaceId: req.params.id
        },
        include: [ models.Merit ]
    }).then(function(raceMerits) {

        return res.send({raceMerits:raceMerits});
    });
});

router.post('/raceMerits', function(req, res) {
    models.RaceMerit.create({
        RaceId: req.body.race_id,
        MeritId: req.body.merit_id,
        race_cost: req.body.race_cost,
        race_default: req.body.race_default.toString()
    }).then(function(raceMerit) {
        res.send({ status: 'CREATED', raceMerit:raceMerit})
    });
});

router.delete('/raceMerits/:id', function (req, res){
    models.RaceMerit.findById(req.params.id).then(function (raceMerits) {
        if(!raceMerits) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return raceMerits.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;