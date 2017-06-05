/**
 * Created by artemk on 3/9/16.
 */

var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/spells', function (req, res) {
    models.Spell.create({
        name: req.body.name,
        AttachedSkillId: req.body.attached_skill_id,
        additional_schools: req.body.additional_schools,
        complexity: req.body.complexity,
        creating_complexity: req.body.creating_complexity,
        mana: req.body.mana,
        instant: req.body.instant,
        mana_support: req.body.mana_support,
        mana_sup_time: req.body.mana_sup_time,
        cost: req.body.cost,
        effect: req.body.effect,
        description: req.body.description,
        SpellId: req.body.spell_id,
        modification_needed: req.body.modification_needed
    }).then(function (spell) {
        res.send({status: 'CREATED', spell: spell})
    });
});

router.get('/spells', function (req, res) {
    models.Spell.findAll({
        include: [
            models.Spell,
            {
                model: models.Spell,
                as: 'BaseSpell'
            }
        ]
    }).then(function (spells) {
        return res.send({spells: spells});
    });
});

router.get('/spellsBySchoolId/:id', function (req, res) {
    models.Spell.findAll({
        where: {
            AttachedSkillId: req.params.id
        },
        include: [
            models.Spell,
            {
                model: models.Spell,
                as: 'BaseSpell'
            }
        ]
    }).then(function (spells) {
        return res.send({data: spells});
    });
});

router.get('/spells/:id', function (req, res) {
    models.Spell.findById(req.params.id, {
        include: [
            models.Spell,
            {
                model: models.Spell,
                as: 'BaseSpell'
            }
        ]
    }).then(function (spell) {
        if (!spell) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', spell: spell});
    });
});

router.put('/spells/:id', function (req, res) {
    models.Spell.findById(req.params.id).then(function (spell) {
        if (!spell) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        spell.name = req.body.name;
        spell.additional_schools = req.body.additional_schools;
        spell.complexity = req.body.complexity;
        spell.creating_complexity = req.body.creating_complexity;
        spell.mana = req.body.mana;
        spell.instant = req.body.instant;
        spell.mana_support = req.body.mana_support;
        spell.mana_sup_time = req.body.mana_sup_time;
        spell.cost = req.body.cost;
        spell.effect = req.body.effect;
        spell.description = req.body.description;
        spell.SpellId = req.body.spell_id;
        spell.modification_needed = req.body.modification_needed;

        return spell.update({
            name: req.body.name,
            additional_schools: req.body.additional_schools,
            complexity: req.body.complexity,
            creating_complexity: req.body.creating_complexity,
            mana: req.body.mana,
            instant: req.body.instant,
            mana_support: req.body.mana_support,
            mana_sup_time: req.body.mana_sup_time,
            cost: req.body.cost,
            effect: req.body.effect,
            description: req.body.description,
            SpellId: req.body.spell_id,
            modification_needed: req.body.modification_needed
        }).then(function (spell) {
            res.send({status: 'UPDATED', spell: spell})
        });
    });
});

router.delete('/spells/:id', function (req, res) {
    models.Spell.findById(req.params.id).then(function (spell) {
        if (!spell) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return spell.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;