var express = require('express');
var router = express.Router();
var fs = require('fs');
var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'hjzqny4m9',
    api_key: '934772951151964',
    api_secret: 'SYTVrZ2QvK3f_zEVbejHzM2wVAk'
});

router.post('/uploadAvatar/:personage_id', function (req, res) {
    var file = req.body.file;
    var newPath = __dirname.replace("routes", "") + "public/uploadedImages/" + req.body.name;
    var data = file.substring(file.indexOf(',') + 1);
    var buf = new Buffer(data, 'base64');
    fs.writeFile(newPath, buf);
    var public_id = req.body.name.replace(".png", "");
    console.log('id: '+ public_id);
    cloudinary.uploader.upload(newPath.replace('[.]png', ''), function(result) {
        return res.send({status:'DONE'});
    }, { public_id:  public_id});
});

router.post('/uploadPlayerAvatar/:player_id', function (req, res) {
    var file = req.body.file;
    var newPath = __dirname.replace("routes", "") + "public/uploadedImages/" + req.body.name;
    var data = file.substring(file.indexOf(',') + 1);
    var buf = new Buffer(data, 'base64');
    fs.writeFile(newPath, buf);
    var public_id = req.body.name.replace(".png", "");
    console.log('id: '+ public_id);
    cloudinary.uploader.upload(newPath.replace('[.]png', ''), function(result) {
        return res.send({status:'DONE'});
    }, { public_id:  public_id});
});

module.exports = router;