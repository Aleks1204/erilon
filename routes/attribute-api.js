/**
 * Created by artemk on 1/23/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/attributes', function(req, res) {
    models.Attribute.create({
        name: req.body.name,
        action_level_bonus: req.body.action_level_bonus
    }).then(function(attribute) {
        res.send({ status: 'CREATED', attribute:attribute })
    });
});

router.get('/attributes', function(req, res) {
    models.Attribute.findAll().then(function(attributes) {
        return res.send({attributes:attributes});
    });
});

router.get('/attributes/:id', function(req, res) {
    models.Attribute.findById(req.params.id).then(function (attribute) {
        if(!attribute) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', attribute: attribute });
    });
});

router.put('/attributes/:id', function (req, res){
    models.Attribute.findById(req.params.id).then(function (attribute) {
        if(!attribute) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        attribute.name = req.body.name;
        attribute.action_level_bonus = req.body.action_level_bonus;
        return attribute.update({
            name: req.body.name,
            action_level_bonus: req.body.action_level_bonus
        }).then(function(attribute) {
            res.send({ status: 'UPDATED', attribute:attribute })
        });
    });
});

router.delete('/attributes/:id', function (req, res){
    models.Attribute.findById(req.params.id).then(function (attribute) {
        if(!attribute) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return attribute.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;