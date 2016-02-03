/**
 * Created by artemk on 2/2/16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/personageInherents', function(req, res) {
    models.PersonageInherent.findAll({
        include: [ models.Inherent ]
    }).then(function(personageInherents) {
        return res.send({personageInherents:personageInherents});
    });
});

router.get('/personageInherentsByPersonageId/:id', function(req, res) {
    models.PersonageInherent.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [ models.Inherent ]
    }).then(function(personageInherents) {
        return res.send({personageInherents:personageInherents});
    });
});

router.post('/personageInherents', function(req, res) {
    models.PersonageInherent.create({
        PersonageId: req.body.personage_id,
        InherentId: req.body.inherent_id,
        value: req.body.value
    }).then(function(personageInherent) {
        res.send({ status: 'CREATED', personageInherent:personageInherent})
    });
});

router.delete('/personageInherents/:id', function (req, res){
    models.PersonageInherent.findById(req.params.id).then(function (personageInherents) {
        if(!personageInherents) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return personageInherents.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
