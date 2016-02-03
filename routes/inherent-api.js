/**
 * Created by artemk on 2/2/16.
 */
/**
 * Created by artemk on 1/29/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/inherents', function(req, res) {
    models.Inherent.create({
        name: req.body.name,
        probability: req.body.probability,
        description: req.body.description,
        action_level_bonus: req.body.action_level_bonus
    }).then(function(inherent) {
        res.send({ status: 'CREATED', inherent:inherent })
    });
});

router.get('/inherents', function(req, res) {
    models.Inherent.findAll().then(function(inherents) {
        return res.send({inherents:inherents});
    });
});

router.get('/inherents/:id', function(req, res) {
    models.Inherent.findById(req.params.id).then(function (inherent) {
        if(!inherent) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', inherent: inherent });
    });
});

router.put('/inherents/:id', function (req, res){
    models.Inherent.findById(req.params.id).then(function (inherent) {
        if(!inherent) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        inherent.name = req.body.name;
        inherent.probability = req.body.probability;
        inherent.description = req.body.description;
        inherent.action_level_bonus = req.body.action_level_bonus;
        return inherent.update({
            name: req.body.name,
            cost: req.body.cost,
            description: req.body.description,
            action_level_bonus: req.body.action_level_bonus
        }).then(function(inherent) {
            res.send({ status: 'UPDATED', inherent:inherent })
        });
    });
});

router.delete('/inherents/:id', function (req, res){
    models.Inherent.findById(req.params.id).then(function (inherent) {
        if(!inherent) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return inherent.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;