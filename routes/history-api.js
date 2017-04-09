/**
 * Created by artemk on 2/14/16.
 */

var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/history', function(req, res) {
    models.History.create({
        key: req.body.key,
        value: req.body.value
    }).then(function(history) {
        res.send({ status: 'CREATED', history:history })
    });
});

router.get('/byKey/:key', function(req, res) {
    models.History.findOne({
        where: {
            key: req.params.key
        },
        order: [['updatedAt', 'DESC']]
    }).then(function(result) {
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        return res.send({result:result});
    });
});

router.delete('/history/:id', function (req, res){
    models.History.findById(req.params.id).then(function (history) {
        if(!history) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return history.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;

