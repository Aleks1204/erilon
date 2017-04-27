var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/races', function(req, res) {
        models.Race.create({
            name: req.body.name,
            max_age: req.body.max_age.toString(),
            description: req.body.description
        }).then(function(race) {
            res.send({ status: 'CREATED', race:race })
        });
});

router.get('/races', function(req, res) {
    models.Race.findAll().then(function(races) {
        return res.send({data:races});
    });
});

router.get('/racesWithRelations', function(req, res) {
    models.Race.findAll({
        include: [
            {
                model: models.RaceAttribute,
                include: [models.Attribute]
            },
            {
                model: models.RaceFlaw,
                include: [models.Flaw]
            },
            {
                model: models.RaceMerit,
                include: [models.Merit]
            },
            {
                model: models.RaceInherent,
                include: [models.Inherent]
            }
        ]
    }).then(function(races) {
        return res.send({data:races});
    });
});

router.get('/races/:id', function(req, res) {
    models.Race.findById(req.params.id).then(function (race) {
        if(!race) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', race: race });
    });
});

router.put('/races/:id', function (req, res){
    models.Race.findById(req.params.id).then(function (race) {
        if(!race) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        race.name = req.body.name;
        race.max_age = req.body.max_age;
        race.description = req.body.description;
        return race.update({
            name: req.body.name,
            max_age: req.body.max_age,
            description: req.body.description
        }).then(function(race) {
            res.send({ status: 'UPDATED', race:race })
        });
    });
});

router.delete('/races/:id', function (req, res){
    models.Race.findById(req.params.id).then(function (race) {
        if(!race) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return race.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});


module.exports = router;