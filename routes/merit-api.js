/**
 * Created by artemk on 1/29/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/merits', function(req, res) {
    models.Merit.create({
        name: req.body.name,
        cost: req.body.cost,
        description: req.body.description,
        action_level_bonus: req.body.action_level_bonus
    }).then(function(merit) {
        res.send({ status: 'CREATED', merit:merit })
    });
});

router.get('/merits', function(req, res) {
    models.Merit.findAll().then(function(merits) {
        return res.send({merits:merits});
    });
});

router.get('/merits/:id', function(req, res) {
    models.Merit.findById(req.params.id).then(function (merit) {
        if(!merit) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', merit: merit });
    });
});

router.put('/merits/:id', function (req, res){
    models.Merit.findById(req.params.id).then(function (merit) {
        if(!merit) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        merit.name = req.body.name;
        merit.cost = req.body.cost;
        merit.description = req.body.description;
        merit.action_level_bonus = req.body.action_level_bonus;
        return merit.update({
            name: req.body.name,
            cost: req.body.cost,
            description: req.body.description,
            action_level_bonus: req.body.action_level_bonus
        }).then(function(merit) {
            res.send({ status: 'UPDATED', merit:merit })
        });
    });
});

router.delete('/merits/:id', function (req, res){
    models.Merit.findById(req.params.id).then(function (merit) {
        if(!merit) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return merit.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;