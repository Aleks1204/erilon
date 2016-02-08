/**
 * Created by artemk on 2/8/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/flaws', function(req, res) {
    models.Flaw.create({
        name: req.body.name,
        cost: req.body.cost,
        description: req.body.description,
        action_level_bonus: req.body.action_level_bonus
    }).then(function(flaw) {
        res.send({ status: 'CREATED', flaw:flaw })
    });
});

router.get('/flaws', function(req, res) {
    models.Flaw.findAll().then(function(flaws) {
        return res.send({flaws:flaws});
    });
});

router.get('/flaws/:id', function(req, res) {
    models.Flaw.findById(req.params.id).then(function (flaw) {
        if(!flaw) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', flaw: flaw });
    });
});

router.put('/flaws/:id', function (req, res){
    models.Flaw.findById(req.params.id).then(function (flaw) {
        if(!flaw) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        flaw.name = req.body.name;
        flaw.cost = req.body.cost;
        flaw.description = req.body.description;
        flaw.action_level_bonus = req.body.action_level_bonus;
        return flaw.update({
            name: req.body.name,
            cost: req.body.cost,
            description: req.body.description,
            action_level_bonus: req.body.action_level_bonus
        }).then(function(flaw) {
            res.send({ status: 'UPDATED', flaw:flaw })
        });
    });
});

router.delete('/flaws/:id', function (req, res){
    models.Flaw.findById(req.params.id).then(function (flaw) {
        if(!flaw) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return flaw.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
