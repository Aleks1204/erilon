/**
 * Created by artemk on 3/24/16.
 */

var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage', 'ui.bootstrap']);

app.controller("personageController", function ($scope, $http, $q, $timeout, $window) {
    $scope.loader = true;
    $scope.meritAvailable = true;
    $scope.showGenerateIneherentsButton = false;

    $scope.personageMerits = null;
    $scope.personageInherents = null;
    $scope.personageFlaws = null;
    $scope.personageTriggerSkills = null;
    $scope.personageAttachedSkills = null;
    $scope.personageSpells = null;
    $scope.confirmChanges = true;
    $scope.itemsToDelete = [];
    $scope.magicSchools = [];

    $window.onbeforeunload = function () {
        if (window.location.href.indexOf('localhost') == -1) {
            return "go away!";
        }
    };

    $(".inherentsButton").click(function () {
        $("#inherents").show();
        $("#attr").hide();
        $("#attached").hide();
        $("#trigger").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#steps").scrollTo('.inherentsButton');
        $(".inherentsButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
    });

    $(".attributesButton").click(function () {
        $("#attr").show();
        $("#inherents").hide();
        $("#attached").hide();
        $("#trigger").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#steps").scrollTo('.attributesButton');
        $(".attributesButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    $(".attachedButton").click(function () {
        $("#attached").show();
        $("#attr").hide();
        $("#inherents").hide();
        $("#trigger").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#steps").scrollTo('.attachedButton');
        $(".attachedButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    $(".triggerButton").click(function () {
        $("#trigger").show();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#steps").scrollTo('.triggerButton');
        $(".triggerButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    $(".meritsButton").click(function () {
        $("#merits").show();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#steps").scrollTo('.meritsButton');
        $(".meritsButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    $(".flawsButton").click(function () {
        $("#flaws").show();
        $("#merits").hide();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#spells").hide();
        $("#steps").scrollTo('.flawsButton');
        $(".flawsButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    $(".spellsButton").click(function () {
        $("#spells").show();
        $("#flaws").hide();
        $("#merits").hide();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#steps").scrollTo('.spellsButton');
        $(".spellsButton").addClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    $scope.filteredDefault = false;
    $scope.filteredTheoretical = false;
    $scope.attachedSkillsMixed = [];

    function calculateAttachedSkillsToShow() {
        angular.forEach($scope.attachedSkills, function (attachedSkill) {
            var targetPersonageAS = null;
            angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                if (attachedSkill.id == personageAttachedSkill.AttachedSkill.id) {
                    targetPersonageAS = personageAttachedSkill;
                }
            });
            $scope.attachedSkillsMixed.push({
                attachedSkill: attachedSkill,
                personageAttachedSkill: targetPersonageAS
            });
        });
    }

    $scope.filteredAttachedSkillsCategories = [];
    $scope.showAttachedSkillsCategories = false;
    $scope.showAttachedSkillsCategoriesFilter = function () {
        $scope.showAttachedSkillsCategories = true;
    };

    $scope.hideAttachedSkillsCategoriesFilter = function () {
        $scope.showAttachedSkillsCategories = false;
    };

    $scope.filterAttachedSkillsByCategory = function (category, selected) {
        if (selected) {
            $scope.filteredAttachedSkillsCategories.push(category);
        } else {
            $scope.filteredAttachedSkillsCategories.splice($scope.filteredAttachedSkillsCategories.indexOf(category), 1);
        }
    };

    $scope.filterAttachedSkillsByDefaultShow = function (selected) {
        $scope.filteredAttachedSkillsDefaultShow = selected;
    };

    $scope.filterAttachedSkillsByDefault = function (selected) {
        $scope.filteredAttachedSkillsDefault = selected;
    };

    $scope.filterAttachedSkillsByTheoretical = function (selected) {
        $scope.filteredAttachedSkillsTheoretical = selected;
    };

    $scope.filteredAttachedSkills = function (attachedSkill) {
        if (!$scope.filteredAttachedSkillsDefaultShow) {
            if (attachedSkill.default_skill) {
                return true;
            }
        }

        if ($scope.filteredAttachedSkillsTheoretical) {
            if (!attachedSkill.theoretical) {
                return true;
            }
        }

        if ($scope.filteredAttachedSkillsDefault) {
            if (!attachedSkill.default_skill) {
                return true;
            }
        }

        if ($scope.filteredAttachedSkillsCategories.length == 0) {
            return false;
        }

        var categories = attachedSkill.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredAttachedSkillsCategories.indexOf(item) != -1) {
                result = false;
            }
        });
        return result;
    };

    $scope.flawsMixed = [];

    function calculateFlawsToShow() {
        angular.forEach($scope.flaws, function (flaw) {
            var targetPersonageFlaw = null;
            angular.forEach($scope.personageFlaws, function (personageFlaw) {
                if (flaw.id == personageFlaw.Flaw.id) {
                    targetPersonageFlaw = personageFlaw;
                }
            });
            $scope.flawsMixed.push({
                flaw: flaw,
                personageFlaw: targetPersonageFlaw
            });
        });
    }

    $scope.filteredFlawsCategories = [];
    $scope.showFlawsCategories = false;
    $scope.showFlawsCategoriesFilter = function () {
        $scope.showFlawsCategories = true;
    };

    $scope.hideFlawsCategoriesFilter = function () {
        $scope.showFlawsCategories = false;
    };

    $scope.filterFlawsByCategory = function (category, selected) {
        if (selected) {
            $scope.filteredFlawsCategories.push(category);
        } else {
            $scope.filteredFlawsCategories.splice($scope.filteredFlawsCategories.indexOf(category), 1);
        }
    };

    $scope.filterFlawsByUnremovable = function (selected) {
        $scope.filteredFlawsUnremovable = selected;
    };

    $scope.filteredFlaws = function (flaw) {
        if ($scope.filteredFlawsUnremovable) {
            if (!flaw.unremovable) {
                return true;
            }
        }

        if ($scope.filteredFlawsCategories.length == 0) {
            return false;
        }

        var categories = flaw.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredFlawsCategories.indexOf(item) != -1) {
                result = false;
            }
        });
        return result;
    };

    $scope.triggerSkillsMixed = [];

    function calculateTriggerSkillsToShow() {
        angular.forEach($scope.triggerSkills, function (triggerSkill) {
            var targetPersonageTriggerSkill = null;
            angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                if (triggerSkill.id == personageTriggerSkill.TriggerSkill.id) {
                    targetPersonageTriggerSkill = personageTriggerSkill;
                }
            });
            $scope.triggerSkillsMixed.push({
                triggerSkill: triggerSkill,
                personageTriggerSkill: targetPersonageTriggerSkill
            });
        });
    }

    $scope.filteredTriggerSkillsCategories = [];
    $scope.showTriggerSkillsCategories = false;
    $scope.showTriggerSkillsCategoriesFilter = function () {
        $scope.showTriggerSkillsCategories = true;
    };

    $scope.hideTriggerSkillsCategoriesFilter = function () {
        $scope.showTriggerSkillsCategories = false;
    };

    $scope.filterTriggerSkillsByCategory = function (category, selected) {
        if (selected) {
            $scope.filteredTriggerSkillsCategories.push(category);
        } else {
            $scope.filteredTriggerSkillsCategories.splice($scope.filteredTriggerSkillsCategories.indexOf(category), 1);
        }
    };

    $scope.filteredTriggerSkills = function (triggerSkill) {

        if ($scope.filteredTriggerSkillsCategories.length == 0) {
            return false;
        }

        var categories = triggerSkill.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredTriggerSkillsCategories.indexOf(item) != -1) {
                result = false;
            }
        });
        return result;
    };

    $scope.meritsMixed = [];

    function calculateMeritsToShow() {
        $http.get('/raceMeritsByRaceId/' + $scope.personage.RaceId).success(function (results) {
            angular.forEach(results.raceMerits, function (raceMerit) {
                for (var i = 0; i < $scope.personageMerits.length; i++) {
                    if (!raceMerit.race_default && raceMerit.race_cost != 0 && raceMerit.MeritId == $scope.personageMerits[i].Merit.id) {
                        $scope.personageMerits[i].Merit.cost = raceMerit.race_cost;
                    }
                }
            });

            angular.forEach($scope.merits, function (merit) {
                var targetPersonageMerit = null;
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    if (merit.id == personageMerit.Merit.id) {
                        targetPersonageMerit = personageMerit;
                    }
                });
                $scope.meritsMixed.push({
                    merit: merit,
                    personageMerit: targetPersonageMerit,
                    available: getPrerequisites(merit)
                });
            });
        });
        $scope.loader = false;
    }

    $scope.spellsBySchool = [];

    function calculateSpellsToShow() {
        angular.forEach($scope.magicSchools, function (school) {
            var spells = [];
            angular.forEach(school.Spells, function (spell) {
                var targetPersonageSpell = null;
                angular.forEach($scope.personageSpells, function (personageSpell) {
                    if (spell.id == personageSpell.Spell.id) {
                        targetPersonageSpell = personageSpell;
                    }
                });
                spells.push({
                    spell: spell,
                    personageSpell: targetPersonageSpell
                });
            });
            $scope.spellsBySchool.push({
                school: school,
                spells: spells,
                added: false
            });
        });
    }

    function calculateAddedSchools() {
        angular.forEach($scope.spellsBySchool, function (school) {
            school.added = false;
            angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                if (personageAttachedSkill.AttachedSkillId == school.school.id) {
                    school.added = true;
                }
            });
        });
    }

    $scope.filteredMeritCategories = [];
    $scope.showMeritCategories = false;
    $scope.showMeritCategoriesFilter = function () {
        $scope.showMeritCategories = true;
    };

    $scope.hideMeritCategoriesFilter = function () {
        $scope.showMeritCategories = false;
    };

    $scope.filterMeritByAvailability = function (selected) {
        $scope.filteredMeritAvailable = selected;
    };

    $scope.filterMeritByCategory = function (category, selected) {
        if (selected) {
            $scope.filteredMeritCategories.push(category);
        } else {
            $scope.filteredMeritCategories.splice($scope.filteredMeritCategories.indexOf(category), 1);
        }
    };

    $scope.filteredMerit = function (meritMixed) {

        if ($scope.filteredMeritAvailable) {
            if (meritMixed.available != true) {
                return true;
            }
        }

        if ($scope.filteredMeritCategories.length == 0) {
            return false;
        }

        var categories = meritMixed.merit.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredMeritCategories.indexOf(item) != -1) {
                result = false;
            }
        });
        return result;
    };

    function updateAttributePrerequisites(attribute_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritAttributes, function (meritAttribute) {
                if (meritAttribute.AttributeId == attribute_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateAttachedSkillPrerequisites(attachedSkill_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritAttachedSkills, function (meritAttachedSkill) {
                if (meritAttachedSkill.AttachedSkillId == attachedSkill_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateAttributeAttachedSkillPrerequisites(id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                if (meritAttributeAttachedSkill.AttributeId == id || meritAttributeAttachedSkill.AttachedSkillId == id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateTriggerSkillPrerequisites(triggerSkill_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritTriggerSkills, function (meritTriggerSkill) {
                if (meritTriggerSkill.TriggerSkillId == triggerSkill_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateFlawPrerequisites(flaw_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritFlaws, function (meritFlaw) {
                if (meritFlaw.FlawId == flaw_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateMeritPrerequisites(merit_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritMerits, function (meritMerit) {
                if (meritMerit.PrerequisiteMeritId == merit_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    var merits = $q.defer();
    var inherents = $q.defer();
    var flaws = $q.defer();
    var attachedSkills = $q.defer();
    var triggerSkills = $q.defer();
    var personage = $q.defer();
    var raceAttributes = $q.defer();
    var raceInherents = $q.defer();
    var personageAttachedSkills = $q.defer();
    var personageTriggerSkills = $q.defer();
    var personageFlaws = $q.defer();
    var personageMerits = $q.defer();
    var personageInherents = $q.defer();
    var personageSpells = $q.defer();

    function success() {
        $scope.hasInherents();
        recalculateBasicCharacteristics();
        calculateAttachedSkillsToShow();
        calculateTriggerSkillsToShow();
        calculateFlawsToShow();
        calculateMeritsToShow();
        calculateSpellsToShow();
        calculateAddedSchools();
        $scope.loader = false;
    }

    var all = $q.all([
        merits.promise,
        inherents.promise,
        flaws.promise,
        attachedSkills.promise,
        triggerSkills.promise,
        personage.promise,
        raceAttributes.promise,
        raceInherents.promise,
        personageAttachedSkills.promise,
        personageTriggerSkills.promise,
        personageFlaws.promise,
        personageMerits.promise,
        personageInherents.promise,
        personageSpells.promise
    ]);

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
        angular.forEach(results.attachedSkills, function (attachedSkill) {
            if (attachedSkill.spells_connected) {
                $scope.magicSchools.push(attachedSkill);
            }
        });
        attachedSkills.resolve();
    });

    $http.get('/triggerSkills').success(function (results) {
        $scope.triggerSkills = results.triggerSkills;
        triggerSkills.resolve();
    });

    $http.get('/personageAttachedSkillsByPersonageId/' + personageId).success(function (data) {
        $scope.personageAttachedSkills = data.data;
        personageAttachedSkills.resolve();
    });

    $http.get('/personageTriggerSkillsByPersonageId/' + personageId).success(function (data) {
        $scope.personageTriggerSkills = data.data;
        personageTriggerSkills.resolve();
    });

    $http.get('/personageFlawsByPersonageId/' + personageId).success(function (data) {
        $scope.personageFlaws = data.data;
        personageFlaws.resolve();
    });

    $http.get('/personageMeritsByPersonageId/' + personageId).success(function (data) {
        $scope.personageMerits = data.data;
        personageMerits.resolve();
    });

    $http.get('/personageInherentsByPersonageId/' + personageId).success(function (data) {
        $scope.personageInherents = data.data;
        personageInherents.resolve();
    });

    $http.get('/personageSpellsByPersonageId/' + personageId).success(function (data) {
        $scope.personageSpells = data.personageSpells;
        personageSpells.resolve();
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
            $scope.showGenerateIneherentsButton = result.result == null;
        });
    };

    function recalculateBasicCharacteristics() {
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

    }

    $scope.increaseAttribute = function (id) {
        $scope.loader = true;
        var maxPrice = 8;
        var isPrimaryAttributeSet = false;
        var isSecondaryAttributeSet = 0;

        angular.forEach($scope.raceAttributes, function (raceAttribute) {
            angular.forEach($scope.personageAttributes, function (personageAttribute) {
                if (raceAttribute.Attribute.id == personageAttribute.Attribute.id) {
                    if (personageAttribute.value > maxPrice - raceAttribute.base_cost) {
                        isSecondaryAttributeSet++;
                    }
                    if (personageAttribute.value > maxPrice - raceAttribute.base_cost + 1) {
                        isPrimaryAttributeSet = true;
                    }
                }
            });
        });


        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (personageAttribute.id == id) {
                angular.forEach($scope.raceAttributes, function (raceAttribute) {
                    if (raceAttribute.Attribute.id == personageAttribute.Attribute.id && personageAttribute.value < maxPrice - raceAttribute.base_cost + 2) {
                        if (personageAttribute.value < maxPrice - raceAttribute.base_cost) {
                            personageAttribute.value++;
                            $scope.personage.experience = $scope.personage.experience - raceAttribute.base_cost;
                            updateAttributePrerequisites(personageAttribute.Attribute.id);
                            updateAttributeAttachedSkillPrerequisites(personageAttribute.Attribute.id);
                        } else {
                            if (personageAttribute.value == maxPrice - raceAttribute.base_cost + 1) {
                                if (!isPrimaryAttributeSet) {
                                    personageAttribute.value++;
                                    $scope.personage.experience = $scope.personage.experience - raceAttribute.base_cost;
                                    updateAttributePrerequisites(personageAttribute.Attribute.id);
                                    updateAttributeAttachedSkillPrerequisites(personageAttribute.Attribute.id);
                                }
                            } else {
                                if (isSecondaryAttributeSet < 3) {
                                    personageAttribute.value++;
                                    $scope.personage.experience = $scope.personage.experience - raceAttribute.base_cost;
                                    updateAttributePrerequisites(personageAttribute.Attribute.id);
                                    updateAttributeAttachedSkillPrerequisites(personageAttribute.Attribute.id);
                                }
                            }
                        }
                    }
                });
            }
        });

        recalculateBasicCharacteristics();
        $scope.loader = false;
    };

    $scope.decreaseAttribute = function (id) {
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (personageAttribute.id == id && personageAttribute.value > 1) {

                checkAttributeRelatedPrerequisites(personageAttribute).then(function (changesConfirmed) {
                    if (changesConfirmed) {
                        personageAttribute.value--;
                        angular.forEach($scope.raceAttributes, function (raceAttribute) {
                            if (raceAttribute.Attribute.id == personageAttribute.Attribute.id) {
                                $scope.personage.experience = $scope.personage.experience + raceAttribute.base_cost;
                                updateAttributePrerequisites(personageAttribute.Attribute.id);
                                updateAttributeAttachedSkillPrerequisites(personageAttribute.Attribute.id);
                            }
                        });
                    }
                });
            }
        });
        recalculateBasicCharacteristics();
    };

    function checkAttributeRelatedPrerequisites(personageAttribute) {
        var result = $q.defer();
        $scope.itemsToDelete = [];
        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritAttributes, function (meritAttribute) {
                if (personageAttribute.Attribute.id == meritAttribute.Attribute.id) {
                    if (personageAttribute.value <= meritAttribute.value) {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMerit,
                            prerequisiteName: personageAttribute.Attribute.name,
                            prerequisiteValue: personageAttribute.value
                        });
                    }
                }
            });

            angular.forEach(personageMerit.Merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                if (personageAttribute.Attribute.id == meritAttributeAttachedSkill.Attribute.id) {
                    angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                        if (personageAttachedSkill.AttachedSkill.id == meritAttributeAttachedSkill.AttachedSkill.id) {
                            if (personageAttachedSkill.value + personageAttribute.value <= meritAttributeAttachedSkill.value) {
                                $scope.itemsToDelete.push({
                                    targetMerit: personageMerit,
                                    prerequisiteName: personageAttachedSkill.AttachedSkill.name + '+' + personageAttribute.Attribute.name,
                                    prerequisiteValue: personageAttachedSkill.value + personageAttribute.value
                                });
                            }
                        }
                    });
                }
            });
        });

        if ($scope.itemsToDelete.length) {
            var checkMeritPromises = [];
            angular.forEach($scope.itemsToDelete, function (item) {
                checkMeritPromises.push(checkMeritRelatedPrerequisites(item.targetMerit, 'delete'));
            });
            $q.all(checkMeritPromises).then(function () {
                $('#confirmChangesModal').modal('show');
                $('#deleteConfirmed').click(function () {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                });
                $('#deleteCancelled').click(function () {
                    result.resolve(false);
                });
            });
        } else {
            result.resolve(true);
        }

        return result.promise;
    }

    $scope.addPersonageSpell = function (spell) {
        var personageSpell = {
            Spell: spell,
            SpellId: spell.id,
            PersonageId: personageId,
            level: 0,
            tutored: false
        };
        $scope.personageSpells.push(personageSpell);

        angular.forEach($scope.spellsBySchool, function (school) {
            angular.forEach(school.spells, function (spellInSchool) {
                if (spellInSchool.spell.id == spell.id) {
                    spellInSchool.personageSpell = personageSpell;
                }
            });
        });

        $scope.personage.experience = $scope.personage.experience - spell.cost;
    };

    $scope.deletePersonageSpell = function (personageSpell) {
        var index = $scope.personageSpells.indexOf(personageSpell);
        $scope.personageSpells.splice(index, 1);

        angular.forEach($scope.spellsBySchool, function (school) {
            angular.forEach(school.spells, function (spellInSchool) {
                if (spellInSchool.spell.id == personageSpell.Spell.id && spellInSchool.personageSpell != null) {
                    spellInSchool.personageSpell = null;
                }
            });
        });

        $scope.personage.experience = $scope.personage.experience + personageSpell.Spell.cost;
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
                            updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                            updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                            if (personageAttachedSkill.AttachedSkill.difficult) {
                                $scope.personage.experience = $scope.personage.experience - 2;
                            } else {
                                $scope.personage.experience = $scope.personage.experience - 1;
                            }
                        } else {
                            if (personageAttachedSkill.value < wisdomDoubleValue) {
                                personageAttachedSkill.value++;
                                updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
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
                                    updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                    updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                    if (personageAttachedSkill.AttachedSkill.difficult) {
                                        $scope.personage.experience = $scope.personage.experience - 2;
                                    } else {
                                        $scope.personage.experience = $scope.personage.experience - 1;
                                    }
                                } else {
                                    if (personageAttachedSkill.value < wisdomDoubleValue) {
                                        personageAttachedSkill.value++;
                                        updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                        updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
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
                                    updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                    updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                    if (personageAttachedSkill.AttachedSkill.difficult) {
                                        $scope.personage.experience = $scope.personage.experience - 2;
                                    } else {
                                        $scope.personage.experience = $scope.personage.experience - 1;
                                    }
                                } else {
                                    if (personageAttachedSkill.value < wisdomDoubleValue) {
                                        personageAttachedSkill.value++;
                                        updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                                        updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
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

        function success() {
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
                                updateTriggerSkillPrerequisites(id);
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
        angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
            if (personageAttachedSkill.AttachedSkill.id == id && personageAttachedSkill.value > 0) {
                checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, 'decrease').then(function (confirmedChanges) {
                    if (confirmedChanges) {
                        personageAttachedSkill.value--;
                        updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                        updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                        if (personageAttachedSkill.AttachedSkill.difficult) {
                            $scope.personage.experience = $scope.personage.experience + 2;
                        } else {
                            $scope.personage.experience = $scope.personage.experience + 1;
                        }
                    }
                });
            }
        });
    };

    function checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, action) {
        var result = $q.defer();
        $scope.itemsToDelete = [];

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritAttachedSkills, function (meritAttachedSkill) {
                if (personageAttachedSkill.AttachedSkill.id == meritAttachedSkill.AttachedSkill.id) {
                    if (action == 'delete') {
                        if (personageAttachedSkill.value >= meritAttachedSkill.value) {
                            $scope.itemsToDelete.push({
                                targetMerit: personageMerit,
                                prerequisiteName: personageAttachedSkill.AttachedSkill.name,
                                prerequisiteValue: meritAttachedSkill.value
                            });
                        }
                    }
                    if (action == 'decrease') {
                        if (personageAttachedSkill.value == meritAttachedSkill.value) {
                            $scope.itemsToDelete.push({
                                targetMerit: personageMerit,
                                prerequisiteName: personageAttachedSkill.AttachedSkill.name,
                                prerequisiteValue: meritAttachedSkill.value
                            });
                        }
                    }
                }
            });

            angular.forEach(personageMerit.Merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                if (personageAttachedSkill.AttachedSkill.id == meritAttributeAttachedSkill.AttachedSkill.id) {
                    angular.forEach($scope.personageAttributes, function (personageAttribute) {
                        if (personageAttribute.Attribute.id == meritAttributeAttachedSkill.Attribute.id) {
                            if (action == 'delete') {
                                if (personageAttachedSkill.value + personageAttribute.value >= meritAttributeAttachedSkill.value) {
                                    $scope.itemsToDelete.push({
                                        targetMerit: personageMerit,
                                        prerequisiteName: personageAttachedSkill.AttachedSkill.name + '+' + personageAttribute.Attribute.name,
                                        prerequisiteValue: meritAttributeAttachedSkill.value
                                    });
                                }
                            }
                            if (action == 'decrease') {
                                if (personageAttachedSkill.value + personageAttribute.value == meritAttributeAttachedSkill.value) {
                                    $scope.itemsToDelete.push({
                                        targetMerit: personageMerit,
                                        prerequisiteName: personageAttachedSkill.AttachedSkill.name + '+' + personageAttribute.Attribute.name,
                                        prerequisiteValue: meritAttributeAttachedSkill.value
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });

        if ($scope.itemsToDelete.length) {
            var checkMeritPromises = [];
            angular.forEach($scope.itemsToDelete, function (item) {
                checkMeritPromises.push(checkMeritRelatedPrerequisites(item.targetMerit, 'delete'));
            });
            $q.all(checkMeritPromises).then(function () {
                $('#confirmChangesModal').modal('show');
                $('#deleteConfirmed').click(function () {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                });
                $('#deleteCancelled').click(function () {
                    result.resolve(false);
                });
            });
        } else {
            result.resolve(true);
        }

        return result.promise;
    }

    $scope.decreaseTriggerSkillLevel = function (id) {
        angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
            if (personageTriggerSkill.TriggerSkill.id == id) {

                var previousLevel = personageTriggerSkill.currentLevel - 1;
                var currentLevel = personageTriggerSkill.currentLevel;

                checkTriggerSkillRelatedPrerequisites(personageTriggerSkill).then(function (result) {
                    if (result) {
                        $http.get('/skillLevelsByTriggerSkillId/' + id).success(function (results) {
                            if (previousLevel == 0) {
                                personageTriggerSkill.currentLevel--;
                            }
                            angular.forEach(results.skillLevels, function (skillLevel) {
                                if (skillLevel.level == previousLevel) {
                                    personageTriggerSkill.currentLevel--;
                                    updateTriggerSkillPrerequisites(id);
                                }
                                if (skillLevel.level == currentLevel) {
                                    $http.get('/byKey/' + 'TRIGGER_LEVEL' + skillLevel.level.toString() + 'UP').success(function (result) {
                                        $scope.personage.experience = $scope.personage.experience + parseInt(result.result.value);
                                    });
                                }
                            });
                        });
                    }
                });
            }
        });
    };

    function getPrerequisites(merit) {
        var invalidPrerequisites = [];

        if (merit.MeritAttributes.length != 0) {
            angular.forEach(merit.MeritAttributes, function (meritAttribute) {
                angular.forEach($scope.personageAttributes, function (personageAttribute) {
                    if (meritAttribute.AttributeId == personageAttribute.AttributeId) {
                        if (personageAttribute.value < meritAttribute.value) {
                            invalidPrerequisites.push({
                                name: meritAttribute.Attribute.name,
                                expectedValue: meritAttribute.value
                            });
                        }
                    }
                });
            });
        }

        if (merit.MeritAttachedSkills.length != 0) {
            angular.forEach(merit.MeritAttachedSkills, function (meritAttachedSkill) {
                var expected = {
                    name: meritAttachedSkill.AttachedSkill.name,
                    expectedValue: meritAttachedSkill.value
                };
                var isPresent = false;
                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    if (meritAttachedSkill.AttachedSkillId == personageAttachedSkill.AttachedSkillId) {
                        isPresent = true;
                        if (personageAttachedSkill.currentLevel < meritAttachedSkill.value) {
                            invalidPrerequisites.push(expected);
                        }
                    }
                });
                if (!isPresent) {
                    invalidPrerequisites.push(expected);
                }
            });
        }

        if (merit.MeritAttributeAttachedSkills.length != 0) {
            angular.forEach(merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                var expected = {
                    name: meritAttributeAttachedSkill.Attribute.name + '+' + meritAttributeAttachedSkill.AttachedSkill.name,
                    expectedValue: meritAttributeAttachedSkill.value
                };
                var isPresent = false;
                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    if (meritAttributeAttachedSkill.AttachedSkillId == personageAttachedSkill.AttachedSkillId) {
                        isPresent = true;
                        angular.forEach($scope.personageAttributes, function (personageAttribute) {
                            if (meritAttributeAttachedSkill.AttributeId == personageAttribute.AttributeId) {
                                if (personageAttachedSkill.value + personageAttribute.value < meritAttributeAttachedSkill.value) {
                                    invalidPrerequisites.push(expected);
                                }
                            }
                        });
                    }
                });
                if (!isPresent) {
                    invalidPrerequisites.push(expected);
                }
            });
        }


        if (merit.MeritTriggerSkills.length != 0) {
            angular.forEach(merit.MeritTriggerSkills, function (meritTriggerSkill) {
                var expected = {
                    name: meritTriggerSkill.TriggerSkill.name,
                    expectedValue: getLevelName(meritTriggerSkill.level)
                };
                if ($scope.personageTriggerSkills.length == 0) {
                    invalidPrerequisites.push(expected);
                }
                var isPresent = false;
                angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                    if (meritTriggerSkill.TriggerSkillId == personageTriggerSkill.TriggerSkillId) {
                        isPresent = true;
                        if (personageTriggerSkill.currentLevel < meritTriggerSkill.level) {
                            invalidPrerequisites.push(expected);
                        }
                    }
                });
                if (!isPresent && $scope.personageTriggerSkills.length != 0) {
                    invalidPrerequisites.push(expected);
                }
            });
        }

        if (merit.MeritInherents.length != 0) {
            angular.forEach(merit.MeritInherents, function (meritInherent) {
                var isPresent = false;
                angular.forEach($scope.personageInherents, function (personageInherent) {
                    if (personageInherent.InherentId == meritInherent.InherentId) {
                        if (personageInherent.value != null) {
                            isPresent = true;
                            switch (meritInherent.lessMoreEqual) {
                                case 1:
                                    if (personageInherent.value < meritInherent.value) {
                                        invalidPrerequisites.push({
                                            name: meritInherent.Inherent.name,
                                            expectedValue: '>' + (meritInherent.value - 1)
                                        });
                                    }
                                    break;
                                case 0:
                                    if (personageInherent.value != meritInherent.value) {
                                        invalidPrerequisites.push({
                                            name: meritInherent.Inherent.name,
                                            expectedValue: '=' + meritInherent.value
                                        });
                                    }
                                    break;
                                case -1:
                                    if (personageInherent.value > meritInherent.value) {
                                        invalidPrerequisites.push({
                                            name: meritInherent.Inherent.name,
                                            expectedValue: '<' + (meritInherent.value + 1)
                                        });
                                    }
                                    break;
                            }
                        }
                    }
                });
                if (!isPresent) {
                    invalidPrerequisites.push({
                        name: meritInherent.Inherent.name,
                        expectedValue: 'присутствует'
                    });
                }
            });
        }

        if (merit.MeritFlaws.length != 0) {
            angular.forEach(merit.MeritFlaws, function (meritFlaw) {
                var isPresent = false;
                angular.forEach($scope.personageFlaws, function (personageFlaw) {
                    if (meritFlaw.FlawId == personageFlaw.FlawId) {
                        isPresent = true;
                    }
                });
                if (meritFlaw.presentAbsent) {
                    if (!isPresent) {
                        invalidPrerequisites.push({
                            name: meritFlaw.Flaw.name,
                            expectedValue: 'присутствует'
                        });
                    }
                }
                if (!meritFlaw.presentAbsent) {
                    if (isPresent) {
                        invalidPrerequisites.push({
                            name: meritFlaw.Flaw.name,
                            expectedValue: 'отсутствует'
                        });
                    }
                }
            });
        }

        if (merit.MeritMerits.length != 0) {
            angular.forEach(merit.MeritMerits, function (meritMerit) {
                var isPresent = false;
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    if (meritMerit.PrerequisiteMeritId == personageMerit.MeritId) {
                        isPresent = true;
                    }
                });
                if (meritMerit.presentAbsent) {
                    if (!isPresent) {
                        invalidPrerequisites.push({
                            name: meritMerit.MeritPrerequisite.name,
                            expectedValue: 'присутствует'
                        });
                    }
                }
                if (!meritMerit.presentAbsent) {
                    if (isPresent) {
                        invalidPrerequisites.push({
                            name: meritMerit.MeritPrerequisite.name,
                            expectedValue: 'отсутствует'
                        });
                    }
                }
            });
        }

        if (invalidPrerequisites.length == 0) {
            return true;
        } else {
            return invalidPrerequisites;
        }
    }

    function getLevelName(levelNumber) {
        var levelName = '';
        switch (levelNumber) {
            case 0:
                levelName = 'База';
                break;
            case 1:
                levelName = 'Эксперт';
                break;
            case 2:
                levelName = 'Мастер';
                break;
            case 3:
                levelName = 'Магистр';
                break;
            case 4:
                levelName = 'Гроссмейстер';
                break;
            default:
                levelName = 'Уровень не указан';
                break;
        }
        return levelName;
    }

    $scope.addPersonageMerit = function (merit) {
        var personageMerit = {
            Merit: merit,
            MeritId: merit.id,
            PersonageId: personageId
        };

        $scope.personageMerits.push(personageMerit);

        if (merit.name.indexOf('Талант') > -1) {
            angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                if (merit.name.indexOf(personageTriggerSkill.TriggerSkill.name) > -1) {
                    personageTriggerSkill.talented = true;
                }
            });
        }

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach($scope.meritsMixed, function (meritMixed) {
                if (personageMerit.Merit.id == meritMixed.merit.id && meritMixed.personageMerit == null) {
                    meritMixed.personageMerit = personageMerit;
                }
            });
        });
        updateMeritPrerequisites(merit.id);
        $scope.personage.experience = $scope.personage.experience - merit.cost;
    };

    $scope.checkPrerequisitesAndDeletePersonageMerit = function (personageMerit) {
        $scope.itemsToDelete = [];
        checkMeritRelatedPrerequisites(personageMerit, 'delete').then(function () {
            if ($scope.itemsToDelete.length) {
                var result = $q.defer();
                $('#confirmChangesModal').modal('show');
                $('#deleteConfirmed').click(function () {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                });
                $('#deleteCancelled').click(function () {
                    result.resolve(false);
                });
                result.promise.then(function (confirmedChanges) {
                    if (confirmedChanges) {
                        deletePersonageMerit(personageMerit);
                    }
                });
            } else {
                deletePersonageMerit(personageMerit);
            }
        });
    };

    function deletePersonageMerit(personageMerit) {
        if (personageMerit.Merit.name.indexOf('Талант') > -1) {
            angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                if (personageMerit.Merit.name.indexOf(personageTriggerSkill.TriggerSkill.name) > -1) {
                    personageTriggerSkill.talented = false;
                }
            });
        }

        var index = $scope.personageMerits.indexOf(personageMerit);
        $scope.personageMerits.splice(index, 1);

        angular.forEach($scope.meritsMixed, function (meritMixed) {
            if (meritMixed.merit.id == personageMerit.Merit.id && meritMixed.personageMerit != null) {
                meritMixed.personageMerit = null;
            }
        });

        updateMeritPrerequisites(personageMerit.Merit.id);
        $scope.personage.experience = $scope.personage.experience + personageMerit.Merit.cost;

    }

    function checkMeritRelatedPrerequisites(personageMerit, action) {
        var defer = $q.defer();
        var resolved = false;
        angular.forEach($scope.personageMerits, function (personageMeritFromList) {
            var personageMeritToDelete = personageMeritFromList;
            angular.forEach(personageMeritFromList.Merit.MeritMerits, function (meritMerit) {
                if (personageMerit.Merit.id == meritMerit.MeritPrerequisite.id) {
                    if (meritMerit.presentAbsent && action == 'delete') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMeritToDelete,
                            prerequisiteName: meritMerit.MeritPrerequisite.name,
                            prerequisiteValue: 'присутствует'
                        });
                        checkMeritRelatedPrerequisites(personageMeritToDelete, 'delete');
                        resolved = true;
                        defer.resolve();
                    }
                    if (!meritMerit.presentAbsent && action == 'add') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMeritToDelete,
                            prerequisiteName: meritMerit.MeritPrerequisite.name,
                            prerequisiteValue: 'отсутствует'
                        });
                        checkMeritRelatedPrerequisites(personageMeritToDelete, 'delete');
                        resolved = true;
                        defer.resolve();
                    }
                }
            });
        });

        if (!resolved) {
            defer.resolve();
        }
        return defer.promise;
    }

    $scope.addPersonageFlaw = function (flaw) {
        var personageFlaw = {
            Flaw: flaw,
            FlawId: flaw.id,
            PersonageId: personageId
        };
        checkFlawRelatedPrerequisites(personageFlaw, 'add').then(function (confirmedChanges) {
            if (confirmedChanges) {
                $scope.personageFlaws.push(personageFlaw);

                angular.forEach($scope.flawsMixed, function (flawMixed) {
                    if (personageFlaw.Flaw.id == flawMixed.flaw.id && flawMixed.personageFlaw == null) {
                        flawMixed.personageFlaw = personageFlaw;
                    }
                });

                updateFlawPrerequisites(flaw.id);
                $scope.personage.experience = $scope.personage.experience + flaw.cost;
            }
        });
    };

    $scope.deletePersonageFlaw = function (personageFlaw) {
        checkFlawRelatedPrerequisites(personageFlaw, 'delete').then(function (confirmedChanges) {
            if (confirmedChanges) {
                var index = $scope.personageFlaws.indexOf(personageFlaw);
                $scope.personageFlaws.splice(index, 1);

                angular.forEach($scope.flawsMixed, function (flawMixed) {
                    if (flawMixed.flaw.id == personageFlaw.Flaw.id && flawMixed.personageFlaw != null) {
                        flawMixed.personageFlaw = null;
                    }
                });

                updateFlawPrerequisites(personageFlaw.Flaw.id);
                $scope.personage.experience = $scope.personage.experience - personageFlaw.Flaw.cost;
            }
        });
    };

    function checkFlawRelatedPrerequisites(personageFlaw, action) {
        var result = $q.defer();
        $scope.itemsToDelete = [];

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritFlaws, function (meritFlaw) {
                if (personageFlaw.Flaw.id == meritFlaw.Flaw.id) {
                    if (meritFlaw.presentAbsent && action == 'delete') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMerit,
                            prerequisiteName: meritFlaw.Flaw.name,
                            prerequisiteValue: 'присутствует'
                        });
                    }
                    if (!meritFlaw.presentAbsent && action == 'add') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMerit,
                            prerequisiteName: meritFlaw.Flaw.name,
                            prerequisiteValue: 'отсутствует'
                        });
                    }
                }
            });
        });

        if ($scope.itemsToDelete.length) {
            var checkMeritPromises = [];
            angular.forEach($scope.itemsToDelete, function (item) {
                checkMeritPromises.push(checkMeritRelatedPrerequisites(item.targetMerit, 'delete'));
            });
            $q.all(checkMeritPromises).then(function () {
                $('#confirmChangesModal').modal('show');
                $('#deleteConfirmed').click(function () {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                });
                $('#deleteCancelled').click(function () {
                    result.resolve(false);
                });
            });
        } else {
            result.resolve(true);
        }

        return result.promise;
    }

    $scope.addPersonageAttachedSkill = function (attachedSkill) {
        $scope.personageAttachedSkills.push({
            AttachedSkill: attachedSkill,
            AttachedSkillId: attachedSkill.id,
            PersonageId: personageId,
            value: 1
        });

        angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
            angular.forEach($scope.attachedSkillsMixed, function (attachedSkillMixed) {
                if (personageAttachedSkill.AttachedSkill.id == attachedSkillMixed.attachedSkill.id && attachedSkillMixed.personageAttachedSkill == null) {
                    attachedSkillMixed.personageAttachedSkill = personageAttachedSkill;
                }
            });
        });

        if (attachedSkill.difficult) {
            $scope.personage.experience = $scope.personage.experience - 2;
        } else {
            $scope.personage.experience = $scope.personage.experience - 1;
        }
        updateAttachedSkillPrerequisites(attachedSkill.id);
        updateAttributeAttachedSkillPrerequisites(attachedSkill.id);
        calculateAddedSchools();
    };

    $scope.changeColor = function (value) {
        if (value == null) {
            return {'background-color': '#C1BDBD', 'border-bottom': '3px solid white'};
        }
    };

    $scope.showHideDescription = function (id) {
        $scope.test = !$scope.test;
        $scope.clickedSpell = id;
    };

    $scope.isShowSpell = function (id) {
        return !!($scope.test && $scope.clickedSpell == id);
    };

    $scope.changeColorNotAvailable = function (available, isAdded) {
        if (available != true) {
            return {'background-color': '#e2b2b3', 'border-bottom': '3px solid white'};
        } else if (isAdded == null) {
            return {'background-color': '#C1BDBD', 'border-bottom': '3px solid white'};
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

    $scope.addPersonageTriggerSkill = function (triggerSkill) {
        $scope.loader = true;
        $scope.personageTriggerSkills.push({
            TriggerSkill: triggerSkill,
            TriggerSkillId: triggerSkill.id,
            PersonageId: personageId,
            currentLevel: 0,
            talented: false,
            tutored: false
        });

        angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
            angular.forEach($scope.triggerSkillsMixed, function (triggerSkillMixed) {
                if (personageTriggerSkill.TriggerSkill.id == triggerSkillMixed.triggerSkill.id && triggerSkillMixed.personageTriggerSkill == null) {
                    triggerSkillMixed.personageTriggerSkill = personageTriggerSkill;
                }
            });
        });

        $scope.personage.experience = $scope.personage.experience - triggerSkill.cost;
        updateTriggerSkillPrerequisites(triggerSkill.id);
        $scope.loader = false;
    };

    $scope.deletePersonageAttachedSkill = function (personageAttachedSkill) {
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
            checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, 'delete').then(function (result) {
                if (result) {
                    var index = $scope.personageAttachedSkills.indexOf(personageAttachedSkill);
                    $scope.personageAttachedSkills.splice(index, 1);

                    angular.forEach($scope.attachedSkillsMixed, function (attachedSkillMixed) {
                        if (attachedSkillMixed.attachedSkill.id == personageAttachedSkill.AttachedSkill.id && attachedSkillMixed.personageAttachedSkill != null) {
                            attachedSkillMixed.personageAttachedSkill = null;
                        }
                    });

                    if (personageAttachedSkill.AttachedSkill.difficult) {
                        $scope.personage.experience = $scope.personage.experience + 2 * personageAttachedSkill.value;
                    } else {
                        $scope.personage.experience = $scope.personage.experience + personageAttachedSkill.value;
                    }
                    updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                    updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                    calculateAddedSchools();
                }
            });
        }
    };

    $scope.deletePersonageTriggerSkill = function (personageTriggerSkill) {
        checkTriggerSkillRelatedPrerequisites(personageTriggerSkill).then(function (result) {
            if (result) {
                var index = $scope.personageTriggerSkills.indexOf(personageTriggerSkill);
                $scope.personageTriggerSkills.splice(index, 1);

                angular.forEach($scope.triggerSkillsMixed, function (triggerSkillMixed) {
                    if (triggerSkillMixed.triggerSkill.id == personageTriggerSkill.TriggerSkill.id && triggerSkillMixed.personageTriggerSkill != null) {
                        triggerSkillMixed.personageTriggerSkill = null;
                    }
                });

                updateTriggerSkillPrerequisites(personageTriggerSkill.TriggerSkill.id);
                $scope.personage.experience = $scope.personage.experience + personageTriggerSkill.TriggerSkill.cost;
            }
        });
    };

    function checkTriggerSkillRelatedPrerequisites(personageTriggerSkill) {
        var result = $q.defer();
        $scope.itemsToDelete = [];

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritTriggerSkills, function (meritTriggerSkill) {
                if (personageTriggerSkill.TriggerSkill.id == meritTriggerSkill.TriggerSkill.id) {
                    if (meritTriggerSkill.level == personageTriggerSkill.currentLevel) {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMerit,
                            prerequisiteName: personageTriggerSkill.TriggerSkill.name,
                            prerequisiteValue: getLevelName(personageTriggerSkill.currentLevel)
                        });
                    }
                }
            });
        });

        if ($scope.itemsToDelete.length) {
            var checkMeritPromises = [];
            angular.forEach($scope.itemsToDelete, function (item) {
                checkMeritPromises.push(checkMeritRelatedPrerequisites(item.targetMerit, 'delete'));
            });
            $q.all(checkMeritPromises).then(function () {
                $('#confirmChangesModal').modal('show');
                $('#deleteConfirmed').click(function () {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                });
                $('#deleteCancelled').click(function () {
                    result.resolve(false);
                });
            });
        } else {
            result.resolve(true);
        }

        return result.promise;
    }

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
})
;
