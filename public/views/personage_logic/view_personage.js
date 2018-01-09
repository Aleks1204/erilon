var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage', 'hmTouchEvents', 'ngSanitize', 'jm.i18next']);

app.controller("personageController", function ($scope, $http, $q, $localStorage, $i18next) {
    var personage = $q.defer();
    var raceAttributes = $q.defer();

    $scope.setActive = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.dexterity')) {
            $('#hitPiercePunch').addClass('derivedActive');
            $('#hitChopPunch').addClass('derivedActive');
            $('#rangedHit').addClass('derivedActive');
            $('#dodge').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.speed')) {
            $('#hitPiercePunch').addClass('derivedActive');
            $('#parryPiercePunch').addClass('derivedActive');
            $('#generalActionPoints').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.power')) {
            $('#hitChopPunch').addClass('derivedActive');
            $('#parryChopPunch').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.perception')) {
            $('#rangedHit').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.reaction')) {
            $('#parryPiercePunch').addClass('derivedActive');
            $('#parryChopPunch').addClass('derivedActive');
            $('#dodge').addClass('derivedActive');
            $('#initiative').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.endurance')) {
            $('#endurancePoints').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === $i18next.t('page.character.intelligence')) {
            $('#mentalActionPoints').addClass('derivedActive');
            $('#generalActionPoints').addClass('derivedActive');
        }
    };

    $scope.hitPiercePunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.dexterity')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.speed')).parent('tr').addClass('derivedActive');
    };

    $scope.hitChopPunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.dexterity')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.power')).parent('tr').addClass('derivedActive');
    };

    $scope.rangedHitAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.dexterity')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.perception')).parent('tr').addClass('derivedActive');
    };

    $scope.parryPiercePunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.speed')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.reaction')).parent('tr').addClass('derivedActive');
    };

    $scope.parryChopPunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.reaction')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.power')).parent('tr').addClass('derivedActive');
    };

    $scope.dodgeAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.dexterity')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.reaction')).parent('tr').addClass('derivedActive');
    };

    $scope.generalActionPointsAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.intelligence')).parent('tr').addClass('derivedActive');
        $('#' + $i18next.t('page.character.speed')).parent('tr').addClass('derivedActive');
    };

    $scope.mentalActionPointsAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.intelligence')).parent('tr').addClass('derivedActive');
    };

    $scope.endurancePointsAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.endurance')).parent('tr').addClass('derivedActive');
    };

    $scope.initiativeAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#' + $i18next.t('page.character.dexterity')).parent('tr').addClass('derivedActive');
    };

    function addAllModifiers(targetName, initialValue) {
        var name = targetName.toLowerCase();
        var finalValue = initialValue;
        var percentage = 1;
        var descriptionString = "база: " + initialValue + ", ";
        var modifierString = '';
        angular.forEach($scope.personageMerits, function (personageMerit) {
            var bonuses_description = personageMerit.Merit.permanent_bonus.toLowerCase();
            if (bonuses_description.includes(name)) {
                angular.forEach(bonuses_description.split(","), function (bonus) {
                    if (bonus.includes("%")) {
                        if (bonus.replace(/([a-я ]*[А-Я ]*[a-z ]*[A-Z ]*)\s*\d+[%]\s*(.*)/, '$1$2').trim() === name) {
                            modifierString = bonus.replace(/[a-я ]*[А-Я ]*[a-z ]*[A-Z ]*\s*(\d+[%]).*/g, "$1");
                            percentage = percentage * parseInt(modifierString.replace(/\D*/, "")) / 100;
                            descriptionString = descriptionString + personageMerit.Merit.name + ": " + modifierString + ", ";
                        }
                    } else {
                        if (bonus.replace(/([a-я ]*[А-Я ]*[a-z ]*[A-Z ]*)\s*[+]?[-]?\d+\s*(.*)/, '$1$2').trim() === name) {
                            modifierString = bonus.replace(/[a-я ]*[А-Я ]*[a-z ]*[A-Z ]*\s*([+]?[-]?\d+).*/g, "$1");
                            if (modifierString.includes("-")) {
                                finalValue = finalValue - parseInt(modifierString.replace(/\D*/, ""));
                            } else {
                                finalValue = finalValue + parseInt(modifierString.replace(/\D*/, ""));
                            }
                            descriptionString = descriptionString + personageMerit.Merit.name + ": " + modifierString + ", ";
                        }
                    }
                });
            }
        });

        angular.forEach($scope.personageFlaws, function (personageFlaw) {
            var bonuses_description = personageFlaw.Flaw.permanent_bonus.toLowerCase();
            if (bonuses_description.includes(name)) {
                angular.forEach(bonuses_description.split(","), function (bonus) {
                    if (bonus.includes("%")) {
                        if (bonus.replace(/([a-я ]*[А-Я ]*[a-z ]*[A-Z ]*)\s*\d+[%]\s*(.*)/, '$1$2').trim() === name) {
                            modifierString = bonus.replace(/[a-я ]*[А-Я ]*[a-z ]*[A-Z ]*\s*(\d+[%]).*/g, "$1");
                            percentage = percentage * parseInt(modifierString.replace(/\D*/, "")) / 100;
                            descriptionString = descriptionString + personageFlaw.Flaw.name + ": " + modifierString + ", ";
                        }
                    } else {
                        if (bonus.replace(/([a-я ]*[А-Я ]*[a-z ]*[A-Z ]*)\s*[+]?[-]?\d+\s*(.*)/, '$1$2').trim() === name) {
                            modifierString = bonus.replace(/[a-я ]*[А-Я ]*[a-z ]*[A-Z ]*\s*([+]?[-]?\d+).*/g, "$1");
                            if (modifierString.includes("-")) {
                                finalValue = finalValue - parseInt(modifierString.replace(/\D*/, ""));
                            } else {
                                finalValue = finalValue + parseInt(modifierString.replace(/\D*/, ""));
                            }
                            descriptionString = descriptionString + personageFlaw.Flaw.name + ": " + modifierString + ", ";
                        }
                    }
                });
            }
        });

        angular.forEach($scope.personageInherents, function (personageInherent) {
            var bonuses_description = personageInherent.Inherent.permanent_bonus.toLowerCase();
            if (bonuses_description.includes(name)) {
                angular.forEach(bonuses_description.split(","), function (bonus) {
                    if (bonus.includes("%")) {
                        if (bonus.replace(/([a-я ]*[А-Я ]*[a-z ]*[A-Z ]*)\s*\d+[%]\s*(.*)/, '$1$2').trim() === name) {
                            modifierString = bonus.replace(/[a-я ]*[А-Я ]*[a-z ]*[A-Z ]*\s*(\d+[%]).*/g, "$1");
                            percentage = percentage * parseInt(modifierString.replace(/\D*/, "")) / 100;
                            descriptionString = descriptionString + personageInherent.Inherent.name + ": " + modifierString + ", ";
                        }
                    } else {
                        if (bonus.replace(/([a-я ]*[А-Я ]*[a-z ]*[A-Z ]*)\s*[+]?[-]?\d+\s*(.*)/, '$1$2').trim() === name) {
                            modifierString = bonus.replace(/[a-я ]*[А-Я ]*[a-z ]*[A-Z ]*\s*([+]?[-]?\d+).*/g, "$1");
                            if (modifierString.includes("-")) {
                                finalValue = finalValue - parseInt(modifierString.replace(/\D*/, ""));
                            } else {
                                finalValue = finalValue + parseInt(modifierString.replace(/\D*/, ""));
                            }
                            descriptionString = descriptionString + personageInherent.Inherent.name + ": " + modifierString + ", ";
                        }
                    }
                });
            }
        });

        descriptionString = descriptionString.slice(0, -2);

        return {
            value: Math.floor(finalValue * percentage),
            text: " (" + descriptionString + ")"
        };
    }

    function success() {
        calculateBasicCharacteristics();

        $scope.weight1 = $scope.power;
        $scope.weight2 = $scope.power * 2;
        $scope.weight3 = $scope.power * 3;
        $scope.weight4 = $scope.power * 5;
        $scope.weight5 = $scope.power * 10;
        $scope.weight6 = $scope.power * 15;

        var watchfulness_vision = addAllModifiers($i18next.t('page.character.additional_derivatives.watchfulness_vision'), $scope.perception);
        $scope.watchfulness_vision = watchfulness_vision.value + 'd ' + watchfulness_vision.text;
        var watchfulness_hearing = addAllModifiers($i18next.t('page.character.additional_derivatives.watchfulness_hearing'), $scope.perception);
        $scope.watchfulness_hearing = watchfulness_hearing.value + 'd ' + watchfulness_hearing.text;
        var bounce = addAllModifiers($i18next.t('page.character.additional_derivatives.bounce'), $scope.dexterity);
        $scope.bounce = bounce.value + 'd ' + bounce.text;
        var falling_damage_coefficient = addAllModifiers($i18next.t('page.character.additional_derivatives.falling_damage_coefficient'), $scope.personage.Race.falling_damage_coefficient);
        falling_damage_coefficient.value = falling_damage_coefficient.value + Math.floor(Math.abs(($scope.dexterity - 3) / 3));
        $scope.falling_damage_coefficient = falling_damage_coefficient.value + falling_damage_coefficient.text;
        var balance_check = addAllModifiers($i18next.t('page.character.additional_derivatives.balance_check'), $scope.dexterity);
        balance_check.value = balance_check.value + Math.floor(Math.abs(($scope.dexterity - 3) / 3));
        $scope.balance_check = balance_check.value + 'd ' + balance_check.text;
        var poise_check = addAllModifiers($i18next.t('page.character.additional_derivatives.poise_check'), $scope.power);
        $scope.poise_check = poise_check.value + 'd ' + poise_check.text;
        $scope.mana_refresh = 5 + Math.floor(Math.abs(($scope.endurance - 3) / 3));

        var step = addAllModifiers($i18next.t('page.character.additional_derivatives.move.step'), $scope.speed);
        $scope.step = step.value + step.text;
        var run = addAllModifiers($i18next.t('page.character.additional_derivatives.move.run'), $scope.speed);
        $scope.run = run.value * 2 + run.text;
        var sprint = addAllModifiers($i18next.t('page.character.additional_derivatives.move.sprint'), $scope.speed);
        $scope.sprint = sprint.value * 4 + sprint.text;
        var climbing = addAllModifiers($i18next.t('page.character.additional_derivatives.move.climbing'), $scope.dexterity);
        $scope.climbing = climbing.value + 'd ' + climbing.text;
        var swimming = addAllModifiers($i18next.t('page.character.additional_derivatives.move.swimming'), $scope.speed);
        $scope.swimming = swimming.value + swimming.text;

        $scope.scratches = 2;
        $scope.light_injuries = 10;
        $scope.medium_injuries = 15;
        $scope.heavy_injuries = 30;
        $scope.deadly_injuries = 30 + $scope.vitality * 2;
        $scope.death = 30 + $scope.vitality * 3;

        $scope.hp_scratches = $scope.vitality * 20;
        $scope.hp_light_injuries = $scope.vitality * 10;
        $scope.hp_medium_injuries = $scope.vitality * 5;
        $scope.hp_heavy_injuries = $scope.vitality * 2;
        $scope.hp_deadly_injuries = $scope.vitality;

        $scope.stub = 0;
        $scope.slash = Math.floor(Math.abs(($scope.power - 3) / 6));
        $scope.cut = 0;
        $scope.blunt = Math.floor(Math.abs(($scope.power - 3) / 3));

        var horror = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.horror'), $scope.will);
        $scope.horror = horror.value + 'd ' + horror.text;
        var persuasion = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.persuasion'), $scope.intelligence);
        persuasion.value = persuasion.value + Math.floor(Math.abs(($scope.will - 3) / 3));
        $scope.persuasion = persuasion.value + 'd ' + persuasion.text;
        var seduction = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.seduction'), $scope.charisma);
        seduction.value = seduction.value + Math.floor(Math.abs(($scope.will - 3) / 3));
        $scope.seduction = seduction.value + 'd ' + seduction.text;
        var oppression = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.oppression'), $scope.will);
        oppression.value = oppression.value + Math.floor(Math.abs(($scope.will - 3) / 3));
        $scope.oppression = oppression.value + 'd ' + oppression.text;


        var getAppearance = $.grep($scope.personageInherents, function (personageInherent) {
            return personageInherent.Inherent.name === $i18next.t('page.character.appearance');
        });
        var appearance = addAllModifiers($i18next.t('page.character.appearance'), getAppearance[0].value);
        appearance.value = appearance.value + Math.floor(Math.abs(($scope.charisma - 3) / 3));
        $scope.appearance = appearance.value + 'd ' + appearance.text;

        var getLuck = $.grep($scope.personageInherents, function (personageInherent) {
            return personageInherent.Inherent.name === $i18next.t('page.character.luck');
        });
        var luck = addAllModifiers($i18next.t('page.character.luck'), getLuck[0].value);
        $scope.luck = luck.value + 'd ' + luck.text;

        $scope.poisons_resistance = 0;
        var getPoisonsResistance = $.grep($scope.personageInherents, function (personageInherent) {
            return personageInherent.Inherent.name === $i18next.t('page.character.additional_derivatives.poisons_resistance');
        });
        if (getPoisonsResistance.length !== 0) {
            $scope.poisons_resistance = 1;
        }
        var poisons_resistance = addAllModifiers($i18next.t('page.character.additional_derivatives.poisons_resistance'), $scope.poisons_resistance);
        $scope.poisons_resistance = poisons_resistance.value + 'd ' + poisons_resistance.text;

        var cloaking_moving = addAllModifiers($i18next.t('page.character.additional_derivatives.cloaking_moving'), $scope.dexterity);
        $scope.cloaking_moving = cloaking_moving.value + 'd ' + cloaking_moving.text;
        var cloaking_not_moving = addAllModifiers($i18next.t('page.character.additional_derivatives.cloaking_not_moving'), $scope.will);
        $scope.cloaking_not_moving = cloaking_not_moving.value + 'd ' + cloaking_not_moving.text;

        var getIntimidation = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name === $i18next.t('page.character.additional_derivatives.intimidation');
        });

        var intimidationModifier = 0;
        if (getIntimidation.length === 0) {
            intimidationModifier = 4;
        }
        var intimidation = addAllModifiers($i18next.t('page.character.additional_derivatives.intimidation_strength'), $scope.will + $scope.power - intimidationModifier);

        $scope.intimidation = intimidation.value + 'd ' + intimidation.text;

        $('#loader').hide();
        $('section').removeClass('hide');
        table('/personageFlawsByPersonageId/' + personageId, '#flaws', [
            {
                data: "Flaw.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "Flaw.description"}
        ], 2);

        table('/personageMeritsByPersonageId/' + personageId, '#merits', [
            {
                data: "Merit.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "Merit.description"}
        ], 2);

        $http.get('/byKey/' + 'show_default_skills' + $localStorage.playerId).then(function (response) {
            $scope.defaultSkills = response.data.result != null;
            table('/personageAttachedSkillsByPersonageId/' + personageId, '#attachedSkills', [
                {
                    data: "AttachedSkill.name",
                    render: function (data, type, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {"data": "value"},
                {
                    data: "AttachedSkill",
                    orderable: false,
                    render: function (data, type, row) {
                        var returned = '';
                        angular.forEach(data.AttachedSkillAttributes, function (attachedSkillAttribute) {
                            var value = getPersonageAttributeValue(attachedSkillAttribute.Attribute) + row.value;
                            returned = returned + '<h4 class="margin-bottom-0"><small>' + attachedSkillAttribute.Attribute.name + '+' + attachedSkillAttribute.AttachedSkill.name + '=' + value + ':</small></h4>' + attachedSkillAttribute.description;
                        });
                        return returned;
                    }
                },
                {"data": "AttachedSkill.description"}
            ], 4);
        });

        table('/personageInherentsByPersonageId/' + personageId, '#inherents', [
            {
                data: "Inherent.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "value"},
            {"data": "Inherent.description"}
        ], 3);

        table('/personageTriggerSkillsByPersonageId/' + personageId, '#triggerSkills', [
            {
                data: "TriggerSkill.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {
                "targets": 0,
                "data": function (row, type, val, meta) {
                    if (row.currentLevel === 0) {
                        return "";
                    }
                    if (row.currentLevel === 1) {
                        return getLevelName(1);
                    }
                    if (row.currentLevel === 2) {
                        return getLevelName(2);
                    }
                    if (row.currentLevel === 3) {
                        return getLevelName(3);
                    }
                    if (row.currentLevel === 4) {
                        return getLevelName(4);
                    }
                }
            },
            {
                "targets": 0,
                "data": function (row, type, val, meta) {
                    if (row.talented) {
                        return $i18next.t('general.yes');
                    } else {
                        return "";
                    }
                }
            },
            {"data": "TriggerSkill.description"}
        ], 4);
    }

    function getLevelName(levelNumber) {
        var levelName = '';
        switch (levelNumber) {
            case 0:
                levelName = $i18next.t('level.base');
                break;
            case 1:
                levelName = $i18next.t('level.expert');
                break;
            case 2:
                levelName = $i18next.t('level.master');
                break;
            case 3:
                levelName = $i18next.t('level.magister');
                break;
            case 4:
                levelName = $i18next.t('level.grandmaster');
                break;
            default:
                levelName = $i18next.t('level.none');
                break;
        }
        return levelName;
    }

    function table(dataUrl, tableId, columns, maxSize) {
        var table = $(tableId).DataTable({
            responsive: true,
            "language": {
                "search": $i18next.t('table.label.search'),
                "loadingRecords": $i18next.t('table.pagination.empty_search_results'),
                "zeroRecords": $i18next.t('table.pagination.empty_search_results'),
                "emptyTable": $i18next.t('table.pagination.empty_table'),
                "lengthMenu": $i18next.t('table.pagination.show') + " _MENU_"
            },
            stateSave: true,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, $i18next.t('table.pagination.all')]],
            "info": false,
            "ajax": dataUrl,
            "columns": columns,
            "pagingType": "numbers"
        });
        $(tableId + '_filter').addClass("pull-right");
        $(tableId + '_paginate').addClass("pull-right");

        $(tableId).on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (tr.find('td').length < maxSize && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
                if (row.child.isShown()) {
                    $(this).find('.icmn-circle-down2').remove();
                    $(this).prepend('<i class="icmn-circle-up2 margin-right-10"></i>');
                }
                else {
                    $(this).find('.icmn-circle-up2').remove();
                    $(this).prepend('<i class="icmn-circle-down2 margin-right-10"></i>');
                }
            }
        });
        table.columns().iterator('column', function (ctx, idx) {
            $(table.column(idx).header()).append('<span class="sort-icon"/>');
        });

        if (tableId === '#attachedSkills' && !$scope.defaultSkills) {
            $.fn.dataTableExt.afnFiltering.push(function (oSettings, aData, iDataIndex) {
                return aData[1] !== '0';
            });
        }
        return table;
    }

    var personageMeritsPromise = $q.defer();
    var personageFlawsPromise = $q.defer();
    var personageInherentsPromise = $q.defer();
    var personageTriggerSkillsPromise = $q.defer();

    var playerAttributes = $q.defer();
    var all = $q.all([personage.promise, raceAttributes.promise, playerAttributes.promise,
        personageMeritsPromise.promise, personageFlawsPromise.promise, personageInherentsPromise.promise,
        personageTriggerSkillsPromise.promise]);

    all.then(success);

    $http.get('/personages/' + personageId).then(function (response) {
        $scope.personage = response.data.personage;
        $scope.age = response.data.personage.age;
        if (response.data.personage.max_age !== 0) {
            $scope.max_age = response.data.personage.max_age;
        } else {
            $scope.max_age = response.data.personage.Race.max_age;
        }
        $http.get('/raceAttributesByRaceId/' + response.data.personage.RaceId).then(function (data) {
            $scope.raceAttributes = response.data.raceAttributes;
            raceAttributes.resolve();
        });
        $scope.personageAttributes = response.data.personage.PersonageAttributes;
        personage.resolve();
    });

    $http.get('/playerAttributesByPlayerId/' + $localStorage.playerId).then(function (response) {
        $scope.playerAttributes = response.data.playerAttributes;
        playerAttributes.resolve();
    });

    $http.get("/personageMeritsByPersonageId/" + personageId).then(function (response) {
        $scope.personageMerits = response.data.data;
        personageMeritsPromise.resolve();
    });

    $http.get("/personageInherentsByPersonageId/" + personageId).then(function (response) {
        $scope.personageInherents = response.data.data;
        personageInherentsPromise.resolve();
    });

    $http.get("/personageFlawsByPersonageId/" + personageId).then(function (response) {
        $scope.personageFlaws = response.data.data;
        personageFlawsPromise.resolve();
    });

    $http.get("/personageTriggerSkillsByPersonageId/" + personageId).then(function (response) {
        $scope.personageTriggerSkills = response.data.data;
        personageTriggerSkillsPromise.resolve();
    });

    function magicTable(id, name, attachedSkill) {
        var spells = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            angular.forEach(attachedSkill.Spells, function (spell) {
                if (spell.id === personageSpell.SpellId) {
                    spells.push({personageSpell: personageSpell, spell: spell});
                }
            });
        });
        $('#spells').append('<div class="row">' +
            '<div id="' + id + 'MagicPanel" class="panel" style="box-shadow: 0 2px 10px -2px rgba(55, 58, 60, 0.3); width: 99.2%;">' +
            '<h3 class="panel-heading">' + name + '</h3>' +
            '<div class="panel-body table-responsive">' +
            '<table id="' + id + 'Magic" class="table table-hover nowrap" width="100%">' +
            '<thead>' +
            '<tr>' +
            '<th>' + $i18next.t('table.header.spell') + '</th>' +
            '<th>' + $i18next.t('table.header.difficulty') + '</th>' +
            '<th>' + $i18next.t('table.header.mana') + '</th>' +
            '<th>' + $i18next.t('table.header.mana_support') + '</th>' +
            '<th>' + $i18next.t('table.header.creation_difficulty') + '</th>' +
            '<th>' + $i18next.t('table.header.instant') + '</th>' +
            '<th>' + $i18next.t('table.header.level') + '</th>' +
            '<th>' + $i18next.t('table.header.effect') + '</th>' +
            '<th>' + $i18next.t('table.header.description') + '</th>' +
            '</tr>' +
            '</thead>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>');
        var tableSelector = $('#' + id + 'Magic');
        var table = tableSelector.DataTable({
            responsive: true,
            stateSave: true,
            "language": {
                "search": $i18next.t('table.label.search'),
                "zeroRecords": $i18next.t('table.pagination.empty_search_results'),
                "emptyTable": $i18next.t('table.pagination.empty_table'),
                "lengthMenu": $i18next.t('table.pagination.show') + " _MENU_"
            },
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, $i18next.t('table.pagination.all')]],
            "info": false,
            data: spells,
            columns: [
                {
                    data: "spell.name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {data: 'spell.complexity'},
                {data: 'spell.mana'},
                {
                    data: 'spell.mana_support',
                    render: function (data, type, row) {
                        if (row.spell.instant) {
                            return "-";
                        }
                        return row.spell.mana_support + ' ' + row.spell.mana_sup_time;
                    }
                },
                {data: 'spell.creating_complexity'},
                {
                    data: 'spell.instant',
                    render: function (data, type, row) {
                        if (data) {
                            return $i18next.t('general.yes');
                        } else {
                            return $i18next.t('popup.no');
                        }
                    }
                },
                {data: 'personageSpell.level'},
                {
                    data: 'spell.effect',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0);' + row.spell.id + '" class="link-underlined link-blue hidden-md-up effect">' +
                            $i18next.t('table.header.effect') +
                            '</a>' +
                            '<div id="spellEffect' + row.spell.id + '" style="display: none">' +
                            '<br>' +
                            '<div>' + data + '</div>' +
                            '</div> <div class="hidden-xs-down">' + data + '</div>'
                    }
                },
                {
                    data: 'spell.description',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0);' + row.spell.id + '" class="link-underlined link-blue hidden-md-up description">' +
                            $i18next.t('table.header.description') +
                            '</a>' +
                            '<div id="spellDescription' + row.spell.id + '" style="display: none">' +
                            '<br>' +
                            '<div>' + data + '</div>' +
                            '</div> <div class="hidden-xs-down">' + data + '</div>'

                    }
                }
            ],
            "pagingType": "numbers"
        });
        $('#' + id + 'Magic' + '_filter').addClass("pull-right");
        $('#' + id + 'Magic' + '_paginate').addClass("pull-right");
        $('#' + id + 'Magic').on('click', '.description', function () {
            var spellId = this.href.substring(this.href.indexOf(';') + 1);
            $('#spellDescription' + spellId).toggle();
        });
        $('#' + id + 'Magic').on('click', '.effect', function () {
            var spellId = this.href.substring(this.href.indexOf(';') + 1);
            $('#spellEffect' + spellId).toggle();
        });
        tableSelector.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (tr.find('td').length < 9 && $(this).index() === 0) {
                if (row.child.isShown()) {
                    $(this).find('.icmn-circle-down2').remove();
                    $(this).prepend('<i class="icmn-circle-up2 margin-right-10"></i>');
                }
                else {
                    $(this).find('.icmn-circle-up2').remove();
                    $(this).prepend('<i class="icmn-circle-down2 margin-right-10"></i>');
                }
            }
        });
    }

    $scope.calculateMagicSchools = function () {
        $scope.schools = [];
        var buffer = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (buffer.indexOf(personageSpell.Spell.AttachedSkillId) === -1) {
                buffer.push(personageSpell.Spell.AttachedSkillId);
            }
        });

        angular.forEach(buffer, function (attachedSkillId) {
            $http.get('/attachedSkills/' + attachedSkillId).then(function (response) {
                $scope.schools.push(response.data.attachedSkill);
                magicTable(response.data.attachedSkill.id, response.data.attachedSkill.name, response.data.attachedSkill);
            });
        });
    };

    $scope.isCategoryAttributesMenuClose = true;

    var attributesCategoriesFilerMenu = new Menu({
        wrapper: '.o-wrapper-attributes',
        type: 'slide-bottom',
        mask: '.c-mask',
        size: 390
    });

    $scope.openHideAttributesCategoriesFilterMenu = function () {
        if ($scope.isCategoryAttributesMenuClose) {
            attributesCategoriesFilerMenu.open();
            $scope.isCategoryAttributesMenuClose = false;
        } else {
            attributesCategoriesFilerMenu.close();
            $scope.isCategoryAttributesMenuClose = true;
        }
    };

    function calculateBasicCharacteristics() {
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            switch (personageAttribute.Attribute.name) {
                case $i18next.t('page.character.power'):
                    $scope.power = personageAttribute.value;
                    break;
                case $i18next.t('page.character.dexterity'):
                    $scope.dexterity = personageAttribute.value;
                    break;
                case $i18next.t('page.character.speed'):
                    $scope.speed = personageAttribute.value;
                    break;
                case $i18next.t('page.character.reaction'):
                    $scope.reaction = personageAttribute.value;
                    break;
                case $i18next.t('page.character.perception'):
                    $scope.perception = personageAttribute.value;
                    break;
                case $i18next.t('page.character.endurance'):
                    $scope.endurance = personageAttribute.value;
                    break;
                case $i18next.t('page.character.vitality'):
                    $scope.vitality = personageAttribute.value;
                    break;
                case $i18next.t('page.character.wisdom'):
                    $scope.wisdom = personageAttribute.value;
                    break;
                case $i18next.t('page.character.intelligence'):
                    $scope.intelligence = personageAttribute.value;
                    break;
                case $i18next.t('page.character.will'):
                    $scope.will = personageAttribute.value;
                    break;
                case $i18next.t('page.character.charisma'):
                    $scope.charisma = personageAttribute.value;
                    break;
            }
        });

        $scope.hitPiercePunch = $scope.dexterity + $scope.speed;
        $scope.hitChopPunch = $scope.dexterity + $scope.power;
        $scope.rangedHit = addAllModifiers($i18next.t('page.character.ranged_hit'), $scope.dexterity + $scope.perception).value;
        $scope.parryPiercePunch = $scope.reaction + $scope.speed;
        $scope.parryChopPunch = $scope.power + $scope.reaction;

        $scope.dodge = addAllModifiers($i18next.t('page.character.dodge'), $scope.dexterity + $scope.reaction).value;

        if ($scope.speed < $scope.intelligence) {
            $scope.generalActionPoints = $scope.speed;
        } else {
            $scope.generalActionPoints = $scope.intelligence;
        }
        $scope.mentalActionPoints = $scope.intelligence;
        $scope.initiative = addAllModifiers($i18next.t('page.character.initiative'), $scope.reaction).value;
        $scope.endurancePoints = $scope.endurance * 20;
    }

    $scope.getAttributePosition = function (personageAttribute) {
        var position = 0;
        angular.forEach($scope.playerAttributes, function (playerAttribute) {
            if (personageAttribute.AttributeId === playerAttribute.AttributeId) {
                position = playerAttribute.position;
            }
        });
        return position;
    };

    $scope.ifMagic = function (personageAttribute) {
        return personageAttribute.Attribute.name === $i18next.t('page.character.magic') && personageAttribute.value === 0;
    };

    function getPersonageAttributeValue(attribute) {
        var attributeValue = 0;
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (attribute.id === personageAttribute.Attribute.id) {
                attributeValue = personageAttribute.value;
            }
        });
        return attributeValue;
    }

    var personageSpellsClicked = false;
    $scope.getPersonageSpells = function () {
        if (!personageSpellsClicked) {
            personageSpellsClicked = true;
            $http.get('/personageSpellsByPersonageId/' + personageId).then(function (response) {
                $scope.personageSpells = response.data.personageSpells;
                $scope.calculateMagicSchools();
                $scope.loader = false;
            });
        }
    };

    $scope.noticesClicked = false;

    $scope.showNotices = function () {
        if (!$scope.noticesClicked) {
            $scope.noticesClicked = true;
            $scope.noticeTable = table('/noticesByPersonageId/' + personageId, '#noticesTable', [
                {
                    data: "name",
                    render: function (data, type, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline margin-bottom-0 edit" value="'
                            + data + '"  type="button"></button>' +
                            '<button class="btn btn-icon btn-danger btn-rounded fa fa-close margin-inline margin-bottom-0 delete" value="'
                            + data + '" type="button"></button>';
                    }
                },
                {
                    "data": "description",
                    "bSearchable": false
                }
            ], 3);

            $scope.noticeTable.on('click', '.edit', function () {
                $http.get('/notices/' + this.value).then(function (response) {
                    var notice = response.data.notice;
                    swal({
                        title: $i18next.t('page.character.notice.edit_title'),
                        html: '<form>' +
                        '<div class="form-group">' +
                        '<label for="noticeTitle" class="form-control-label">' + $i18next.t('page.character.notice.title') + '</label>' +
                        '<input type="text" class="form-control" id="noticeTitle" value="' + notice.name + '">' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<label for="noticeBody" class="form-control-label">' + $i18next.t('page.character.notice.text') + '</label>' +
                        '<textarea id="noticeDescription" class="form-control">' + notice.description + '</textarea>' +
                        '</div>' +
                        '</form>',
                        showCancelButton: true,
                        cancelButtonText: $i18next.t('popup.cancel_button'),
                        confirmButtonText: $i18next.t('popup.save_button'),
                        showLoaderOnConfirm: true,
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                resolve([
                                    $('#noticeTitle').val(),
                                    $('#noticeDescription').val()
                                ])
                            })
                        },
                        onOpen: function () {
                            $('#noticeTitle').focus();
                            autosize($('#noticeDescription'));
                        }
                    }).then(function success(result) {
                        $http.put('/notices/' + notice.id, {
                            name: result[0],
                            experience: notice.experience,
                            description: result[1]
                        }).then(function () {
                            $scope.noticeTable.ajax.reload(null, false)
                        });
                    });
                });
            });

            $scope.noticeTable.on('click', '.delete', function () {
                var id = this.value;
                swal({
                    title: $i18next.t('popup.confirm_title'),
                    text: $i18next.t('page.character.notice.delete_text'),
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: $i18next.t('popup.delete_button'),
                    cancelButtonText: $i18next.t('popup.cancel_button')
                }).then(function success() {
                    $http.delete('/notices/' + id).then(function () {
                        $scope.noticeTable.ajax.reload(null, false)
                    });
                }, function cancel() {
                });
            });
        }
    };

    $scope.addNotice = function () {
        swal({
            title: $i18next.t('page.character.notice.add_title'),
            html: '<form>' +
            '<div class="form-group">' +
            '<label for="noticeTitle" class="form-control-label">' + $i18next.t('page.character.notice.title') + '</label>' +
            '<input type="text" class="form-control" id="noticeTitle">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="noticeBody" class="form-control-label">' + $i18next.t('page.character.notice.text') + '</label>' +
            '<textarea id="noticeDescription" class="form-control"></textarea>' +
            '</div>',
            showCancelButton: true,
            cancelButtonText: $i18next.t('popup.cancel_button'),
            confirmButtonText: $i18next.t('popup.add_button'),
            showLoaderOnConfirm: true,
            input: 'text',
            inputClass: 'hide',
            inputValidator: function (value) {
                return new Promise(function (resolve, reject) {
                    if ($('#noticeTitle').val() !== '') {
                        resolve()
                    } else {
                        reject($i18next.t('page.character.notice.error_empty_title'))
                    }
                })
            },
            preConfirm: function (value) {
                return new Promise(function (resolve) {
                    resolve([
                        $('#noticeTitle').val(),
                        $('#noticeDescription').val()
                    ])
                })
            },
            onOpen: function () {
                $('#noticeTitle').focus();
            }
        }).then(function success(result) {
            $http.post('/notices', {
                personage_id: personageId,
                name: result[0],
                experience: 0,
                description: result[1]
            }).then(function () {
                $scope.noticeTable.ajax.reload(null, false)
            });
        });
    };
});