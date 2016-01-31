var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/raceAttributes', function(req, res) {
    models.RaceAttribute.findAll({
        include: [ models.Attribute ]
    }).then(function(raceAttributes) {
        return res.send({raceAttributes:raceAttributes});
    });
});

router.get('/raceAttributesByRaceId/:id', function(req, res) {
    models.RaceAttribute.findAll({
        where: {
            RaceId: req.params.id
        },
        include: [ models.Attribute ]
    }).then(function(raceAttributes) {
            return res.send({raceAttributes:raceAttributes});
        });
});

router.post('/raceAttributes', function(req, res) {
    models.RaceAttribute.create({
        RaceId: req.body.race_id,
        AttributeId: req.body.attribute_id,
        base_cost: req.body.base_cost.toString(),
        max_value: req.body.max_value.toString()
    }).then(function(raceAttribute) {
        res.send({ status: 'CREATED', raceAttribute:raceAttribute})
    });
});

router.delete('/raceAttributes/:id', function (req, res){
    models.RaceAttribute.findById(req.params.id).then(function (raceAttributes) {
        if(!raceAttributes) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return raceAttributes.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;