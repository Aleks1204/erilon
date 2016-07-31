var models = require('../models');
var express = require('express');
var router = express.Router();
var log = require('../log')(module);

router.post('/permissions', function (req, res) {
    models.Permission.create({
        name: req.body.name
    }).then(function (permission) {
        res.send({status: 'CREATED', Permission: permission})
    });
});

router.get('/permissions', function (req, res) {
    models.Permission.findAll().then(function (permissions) {
        return res.send({permissions: permissions});
    });
});

router.get('/permissions/:id', function (req, res) {
    models.Permission.findById(req.params.id).then(function (permission) {
        if (!permission) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send({status: 'OK', permission: permission});
    });
});

router.put('/permissions/:id', function (req, res) {
    models.Permission.findById(req.params.id).then(function (permission) {
        if (!permission) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        permission.name = req.body.name;
        return permission.update({
            name: req.body.name
        }).then(function (permission) {
            res.send({status: 'UPDATED', permission: permission})
        });
    });
});

router.delete('/permissions/:id', function (req, res) {
    models.Permission.findById(req.params.id).then(function (permission) {
        if (!permission) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return permission.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
