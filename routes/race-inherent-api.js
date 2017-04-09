/**
 * Created by artemk on 2/3/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/raceInherents', function(req, res) {
    models.RaceInherent.findAll({
        include: [ models.Inherent ]
    }).then(function(raceInherents) {
        return res.send({raceInherents:raceInherents});
    });
});

router.get('/raceInherentsByRaceId/:id', function(req, res) {
    models.RaceInherent.findAll({
        where: {
            RaceId: req.params.id
        },
        include: [ models.Inherent ]
    }).then(function(raceInherents) {
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        return res.send({raceInherents:raceInherents});
    });
});

router.post('/raceInherents', function(req, res) {
    models.RaceInherent.create({
        RaceId: req.body.race_id,
        InherentId: req.body.inherent_id,
        race_probability: req.body.race_probability
    }).then(function(raceInherent) {
        res.send({ status: 'CREATED', raceInherent:raceInherent})
    });
});

router.delete('/raceInherents/:id', function (req, res){
    models.RaceInherent.findById(req.params.id).then(function (raceInherents) {
        if(!raceInherents) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return raceInherents.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
