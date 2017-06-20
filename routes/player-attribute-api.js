var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/playerAttributes', function (req, res) {
    models.PlayerAttribute.findAll({
        include: [models.Attribute]
    }).then(function (playerAttributes) {
        return res.send({playerAttributes: playerAttributes});
    });
});

router.get('/playerAttributesByPlayerId/:id', function (req, res) {
    models.PlayerAttribute.findAll({
        where: {
            PlayerId: req.params.id
        },
        include: [models.Attribute]
    }).then(function (playerAttributes) {
        return res.send({playerAttributes: playerAttributes});
    });
});

router.post('/playerAttributes', function (req, res) {
    models.PlayerAttribute.create({
        PlayerId: req.body.player_id,
        AttributeId: req.body.attribute_id,
        position: req.body.position
    }).then(function (playerAttribute) {
        res.send({status: 'CREATED', playerAttribute: playerAttribute})
    });
});

router.delete('/playerAttributes/:id', function (req, res) {
    models.PlayerAttribute.findById(req.params.id).then(function (playerAttributes) {
        if (!playerAttributes) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return playerAttributes.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

router.put('/playerAttributes/:id', function (req, res) {
    models.PlayerAttribute.findById(req.params.id).then(function (playerAttribute) {
        if (!playerAttribute) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        playerAttribute.position = req.body.position;

        return playerAttribute.update({
            position: req.body.position
        }).then(function (playerAttribute) {
            res.send({status: 'UPDATED', playerAttribute: playerAttribute})
        });
    });
});

module.exports = router;