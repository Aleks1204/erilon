/**
 * Created by artemk on 3/24/16.
 */

//"use strict";

(function (i) {
    var e = /iPhone/i, n = /iPod/i, o = /iPad/i, t = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, r = /Android/i, d = /BlackBerry/i, s = /Opera Mini/i, a = /IEMobile/i, b = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, h = RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"), c = function (i, e) {
        return i.test(e)
    }, l = function (i) {
        var l = i || navigator.userAgent;
        this.apple = {
            phone: c(e, l),
            ipod: c(n, l),
            tablet: c(o, l),
            device: c(e, l) || c(n, l) || c(o, l)
        }, this.android = {
            phone: c(t, l),
            tablet: !c(t, l) && c(r, l),
            device: c(t, l) || c(r, l)
        }, this.other = {
            blackberry: c(d, l),
            opera: c(s, l),
            windows: c(a, l),
            firefox: c(b, l),
            device: c(d, l) || c(s, l) || c(a, l) || c(b, l)
        }, this.seven_inch = c(h, l), this.any = this.apple.device || this.android.device || this.other.device || this.seven_inch
    }, v = i.isMobile = new l;
    v.Class = l
})(window);

var personageId = /id=(\d+)/.exec(window.location.href)[1];
// var app = angular.module("personageApp", ['ngStorage', 'ui.bootstrap', 'ngMaterial']);
var app = angular.module("personageApp", ['ngStorage', 'ui.bootstrap']);

app.controller("personageController", function ($scope, $http, $q, $timeout, $window, $sce, $mdDialog) {
    $scope.loader = true;
    $scope.isMobile = isMobile.android.phone;
    $scope.meritAvailable = true;
    $scope.showGenerateIneherentsButton = true;

    $scope.personageMerits = null;
    $scope.personageInherents = null;
    $scope.personageFlaws = null;
    $scope.personageTriggerSkills = null;
    $scope.personageAttachedSkills = null;
    $scope.personageSpells = null;
    $scope.confirmChanges = true;

    $window.onbeforeunload = function () {
        if (window.location.href.indexOf('localhost') == -1) {
            return "go away!";
        }
    };

    var merits = $q.defer();
    var inherents = $q.defer();
    var flaws = $q.defer();
    var attachedSkills = $q.defer();
    var triggerSkills = $q.defer();
    var personage = $q.defer();
    var raceAttributes = $q.defer();
    var personageMerits = $q.defer();
    var raceInherents = $q.defer();

    function success(data) {
        $scope.hasInherents();
        $scope.recalculateBasicCharacteristics();
        $scope.loader = false;
    }

    var all = $q.all([merits.promise, inherents.promise, flaws.promise, attachedSkills.promise,
        triggerSkills.promise, personage.promise, raceAttributes.promise, raceInherents.promise]);

    all.then(success);

    $http.get('/merits').success(function (results) {
        $scope.merits = results.merits;
        merits.resolve();
    });

    $http.get('/inherents').success(function (results) {
        $scope.inherents = results.inherents;
        inherents.resolve();
    });

    $http.get('/flaws').success(function (results) {
        $scope.flaws = results.flaws;
        flaws.resolve();
    });

    $http.get('/attachedSkills').success(function (results) {
        $scope.attachedSkills = results.attachedSkills;
        attachedSkills.resolve();
    });

    $http.get('/triggerSkills').success(function (results) {
        $scope.triggerSkills = results.triggerSkills;
        triggerSkills.resolve();
    });

    $http.get('/personages/' + personageId).success(function (data) {
        $scope.personage = data.personage;
        $scope.age = data.personage.age;
        if (data.personage.max_age != 0) {
            $scope.max_age = data.personage.max_age;
        } else {
            $scope.max_age = data.personage.Race.max_age;
        }
        $http.get('/raceAttributesByRaceId/' + data.personage.RaceId).success(function (data) {
            $scope.raceAttributes = data.raceAttributes;
            raceAttributes.resolve();
        });
        $http.get('/raceInherentsByRaceId/' + data.personage.RaceId).success(function (data) {
            $scope.raceInherents = data.raceInherents;
            raceInherents.resolve();
        });
        $scope.experienceValid = function () {
            return $scope.personage.experience < 0;
        };
        $scope.personageAttributes = data.personage.PersonageAttributes;
        $scope.personageInherents = data.personage.PersonageInherents;
        $scope.personageFlaws = data.personage.PersonageFlaws;
        $scope.personageTriggerSkills = data.personage.PersonageTriggerSkills;
        $scope.notices = data.personage.Notices;
        $scope.playerId = data.personage.PlayerId;
        personage.resolve();
    });

    $scope.randomizeInherentsAndValues = function () {
        $scope.loader = true;
        randomizeInherents();
        $scope.loader = true;
    };

    function randomizeInherents() {
        var promises = [];
        angular.forEach($scope.inherents, function (inherent) {
            var probability = inherent.probability;

            angular.forEach($scope.raceInherents, function (raceInherent) {
                if (raceInherent.Inherent.id == inherent.id) {
                    probability = raceInherent.race_probability;
                }
            });

            var random = Math.floor((Math.random() * probability) + 1);
            if (random == probability) {
                promises.push($scope.addPersonageInherent(inherent.id));
            }
        });

        $q.all(promises).then(function () {
            $scope.loader = true;
            randomizeInherentValues();
            setHasInherents();
            $scope.savePersonage();
        });
    }

    function randomizeInherentValues() {
        angular.forEach($scope.personageInherents, function (personageInherent) {
            if (personageInherent.Inherent.name == 'Внешность') {
                var random = Math.floor((Math.random() * 9) + 1);
                switch (random) {
                    case 1:
                        personageInherent.value = -3;
                        break;
                    case 2:
                        personageInherent.value = -2;
                        break;
                    case 3:
                        personageInherent.value = -1;
                        break;
                    case 4:
                        personageInherent.value = 0;
                        break;
                    case 5:
                        personageInherent.value = 0;
                        break;
                    case 6:
                        personageInherent.value = 0;
                        break;
                    case 7:
                        personageInherent.value = 1;
                        break;
                    case 8:
                        personageInherent.value = 2;
                        break;
                    case 9:
                        personageInherent.value = 3;
                        break;
                }
            }
            if (personageInherent.Inherent.name == 'Маг' || personageInherent.Inherent.name == 'Везение') {
                personageInherent.value = Math.floor((Math.random() * 6) + 1);
            }
        });
    }

    function setHasInherents() {
        $http.post('/history', {
            key: 'HAS_INHERENTS' + personageId,
            value: 'TRUE'
        }).success($scope.hasInherents);
    }

    $scope.hasInherents = function () {
        $http.get('/byKey/' + 'HAS_INHERENTS' + personageId).success(function (result) {
            if (result.result != null) {
                if (result.result.value == 'TRUE') {
                    $scope.showGenerateIneherentsButton = false;
                }
            }
        });
    };

    $scope.recalculateBasicCharacteristics = function () {
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            switch (personageAttribute.Attribute.name) {
                case "Сила":
                    $scope.power = personageAttribute.value;
                    break;
                case "Ловкость":
                    $scope.dexterity = personageAttribute.value;
                    break;
                case "Скорость":
                    $scope.speed = personageAttribute.value;
                    break;
                case "Реакция":
                    $scope.reaction = personageAttribute.value;
                    break;
                case "Восприятие":
                    $scope.perception = personageAttribute.value;
                    break;
                case "Выносливость":
                    $scope.endurance = personageAttribute.value;
                    break;
                case "Живучесть":
                    $scope.vitality = personageAttribute.value;
                    break;
                case "Мудрость":
                    $scope.wisdom = personageAttribute.value;
                    break;
                case "Интеллект":
                    $scope.intelligence = personageAttribute.value;
                    break;
                case "Воля":
                    $scope.will = personageAttribute.value;
                    break;
                case "Харизма":
                    $scope.charisma = personageAttribute.value;
                    break;
            }
        });

        $scope.hitPiercePunch = $scope.dexterity + $scope.speed;
        $scope.hitChopPunch = $scope.dexterity + $scope.power;
        $scope.rangedHit = $scope.dexterity + $scope.perception;
        $scope.parryPiercePunch = $scope.reaction + $scope.speed;
        $scope.parryChopPunch = $scope.power + $scope.reaction;
        $scope.dodge = $scope.dexterity + $scope.reaction;
        if ($scope.speed < $scope.intelligence) {
            $scope.generalActionPoints = $scope.speed;
        } else {
            $scope.generalActionPoints = $scope.intelligence;
        }
        $scope.mentalActionPoints = $scope.intelligence;
        $scope.initiative = $scope.reaction;
        $scope.endurancePoints = $scope.endurance * 20;

    };

    $scope.recalculateMagicSchools = function () {
        $scope.schools = [];
        angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
            if (personageAttachedSkill.AttachedSkill.spells_connected) {
                $scope.schools.push(personageAttachedSkill.AttachedSkill);
            }
        });
    };

    $scope.showSpellDetail = function (spell_id) {
        $scope.loader = true;
        $scope.spellDetails = {
            spell: null,
            personageSpell: null
        };
        $http.get('/spells/' + spell_id).success(function (result) {
            $scope.spellDetails.spell = result.spell;
            angular.forEach($scope.personageSpells, function (personageSpell) {
                if (personageSpell.Spell.id == spell_id) {
                    $scope.spellDetails.personageSpell = personageSpell;
                }
            });
            $scope.loader = false;
            jQuery('#spellDetails').modal('show');
        });
    };

    $scope.hitPiercePunchDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на бросок попадания колющим/режущим ударом. Равно ловкости+скорости персонажа</p>');
    $scope.hitChopPunchDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на бросок попадания рубящим ударом. Равно ловкости+силе персонажа</p>');
    $scope.rangedHitDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на бросок попадания при стрельбе из луков, арбалетов и использовании метательного оружия. Равно ловкости+восприятию персонажа</p>');
    $scope.parryPiercePunchDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на парирование колющих/режущих ударов. Равно скорости+реакции персонажа</p>');
    $scope.parryChopPunchDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на парирование рубящего удара. Равно силе+реакции персонажа</p>');
    $scope.dodgeDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на уклонение от атак. Равно ловкости+реакции персонажа</p>');
    $scope.generalActionPointsDescription = $sce.trustAsHtml('<p style="font-size: large">Количество физических действий, совершаемых в раунд (удары, парирование, уклонение). Равно меньшему значению из скорости и интеллекта персонажа</p>');
    $scope.mentalActionPointsDescription = $sce.trustAsHtml('<p style="font-size: large">Количество ментальных действий, совершаемых в раунд (активация способностей). Равно интеллекту персонажа</p>');
    $scope.endurancePointsDescription = $sce.trustAsHtml('<p style="font-size: large">Количество очков выносливости персонажа. Тратится на активацию заклинаний и способностей, бег и любые действия. Равно выносливости персонажа, умноженной на 20</p>');
    $scope.initiativeDescription = $sce.trustAsHtml('<p style="font-size: large">Количество кубиков на определение очередности хода в раунде. Равно реакции персонажа</p>');

    $scope.isSpellAdded = function (id) {
        var spellAdded = false;
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (personageSpell.Spell.id == id) {
                spellAdded = true;
            }
        });
        return spellAdded;
    };

    $scope.isSpellAddedAndLevel0 = function (id) {
        var isSpellAddedAndLevel0 = false;
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (personageSpell.Spell.id == id && personageSpell.level == 0) {
                isSpellAddedAndLevel0 = true;
            }
        });
        return isSpellAddedAndLevel0;
    };

    $scope.addPersonageSpell = function (id) {
        $scope.loader = true;
        $http.get('/spells/' + id).success(function (result) {
            $scope.personageSpells.push({
                Spell: result.spell,
                SpellId: id,
                PersonageId: personageId,
                level: 0,
                tutored: false
            });
            $scope.personage.experience = $scope.personage.experience - result.spell.cost;
            $scope.loader = false;
        });
    };

    $scope.deletePersonageSpell = function (id) {
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (personageSpell.Spell.id == id) {
                var index = $scope.personageSpells.indexOf(personageSpell);
                $scope.personageSpells.splice(index, 1);
                $scope.personage.experience = $scope.personage.experience + personageSpell.Spell.cost;
            }
        });
    };

    $scope.increaseSpellLevel = function (personageSpell) {
        $scope.loader = true;

        var increaseLevel = $q.defer();

        function success(data) {
            $scope.loader = false;
        }

        var all = $q.all([increaseLevel.promise]);
        all.then(success);

        var cost;
        if (personageSpell.level < 5) {
            if (personageSpell.tutored) {
                cost = personageSpell.Spell.cost;
                personageSpell.tutored = false;
            } else {
                cost = personageSpell.Spell.cost * 2;
            }

            personageSpell.level++;
            $scope.personage.experience = $scope.personage.experience - cost;
            $http.post('/history', {
                key: 'SPELL_LEVEL' + personageSpell.level.toString() + 'UP',
                value: cost.toString()
            }).success(function () {
                increaseLevel.resolve();
            });
        } else {
            increaseLevel.resolve();
        }
    };

    $scope.decreaseSpellLevel = function (personageSpell) {

        $scope.loader = true;

        var decreaseLevel = $q.defer();

        function success(data) {
            $scope.loader = false;
        }

        var all = $q.all([decreaseLevel.promise]);
        all.then(success);

        if (personageSpell.level > 0) {
            $http.get('/byKey/' + 'SPELL_LEVEL' + personageSpell.level.toString() + 'UP').success(function (result) {
                $scope.personage.experience = $scope.personage.experience + parseInt(result.result.value);
                personageSpell.level--;
            }).success(function () {
                decreaseLevel.resolve();
            });
        } else {
            decreaseLevel.resolve();
        }
    };

    $scope.increaseAttachedSkill = function (id) {
        $scope.loader = true;
        var isPrimaryAttributeSet = false;
        var isSecondaryAttributeSet = 0;
        var wisdomDoubleValue = $scope.wisdom * 2;

        angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
            if (personageAttachedSkill.value > 3) {
                isSecondaryAttributeSet++;
            }
            if (personageAttachedSkill.value > 4) {
                isPrimaryAttributeSet = true;
            }
        });


        angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
            if (personageAttachedSkill.AttachedSkill.id == id) {
                if (personageAttachedSkill.value < 5) {
                    if (personageAttachedSkill.value < 3) {
                        if (!personageAttachedSkill.AttachedSkill.theoretical) {
                            personageAttachedSkill.value++;
                            if (personageAttachedSkill.AttachedSkill.difficult) {
                                $scope.personage.experience = $scope.personage.experience - 2;
                            } else {
                                $scope.personage.experience = $scope.personage.experience - 1;
                            }
                        } else {
                            if (personageAttachedSkill.value < wisdomDoubleValue) {
                                personageAttachedSkill.value++;
                                if (personageAttachedSkill.AttachedSkill.difficult) {
                                    $scope.personage.experience = $scope.personage.experience - 2;
                                } else {
                                    $scope.personage.experience = $scope.personage.experience - 1;
                                }
                            }
                        }
                    } else {
                        if (personageAttachedSkill.value == 4) {
                            if (!isPrimaryAttributeSet) {
                                if (!personageAttachedSkill.AttachedSkill.theoretical) {
                                    personageAttachedSkill.value++;
                                    if (personageAttachedSkill.AttachedSkill.difficult) {
                                        $scope.personage.experience = $scope.personage.experience - 2;
                                    } else {
                                        $scope.personage.experience = $scope.personage.experience - 1;
                                    }
                                } else {
                                    if (personageAttachedSkill.value < wisdomDoubleValue) {
                                        personageAttachedSkill.value++;
                                        if (personageAttachedSkill.AttachedSkill.difficult) {
                                            $scope.personage.experience = $scope.personage.experience - 2;
                                        } else {
                                            $scope.personage.experience = $scope.personage.experience - 1;
                                        }
                                    }
                                }
                            }
                        } else {
                            if (isSecondaryAttributeSet < 3) {
                                if (!personageAttachedSkill.AttachedSkill.theoretical) {
                                    personageAttachedSkill.value++;
                                    if (personageAttachedSkill.AttachedSkill.difficult) {
                                        $scope.personage.experience = $scope.personage.experience - 2;
                                    } else {
                                        $scope.personage.experience = $scope.personage.experience - 1;
                                    }
                                } else {
                                    if (personageAttachedSkill.value < wisdomDoubleValue) {
                                        personageAttachedSkill.value++;
                                        if (personageAttachedSkill.AttachedSkill.difficult) {
                                            $scope.personage.experience = $scope.personage.experience - 2;
                                        } else {
                                            $scope.personage.experience = $scope.personage.experience - 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        $scope.loader = false;
    };

    $scope.increaseTriggerSkillLevel = function (id) {
        $scope.loader = true;

        var increaseLevel = $q.defer();

        function success(data) {
            $scope.loader = false;
        }

        var all = $q.all([increaseLevel.promise]);
        all.then(success);

        angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
            if (personageTriggerSkill.TriggerSkill.id == id) {
                var nextLevel = personageTriggerSkill.currentLevel + 1;
                $http.get('/skillLevelsByTriggerSkillId/' + id).success(function (results) {
                    if (results.skillLevels.length == 0) {
                        increaseLevel.resolve();
                    }
                    angular.forEach(results.skillLevels, function (skillLevel) {
                        if (skillLevel.level == nextLevel) {
                            var cost = skillLevel.cost;
                            personageTriggerSkill.currentLevel++;
                            if (personageTriggerSkill.talented) {
                                cost = Math.ceil(cost / 1.5);
                            }
                            if (!personageTriggerSkill.tutored) {
                                cost = cost * 2;
                            } else {
                                personageTriggerSkill.tutored = false;
                            }
                            $scope.personage.experience = $scope.personage.experience - cost;
                            $http.post('/history', {
                                key: 'TRIGGER_LEVEL' + skillLevel.level.toString() + 'UP',
                                value: cost.toString()
                            }).success(function () {
                                increaseLevel.resolve();
                            });
                        } else {
                            increaseLevel.resolve();
                        }
                    });
                });
            }
        });
    };

    $scope.decreaseAttachedSkill = function (id) {

        $scope.loader = true;

        var decrease = $q.defer();

        var all = $q.all([decrease.promise]);
        all.then(success);

        function success(data) {
            $scope.loader = false;
        }

        angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {

            if (personageAttachedSkill.AttachedSkill.id == id && personageAttachedSkill.value > 0) {
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    angular.forEach(personageMerit.Merit.MeritAttachedSkills, function (meritAttachedSkill) {
                        if (personageAttachedSkill.AttachedSkill.id == meritAttachedSkill.AttachedSkill.id) {
                            if (personageAttachedSkill.value <= meritAttachedSkill.value) {
                                $scope.showConfirmDeletePersonagMerit(personageMerit);
                            }
                        }
                    });

                    angular.forEach(personageMerit.Merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                        if (personageAttachedSkill.AttachedSkill.id == meritAttributeAttachedSkill.AttachedSkill.id) {
                            angular.forEach($scope.personageAttributes, function (personageAttribute) {
                                if (personageAttribute.Attribute.id == meritAttributeAttachedSkill.Attribute.id) {
                                    if (personageAttachedSkill.value + personageAttribute.value <= meritAttributeAttachedSkill.value) {
                                        $scope.showConfirmDeletePersonagMerit(personageMerit);
                                    }
                                }
                            });
                        }
                    });
                });

                if ($scope.confirmChanges) {
                    personageAttachedSkill.value--;
                    if (personageAttachedSkill.AttachedSkill.difficult) {
                        $scope.personage.experience = $scope.personage.experience + 2;
                    } else {
                        $scope.personage.experience = $scope.personage.experience + 1;
                    }
                }
            }
        });
        decrease.resolve();
    };

    $scope.showConfirmDeletePersonagMerit = function(personageMerit) {
        var confirm = $mdDialog.confirm()
            .title('Подтверждение удаления достоинства')
            .textContent('Данное изменение приведет к удалению достоинства ' + personageMerit.Merit.name + ' так как достоиснтво иммет пререквизиты')
            .ok('Удалить и изменить')
            .cancel('Оставить');
        $mdDialog.show(confirm).then(function() {
            $scope.deletePersonageMerit(personageMerit);
        }, function() {
            $scope.confirmChanges = false;
        });
    };

    $scope.decreaseTriggerSkillLevel = function (id) {
        $scope.loader = true;

        var decreaseLevel = $q.defer();

        var all = $q.all([decreaseLevel.promise]);
        all.then(success);

        function success(data) {
            $scope.loader = false;
        }


        angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
            if (personageTriggerSkill.TriggerSkill.id == id) {

                var previousLevel = personageTriggerSkill.currentLevel - 1;
                var currentLevel = personageTriggerSkill.currentLevel;

                angular.forEach($scope.personageMerits, function (personageMerit) {
                    angular.forEach(personageMerit.Merit.MeritTriggerSkills, function (meritTriggerSkill) {
                        if (personageTriggerSkill.TriggerSkill.id == meritTriggerSkill.TriggerSkill.id) {
                            if (currentLevel != 0) {
                                if (meritTriggerSkill.level == currentLevel) {
                                    $scope.deletePersonageMerit(personageMerit);
                                }
                            }

                        }
                    });
                });

                $http.get('/skillLevelsByTriggerSkillId/' + id).success(function (results) {
                    if (previousLevel == 0) {
                        personageTriggerSkill.currentLevel--;
                    }
                    angular.forEach(results.skillLevels, function (skillLevel) {
                        if (skillLevel.level == previousLevel) {
                            personageTriggerSkill.currentLevel--;
                        }
                        if (skillLevel.level == currentLevel) {
                            $http.get('/byKey/' + 'TRIGGER_LEVEL' + skillLevel.level.toString() + 'UP').success(function (result) {
                                $scope.personage.experience = $scope.personage.experience + parseInt(result.result.value);
                            });
                        }
                    });
                    decreaseLevel.resolve();
                });
            }
        });
    };

    $scope.validatePrerequisites = function (merit) {
        $scope.loader = true;
        $scope.meritAvailable = true;
        var meritObject = angular.fromJson(merit);

        var attributeSatisfiedPromise = $q.defer();
        var attachedSkillSatisfiedPromise = $q.defer();
        var attributeAttachedSkillSatisfiedPromise = $q.defer();
        var triggerSkillSatisfiedPromise = $q.defer();
        var inherentSatisfiedPromise = $q.defer();
        var flawSatisfiedPromise = $q.defer();
        var meritSatisfiedPromise = $q.defer();
        var attachedSkillExistPromise = $q.defer();
        var attributeAttachedSkillExistPromise = $q.defer();
        var triggerSkillExistPromise = $q.defer();
        var inherentExistPromise = $q.defer();
        var validatePrerequisites = $q.defer();

        function success(data) {
            $scope.loader = false;
            angular.forEach(data, function (result) {
                if (!result) {
                    $scope.meritAvailable = false;
                }
            });
            validatePrerequisites.resolve({meritAvailable: $scope.meritAvailable});
        }

        var all = $q.all([attributeSatisfiedPromise.promise,
            attachedSkillSatisfiedPromise.promise, attachedSkillExistPromise.promise,
            attributeAttachedSkillSatisfiedPromise.promise, attributeAttachedSkillExistPromise.promise,
            triggerSkillSatisfiedPromise.promise, triggerSkillExistPromise.promise,
            inherentSatisfiedPromise.promise, inherentExistPromise.promise,
            flawSatisfiedPromise.promise,
            meritSatisfiedPromise.promise]);
        all.then(success);


        $http.get('/meritAttributesByMeritId/' + meritObject.id).success(function (results) {
            var attributeSatisfied = true;
            angular.forEach(results.meritAttributes, function (meritAttribute) {
                angular.forEach($scope.personageAttributes, function (personageAttribute) {
                    if (meritAttribute.AttributeId == personageAttribute.AttributeId) {
                        if (personageAttribute.value < meritAttribute.value) {
                            attributeSatisfied = false;
                        }
                    }
                });
            });
            attributeSatisfiedPromise.resolve(attributeSatisfied);
        });

        $http.get('/meritAttachedSkillsByMeritId/' + meritObject.id).success(function (results) {
            var attachedSkillExist = false;
            var attachedSkillSatisfied = true;
            if (results.meritAttachedSkills.length == 0) {
                attachedSkillExist = true;
            }
            angular.forEach(results.meritAttachedSkills, function (meritAttachedSkill) {
                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    if (meritAttachedSkill.AttachedSkillId == personageAttachedSkill.AttachedSkillId) {
                        attachedSkillExist = true;
                        if (personageAttachedSkill.value < meritAttachedSkill.value) {
                            attachedSkillSatisfied = false;
                        }
                    }
                });
            });
            attachedSkillExistPromise.resolve(attachedSkillExist);
            attachedSkillSatisfiedPromise.resolve(attachedSkillSatisfied);
        });


        $http.get('/meritAttributeAttachedSkillsByMeritId/' + meritObject.id).success(function (results) {
            var attributeAttachedSkillSatisfied = true;
            var attributeAttachedSkillExist = false;
            if (results.meritAttributeAttachedSkills.length == 0) {
                attributeAttachedSkillExist = true;
            }
            angular.forEach(results.meritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    if (meritAttributeAttachedSkill.AttachedSkillId == personageAttachedSkill.AttachedSkillId) {
                        attributeAttachedSkillExist = true;
                        angular.forEach($scope.personageAttributes, function (personageAttribute) {
                            if (meritAttributeAttachedSkill.AttributeId == personageAttribute.AttributeId) {
                                if (personageAttachedSkill.value + personageAttribute.value < meritAttributeAttachedSkill.value) {
                                    attributeAttachedSkillSatisfied = false;
                                }
                            }
                        });
                    }
                });
            });
            attributeAttachedSkillSatisfiedPromise.resolve(attributeAttachedSkillSatisfied);
            attributeAttachedSkillExistPromise.resolve(attributeAttachedSkillExist);
        });


        $http.get('/meritTriggerSkillsByMeritId/' + meritObject.id).success(function (results) {
            var triggerSkillSatisfied = true;
            var triggerSkillExist = false;
            if (results.meritTriggerSkills.length == 0) {
                triggerSkillExist = true;
            }
            angular.forEach(results.meritTriggerSkills, function (meritTriggerSkill) {
                angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                    if (meritTriggerSkill.TriggerSkillId == personageTriggerSkill.TriggerSkillId) {
                        triggerSkillExist = true;
                        if (personageTriggerSkill.currentLevel < meritTriggerSkill.level) {
                            triggerSkillSatisfied = false;
                        }
                    }
                });
            });
            triggerSkillSatisfiedPromise.resolve(triggerSkillSatisfied);
            triggerSkillExistPromise.resolve(triggerSkillExist);
        });


        $http.get('/meritInherentsByMeritId/' + meritObject.id).success(function (results) {
            var inherentSatisfied = true;
            var inherentExist = false;
            if (results.meritInherents.length == 0) {
                inherentExist = true;
            }
            angular.forEach(results.meritInherents, function (meritInherent) {
                angular.forEach($scope.personageInherents, function (personageInherent) {
                    if (meritInherent.InherentId == personageInherent.InherentId) {
                        inherentExist = true;
                        if (meritInherent.Inherent.min_limit != null && meritInherent.Inherent.max_limit != null) {
                            if (personageInherent.value == null) {
                                inherentSatisfied = false;
                            } else {
                                switch (meritInherent.lessMoreEqual) {
                                    case 1:
                                        if (personageInherent.value < meritInherent.value) {
                                            inherentSatisfied = false;
                                        }
                                        break;
                                    case 0:
                                        if (personageInherent.value != meritInherent.value) {
                                            inherentSatisfied = false;
                                        }
                                        break;
                                    case -1:
                                        if (personageInherent.value > meritInherent.value) {
                                            inherentSatisfied = false;
                                        }
                                        break;
                                }
                            }
                        }
                    }
                });
            });
            inherentSatisfiedPromise.resolve(inherentSatisfied);
            inherentExistPromise.resolve(inherentExist);
        });


        $http.get('/meritFlawsByMeritId/' + meritObject.id).success(function (results) {
            var flawSatisfied = true;
            var personageHasFlaw = false;

            angular.forEach(results.meritFlaws, function (meritFlaw) {
                personageHasFlaw = false;
                angular.forEach($scope.personageFlaws, function (personageFlaw) {
                    if (meritFlaw.FlawId == personageFlaw.FlawId) {
                        personageHasFlaw = true;
                    }
                });
                if (meritFlaw.presentAbsent) {
                    if (!personageHasFlaw) {
                        flawSatisfied = false;
                    }
                }
                if (!meritFlaw.presentAbsent) {
                    if (personageHasFlaw) {
                        flawSatisfied = false;
                    }
                }
            });
            flawSatisfiedPromise.resolve(flawSatisfied);
        });


        $http.get('/meritMeritsByMeritId/' + meritObject.id).success(function (results) {
            var meritSatisfied = true;
            var personageHasMerit = false;

            angular.forEach(results.meritMerits, function (meritMerit) {
                personageHasMerit = false;
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    if (meritMerit.PrerequisiteMeritId == personageMerit.MeritId) {
                        personageHasMerit = true;
                    }
                });
                if (meritMerit.presentAbsent) {
                    if (!personageHasMerit) {
                        meritSatisfied = false;
                    }
                }
                if (!meritMerit.presentAbsent) {
                    if (personageHasMerit) {
                        meritSatisfied = false;
                    }
                }
            });
            meritSatisfiedPromise.resolve(meritSatisfied);
        });

        return validatePrerequisites.promise;
    };

    $scope.addPersonageMerit = function (merit) {
        var meritObject = angular.fromJson(merit);

        if ($scope.meritAvailable) {
            $scope.loader = true;
            var changeExperience = $q.defer();
            var checkIfTalent = $q.defer();
            var checkPrerequisites = $q.defer();
            var addMerit = $q.defer();

            function success(data) {
                $scope.loader = false;
                jQuery('#addMeritDialog').modal('hide');
            }

            var all = $q.all([changeExperience.promise, checkIfTalent.promise, checkPrerequisites.promise, addMerit.promise]);
            all.then(success);

            $timeout(function () {
                $scope.personage.experience = $scope.personage.experience - meritObject.cost;
                changeExperience.resolve();
            }, 200);

            $timeout(function () {
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    angular.forEach(personageMerit.Merit.MeritMerits, function (meritMerit) {
                        if (meritObject.id == meritMerit.MeritPrerequisite.id) {
                            if (!meritMerit.presentAbsent) {
                                $scope.showConfirmDeletePersonagMerit(personageMerit);
                            }
                        }
                    });
                });
                checkPrerequisites.resolve();
            }, 200);

            $timeout(function () {
                if (meritObject.name.indexOf('Талант') > -1) {
                    angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                        if (meritObject.name.indexOf(personageTriggerSkill.TriggerSkill.name) > -1) {
                            personageTriggerSkill.talented = true;
                        }
                    });
                }
                checkIfTalent.resolve();
            }, 200);

            $timeout(function () {
                if ($scope.confirmChanges) {
                    var personageMerit = {
                        Merit: meritObject,
                        MeritId: meritObject.id,
                        PersonageId: personageId
                    };
                    $scope.personageMerits.push(personageMerit);
                }
                addMerit.resolve();
            }, 200);
        }
    };

    $scope.deletePersonageMerit = function (personageMerit) {
        $scope.loader = true;
        angular.forEach($scope.personageMerits, function (personageMeritFromList) {
            angular.forEach(personageMeritFromList.Merit.MeritMerits, function (meritMerit) {
                if (personageMerit.Merit.id == meritMerit.MeritPrerequisite.id) {
                    if (meritMerit.presentAbsent) {
                        $scope.deletePersonageMerit(personageMeritFromList);
                    }
                }
            });
        });

        if (personageMerit.Merit.name.indexOf('Талант') > -1) {
            angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                if (personageMerit.Merit.name.indexOf(personageTriggerSkill.TriggerSkill.name) > -1) {
                    personageTriggerSkill.talented = false;
                }
            });
        }

        var index = $scope.personageMerits.indexOf(personageMerit);
        $scope.personageMerits.splice(index, 1);
        $scope.personage.experience = $scope.personage.experience + personageMerit.Merit.cost;
        $scope.loader = false;
    };


    $scope.addPersonageInherent = function (inherent_id) {
        $scope.loader = true;
        jQuery('#addInherentDialog').modal('hide');

        return $http.get('/inherents/' + inherent_id).success(function (result) {
            $scope.personageInherents.push({
                Inherent: result.inherent,
                InherentId: inherent_id,
                PersonageId: personageId
            });
            $scope.loader = false;
        });
    };

    $scope.deletePersonageInherent = function (personageInherent) {
        $scope.loader = true;
        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritInherents, function (meritInherent) {
                if (personageInherent.Inherent.id == meritInherent.Inherent.id) {
                    $scope.showConfirmDeletePersonagMerit(personageMerit);
                }
            });
        });

        if ($scope.confirmChanges) {
            var index = $scope.personageInherents.indexOf(personageInherent);
            $scope.personageInherents.splice(index, 1);
        }
        $scope.loader = false;
    };

    $scope.addPersonageFlaw = function (flaw_id) {
        $scope.loader = true;
        jQuery('#addFlawDialog').modal('hide');
        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritFlaws, function (meritFlaw) {
                if (flaw_id == meritFlaw.Flaw.id) {
                    if (!meritFlaw.presentAbsent) {
                        $scope.showConfirmDeletePersonagMerit(personageMerit);
                    }
                }
            });
        });

        if ($scope.confirmChanges) {
            $http.get('/flaws/' + flaw_id).success(function (result) {
                $scope.personageFlaws.push({
                    Flaw: result.flaw,
                    FlawId: flaw_id,
                    PersonageId: personageId
                });
                $scope.personage.experience = $scope.personage.experience + result.flaw.cost;
                $scope.loader = false;
            });
        } else {
            $scope.loader = false;
        }
    };

    $scope.deletePersonageFlaw = function (personageFlaw) {
        $scope.loader = true;
        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritFlaws, function (meritFlaw) {
                if (personageFlaw.Flaw.id == meritFlaw.Flaw.id) {
                    if (meritFlaw.presentAbsent) {
                        $scope.showConfirmDeletePersonagMerit(personageMerit);
                    }
                }
            });
        });

        if ($scope.confirmChanges) {
            var index = $scope.personageFlaws.indexOf(personageFlaw);
            $scope.personageFlaws.splice(index, 1);
            $scope.personage.experience = $scope.personage.experience - personageFlaw.Flaw.cost;
        }
        $scope.loader = false;
    };

    $scope.addPersonageAttachedSkill = function (attachedSkill_id) {
        $scope.loader = true;
        jQuery('#addAttachedSkillDialog').modal('hide');
        $http.get('/attachedSkills/' + attachedSkill_id).success(function (result) {
            $scope.personageAttachedSkills.push({
                AttachedSkill: result.attachedSkill,
                AttachedSkillId: attachedSkill_id,
                PersonageId: personageId,
                value: 1
            });
            if (result.attachedSkill.difficult) {
                $scope.personage.experience = $scope.personage.experience - 2;
            } else {
                $scope.personage.experience = $scope.personage.experience - 1;
            }
            $scope.recalculateMagicSchools($scope.personageAttachedSkills);
            $scope.loader = false;
        });
    };

    $scope.showAddDialog = function (values, addingFunction) {
        $mdDialog.show({
            locals: {valuesForFilter: values, addItemFunction: addingFunction},
            controller: DialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'addItemTemplate.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    };

    $scope.showAddMeritDialog = function (merits, addMeritFunction, validationFunction) {
        $mdDialog.show({
            locals: {
                meritsForFilter: merits,
                addMeritFunction: addMeritFunction,
                validationFunction: validationFunction
            },
            controller: MeritDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'addMeritTemplate.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    };

    var personageAttachedSkillsClicked = false;
    $scope.getPersonageAttachedSkills = function () {
        if (!personageAttachedSkillsClicked) {
            personageAttachedSkillsClicked = true;
            $scope.loader = true;
            $http.get('/personageAttachedSkillsByPersonageId/' + personageId).success(function (data) {
                $scope.recalculateMagicSchools(data.personageAttachedSkills);
                $scope.personageAttachedSkills = data.personageAttachedSkills;
                $scope.loader = false;
            });
        }
    };

    var personageSpellsClicked = false;
    $scope.getPersonageSpells = function () {
        if (!personageSpellsClicked) {
            personageSpellsClicked = true;
            $scope.loader = true;
            $http.get('/personageSpellsByPersonageId/' + personageId).success(function (data) {
                $scope.personageSpells = data.personageSpells;
                $scope.loader = false;
            });
        }
    };

    var personageTriggerSkillsClicked = false;
    $scope.getPersonageTriggerSkills = function () {
        if (!personageTriggerSkillsClicked) {
            personageTriggerSkillsClicked = true;
            $scope.loader = true;
            $http.get('/personageTriggerSkillsByPersonageId/' + personageId).success(function (data) {
                $scope.personageTriggerSkills = data.personageTriggerSkills;
                $scope.loader = false;
            });
        }
    };

    var noticesClicked = false;
    $scope.getNotices = function () {
        if (!noticesClicked) {
            noticesClicked = true;
            $scope.loader = true;
            $http.get('/noticesByPersonageId/' + personageId).success(function (data) {
                $scope.notices = data.notices;
                $scope.loader = false;
            });
        }
    };

    var personageFlawsClicked = false;
    $scope.getPersonageFlaws = function () {
        if (!personageFlawsClicked) {
            personageFlawsClicked = true;
            $scope.loader = true;
            $http.get('/personageFlawsByPersonageId/' + personageId).success(function (data) {
                $scope.personageFlaws = data.personageFlaws;
                $scope.loader = false;
            });
        }
    };

    var personageMeritsClicked = false;
    $scope.getPersonageMerits = function () {
        if (!personageMeritsClicked) {
            personageMeritsClicked = true;
            $scope.loader = true;
            $http.get('/personageMeritsByPersonageId/' + personageId).success(function (data) {
                $scope.personageMerits = data.personageMerits;
                $scope.loader = false;
                $scope.calculateShowMerits();
            });
        }
    };

    var personageInherentsClicked = false;
    $scope.getPersonageInherents = function () {
        if (!personageInherentsClicked) {
            personageInherentsClicked = true;
            $scope.loader = true;
            $http.get('/personageInherentsByPersonageId/' + personageId).success(function (data) {
                $scope.personageInherents = data.personageInherents;
                $scope.loader = false;
            });
        }
    };

    $scope.recalculateMagicSchools = function (personageAttachedSkills) {
        $scope.schools = [];
        angular.forEach(personageAttachedSkills, function (personageAttachedSkill) {
            if (personageAttachedSkill.AttachedSkill.spells_connected) {
                $scope.schools.push(personageAttachedSkill.AttachedSkill);
            }
        });
    };

    $scope.addPersonageTriggerSkill = function (triggerSkill_id) {
        $scope.loader = true;
        jQuery('#addTriggerSkillDialog').modal('hide');
        $http.get('/triggerSkills/' + triggerSkill_id).success(function (result) {
            $scope.personageTriggerSkills.push({
                TriggerSkill: result.triggerSkill,
                TriggerSkillId: triggerSkill_id,
                PersonageId: personageId,
                currentLevel: 0,
                talented: false,
                tutored: false
            });
            $scope.personage.experience = $scope.personage.experience - result.triggerSkill.cost;
            $scope.loader = false;
        });
    };

    $scope.deletePersonageAttachedSkill = function (personageAttachedSkill) {
        $scope.loader = true;

        var hasSpells = false;

        if (personageAttachedSkill.AttachedSkill.spells_connected) {
            angular.forEach($scope.personageSpells, function (personageSpell) {
                if (personageSpell.Spell.AttachedSkillId == personageAttachedSkill.AttachedSkill.id && !hasSpells) {
                    hasSpells = true;
                    jQuery('#attachedSkillHasSpellsAlert').modal('show');
                }
            });
        }

        if (!hasSpells) {
            var index = $scope.personageAttachedSkills.indexOf(personageAttachedSkill);
            $scope.personageAttachedSkills.splice(index, 1);

            angular.forEach($scope.personageMerits, function (personageMerit) {
                angular.forEach(personageMerit.Merit.MeritAttachedSkills, function (meritAttachedSkill) {
                    if (personageAttachedSkill.AttachedSkill.id == meritAttachedSkill.AttachedSkill.id) {
                        $scope.showConfirmDeletePersonagMerit(personageMerit);
                    }
                });
            });

            if ($scope.confirmChanges) {
                if (personageAttachedSkill.AttachedSkill.difficult) {
                    $scope.personage.experience = $scope.personage.experience + 2 * personageAttachedSkill.value;
                } else {
                    $scope.personage.experience = $scope.personage.experience + personageAttachedSkill.value;
                }
                $scope.recalculateMagicSchools($scope.personageAttachedSkills);
            }
        }
        $scope.loader = false;
    };

    $scope.deletePersonageTriggerSkill = function (personageTriggerSkill) {
        $scope.loader = true;
        var index = $scope.personageTriggerSkills.indexOf(personageTriggerSkill);
        $scope.personageTriggerSkills.splice(index, 1);

        if (personageTriggerSkill.talented) {
            angular.forEach($scope.personageMerits, function (personageMerit) {
                if (personageMerit.Merit.name.indexOf(personageTriggerSkill.TriggerSkill.name)) {
                    $scope.showConfirmDeletePersonagMerit(personageMerit);
                }
            });
        }

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritTriggerSkills, function (meritTriggerSkill) {
                if (personageTriggerSkill.TriggerSkill.id == meritTriggerSkill.TriggerSkill.id) {
                    $scope.showConfirmDeletePersonagMerit(personageMerit);
                }
            });
        });

        if ($scope.confirmChanges) {
            $scope.personage.experience = $scope.personage.experience + personageTriggerSkill.TriggerSkill.cost;
        }
        $scope.loader = false;
    };

    $scope.calculateShowMerits = function () {
        $scope.loader = true;
        $http.get('/raceMeritsByRaceId/' + $scope.personage.RaceId).success(function (results) {
            angular.forEach(results.raceMerits, function (raceMerit) {
                for (var i = 0; i < $scope.personageMerits.length; i++) {
                    if (!raceMerit.race_default && raceMerit.race_cost != 0 && raceMerit.MeritId == $scope.personageMerits[i].Merit.id) {
                        $scope.personageMerits[i].Merit.cost = raceMerit.race_cost;
                    }
                }
            });
        });
        $scope.loader = false;
    };

    $scope.calculateMeritSelectOptions = function () {
        $scope.loader = true;

        $scope.defaultValue = true;

        $scope.selectMerits = [];
        $http.get('/raceMeritsByRaceId/' + $scope.personage.RaceId).success(function (results) {
            angular.forEach($scope.merits, function (merit) {
                var alreadyAdded = false;
                var haveTriggerSkillForThisTalent = true;
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    if (merit.id == personageMerit.Merit.id) {
                        alreadyAdded = true;
                    }
                });

                if (merit.name.indexOf('Талант') > -1) {
                    haveTriggerSkillForThisTalent = false;
                    angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                        if (merit.name.indexOf(personageTriggerSkill.TriggerSkill.name) > -1) {
                            haveTriggerSkillForThisTalent = true;
                        }
                    });
                }

                angular.forEach(results.raceMerits, function (raceMerit) {
                    if (!raceMerit.race_default && raceMerit.race_cost != 0 && raceMerit.MeritId == merit.id) {
                        merit.cost = raceMerit.race_cost;
                    }
                });

                if (!alreadyAdded && haveTriggerSkillForThisTalent) {
                    $scope.selectMerits.push(merit);
                }
            });
            $scope.loader = false;
            $scope.showAddMeritDialog($scope.selectMerits, $scope.addPersonageMerit, $scope.validatePrerequisites)
        });
    };

    $scope.calculateFlawSelectOptions = function () {
        $scope.loader = true;
        $scope.selectFlaws = [];
        angular.forEach($scope.flaws, function (flaw) {
            var contains = false;
            angular.forEach($scope.personageFlaws, function (personageFlaw) {
                if (flaw.id == personageFlaw.Flaw.id) {
                    contains = true;
                }
            });

            if (!contains) {
                $scope.selectFlaws.push(flaw);
            }
        });
        $scope.showAddDialog($scope.selectFlaws, $scope.addPersonageFlaw);
        $scope.loader = false;
    };

    $scope.calculateInherentSelectOptions = function () {
        $scope.loader = true;
        $scope.selectInherents = [];
        angular.forEach($scope.inherents, function (inherent) {
            var contains = false;
            angular.forEach($scope.personageInherents, function (personageInherent) {
                if (inherent.id == personageInherent.Inherent.id) {
                    contains = true;
                }
            });

            if (!contains) {
                $scope.selectInherents.push(inherent);
            }
        });
        $scope.showAddDialog($scope.selectInherents, $scope.addPersonageInherent);
        $scope.loader = false;
    };

    $scope.calculateAttachedSkillSelectOptions = function () {
        $scope.loader = true;
        $scope.selectAttachedSkills = [];
        angular.forEach($scope.attachedSkills, function (attachedSkill) {
            var contains = false;
            angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                if (attachedSkill.id == personageAttachedSkill.AttachedSkill.id) {
                    contains = true;
                }
            });

            if (!contains) {
                $scope.selectAttachedSkills.push(attachedSkill);
            }
        });
        $scope.showAddDialog($scope.selectAttachedSkills, $scope.addPersonageAttachedSkill);
        $scope.loader = false;
    };

    $scope.calculateTriggerSkillSelectOptions = function () {
        $scope.loader = true;
        $scope.selectTriggerSkills = [];
        angular.forEach($scope.triggerSkills, function (triggerSkill) {
            var contains = false;
            angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                if (triggerSkill.id == personageTriggerSkill.TriggerSkill.id) {
                    contains = true;
                }
            });

            if (!contains) {
                $scope.selectTriggerSkills.push(triggerSkill);
            }
        });
        $scope.showAddDialog($scope.selectTriggerSkills, $scope.addPersonageTriggerSkill);
        $scope.loader = false;
    };

    $scope.viewNotice = function (notice_id) {
        jQuery('#' + notice_id + '_view').modal('show');
    };

    $scope.editNotice = function (notice_id) {
        jQuery('#' + notice_id + '_view').modal('hide');
        jQuery('#' + notice_id + '_edit').modal('show');
    };

    $scope.updateNotice = function (notice) {
        $http.put('/notices/' + notice.id, {
            name: notice.name,
            description: notice.description
        }).success(function (data) {
            jQuery('#' + notice.id + '_edit').modal('hide');
            $('#' + notice.id + '_edit').on('hidden.bs.modal', function () {
                $http.get("/noticesByPersonageId/" + personageId).success(function (data) {
                    $scope.notices = data.notices;
                });
            });
        });
    };

    $scope.clearNoticeFields = function () {
        $scope.noticeName = '';
        $scope.noticeDescription = '';
    };

    $scope.addNotice = function () {
        $http.post('/notices', {
            personage_id: personageId,
            name: $scope.noticeName,
            description: $scope.noticeDescription
        }).success(function (data) {
            jQuery('#addNotice').modal('hide');
            $('#addNotice').on('hidden.bs.modal', function () {
                $http.get("/noticesByPersonageId/" + personageId).success(function (data) {
                    $scope.notices = data.notices;
                });
            });
        });
    };

    $scope.deleteNotice = function (notice_id) {
        $http.delete('/notices/' + notice_id).success(function (data) {
            jQuery('#' + notice_id + '_view').modal('hide');
            $('#' + notice_id + '_view').on('hidden.bs.modal', function () {
                $http.get("/noticesByPersonageId/" + personageId).success(function (data) {
                    $scope.notices = data.notices;
                });
            });
        });
    };

    $scope.reset = function () {
        location.reload();
    };

    $scope.savePersonage = function () {
        $scope.loader = true;

        function success(data) {
            $scope.loader = false;
        }

        var personage = $q.defer();
        var personageAttributeAllPromise = $q.defer();
        var personageMeritAllPromise = $q.defer();
        var personageInherentAllPromise = $q.defer();
        var personageFlawAllPromise = $q.defer();
        var personageAttachedSkillAllPromise = $q.defer();
        var personageTriggerSkillAllPromise = $q.defer();
        var personageSpellsAllPromise = $q.defer();

        $q.all([personageAttributeAllPromise.promise, personage.promise,
            personageMeritAllPromise.promise, personageInherentAllPromise.promise,
            personageFlawAllPromise.promise, personageAttachedSkillAllPromise.promise,
            personageTriggerSkillAllPromise.promise, personageSpellsAllPromise.promise])
            .then(success);

        $http.put('/personages/' + personageId, {
            race_id: $scope.personage.RaceId,
            name: $scope.personage.name,
            age: $scope.age,
            max_age: $scope.max_age,
            generated: false,
            experience: $scope.personage.experience,
            notes: $scope.notes
        }).success(function (data) {
            personage.resolve();
        });


        var personageAttributePromises = [];
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            personageAttributePromises.push($http.put('/personageAttributes/' + personageAttribute.id, {
                value: personageAttribute.value
            }));
        });

        $q.all(personageAttributePromises).then(function () {
            personageAttributeAllPromise.resolve();
        });

        if ($scope.personageMerits != null) {
            $http.get('/personageMeritsByPersonageId/' + personageId).success(function (results) {
                var deletePromises = [];

                angular.forEach(results.personageMerits, function (personageMerit) {
                    deletePromises.push($http.delete('/personageMerits/' + personageMerit.id));
                });

                $q.all(deletePromises).then(function () {
                    var addPromises = [];
                    angular.forEach($scope.personageMerits, function (personageMerit) {
                        addPromises.push($http.post('/personageMerits', {
                            merit_id: personageMerit.Merit.id,
                            personage_id: personageId,
                            unremovable: personageMerit.unremovable
                        }));
                    });
                    $q.all(addPromises).then(function () {
                        personageMeritAllPromise.resolve();
                    });
                });
            });
        } else {
            personageMeritAllPromise.resolve();
        }

        if ($scope.personageInherents != null) {
            $http.get('/personageInherentsByPersonageId/' + personageId).success(function (results) {
                var deletePromises = [];

                angular.forEach(results.personageInherents, function (personageInherent) {
                    deletePromises.push($http.delete('/personageInherents/' + personageInherent.id));
                });

                $q.all(deletePromises).then(function () {
                    var addPromises = [];
                    angular.forEach($scope.personageInherents, function (personageInherent) {
                        addPromises.push($http.post('/personageInherents', {
                            inherent_id: personageInherent.Inherent.id,
                            personage_id: personageId,
                            value: personageInherent.value
                        }));
                    });
                    $q.all(addPromises).then(function () {
                        personageInherentAllPromise.resolve();
                    });
                });
            });
        } else {
            personageInherentAllPromise.resolve();
        }

        if ($scope.personageFlaws != null) {
            $http.get('/personageFlawsByPersonageId/' + personageId).success(function (results) {
                var deletePromises = [];

                angular.forEach(results.personageFlaws, function (personageFlaw) {
                    deletePromises.push($http.delete('/personageFlaws/' + personageFlaw.id));
                });

                $q.all(deletePromises).then(function () {
                    var addPromises = [];
                    angular.forEach($scope.personageFlaws, function (personageFlaw) {
                        addPromises.push($http.post('/personageFlaws', {
                            flaw_id: personageFlaw.Flaw.id,
                            personage_id: personageId,
                            personage_race_default: personageFlaw.personage_race_default
                        }));
                    });
                    $q.all(addPromises).then(function () {
                        personageFlawAllPromise.resolve();
                    });
                });
            });
        } else {
            personageFlawAllPromise.resolve();
        }

        if ($scope.personageAttachedSkills != null) {
            $http.get('/personageAttachedSkillsByPersonageId/' + personageId).success(function (results) {
                var deletePromises = [];

                angular.forEach(results.personageAttachedSkills, function (personageAttachedSkill) {
                    deletePromises.push($http.delete('/personageAttachedSkills/' + personageAttachedSkill.id));
                });

                $q.all(deletePromises).then(function () {
                    var addPromises = [];
                    angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                        addPromises.push($http.post('/personageAttachedSkills', {
                            attachedSkill_id: personageAttachedSkill.AttachedSkill.id,
                            personage_id: personageId,
                            value: personageAttachedSkill.value
                        }));
                    });
                    $q.all(addPromises).then(function () {
                        personageAttachedSkillAllPromise.resolve();
                    });
                });
            });
        } else {
            personageAttachedSkillAllPromise.resolve();
        }

        if ($scope.personageTriggerSkills != null) {
            $http.get('/personageTriggerSkillsByPersonageId/' + personageId).success(function (results) {
                var deletePromises = [];

                angular.forEach(results.personageTriggerSkills, function (personageTriggerSkill) {
                    deletePromises.push($http.delete('/personageTriggerSkills/' + personageTriggerSkill.id));
                });

                $q.all(deletePromises).then(function () {
                    var addPromises = [];
                    angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                        addPromises.push($http.post('/personageTriggerSkills', {
                            trigger_skill_id: personageTriggerSkill.TriggerSkill.id,
                            personage_id: personageId,
                            currentLevel: personageTriggerSkill.currentLevel,
                            talented: personageTriggerSkill.talented,
                            tutored: personageTriggerSkill.tutored
                        }));
                    });
                    $q.all(addPromises).then(function () {
                        personageTriggerSkillAllPromise.resolve();
                    });
                });
            });
        } else {
            personageTriggerSkillAllPromise.resolve();
        }


        if ($scope.personageSpells != null) {
            $http.get('/personageSpellsByPersonageId/' + personageId).success(function (results) {
                var deletePromises = [];

                angular.forEach(results.personageSpells, function (personageSpell) {
                    deletePromises.push($http.delete('/personageSpells/' + personageSpell.id));
                });

                $q.all(deletePromises).then(function () {
                    var addPromises = [];
                    angular.forEach($scope.personageSpells, function (personageSpell) {
                        addPromises.push($http.post('/personageSpells', {
                            spell_id: personageSpell.Spell.id,
                            personage_id: personageId,
                            level: personageSpell.level,
                            tutored: personageSpell.tutored
                        }));
                    });
                    $q.all(addPromises).then(function () {
                        personageSpellsAllPromise.resolve();
                    });
                });
            });
        } else {
            personageSpellsAllPromise.resolve();
        }

    };
});
