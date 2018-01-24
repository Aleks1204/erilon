/**
 * Created by artem-kalantay on 11.05.16.
 */

var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/room', function (req, res) {
    models.Room.create({
        PlayerId: req.body.player_id,
        name: req.body.name,
        description: req.body.description
    }).then(function (room) {
        res.send({status: 'CREATED', room: room})
    });
});

router.get('/rooms', function (req, res) {
    models.Room.findAll().then(function (rooms) {
        return res.send({rooms: rooms});
    });
});

router.get('/room/:id', function (req, res) {
    models.Room.findById(req.params.id).then(function (room) {
        if (!room) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', room: room});
    });
});

router.put('/room/:id', function (req, res) {
    models.Room.findById(req.params.id).then(function (room) {
        if (!room) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        room.name = req.body.name;
        room.description = req.body.description;
        return room.update({
            description: req.body.description,
            name: req.body.name
        }).then(function (room) {
            res.send({status: 'UPDATED', room: room})
        });
    });
});

router.put('/changeRoomOwner/:id', function (req, res) {
    models.Room.findById(req.params.id).then(function (room) {
        if (!room) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        room.PlayerId = req.body.player_id;
        return room.update({
            PlayerId: req.body.player_id
        }).then(function (room) {
            res.send({status: 'UPDATED', room: room})
        });
    });
});

router.delete('/room/:id', function (req, res) {
    models.Room.findById(req.params.id).then(function (room) {
        if (!room) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return room.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
