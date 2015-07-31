/**
 * Created by shmublon on 7/30/15.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/personages', function(req, res) {
    var Personage = models.Personage.create({
        RaceId: req.body.race_id,
        name: req.body.name,
        age: req.body.age,
        generated: req.body.generated,
        experience: req.body.experience

    }).then(function(personage) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send({ status: 'CREATED', personage:personage })
    });
});

router.get('/personages', function(req, res) {
    models.Personage.findAll({
        include: [ models.Race ]
    }).then(function(personages) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send({records:personages});
    });
});

router.get('/personages/:id', function(req, res) {
    models.Personage.findById(req.params.id, {include: [ models.Race ]}).
        then(function (personage) {
        if(!personage) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send({ status: 'OK', personage: personage });
    });
});

router.put('/personages/:id', function (req, res){
    models.Personage.findById(req.params.id).then(function (personage) {
        if(!personage) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        personage.name = req.body.name;
        personage.max_age = req.body.max_age;
        return personage.update({
            race_id: req.body.race_id,
            name: req.body.name,
            age: req.body.age,
            generated: req.body.generated,
            experience: req.body.experience
        }).then(function(personage) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send({ status: 'UPDATED', personage:personage })
        });
    });
});

router.delete('/personages/:id', function (req, res){
    models.Personage.findById(req.params.id).then(function (personage) {
        if(!personage) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return personage.destroy().then(function () {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;