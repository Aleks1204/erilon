/**
 * Created by artemk on 2/8/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/raceFlaws', function(req, res) {
    models.RaceFlaw.findAll({
        include: [ models.Flaw ]
    }).then(function(raceFlaws) {
        return res.send({raceFlaws:raceFlaws});
    });
});

router.get('/raceFlawsByRaceId/:id', function(req, res) {
    models.RaceFlaw.findAll({
        where: {
            RaceId: req.params.id
        },
        include: [ models.Flaw ]
    }).then(function(raceFlaws) {
        return res.send({raceFlaws:raceFlaws});
    });
});

router.post('/raceFlaws', function(req, res) {
    models.RaceFlaw.create({
        RaceId: req.body.race_id,
        FlawId: req.body.flaw_id
    }).then(function(raceFlaw) {
        res.send({ status: 'CREATED', raceFlaw:raceFlaw})
    });
});

router.delete('/raceFlaws/:id', function (req, res){
    models.RaceFlaw.findById(req.params.id).then(function (raceFlaws) {
        if(!raceFlaws) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return raceFlaws.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;