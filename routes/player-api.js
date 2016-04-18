/**
 * Created by artemk on 4/12/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/players', function (req, res) {
    models.Player.create({
        RoleId: req.body.role_id,
        name: req.body.name

    }).then(function (player) {
        res.send({status: 'CREATED', player: player})
    });
});

router.get('/players', function (req, res) {
    models.Player.findAll().then(function (players) {
        return res.send({players: players});
    });
});

router.get('/players/:id', function (req, res) {
    models.Player.findById(req.params.id, {
        include: [{
            model: models.Role,
            include: [{
                model: models.RolePermission,
                include: [models.Permission]
            }]
        }]
    }).
    then(function (player) {
        if (!player) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', player: player});
    });
});

router.get('/isPlayerExist/:name', function (req, res) {
    models.Player.findOne({
        where: {
            name: req.params.name
        }
    }).
    then(function (player) {
        if (!player) {
            return res.send({status: 'Not found'});
        }

        return res.send({status: 'OK', player: player});
    });
});

router.put('/players/:id', function (req, res) {
    models.Player.findById(req.params.id).then(function (player) {
        if (!player) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        player.name = req.body.name;
        return player.update({
            name: req.body.name
        }).then(function (player) {
            res.send({status: 'UPDATED', player: player})
        });
    });
});

router.delete('/players/:id', function (req, res) {
    models.Player.findById(req.params.id).then(function (player) {
        if (!player) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return player.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
