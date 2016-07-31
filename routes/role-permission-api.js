/**
 * Created by artem-kalantay on 12.05.16.
 */
var models  = require('../models');
var express = require('express');
var router  = express.Router();
var log = require('../log')(module);

router.post('/rolePermissions', function(req, res) {
    models.RolePermission.create({
        RoleId: req.body.role_id,
        PermissionId: req.body.permission_id
    }).then(function(rolePermission) {
        res.send({ status: 'CREATED', rolePermission:rolePermission })
    });
});

router.get('/rolePermissions', function(req, res) {
    models.RolePermission.findAll().then(function(rolePermissions) {
        return res.send({rolePermissions:rolePermissions});
    });
});

router.get('/rolePermissions/:roleId/:permissionId', function (req, res) {
    models.RolePermission.findOne({
        where: {
            RoleId: req.params.roleId,
            PermissionId: req.params.permissionId
        }
    }).then(function (rolePermission) {
        return res.send({rolePermission: rolePermission});
    });
});

router.get('/rolePermissions/:id', function(req, res) {
    models.RolePermission.findById(req.params.id).then(function (rolePermission) {
        if(!rolePermission) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return res.send({ status: 'OK', rolePermission: rolePermission });
    });
});

router.delete('/rolePermissions/:id', function (req, res){
    models.RolePermission.findById(req.params.id).then(function (rolePermission) {
        if(!rolePermission) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }

        return rolePermission.destroy().then(function () {
            return res.send({ status: 'REMOVED' });
        });
    });
});

module.exports = router;