var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/races', function(req, res) {
        models.Race.create({
            name: req.body.name,
            max_age: req.body.max_age.toString()
        }).then(function(race) {
            res.send({ status: 'CREATED', race:race })
        });
});

router.get('/races', function(req, res) {
    models.Race.findAll().then(function(races) {
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        return res.send({races:races});
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
        return race.update({
            name: req.body.name,
            max_age: req.body.max_age
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