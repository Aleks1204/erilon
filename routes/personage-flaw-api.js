/**
 * Created by artemk on 2/8/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/personageFlaws', function(req, res) {
    models.PersonageFlaw.findAll({
        include: [ models.Flaw ]
    }).then(function(personageFlaws) {
        return res.send({personageFlaws:personageFlaws});
    });
});

router.get('/personageFlawsByPersonageId/:id', function(req, res) {
    models.PersonageFlaw.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [ models.Flaw ]
    }).then(function(personageFlaws) {
        return res.send({personageFlaws:personageFlaws});
    });
});

router.post('/personageFlaws', function(req, res) {
    models.PersonageFlaw.create({
        PersonageId: req.body.personage_id,
        FlawId: req.body.flaw_id,
        unremovable: req.body.unremovable
    }).then(function(personageFlaw) {
        res.send({ status: 'CREATED', personageFlaw:personageFlaw})
    });
});

router.delete('/personageFlaws/:id', function (req, res){
    models.PersonageFlaw.findById(req.params.id).then(function (personageFlaws) {
        if(!personageFlaws) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return personageFlaws.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
