/**
 * Created by artemk on 3/14/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.get('/personageSpells', function(req, res) {
    models.PersonageSpell.findAll({
        include: [ models.Spell ]
    }).then(function(personageSpells) {
        return res.send({personageSpells:personageSpells});
    });
});

router.get('/personageSpellsByPersonageId/:id', function(req, res) {
    models.PersonageSpell.findAll({
        where: {
            PersonageId: req.params.id
        },
        include: [ models.Spell ]
    }).then(function(personageSpells) {
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        return res.send({personageSpells:personageSpells});
    });
});

router.get('/personageSpellsByPersonageIdCount/:id', function(req, res) {
    models.PersonageSpell.count({
        where: {
            PersonageId: req.params.id
        },
        include: [ models.Spell ]
    }).then(function(spellsAmount) {
        return res.send({spellsAmount: spellsAmount});
    });
});

router.post('/personageSpells', function(req, res) {
    models.PersonageSpell.create({
        PersonageId: req.body.personage_id,
        SpellId: req.body.spell_id,
        level: req.body.level,
        tutored: req.body.tutored
    }).then(function(personageSpell) {
        res.send({ status: 'CREATED', personageSpell:personageSpell})
    });
});

router.delete('/personageSpells/:id', function (req, res){
    models.PersonageSpell.findById(req.params.id).then(function (personageSpells) {
        if(!personageSpells) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return personageSpells.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
