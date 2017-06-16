var express = require('express');
var router = express.Router();
var fs = require('fs');

router.post('/uploadAvatar/:personage_id', function (req, res) {
    var file = req.body.file;
    var newPath = __dirname.replace("routes", "") + "public/uploadedImages/" + req.body.name;
    var data = file.substring(file.indexOf(',') + 1);
    var buf = new Buffer(data, 'base64');
    fs.writeFile(newPath, buf);
    return res.send({status:'DONE'});
});

module.exports = router;