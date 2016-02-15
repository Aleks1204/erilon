/**
 * Created by artemk on 2/14/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/meritAttributes', function(req, res) {
    models.MeritAttribute.findAll({
        include: [
            models.Attribute,
            models.Merit
        ]
    }).then(function(meritAttributes) {
        return res.send({meritAttributes:meritAttributes});
    });
});

router.get('/meritAttributesByMeritId/:id', function(req, res) {
    models.MeritAttribute.findAll({
        where: {
            MeritId: req.params.id
        },
        include: [
            models.Attribute,
            models.Merit
        ]
    }).then(function(meritAttributes) {
        return res.send({meritAttributes:meritAttributes});
    });
});

router.post('/meritAttributes', function(req, res) {
    models.MeritAttribute.create({
        MeritId: req.body.merit_id,
        AttributeId: req.body.attribute_id,
        value: req.body.value
    }).then(function(personageFlaw) {
        res.send({ status: 'CREATED', personageFlaw:personageFlaw})
    });
});

router.delete('/meritAttributes/:id', function (req, res){
    models.MeritAttribute.findById(req.params.id).then(function (meritAttributes) {
        if(!meritAttributes) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return meritAttributes.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
