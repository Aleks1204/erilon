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
var app = angular.module("personageApp", ['ngStorage', 'ui.bootstrap']);

app.controller("personageController", function ($scope, $http, $q, $sce) {
    $scope.loader = true;
    $scope.isMobile = isMobile.android.phone;
    $scope.meritAvailable = true;
    $scope.currentMerit = null;

    var personage = $q.defer();
    var raceAttributes = $q.defer();
    var personageMerits = $q.defer();

    function success(data) {
        $scope.recalculateBasicCharacteristics();
        $scope.loader = false;
    }

    var all = $q.all([personage.promise, personageMerits.promise]);

    all.then(success);

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
        $scope.experienceValid = function () {
            return $scope.personage.experience < 0;
        };
        $scope.personageAttributes = data.personage.PersonageAttributes;
        personage.resolve();
    });

    $http.get('/personageMeritsByPersonageId/' + personageId).success(function (data) {
        $scope.personageMerits = data.personageMerits;
        personageMerits.resolve();
    });

    $scope.calculateMagicSchools = function () {
        $scope.schools = [];
        var buffer = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (buffer.indexOf(personageSpell.Spell.AttachedSkillId) == -1) {
                buffer.push(personageSpell.Spell.AttachedSkillId);
            }
        });

        angular.forEach(buffer, function (attachedSkillId) {
            $http.get('/attachedSkills/' + attachedSkillId).success(function (data) {
                $scope.schools.push(data.attachedSkill);
            });
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

    $scope.showSpellDetail = function (personageSpell) {
        $scope.currentPersonageSpell = personageSpell;
        jQuery('#spellDetails').modal('show');
    };

    var spells = 0;
    $http.get('/personageSpellsByPersonageIdCount/' + personageId).success(function (data) {
        spells = data.spellsAmount;
    });

    $scope.isSpellsEmpty = function () {
        return spells == 0;
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

    var personageAttachedSkillsClicked = false;
    $scope.getPersonageAttachedSkills = function () {
        if (!personageAttachedSkillsClicked) {
            personageAttachedSkillsClicked = true;
            $scope.loader = true;
            $http.get('/personageAttachedSkillsByPersonageId/' + personageId).success(function (data) {
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
                $scope.calculateMagicSchools();
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

});