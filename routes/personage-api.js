/**
 * Created by shmublon on 7/30/15.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/personages', function (req, res) {
    models.Personage.create({
        RaceId: req.body.race_id,
        PlayerId: req.body.player_id,
        name: req.body.name,
        age: req.body.age,
        max_age: req.body.max_age,
        generated: req.body.generated,
        experience: req.body.experience
    }).then(function (personage) {
        res.send({status: 'CREATED', personage: personage})
    });
});

router.get('/personages', function (req, res) {
    models.Personage.findAll({
        include: [
            models.Race,
            models.Player
        ],
        where: {
            deleted: false
        }
    }).then(function (personages) {
        return res.send({personages: personages});
    });
});

router.get('/personagesByPlayerId/:id', function (req, res) {
    models.Personage.findAll({
        where: {
            PlayerId: req.params.id,
            deleted: false
        },
        include: [
            models.Race,
            models.Player
        ]
    }).then(function (personages) {
        return res.send({personages: personages});
    });
});

router.get('/personagesByRoomId/:id', function (req, res) {
    models.Personage.findAll({
        where: {
            RoomId: req.params.id,
            deleted: false
        },
        include: [
            models.Race,
            models.Player
        ]
    }).then(function (personages) {
        return res.send({personages: personages});
    });
});

router.get('/personages/:id', function (req, res) {
    models.Personage.findById(req.params.id, {
        include: [
            models.Race,
            {
                model: models.PersonageAttribute,
                include: [models.Attribute]
            }
        ],
        where: {
            deleted: false
        }
    }).then(function (personage) {
        if (!personage) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', personage: personage});
    });
});

router.put('/personages/:id', function (req, res) {
    models.Personage.findById(req.params.id).then(function (personage) {
        if (!personage) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        personage.name = req.body.name;
        personage.max_age = req.body.max_age;
        return personage.update({
            race_id: req.body.race_id,
            name: req.body.name,
            age: req.body.age,
            max_age: req.body.max_age,
            generated: req.body.generated,
            experience: req.body.experience,
            avatar: req.body.avatar
        }).then(function (personage) {
            res.send({status: 'UPDATED', personage: personage})
        });
    });
});

router.put('/setPersonageRoom/:id', function (req, res) {
    models.Personage.findById(req.params.id).then(function (personage) {
        if (!personage) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        personage.RoomId = req.body.room_id;
        return personage.update({
            RoomId: req.body.room_id
        }).then(function (personage) {
            res.send({status: 'UPDATED', personage: personage})
        });
    });
});

router.delete('/personages/:id', function (req, res) {
    models.Personage.findById(req.params.id).then(function (personage) {
        if (!personage) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return personage.update({
            deleted: true
        }).then(function () {
            res.send({status: 'REMOVED'})
        });
    });
});

module.exports = router;