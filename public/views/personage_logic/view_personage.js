var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage', 'hmTouchEvents', 'ngSanitize', 'jm.i18next']);

app.controller("personageController", function ($scope, $http, $q, $localStorage, $i18next, $timeout) {
    var personage = $q.defer();
    var raceAttributes = $q.defer();

    $scope.saveActiveTab = function (tabId) {
        $localStorage.activeTab = tabId;
    };

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

    function addAllModifiers(targetName, initialValue, baseParametersString) {
        var name = targetName.toLowerCase();
        var finalValue = initialValue;
        var percentage = 1;
        var descriptionString = $i18next.t('page.character.additional_derivatives.base_value') + ' [' + baseParametersString + '] : ' + initialValue + ", ";
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

    var mainParametersClicked = false;
    $scope.getMainParameters = function () {
        if (!mainParametersClicked) {
            mainParametersClicked = true;
            $timeout(function () {
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
                                    var withModifiers = addAllModifiers(attachedSkillAttribute.name, value, attachedSkillAttribute.Attribute.name + '+' + attachedSkillAttribute.AttachedSkill.name);
                                    returned = returned + '<h4 class="margin-bottom-0"><small>' + attachedSkillAttribute.Attribute.name + '+' + attachedSkillAttribute.AttachedSkill.name + withModifiers.text + '=' + withModifiers.value + ':</small></h4>' + attachedSkillAttribute.description;
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
            }, 500);
        }
    };

    $scope.setWeight = function () {
        swal({
            title: $i18next.t('page.character.edit_weight_title'),
            input: "text",
            inputValue: 0,
            showCancelButton: true,
            confirmButtonText: $i18next.t('popup.save_button'),
            cancelButtonText: $i18next.t('popup.cancel_button')
        }).then(function success(result) {
            $http.post('/history', {
                key: $scope.personage.name + '_weight',
                value: parseInt(result)
            }).then(function () {
                $scope.current_weight = parseInt(result);
                location.reload();
            });
        });
    };

    function success() {
        calculateBasicCharacteristics();

        var getSuffolkPunch = $.grep($scope.personageMerits, function (personageMerit) {
            return personageMerit.Merit.name.toLowerCase() === $i18next.t('page.character.suffolk_punch').toLowerCase();
        });

        var suffolkPunchBonus = 0;
        if (getSuffolkPunch.length > 0) {
            suffolkPunchBonus = 3;
        }

        var weightModifier = Math.floor($scope.current_weight / ($scope.power + suffolkPunchBonus));
        if ($scope.current_weight % $scope.power === 0) {
            weightModifier = weightModifier - 1;
        }

        var dexterityLevel = Math.floor(Math.abs(($scope.dexterity - 3) / 3));
        $scope.cloakingLevel = null;
        var getCloaking = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name.toLowerCase() === $i18next.t('page.character.additional_derivatives.cloaking').toLowerCase();
        });

        if (getCloaking.length !== 0) {
            $scope.cloakingLevel = getCloaking[0].currentLevel;
        }

        var cloakingModifier = 0;
        var climbingCloakingModifier = 0;
        var bounceCloakingModifier = 0;
        var balanceCloakingCheckModifier = 0;
        var fallingDamageCoefficientCloakingModifier = 0;
        var cloakingText = '';
        if ($scope.cloakingLevel === null) {
            cloakingModifier = -2;
            cloakingText = $i18next.t('page.character.additional_derivatives.skill_absent');
        } else {
            if ($scope.cloakingLevel >= 1) {
                cloakingModifier = cloakingModifier + 1;
                cloakingText = $i18next.t('page.character.additional_derivatives.cloaking_expert');
            }
            if ($scope.cloakingLevel >= 2) {
                cloakingModifier = cloakingModifier + 1;
                cloakingText = $i18next.t('page.character.additional_derivatives.cloaking_master');
                climbingCloakingModifier = climbingCloakingModifier + 1;
                bounceCloakingModifier = bounceCloakingModifier + 1;
                balanceCloakingCheckModifier = balanceCloakingCheckModifier + 1;
                fallingDamageCoefficientCloakingModifier = fallingDamageCoefficientCloakingModifier + 1;
            }
            if ($scope.cloakingLevel === 3) {
                cloakingModifier = cloakingModifier + 2;
                cloakingText = $i18next.t('page.character.additional_derivatives.cloaking_magister');
                climbingCloakingModifier = climbingCloakingModifier + 2;
                bounceCloakingModifier = bounceCloakingModifier + 2;
                balanceCloakingCheckModifier = balanceCloakingCheckModifier + 2;
                fallingDamageCoefficientCloakingModifier = fallingDamageCoefficientCloakingModifier + 1;
            }
        }

        $scope.weight1 = $scope.power + suffolkPunchBonus;
        $scope.weight2 = ($scope.power + suffolkPunchBonus) * 2;
        $scope.weight3 = ($scope.power + suffolkPunchBonus) * 3;
        $scope.weight4 = ($scope.power + suffolkPunchBonus) * 5;
        $scope.weight5 = ($scope.power + suffolkPunchBonus) * 10;
        $scope.weight6 = ($scope.power + suffolkPunchBonus) * 15;

        var watchfulness_vision = addAllModifiers($i18next.t('page.character.additional_derivatives.watchfulness_vision'), $scope.perception, $i18next.t('page.character.perception'));
        $scope.watchfulness_vision = watchfulness_vision.value + 'd ' + watchfulness_vision.text;
        var watchfulness_hearing = addAllModifiers($i18next.t('page.character.additional_derivatives.watchfulness_hearing'), $scope.perception, $i18next.t('page.character.perception'));
        $scope.watchfulness_hearing = watchfulness_hearing.value + 'd ' + watchfulness_hearing.text;

        var getKarate = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name.toLowerCase() === $i18next.t('page.character.karate').toLowerCase();
        });

        var karateBonus = 0;
        var karateText = '';
        if (getKarate.length !== 0) {
            if (getKarate[0].currentLevel >= 1) {
                karateBonus = karateBonus + 2;
                karateText = '+' + karateBonus + ' ' + $i18next.t('page.character.additional_derivatives.karate_expert');
            }
            if (getKarate[0].currentLevel >= 2) {
                karateBonus = karateBonus + 1;
                karateText = '+' + karateBonus + ' ' + $i18next.t('page.character.additional_derivatives.karate_master');
            }
            if (getKarate[0].currentLevel >= 3) {
                karateBonus = karateBonus + 2;
                karateText = '+' + karateBonus + ' ' + $i18next.t('page.character.additional_derivatives.karate_magister');
            }
        }

        var bounce = addAllModifiers($i18next.t('page.character.additional_derivatives.bounce'), $scope.dexterity, $i18next.t('page.character.dexterity'));
        if (karateText !== '') {
            bounce.text = bounce.text.slice(0, -1) + ', ' + karateText + ')';
        }
        if ($scope.cloakingLevel !== null) {
            bounce.text = bounce.text.slice(0, -1) + ', +' + bounceCloakingModifier + ' ' + cloakingText + ')';
        }
        if (weightModifier > 0) {
            bounce.text = bounce.text.slice(0, -1) + ', -' + weightModifier + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        bounce.value = bounce.value + karateBonus + bounceCloakingModifier - weightModifier;
        if (bounce.value < 0) {
            bounce.value = 0;
        }
        $scope.bounce = bounce.value + 'd ' + bounce.text;

        var falling_damage_coefficient = addAllModifiers($i18next.t('page.character.additional_derivatives.falling_damage_coefficient'), $scope.personage.Race.falling_damage_coefficient, $i18next.t('page.character.additional_derivatives.falling_damage_coefficient'));
        if (dexterityLevel > 0) {
            falling_damage_coefficient.text = falling_damage_coefficient.text.slice(0, -1) + ', +' + dexterityLevel + ' ' + $i18next.t('page.character.additional_derivatives.dexterity_bonus') + ')';
        }
        if ($scope.cloakingLevel !== null) {
            falling_damage_coefficient.text = falling_damage_coefficient.text.slice(0, -1) + ', +' + fallingDamageCoefficientCloakingModifier + ' ' + cloakingText + ')';
        }
        falling_damage_coefficient.value = falling_damage_coefficient.value + dexterityLevel + fallingDamageCoefficientCloakingModifier;
        $scope.falling_damage_coefficient = falling_damage_coefficient.value + falling_damage_coefficient.text;

        var balance_check = addAllModifiers($i18next.t('page.character.additional_derivatives.balance_check'), $scope.dexterity, $i18next.t('page.character.dexterity'));
        if ($scope.cloakingLevel !== null) {
            balance_check.text = balance_check.text.slice(0, -1) + ', +' + balanceCloakingCheckModifier + ' ' + cloakingText + ')';
        }
        if (weightModifier > 0) {
            balance_check.text = balance_check.text.slice(0, -1) + ', -' + weightModifier + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        balance_check.value = balance_check.value + balanceCloakingCheckModifier - weightModifier;
        if (balance_check.value < 0) {
            balance_check.value = 0;
        }
        $scope.balance_check = balance_check.value + 'd ' + balance_check.text;

        var poise_check = addAllModifiers($i18next.t('page.character.additional_derivatives.poise_check'), $scope.power, $i18next.t('page.character.power'));
        if (dexterityLevel > 0) {
            poise_check.text = poise_check.text.slice(0, -1) + ', +' + dexterityLevel + ' ' + $i18next.t('page.character.additional_derivatives.dexterity_bonus') + ')';
        }
        if (Math.floor(weightModifier / 2) > 0) {
            poise_check.text = poise_check.text.slice(0, -1) + ', -' + Math.floor(weightModifier / 2) + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        poise_check.value = poise_check.value + dexterityLevel - Math.floor(weightModifier / 2);
        if (poise_check.value < 0) {
            poise_check.value = 0;
        }
        $scope.poise_check = poise_check.value + 'd ' + poise_check.text;

        var getMeditation = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name.toLowerCase() === $i18next.t('page.character.meditation').toLowerCase();
        });


        var baseLevelOfManaRefresh = 5;
        var enduranceLevel = Math.floor(Math.abs(($scope.endurance - 3) / 3));
        var energyRefresh = addAllModifiers($i18next.t('page.character.additional_derivatives.energy_refresh'), baseLevelOfManaRefresh, $i18next.t('page.character.additional_derivatives.energy_refresh'));

        if (enduranceLevel > 0) {
            energyRefresh.text = energyRefresh.text.slice(0, -1) + ', +' + enduranceLevel + ' ' + $i18next.t('page.character.additional_derivatives.endurance_bonus') + ')';
        }

        var meditationBonus = 1;
        var meditationBonusText = '';
        if (getMeditation.length > 0) {
            if (getMeditation[0].currentLevel >= 0) {
                meditationBonus = meditationBonus * 2;
                meditationBonusText = 'x' + meditationBonus + ' ' + $i18next.t('page.character.meditation');
            }
            if (getMeditation[0].currentLevel >= 1) {
                meditationBonus = meditationBonus * 2;
                meditationBonusText = 'x' + meditationBonus + ' ' + $i18next.t('page.character.additional_derivatives.meditation_expert');
            }
            if (getMeditation[0].currentLevel >= 2) {
                meditationBonus = meditationBonus * 2;
                meditationBonusText = 'x' + meditationBonus + ' ' + $i18next.t('page.character.additional_derivatives.meditation_master');
            }
            if (getMeditation[0].currentLevel >= 3) {
                meditationBonus = meditationBonus * 2;
                meditationBonusText = 'x' + meditationBonus + ' ' + $i18next.t('page.character.additional_derivatives.meditation_magister');
            }
            if (getMeditation[0].currentLevel >= 4) {
                meditationBonus = meditationBonus * 2;
                meditationBonusText = 'x' + meditationBonus + ' ' + $i18next.t('page.character.additional_derivatives.meditation_grand_master');
            }
        }

        if (meditationBonus > 1) {
            energyRefresh.text = energyRefresh.text.slice(0, -1) + ', ' + meditationBonusText + ')';
        }
        energyRefresh.value = (energyRefresh.value + enduranceLevel) * meditationBonus;

        $scope.energy_refresh = energyRefresh.value + ' ' + $i18next.t('page.character.additional_derivatives.in_min') + ' ' + energyRefresh.text;


        var step = addAllModifiers($i18next.t('page.character.additional_derivatives.move.step'), $scope.speed, $i18next.t('page.character.speed'));
        if (Math.floor(0.2 * weightModifier) > 0) {
            step.text = step.text.slice(0, -1) + ', -' + Math.floor(0.2 * weightModifier) + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        step.value = step.value - Math.floor(0.2 * weightModifier);
        if (step.value < 0) {
            step.value = 0;
        }
        $scope.step = step.value + step.text;
        var run = addAllModifiers($i18next.t('page.character.additional_derivatives.move.run'), $scope.speed, $i18next.t('page.character.speed'));
        if (Math.floor(0.33 * weightModifier) > 0) {
            run.text = run.text.slice(0, -1) + ', -' + Math.floor(0.33 * weightModifier) + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        run.value = run.value * 2 - Math.floor(0.33 * weightModifier);
        if (run.value < 0) {
            run.value = 0;
        }
        $scope.run = run.value + run.text;
        var sprint = addAllModifiers($i18next.t('page.character.additional_derivatives.move.sprint'), $scope.speed, $i18next.t('page.character.speed'));
        if (Math.floor(weightModifier / 2) > 0) {
            sprint.text = sprint.text.slice(0, -1) + ', -' + Math.floor(weightModifier / 2) + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        sprint.value = sprint.value * 4 - Math.floor(weightModifier / 2);
        if (sprint.value < 0) {
            sprint.value = 0;
        }
        $scope.sprint = sprint.value + sprint.text;

        var climbing = addAllModifiers($i18next.t('page.character.additional_derivatives.move.climbing'), $scope.dexterity, $i18next.t('page.character.dexterity'));
        climbing.value = climbing.value + climbingCloakingModifier - weightModifier;
        if ($scope.cloakingLevel !== null) {
            climbing.text = climbing.text.slice(0, -1) + ', +' + climbingCloakingModifier + ' ' + cloakingText + ')';
        }
        if (weightModifier > 0) {
            climbing.text = climbing.text.slice(0, -1) + ', -' + weightModifier + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        if (climbing.value < 0) {
            climbing.value = 0;
        }
        $scope.climbing = climbing.value + 'd ' + climbing.text;

        var getSwimming = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name.toLowerCase() === $i18next.t('page.character.additional_derivatives.move.swimming').toLowerCase();
        });

        var swimming = addAllModifiers($i18next.t('page.character.additional_derivatives.move.swimming'), $scope.speed, $i18next.t('page.character.speed'));
        if (getSwimming.length === 0) {
            swimming.value = swimming.value - 2;
            swimming.text = swimming.text.slice(0, -1) + ', -2 ' + $i18next.t('page.character.additional_derivatives.skill_absent') + ')';
        }
        if (weightModifier > 0) {
            swimming.text = swimming.text.slice(0, -1) + ', -' + weightModifier + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        swimming.value = swimming.value - weightModifier;
        if (swimming.value < 0) {
            swimming.value = 0;
        }
        $scope.swimming = swimming.value + swimming.text;

        var vitalityBonus = 0;
        if ($scope.vitality > 5) {
            vitalityBonus = $scope.vitality - 5;
        }

        var vitalityBonusText = '';
        if (vitalityBonus > 0) {
            vitalityBonusText = ', +' + vitalityBonus + ' ' + $i18next.t('page.character.additional_derivatives.vitality_bonus');
        }

        var deadlyInjuries = 0;
        var death = 0;
        if ($scope.personage.Race.name.toLowerCase() === 'гном') {
            $scope.scratches = 7 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 2' + vitalityBonusText + ', +5 раса гном)';
            $scope.light_injuries = 15 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 10' + vitalityBonusText + ', +5 раса гном)';
            $scope.medium_injuries = 20 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 15' + vitalityBonusText + ', +5 раса гном)';
            $scope.heavy_injuries = 35 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 30' + vitalityBonusText + ', +5 раса гном)';
            deadlyInjuries = 30 + $scope.vitality * 2;
            $scope.deadly_injuries = deadlyInjuries + 5 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' ' + deadlyInjuries + vitalityBonusText + ', +5 раса гном)';
            death = 30 + $scope.vitality * 3;
            $scope.death = death + 5 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' ' + death + vitalityBonusText + ', +5 раса гном)';
        } else {
            $scope.scratches = 2 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 2' + vitalityBonusText + ')';
            $scope.light_injuries = 10 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 10' + vitalityBonusText + ')';
            $scope.medium_injuries = 15 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 15' + vitalityBonusText + ')';
            $scope.heavy_injuries = 30 + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' 30' + vitalityBonusText + ')';
            deadlyInjuries = 30 + $scope.vitality * 2;
            $scope.deadly_injuries = deadlyInjuries + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' ' + deadlyInjuries + vitalityBonusText + ')';
            death = 30 + $scope.vitality * 3;
            $scope.death = death + vitalityBonus + ' (' + $i18next.t('page.character.additional_derivatives.base_value') + ' ' + death + vitalityBonusText + ')';
        }

        $scope.hp_scratches = $scope.vitality * 20;
        $scope.hp_light_injuries = $scope.vitality * 10;
        $scope.hp_medium_injuries = $scope.vitality * 5;
        $scope.hp_heavy_injuries = $scope.vitality * 2;
        $scope.hp_deadly_injuries = $scope.vitality;

        var getZigun = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name.toLowerCase() === $i18next.t('page.character.zigun').toLowerCase();
        });

        var zigunBonus = 0;
        var zigunBonusText = '';
        if (getZigun.length > 0) {
            if (getZigun[0].currentLevel >= 1) {
                zigunBonus = zigunBonus + 1;
                zigunBonusText = '+' + zigunBonus + ' ' + $i18next.t('page.character.additional_derivatives.zigun_expert') + ')';
            }
            if (getZigun[0].currentLevel >= 2) {
                zigunBonus = zigunBonus + 1;
                zigunBonusText = '+' + zigunBonus + ' ' + $i18next.t('page.character.additional_derivatives.zigun_master') + ')';
            }
            if (getZigun[0].currentLevel >= 3) {
                zigunBonus = zigunBonus + 2;
                zigunBonusText = '+' + zigunBonus + ' ' + $i18next.t('page.character.additional_derivatives.zigun_magister') + ')';
            }
        }

        var powerLevel = Math.floor(Math.abs(($scope.power - 3) / 3));
        var doublePowerLevel = Math.floor(Math.abs(($scope.power - 3) / 6));
        var powerBonusText = '';
        var doublePowerBonusText = '';
        if (powerLevel > 0) {
            powerBonusText = '(+' + powerLevel + ' ' + $i18next.t('page.character.additional_derivatives.power_bonus') + ')';
            if (zigunBonus > 0) {
                powerBonusText = powerBonusText.slice(0, -1) + ', ' + zigunBonusText;
            }
        } else {
            if (zigunBonus > 0) {
                powerBonusText = '(' + zigunBonusText;
            }
        }
        if (doublePowerLevel > 0) {
            doublePowerBonusText = '(+' + doublePowerLevel + ' ' + $i18next.t('page.character.additional_derivatives.power_bonus') + ')';
            if (zigunBonus > 0) {
                doublePowerBonusText = doublePowerBonusText.slice(0, -1) + ', ' + zigunBonusText;
            }
        } else {
            if (zigunBonus > 0) {
                doublePowerBonusText = '(' + zigunBonusText;
            }
        }

        if (zigunBonus > 0) {
            $scope.stub = zigunBonus + 'd (' + zigunBonusText;
        } else {
            $scope.stub = '0d';
        }

        if (zigunBonus > 0) {
            $scope.cut = zigunBonus + 'd (' + zigunBonusText;
        } else {
            $scope.cut = '0d';
        }

        $scope.slash = zigunBonus + doublePowerLevel + 'd ' + doublePowerBonusText;
        $scope.blunt = zigunBonus + powerLevel + 'd ' + powerBonusText;

        var horror = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.horror'), $scope.will, $i18next.t('page.character.will'));
        $scope.horror = horror.value + 'd ' + horror.text;

        var willLevel = Math.floor(Math.abs(($scope.will - 3) / 3));

        var persuasion = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.persuasion'), $scope.will, $i18next.t('page.character.will'));
        if (willLevel > 0) {
            persuasion.text = persuasion.text.slice(0, -1) + ', +' + willLevel + ' ' + $i18next.t('page.character.additional_derivatives.will_bonus') + ')';
        }
        persuasion.value = persuasion.value + willLevel;
        $scope.persuasion = persuasion.value + 'd ' + persuasion.text;

        var seduction = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.seduction'), $scope.intelligence, $i18next.t('page.character.intelligence'));
        if (willLevel > 0) {
            seduction.text = seduction.text.slice(0, -1) + ', +' + willLevel + ' ' + $i18next.t('page.character.additional_derivatives.will_bonus') + ')';
        }
        seduction.value = seduction.value + willLevel;
        $scope.seduction = seduction.value + 'd ' + seduction.text;

        var oppression = addAllModifiers($i18next.t('page.character.additional_derivatives.saving_throws.oppression'), $scope.charisma, $i18next.t('page.character.charisma'));
        if (willLevel > 0) {
            oppression.text = oppression.text.slice(0, -1) + ', +' + willLevel + ' ' + $i18next.t('page.character.additional_derivatives.will_bonus') + ')';
        }
        oppression.value = oppression.value + willLevel;
        $scope.oppression = oppression.value + 'd ' + oppression.text;


        var charismaLevel = Math.floor(Math.abs(($scope.charisma - 3) / 3));
        var getAppearance = $.grep($scope.personageInherents, function (personageInherent) {
            return personageInherent.Inherent.name.toLowerCase() === $i18next.t('page.character.appearance').toLowerCase();
        });
        var appearance = addAllModifiers($i18next.t('page.character.appearance'), getAppearance[0].value, $i18next.t('page.character.appearance'));
        appearance.value = appearance.value + charismaLevel;
        if (willLevel > 0) {
            appearance.text = appearance.text.slice(0, -1) + ', +' + charismaLevel + ' ' + $i18next.t('page.character.additional_derivatives.charisma_bonus') + ')';
        }
        $scope.appearance = appearance.value + 'd ' + appearance.text;

        var getLuck = $.grep($scope.personageInherents, function (personageInherent) {
            return personageInherent.Inherent.name.toLowerCase() === $i18next.t('page.character.luck').toLowerCase();
        });
        var luck = addAllModifiers($i18next.t('page.character.luck'), getLuck[0].value, $i18next.t('page.character.luck'));
        $scope.luck = luck.value + 'd ' + luck.text;

        $scope.poisons_resistance = 0;
        var getPoisonsResistance = $.grep($scope.personageInherents, function (personageInherent) {
            return personageInherent.Inherent.name.toLowerCase() === $i18next.t('page.character.additional_derivatives.poisons_resistance').toLowerCase();
        });
        if (getPoisonsResistance.length !== 0) {
            $scope.poisons_resistance = 1;
        }
        var poisons_resistance = addAllModifiers($i18next.t('page.character.additional_derivatives.poisons_resistance'), $scope.poisons_resistance, $i18next.t('page.character.additional_derivatives.poisons_resistance'));
        $scope.poisons_resistance = poisons_resistance.value + 'd ' + poisons_resistance.text;

        var cloaking_moving = addAllModifiers($i18next.t('page.character.additional_derivatives.cloaking_moving'), $scope.dexterity, $i18next.t('page.character.dexterity'));
        var cloaking_not_moving = addAllModifiers($i18next.t('page.character.additional_derivatives.cloaking_not_moving'), $scope.will, $i18next.t('page.character.will'));

        if (Math.floor(weightModifier / 2) > 0) {
            cloaking_moving.text = cloaking_moving.text.slice(0, -1) + ', -' + Math.floor(weightModifier / 2) + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
            cloaking_not_moving.text = cloaking_not_moving.text.slice(0, -1) + ', -' + Math.floor(weightModifier / 2) + ' ' + $i18next.t('page.character.additional_derivatives.weight_modifier') + ')';
        }
        cloaking_moving.value = cloaking_moving.value - Math.floor(weightModifier / 2);
        cloaking_not_moving.value = cloaking_not_moving.value - Math.floor(weightModifier / 2);
        if (cloaking_moving.value < 0) {
            cloaking_moving.value = 0;
        }
        if (cloaking_not_moving.value < 0) {
            cloaking_not_moving.value = 0;
        }
        if (cloakingText === '') {
            $scope.cloaking_moving = cloaking_moving.value + 'd ' + cloaking_moving.text;
            $scope.cloaking_not_moving = cloaking_not_moving.value + 'd ' + cloaking_not_moving.text;
        } else {
            cloaking_moving.value = cloaking_moving.value + cloakingModifier;
            cloaking_not_moving.value = cloaking_not_moving.value + cloakingModifier;
            var plus = '+';
            if (cloakingModifier < 0) {
                plus = '';
            }
            $scope.cloaking_moving = cloaking_moving.value + 'd ' + cloaking_moving.text.slice(0, -1) + ', ' + plus + cloakingModifier + ' ' + cloakingText + ')';
            $scope.cloaking_not_moving = cloaking_not_moving.value + 'd ' + cloaking_not_moving.text.slice(0, -1) + ', ' + plus + cloakingModifier + ' ' + cloakingText + ')';
        }

        var getIntimidation = $.grep($scope.personageTriggerSkills, function (personageTriggerSkill) {
            return personageTriggerSkill.TriggerSkill.name.toLowerCase() === $i18next.t('page.character.additional_derivatives.intimidation').toLowerCase();
        });

        var intimidation = addAllModifiers($i18next.t('page.character.additional_derivatives.intimidation_strength'), $scope.will + $scope.power, $i18next.t('page.character.will') + '+' + $i18next.t('page.character.power'));
        if (getIntimidation.length === 0) {
            intimidation.value = intimidation.value - 4;
            intimidation.text = intimidation.text.slice(0, -1) + ', ' + '-4 ' + $i18next.t('page.character.additional_derivatives.skill_absent') + ')';
        }
        $scope.intimidation = intimidation.value + 'd ' + intimidation.text;

        $('#loader').hide();
        $('section').removeClass('hide');
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
        $http.get('/byKey/' + $scope.personage.name + '_weight').then(function (response) {
            if (response.data.result === null) {
                $scope.current_weight = 0;
            } else {
                $scope.current_weight = parseInt(response.data.result.value);
            }
            personage.resolve();
        });
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
    if ($localStorage.activeTab !== undefined) {
        $('#' + $localStorage.activeTab).click();
        if ($localStorage.activeTab === 'spells_tab') {
            $scope.getPersonageSpells();
        }
        if ($localStorage.activeTab === 'notices_tab') {
            $timeout(function () {
                $scope.showNotices();
            }, 500);
        }
        if ($localStorage.activeTab === 'main_skills_tab') {
            $timeout(function () {
                $scope.getMainParameters();
            }, 500);
        }
    } else {
        $('#main_skills_tab').addClass('active');
        $timeout(function () {
            $scope.getMainParameters();
        }, 500);
    }
});