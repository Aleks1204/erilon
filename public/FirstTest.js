var request = require('request')
    , vows = require('vows')
    , assert = require('assert');

var methodNotAllowed = 'The request method is not allowed for this resource.';
var bodyDosntMatch = 'Request body doesn\'t match input schema.';
var invalidEmail = 'Not a valid email address.';
var missingRequiredField = 'Missing data for required field.';
var BASE_URL = "https://staging.figo.me"
    , HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic Q2xtQUlLSUdQOGlZMk9lblZuck1NYzFiUmEtbzc2Z0VuUUxYWXpRY1F5bjA6U2hDOFRHRk0yeFp4M1FrNEI2Y09GNHRHcEUzckZwSTd3WHVmc1QzakZ1OFE='
};

function assertStatus(code) {
    return function (e, res) {
        assert.equal(res.statusCode, code);
    };
}

function assertErrorCode(errorCode) {
    return function (e, res) {
        assert.equal(JSON.parse(res.body).error.code, errorCode);
    };
}

function assertIsNotEmpty() {
    return function (e, res) {
        assert.isNotEmpty(JSON.parse(res.body));
    };
}

vows.describe('First test')
    .addBatch({
        "Get version": {
            topic: function () {
                request({
                    uri: BASE_URL + "/version"
                    , method: "GET"
                    , headers: HEADERS
                }, this.callback);
            }
            , "should respond with 200": assertStatus(200)
            , "should have a version '3.1.2'": function (err, res, body) {
                assert.equal(JSON.parse(res.body).product_version, '3.1.2')
            }
        }
    }).addBatch({
    "Create user successful POST": {
        topic: function () {
            request({
                uri: BASE_URL + "/auth/user"
                , body: JSON.stringify({
                    "email": Math.random() + "@figo.example.com",
                    "language": "en",
                    "name": "John Doe",
                    "password": "demo1234"
                })
                , method: "POST"
                , headers: HEADERS
            }, this.callback);
        }
        , "should respond with 200": assertStatus(200)
        , "body should not be empty": assertIsNotEmpty()
        , "recovery password should be String": function (err, res, body) {
            assert.isString(JSON.parse(res.body).recovery_password)
        }
        , "recovery password should not be empty": function (err, res, body) {
            assert.isNotEmpty(JSON.parse(res.body).recovery_password)
        }
    },
    "Create user GET not allowed": {
        topic: function () {
            request({
                uri: BASE_URL + "/auth/user"
                , body: JSON.stringify({
                    "email": Math.random() + "@figo.example.com",
                    "language": "en",
                    "name": "John Doe",
                    "password": "demo1234"
                })
                , method: "GET"
                , headers: HEADERS
            }, this.callback);
        }
        , "should respond with 405": assertStatus(405)
        , "error code should be 405": assertErrorCode(1000)
        , "error description should be 'Method Not Allowed'": function (err, res, body) {
            // console.log(res.body);
            assert.equal(JSON.parse(res.body).error.description, methodNotAllowed)
        }
    },
    "Create user POST empty body": {
        topic: function () {
            request({
                uri: BASE_URL + "/auth/user"
                , body: JSON.stringify({})
                , method: "POST"
                , headers: HEADERS
            }, this.callback);
        }
        , "should respond with 405": assertStatus(400)
        , "error code should be 30004": assertErrorCode(1000)
        , "error description should be 'Request body doesn't match input schema.'": function (err, res, body) {
            assert.equal(JSON.parse(res.body).error.description, bodyDosntMatch)
        }
        , "missing password message check": function (err, res, body) {
            assert.equal(JSON.parse(res.body).error.data.password[0], missingRequiredField)
        }
        , "missing email message check": function (err, res, body) {
            assert.equal(JSON.parse(res.body).error.data.email[0], missingRequiredField)
        }
        , "missing name message check": function (err, res, body) {
            assert.equal(JSON.parse(res.body).error.data.name[0], missingRequiredField)
        }
    }
}).run();