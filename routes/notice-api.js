/**
 * Created by artem-kalantay on 04.08.16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/notices', function(req, res) {
    models.Notice.create({
        PersonageId: req.body.personage_id, 
        name: req.body.name,
        experience: req.body.experience,
        description: req.body.description
    }).then(function(notice) {
        res.send({ status: 'CREATED', notice:notice })
    });
});

router.get('/notices', function(req, res) {
    models.Notice.findAll().then(function(notices) {
        return res.send({notices:notices});
    });
});

router.get('/notices/:id', function(req, res) {
    models.Notice.findById(req.params.id).then(function (notice) {
        if(!notice) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', notice: notice });
    });
});

router.get('/noticesByPersonageId/:id', function (req, res) {
    models.Notice.findAll({
        where: {
            PersonageId: req.params.id
        }
    }).then(function (notices) {
        return res.send({data: notices});
    });
});

router.put('/notices/:id', function (req, res){
    models.Notice.findById(req.params.id).then(function (notice) {
        if(!notice) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        notice.name = req.body.name;
        notice.experience = req.body.experience;
        notice.description = req.body.description;
        return notice.update({
            name: req.body.name,
            experience: req.body.experience,
            description: req.body.description
        }).then(function(notice) {
            res.send({ status: 'UPDATED', notice:notice })
        });
    });
});

router.delete('/notices/:id', function (req, res){
    models.Notice.findById(req.params.id).then(function (notice) {
        if(!notice) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return notice.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});


module.exports = router;