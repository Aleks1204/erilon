/**
 * Created by artem-kalantay on 11.05.16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/roles', function(req, res) {
    models.Role.create({
        name: req.body.name
    }).then(function(Role) {
        res.send({ status: 'CREATED', Role:Role })
    });
});

router.get('/roles', function(req, res) {
    models.Role.findAll(
        {
            include: [
                {
                    model: models.RolePermission,
                    include: [models.Permission]
                }
            ]
        }
    ).then(function(roles) {
        return res.send({roles:roles});
    });
});

router.get('/roles/:id', function(req, res) {
    models.Role.findById(req.params.id).then(function (Role) {
        if(!Role) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', Role: Role });
    });
});

router.put('/roles/:id', function (req, res){
    models.Role.findById(req.params.id).then(function (Role) {
        if(!Role) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        Role.name = req.body.name;
        return Role.update({
            name: req.body.name
        }).then(function(Role) {
            res.send({ status: 'UPDATED', Role:Role })
        });
    });
});

router.delete('/roles/:id', function (req, res){
    models.Role.findById(req.params.id).then(function (Role) {
        if(!Role) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return Role.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;
