/**
 * Created by artemk on 2/22/16.
 */
var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.get('/meritInherents', function (req, res) {
    models.MeritInherent.findAll({
        include: [
            models.Inherent,
            models.Merit
        ]
    }).then(function (meritInherents) {
        return res.send({meritInherents: meritInherents});
    });
});

router.get('/meritInherentsByMeritId/:id', function (req, res) {
    models.MeritInherent.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            models.Inherent,
            models.Merit
        ]
    }).then(function (meritInherents) {
        return res.send({meritInherents: meritInherents});
    });
});

router.post('/meritInherents', function (req, res) {
    models.MeritInherent.create({
        MeritId: req.body.merit_id,
        InherentId: req.body.inherent_id,
        value: req.body.value,
        lessMoreEqual: req.body.lessMoreEqual
    }).then(function (meritInherent) {
        res.send({status: 'CREATED', meritInherent: meritInherent})
    });
});

router.delete('/meritInherents/:id', function (req, res) {
    models.MeritInherent.findById(req.params.id).then(function (meritInherents) {
        if (!meritInherents) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return meritInherents.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;