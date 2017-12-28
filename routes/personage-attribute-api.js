var models = require('../models');
var express = require('express');
var router = express.Router();
var Roll = require('roll'),
    roll = new Roll();

router.get('/personageAttributes', function (req, res) {
    models.PersonageAttribute.findAll({
        include: [models.Attribute]
    }).then(function (personageAttributes) {
        return res.send({personageAttributes: personageAttributes});
    });
});

router.get('/personageAttributesByPersonageId/:id', function (req, res) {
    models.PersonageAttribute.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [models.Attribute]
    }).then(function (personageAttributes) {
        return res.send({personageAttributes: personageAttributes});
    });
});

router.post('/personageAttributes', function (req, res) {
    models.PersonageAttribute.create({
        PersonageId: req.body.personage_id,
        AttributeId: req.body.attribute_id,
        value: req.body.value,
        position: req.body.position
    }).then(function (personageAttribute) {
        res.send({status: 'CREATED', personageAttribute: personageAttribute})
    });
});

router.post('/slackPersonageAttributeValue', function (req, res) {
    var parameters = req.body.text.split(' ');
    var personageName = parameters[0];
    var attributeName = parameters[1];
    models.Personage.findOne({
        where: {
            name: personageName
        }
    }).then(function (personage) {
        models.Attribute.findOne({
            where: {
                name: attributeName
            }
        }).then(function (attribute) {
            models.PersonageAttribute.findOne({
                where: {
                    PersonageId: personage.id,
                    AttributeId: attribute.id
                }
            }).then(function (personageAttribute) {
                var yahtzee = roll.roll(personageAttribute.value + 'd6');
                return res.send({
                    "response_type": "in_channel",
                    "text": "Результат: " + yahtzee.result + ". На кубиках " + yahtzee.rolled
                });
            });
        });
    });
});

router.delete('/personageAttributes/:id', function (req, res) {
    models.PersonageAttribute.findById(req.params.id).then(function (personageAttributes) {
        if (!personageAttributes) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return personageAttributes.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

router.put('/personageAttributes/:id', function (req, res) {
    models.PersonageAttribute.findById(req.params.id).then(function (personageAttribute) {
        if (!personageAttribute) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        personageAttribute.value = req.body.value;

        return personageAttribute.update({
            value: req.body.value
        }).then(function (personageAttribute) {
            res.send({status: 'UPDATED', personageAttribute: personageAttribute})
        });
    });
});

module.exports = router;