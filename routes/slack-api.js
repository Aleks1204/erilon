var models = require('../models');
var express = require('express');
var router = express.Router();
var Roll = require('roll'),
    roll = new Roll();
var q = require('q');

var dodge = "Ловкость+Реакция";
var stab = "Ловкость+Скорость";
var slash = "Ловкость+Сила";
var range = "Ловкость+Восприятие";
var parryStab = "Реакция+Скорость";
var parrySlash = "Реакция+Сила";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

router.post('/slackRollAttributes', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 2) {
        modifier = parameters[2].trim();
    }
    rollAttributesForPersonage(parameters[0], parameters[1], modifier, res)
});

router.post('/slackRollDodge', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 1) {
        modifier = parameters[1].trim();
    }
    rollAttributesForPersonage(parameters[0], dodge, modifier, res)
});

router.post('/slackRollStab', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 1) {
        modifier = parameters[1].trim();
    }
    rollAttributesForPersonage(parameters[0], stab, modifier, res)
});

router.post('/slackRollSlash', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 1) {
        modifier = parameters[1].trim();
    }
    rollAttributesForPersonage(parameters[0], slash, modifier, res)
});

router.post('/slackRollParryStab', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 1) {
        modifier = parameters[1].trim();
    }
    rollAttributesForPersonage(parameters[0], parryStab, modifier, res)
});

router.post('/slackRollParrySlash', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 1) {
        modifier = parameters[1].trim();
    }
    rollAttributesForPersonage(parameters[0], parrySlash, modifier, res)
});

router.post('/slackRollRange', function (req, res) {
    var parameters = req.body.text.split(',');
    var modifier = null;
    if (parameters.length > 1) {
        modifier = parameters[1].trim();
    }
    rollAttributesForPersonage(parameters[0], range, modifier, res)
});
router.post('/slackHelp', function (req, res) {
    return res.send({
        "response_type": "in_channel",
        "text": "/rollattribute - Бросок одного или нескольких атрибутов, формат /rollattribute Имя перса, атрибут1+атрибут2+..., модификатор(не обязательно)" +
        "\n/dodge - Уклонение, формат: /dodge имя перса, модификатор(не обязательно)" +
        "\n/stab - Колющий удар, формат: /stab имя перса, модификатор(не обязательно)" +
        "\n/slash - Рубящий удар, формат: /slash имя перса, модификатор(не обязательно)" +
        "\n/range - Выстрел (дальнобойная атака), формат: /range имя перса, модификатор(не обязательно)" +
        "\n/parryslash - Парирование рубящего удара, формат: /parryslash имя перса, модификатор(не обязательно)" +
        "\n/parrystab - Парирование колющего удара удара, формат: /parrystab имя перса, модификатор(не обязательно)"
    });
});

function rollAttributesForPersonage(personageName, attributesNames, modifier, res) {
    personageName = capitalizeFirstLetter(personageName.trim());
    attributesNames = capitalizeFirstLetter(attributesNames.trim());
    var getValues = q.defer();
    models.Personage.findOne({
        where: {
            name: {
                $like: '%' + personageName + '%'
            }
        }
    }).then(function (personage) {
        if (attributesNames.includes('+')) {
            diceAmountFewAttributes(attributesNames, personage, getValues, modifier)
        } else {
            diceAmountSingleAttribute(attributesNames, personage, getValues, modifier)
        }

        return getValues.promise.then(function (result) {
            rollDice(result[0], result[1], res)
        });
    });
}

function diceAmountSingleAttribute(attributeName, personage, getValues, modifier) {
    var modifierText = '';
    models.Attribute.findOne({
        where: {
            name: {
                $like: '%' + attributeName + '%'
            }
        }
    }).then(function (attribute) {
        models.PersonageAttribute.findOne({
            where: {
                PersonageId: personage.id,
                AttributeId: attribute.id
            }
        }).then(function (personageAttribute) {
            var diceAmount = addModifier(personageAttribute.value, modifier);
            if (modifier != null) {
                modifierText = ' с модификатором `' + modifier + '` итого ' + diceAmount + ' кубиков';
            }
            var text = "Персонаж '" + personage.name + "' бросает атрибут '" + attribute.name + "' значение которого '" + personageAttribute.value + "'" + modifierText;
            getValues.resolve([diceAmount, text]);
        });
    });
}

function diceAmountFewAttributes(attributesNames, personage, getValues, modifier) {
    var modifierText = '';
    var attributesNamesArray = attributesNames.split('+');
    var attributesText = '';
    var attributePromises = attributesNamesArray.map(function (attributeName) {
        attributeName = capitalizeFirstLetter(attributeName);
        return models.Attribute.findOne({
            where: {
                name: {
                    $like: '%' + attributeName + '%'
                }
            }
        }).then(function (attribute) {
            attributesText = attributesText + '+' + attribute.name;
            return models.PersonageAttribute.findOne({
                where: {
                    PersonageId: personage.id,
                    AttributeId: attribute.id
                }
            })
        })
    });


    q.all(attributePromises).then(function (personageAttributes) {
        var attributesSum = 0;
        personageAttributes.forEach(function (personageAttribute) {
            attributesSum = attributesSum + personageAttribute.value;
        });
        var diceAmount = addModifier(attributesSum, modifier);
        if (modifier != null) {
            modifierText = ' с модификатором `' + modifier + '` итого ' + diceAmount + ' кубиков';
        }
        var text = "Персонаж '" + personage.name + "' бросает сумму атрибутов '" + attributesText.substring(1) + "' значение которой '" + attributesSum + "'" + modifierText;
        getValues.resolve([diceAmount, text]);
    });
}

function addModifier(startValue, modifier) {
    var finalValue = startValue;
    if (modifier != null) {
        if (modifier.charAt(0) === '+') {
            finalValue = finalValue + parseInt(modifier.slice(1));
        } else if (modifier.charAt(0) === '-') {
            finalValue = finalValue - parseInt(modifier.slice(1));
        } else if (modifier.charAt(0) === '*') {
            finalValue = finalValue * parseInt(modifier.slice(1));
        }
    }
    return finalValue;
}

function rollDice(quantity, preText, response) {
    var dice = roll.roll({
        quantity: quantity,
        sides: 6,
        transformations: ['sum']
    });
    return response.send({
        "response_type": "in_channel",
        "text": preText + " с результатом: *" + dice.result + "*. На кубиках *" + dice.rolled + "*"
    });
}

module.exports = router;