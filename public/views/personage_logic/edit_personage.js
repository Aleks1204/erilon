function isMobile() {
    return navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i);
}

var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage']);

app.controller("personageController", function ($scope, $http, $q, $timeout, $window) {
    $scope.hideEditBlock = true;
    $scope.hideEditDescriptionBlock = true;

    $scope.savePersonageName = function () {
        $http.put('/personages/' + personageId, {
            race_id: $scope.personage.RaceId,
            name: $scope.personage.name,
            age: $scope.age,
            max_age: $scope.max_age,
            generated: false,
            experience: $scope.personage.experience,
            notes: $scope.notes
        }).then(function () {
            $scope.hideEditBlock = true;
            $scope.hideEditDescriptionBlock = true;
        });
    };

    $scope.editExperince = function () {
        swal({
            title: "Опыт персонажа",
            input: "text",
            inputValue: $scope.personage.experience,
            showCancelButton: true,
            confirmButtonText: "Сохранить",
            cancelButtonText: "Отменить"
        }).then(function success(result) {
            $http.put('/personages/' + personageId, {
                race_id: $scope.personage.RaceId,
                name: $scope.personage.name,
                age: $scope.age,
                max_age: $scope.max_age,
                generated: false,
                experience: parseInt(result),
                notes: $scope.notes
            }).then(function () {
                $http.get('/personages/' + personageId).then(function (response) {
                    $scope.personage.experience = response.data.personage.experience;
                });
            });
        });
    };

    $scope.meritAvailable = true;

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
        if (window.location.href.indexOf('localhost') === -1) {
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
        $("#notes").hide();
        $("#steps").scrollTo('.inherentsButton');
        $(".inherentsButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".notesButton").removeClass('active');
    });

    $(".attributesButton").click(function () {
        $("#attr").show();
        $("#inherents").hide();
        $("#attached").hide();
        $("#trigger").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#notes").hide();
        $("#steps").scrollTo('.attributesButton');
        $(".attributesButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
        $(".notesButton").removeClass('active');
    });

    $(".attachedButton").click(function () {
        $("#attached").show();
        $("#attr").hide();
        $("#inherents").hide();
        $("#trigger").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#notes").hide();
        $("#steps").scrollTo('.attachedButton');
        $(".attachedButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
        $(".notesButton").removeClass('active');
        if (isMobile()) {
            $('tr.attached').find('td:not(:eq(0))').hide();
        }
    });

    $(".triggerButton").click(function () {
        $("#trigger").show();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#merits").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#notes").hide();
        $("#steps").scrollTo('.triggerButton');
        $(".triggerButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
        $(".notesButton").removeClass('active');
        if (isMobile()) {
            $('tr.trigger').find('td:not(:eq(0))').hide();
        }
    });

    $(".meritsButton").click(function () {
        $("#merits").show();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#flaws").hide();
        $("#spells").hide();
        $("#notes").hide();
        $("#steps").scrollTo('.meritsButton');
        $(".meritsButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
        $(".notesButton").removeClass('active');
        if (isMobile()) {
            $('tr.merit').find('td:not(:eq(0))').hide();
        }
    });

    $(".flawsButton").click(function () {
        $("#flaws").show();
        $("#merits").hide();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#spells").hide();
        $("#notes").hide();
        $("#steps").scrollTo('.flawsButton');
        $(".flawsButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
        $(".notesButton").removeClass('active');
        if (isMobile()) {
            $('tr.flaw').find('td:not(:eq(0))').hide();
        }
    });

    $(".spellsButton").click(function () {
        $("#spells").show();
        $("#flaws").hide();
        $("#merits").hide();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#notes").hide();
        $("#steps").scrollTo('.spellsButton');
        $(".spellsButton").addClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
        $(".notesButton").removeClass('active');
        if (isMobile()) {
            $('tr.spells').find('td:not(:eq(0))').hide();
        }
    });

    $(".notesButton").click(function () {
        $("#notes").show();
        $("#spells").hide();
        $("#flaws").hide();
        $("#merits").hide();
        $("#trigger").hide();
        $("#attr").hide();
        $("#inherents").hide();
        $("#attached").hide();
        $("#steps").scrollTo('.notesButton');
        $(".notesButton").addClass('active');
        $(".spellsButton").removeClass('active');
        $(".flawsButton").removeClass('active');
        $(".meritsButton").removeClass('active');
        $(".triggerButton").removeClass('active');
        $(".attachedButton").removeClass('active');
        $(".attributesButton").removeClass('active');
        $(".inherentsButton").removeClass('active');
    });

    var changes = {
        added: [],
        valueIncreased: []
    };

    function returnInitialValueIfWasIncreased(name) {
        var result = $.grep(changes.valueIncreased, function (increased) {
            return increased.name === name;
        });
        if (result.length === 0) {
            return null;
        } else {
            return result[0].initialValue;
        }
    }

    function wasAdded(name) {
        return changes.added.indexOf(name) !== -1;
    }

    $scope.flawsToShow = [];

    function calculateFlawsToShow() {
        $scope.flawsToShow = [];
        angular.forEach($scope.personageFlaws, function (personageFlaw) {
            $scope.flawsToShow.push({
                personageFlaw: personageFlaw,
                deleted: false
            });
        });
    }

    $scope.personageInherentValue = null;
    $scope.addPersonageInherent = function () {
        var value = null;
        if ($scope.personageInherentValue !== null) {
            value = $scope.personageInherentValue;
        }
        $http.post('/personageInherents', {
            inherent_id: $scope.inherent_id,
            personage_id: personageId,
            value: value
        }).then(function () {
            $http.get('/personageInherentsByPersonageId/' + personageId).then(function (response) {
                $scope.personageInherents = response.data.data;
            });
        });
    };

    $scope.deletePersonageInherent = function (personageInherentId) {
        $http.delete('/personageInherents/' + personageInherentId).then(function () {
            $http.get('/personageInherentsByPersonageId/' + personageId).then(function (response) {
                $scope.personageInherents = response.data.data;
            });
        });
    };

    $scope.filteredDefault = false;
    $scope.filteredTheoretical = false;
    $scope.attachedSkillsMixed = [];

    function calculateAttachedSkillsToShow() {
        angular.forEach($scope.attachedSkills, function (attachedSkill) {
            var targetPersonageAS = null;
            angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                if (attachedSkill.id === personageAttachedSkill.AttachedSkill.id) {
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


    $scope.isCategoryAttachedSkillsMenuClose = true;

    var attachedSkillsCategoriesFilerMenu = new Menu({
        wrapper: '.o-wrapper-attached-skills',
        type: 'slide-bottom',
        mask: '.c-mask',
        size: 390
    });

    $scope.openHideAttachedSkillsCategoriesFilerMenu = function () {
        if ($scope.isCategoryAttachedSkillsMenuClose) {
            attachedSkillsCategoriesFilerMenu.open();
            $scope.isCategoryAttachedSkillsMenuClose = false;
        } else {
            attachedSkillsCategoriesFilerMenu.close();
            $scope.isCategoryAttachedSkillsMenuClose = true;
        }
    };

    $scope.addedAttachedSkillsFilter = false;

    $scope.filterAttachedSkillsByCategory = function (category, selected) {
        if (selected) {
            $scope.filteredAttachedSkillsCategories.push(category);
        } else {
            $scope.filteredAttachedSkillsCategories.splice($scope.filteredAttachedSkillsCategories.indexOf(category), 1);
        }
    };

    $scope.filteredAttachedSkillsDefault = false;

    $scope.filterAttachedSkillsByDefaultShow = function (selected) {
        if ($scope.filteredAttachedSkillsDefault) {
            $scope.search.default_skill = false;
            $scope.filteredAttachedSkillsDefault = false;
        }
        $scope.filteredAttachedSkillsDefaultShow = selected;
    };

    $scope.filterAttachedSkillsByDefault = function (selected) {
        $scope.filteredAttachedSkillsDefault = selected;
    };

    $scope.filterAttachedSkillsByTheoretical = function (selected) {
        $scope.filteredAttachedSkillsTheoretical = selected;
    };

    $scope.filteredAttachedSkills = function (skillItem) {
        if (skillItem.personageAttachedSkill === null && $scope.addedAttachedSkillsFilter) {
            return true;
        }

        if (!$scope.filteredAttachedSkillsDefaultShow && !isMobile()) {
            if (skillItem.attachedSkill.default_skill) {
                return true;
            }
        }

        if ($scope.filteredAttachedSkillsTheoretical) {
            if (!skillItem.attachedSkill.theoretical) {
                return true;
            }
        }

        if ($scope.filteredAttachedSkillsDefault) {
            if (!skillItem.attachedSkill.default_skill) {
                return true;
            }
        }

        if ($scope.filteredAttachedSkillsCategories.length === 0) {
            return false;
        }

        var categories = skillItem.attachedSkill.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredAttachedSkillsCategories.indexOf(item) !== -1) {
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
                if (triggerSkill.id === personageTriggerSkill.TriggerSkill.id) {
                    targetPersonageTriggerSkill = personageTriggerSkill;
                }
            });
            $scope.triggerSkillsMixed.push({
                triggerSkill: triggerSkill,
                personageTriggerSkill: targetPersonageTriggerSkill
            });
        });
    }

    $('.category-table').find('tr').click(function (event) {
        if (event.target.type !== 'checkbox') {
            $(':checkbox', this).trigger('click');
        }
    });

    $scope.isCategoryTriggerSkillsMenuClose = true;

    var triggerSkillsCategoriesFilerMenu = new Menu({
        wrapper: '.o-wrapper-trigger-skills',
        type: 'slide-bottom',
        mask: '.c-mask',
        size: 133
    });

    $scope.openHideTriggerSkillsCategoriesFilerMenu = function () {
        if ($scope.isCategoryTriggerSkillsMenuClose) {
            triggerSkillsCategoriesFilerMenu.open();
            $scope.isCategoryTriggerSkillsMenuClose = false;
        } else {
            triggerSkillsCategoriesFilerMenu.close();
            $scope.isCategoryTriggerSkillsMenuClose = true;
        }
    };

    $scope.filteredTriggerSkillsCategories = [];

    $scope.filterTriggerSkillsByCategory = function (category, selected) {
        if (selected) {
            $scope.filteredTriggerSkillsCategories.push(category);
        } else {
            $scope.filteredTriggerSkillsCategories.splice($scope.filteredTriggerSkillsCategories.indexOf(category), 1);
        }
    };

    $scope.addedTriggerSkillsFilter = false;

    $scope.filteredTriggerSkills = function (skillItem) {
        if (skillItem.personageTriggerSkill === null && $scope.addedTriggerSkillsFilter) {
            return true;
        }

        if ($scope.filteredTriggerSkillsCategories.length === 0) {
            return false;
        }

        var categories = skillItem.triggerSkill.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredTriggerSkillsCategories.indexOf(item) !== -1) {
                result = false;
            }
        });
        return result;
    };

    $scope.meritsMixed = [];

    function calculateMeritsToShow() {
        $http.get('/raceMeritsByRaceId/' + $scope.personage.RaceId).then(function (response) {
            angular.forEach(response.data.data, function (raceMerit) {
                for (var i = 0; i < $scope.personageMerits.length; i++) {
                    if (!raceMerit.race_default && raceMerit.race_cost !== 0 && raceMerit.MeritId === $scope.personageMerits[i].Merit.id) {
                        $scope.personageMerits[i].Merit.cost = raceMerit.race_cost;
                    }
                }
            });

            angular.forEach($scope.merits, function (merit) {
                var targetPersonageMerit = null;
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    if (merit.id === personageMerit.Merit.id) {
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

    }

    $scope.isCategoryMeritsMenuClose = true;

    var meritsCategoriesFilterMenu = new Menu({
        wrapper: '.o-wrapper-merits',
        type: 'slide-bottom',
        mask: '.c-mask',
        size: 343
    });

    $scope.openHideMeritsCategoriesFilterMenu = function () {
        if ($scope.isCategoryMeritsMenuClose) {
            meritsCategoriesFilterMenu.open();
            $scope.isCategoryMeritsMenuClose = false;
        } else {
            meritsCategoriesFilterMenu.close();
            $scope.isCategoryMeritsMenuClose = true;
        }
    };

    $scope.spellsBySchool = [];

    function calculateSpellsToShow() {
        angular.forEach($scope.magicSchools, function (school) {
            var spells = [];
            angular.forEach(school.Spells, function (spell) {
                var targetPersonageSpell = null;
                angular.forEach($scope.personageSpells, function (personageSpell) {
                    if (spell.id === personageSpell.Spell.id) {
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
                if (personageAttachedSkill.AttachedSkillId === school.school.id) {
                    school.added = true;
                }
            });
        });
    }

    $scope.isCategorySpellsMenuClose = true;

    var spellsCategoriesFilterMenu = new Menu({
        wrapper: '.o-wrapper-spells',
        type: 'slide-bottom',
        mask: '.c-mask',
        size: 95
    });

    $scope.openHideSpellsCategoriesFilterMenu = function () {
        if ($scope.isCategorySpellsMenuClose) {
            spellsCategoriesFilterMenu.open();
            $scope.isCategorySpellsMenuClose = false;
        } else {
            spellsCategoriesFilterMenu.close();
            $scope.isCategorySpellsMenuClose = true;
        }
    };

    $scope.filteredMeritCategories = [];

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

    $scope.addedMeritsFilter = false;

    $scope.filteredMerit = function (meritMixed) {
        if (meritMixed.merit.name === 'Симпатичность' ||
            meritMixed.merit.name === 'Эльфийская ловкость' ||
            meritMixed.merit.name === 'Эльфийская скорость' ||
            meritMixed.merit.name === 'Эльфийская харизма' ||
            meritMixed.merit.name === 'Эльфийское восприятие') {
            return true;
        }

        if (meritMixed.merit.creation_only) {
            return true;
        }

        if (meritMixed.personageMerit === null && $scope.addedMeritsFilter) {
            return true;
        }

        if ($scope.filteredMeritAvailable) {
            if (meritMixed.available !== true) {
                return true;
            }
        }

        if ($scope.filteredMeritCategories.length === 0) {
            return false;
        }

        var categories = meritMixed.merit.category.split(",");
        var result = true;
        categories.forEach(function (item) {
            if ($scope.filteredMeritCategories.indexOf(item) !== -1) {
                result = false;
            }
        });
        return result;
    };

    function updateAttributePrerequisites(attribute_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritAttributes, function (meritAttribute) {
                if (meritAttribute.AttributeId === attribute_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateAttachedSkillPrerequisites(attachedSkill_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritAttachedSkills, function (meritAttachedSkill) {
                if (meritAttachedSkill.AttachedSkillId === attachedSkill_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateAttributeAttachedSkillPrerequisites(id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                if (meritAttributeAttachedSkill.AttributeId === id || meritAttributeAttachedSkill.AttachedSkillId === id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateTriggerSkillPrerequisites(triggerSkill_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritTriggerSkills, function (meritTriggerSkill) {
                if (meritTriggerSkill.TriggerSkillId === triggerSkill_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateFlawPrerequisites(flaw_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritFlaws, function (meritFlaw) {
                if (meritFlaw.FlawId === flaw_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateMeritPrerequisites(merit_id) {
        angular.forEach($scope.meritsMixed, function (meritMixed) {
            angular.forEach(meritMixed.merit.MeritMerits, function (meritMerit) {
                if (meritMerit.PrerequisiteMeritId === merit_id) {
                    meritMixed.available = getPrerequisites(meritMixed.merit);
                }
            })
        });
    }

    function updateInherentsPrerequisites() {
        angular.forEach($scope.personageInherents, function (personageInherent) {
            angular.forEach($scope.meritsMixed, function (meritMixed) {
                angular.forEach(meritMixed.merit.MeritInherents, function (meritInherent) {
                    if (meritInherent.InherentId === personageInherent.InherentId) {
                        meritMixed.available = getPrerequisites(meritMixed.merit);
                    }
                })
            });
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
    var personageNotices = $q.defer();

    function success() {
        recalculateBasicCharacteristics(false);
        calculateAttachedSkillsToShow();
        calculateTriggerSkillsToShow();
        calculateMeritsToShow();
        calculateFlawsToShow();
        calculateSpellsToShow();
        calculateAddedSchools();
        $('#loader').hide();
        $('section').removeClass('hide');
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
        personageSpells.promise,
        personageNotices.promise
    ]);

    all.then(success);

    $http.get('/merits').then(function (response) {
        $scope.merits = response.data.data;
        merits.resolve();
    });

    $http.get('/inherents').then(function (response) {
        $scope.inherents = response.data.data;
        inherents.resolve();
    });

    $http.get('/flaws').then(function (response) {
        $scope.flaws = response.data.data;
        flaws.resolve();
    });

    $http.get('/attachedSkills').then(function (response) {
        $scope.attachedSkills = response.data.data;
        angular.forEach(response.data.data, function (attachedSkill) {
            if (attachedSkill.spells_connected) {
                $scope.magicSchools.push(attachedSkill);
            }
        });
        attachedSkills.resolve();
    });

    $http.get('/triggerSkills').then(function (response) {
        $scope.triggerSkills = response.data.data;
        triggerSkills.resolve();
    });

    $http.get('/personageAttachedSkillsByPersonageId/' + personageId).then(function (response) {
        $scope.personageAttachedSkills = response.data.data;
        personageAttachedSkills.resolve();
    });

    $http.get('/personageTriggerSkillsByPersonageId/' + personageId).then(function (response) {
        $scope.personageTriggerSkills = response.data.data;
        personageTriggerSkills.resolve();
    });

    $http.get('/personageFlawsByPersonageId/' + personageId).then(function (response) {
        $scope.personageFlaws = response.data.data;
        personageFlaws.resolve();
    });

    $http.get('/personageMeritsByPersonageId/' + personageId).then(function (response) {
        $scope.personageMerits = response.data.data;
        personageMerits.resolve();
    });

    $http.get('/personageInherentsByPersonageId/' + personageId).then(function (response) {
        $scope.personageInherents = response.data.data;
        personageInherents.resolve();
    });

    $http.get('/personageSpellsByPersonageId/' + personageId).then(function (response) {
        $scope.personageSpells = response.data.personageSpells;
        personageSpells.resolve();
    });

    $http.get('/noticesByPersonageId/' + personageId).then(function (response) {
        $scope.notices = response.data.data;
        personageNotices.resolve();
    });

    $http.get('/personages/' + personageId).then(function (response) {
        $scope.personage = response.data.personage;
        $scope.age = response.data.personage.age;
        if (response.data.personage.max_age !== 0) {
            $scope.max_age = response.data.personage.max_age;
        } else {
            $scope.max_age = response.data.personage.Race.max_age;
        }
        $http.get('/raceAttributesByRaceId/' + response.data.personage.RaceId).then(function (response) {
            $scope.raceAttributes = response.data.data;
            raceAttributes.resolve();
        });
        $http.get('/raceInherentsByRaceId/' + response.data.personage.RaceId).then(function (response) {
            $scope.raceInherents = response.data.data;
            raceInherents.resolve();
        });

        $scope.personageAttributes = response.data.personage.PersonageAttributes;
        $scope.playerId = response.data.personage.PlayerId;
        personage.resolve();
    });

    function recalculateBasicCharacteristics(animate) {
        var buttonsToAnimate = [];
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            switch (personageAttribute.Attribute.name) {
                case "Сила":
                    if ($scope.power !== personageAttribute.value) {
                        buttonsToAnimate.push($('#hitChopPunch'));
                        buttonsToAnimate.push($('#parryChopPunch'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                        $scope.power = personageAttribute.value;
                    }
                    break;
                case "Ловкость":
                    if ($scope.dexterity !== personageAttribute.value) {
                        $scope.dexterity = personageAttribute.value;
                        buttonsToAnimate.push($('#hitPiercePunch'));
                        buttonsToAnimate.push($('#hitChopPunch'));
                        buttonsToAnimate.push($('#rangedHit'));
                        buttonsToAnimate.push($('#dodge'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                    }
                    break;
                case "Скорость":
                    if ($scope.speed !== personageAttribute.value) {
                        $scope.speed = personageAttribute.value;
                        buttonsToAnimate.push($('#hitPiercePunch'));
                        buttonsToAnimate.push($('parryPiercePunch'));
                        buttonsToAnimate.push($('#generalActionPoints'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                    }
                    break;
                case "Реакция":
                    if ($scope.reaction !== personageAttribute.value) {
                        $scope.reaction = personageAttribute.value;
                        buttonsToAnimate.push($('parryPiercePunch'));
                        buttonsToAnimate.push($('#parryChopPunch'));
                        buttonsToAnimate.push($('#dodge'));
                        buttonsToAnimate.push($('#initiative'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                    }
                    break;
                case "Восприятие":
                    if ($scope.perception !== personageAttribute.value) {
                        $scope.perception = personageAttribute.value;
                        buttonsToAnimate.push($('#rangedHit'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                    }
                    break;
                case "Выносливость":
                    if ($scope.endurance !== personageAttribute.value) {
                        $scope.endurance = personageAttribute.value;
                        buttonsToAnimate.push($('#endurancePoints'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                    }
                    break;
                case "Живучесть":
                    if ($scope.vitality !== personageAttribute.value) {
                        $scope.vitality = personageAttribute.value;
                    }
                    break;
                case "Мудрость":
                    if ($scope.wisdom !== personageAttribute.value) {
                        $scope.wisdom = personageAttribute.value;
                    }
                    break;
                case "Интеллект":
                    if ($scope.intelligence !== personageAttribute.value) {
                        $scope.intelligence = personageAttribute.value;
                        buttonsToAnimate.push($('#mentalActionPoints'));
                        buttonsToAnimate.push($('#generalActionPoints'));
                        animateButtons([$('#characteristics')], 'rubberBand');
                    }
                    break;
                case "Воля":
                    if ($scope.will !== personageAttribute.value) {
                        $scope.will = personageAttribute.value;
                    }
                    break;
                case "Харизма":
                    if ($scope.charisma !== personageAttribute.value) {
                        $scope.charisma = personageAttribute.value;
                    }
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

        if (animate) {
            animateButtons(buttonsToAnimate, 'tada');
        }
    }

    $scope.getPersonageAttributeValue = function (attribute) {
        var attributeValue = 0;
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (attribute.id === personageAttribute.Attribute.id) {
                attributeValue = personageAttribute.value;
            }
        });
        return attributeValue;
    };

    $scope.ifMagic = function (personageAttribute) {
        return personageAttribute.Attribute.name === 'Магия' && personageAttribute.value === 0;
    };

    function getAttributeModifier(attribute) {
        var modifier = 0;
        angular.forEach($scope.personageMerits, function (personageMerit) {
            if (personageMerit.Merit.name === 'Эльфийская ловкость' && attribute.name === 'Ловкость') {
                modifier = 1;
            }
            if (personageMerit.Merit.name === 'Эльфийская скорость' && attribute.name === 'Скорость') {
                modifier = 1;
            }
            if (personageMerit.Merit.name === 'Эльфийское восприятие' && attribute.name === 'Восприятие') {
                modifier = 1;
            }
            if (personageMerit.Merit.name === 'Эльфийская харизма' && attribute.name === 'Харизма') {
                modifier = 1;
            }
        });
        return modifier;
    }

    $scope.increaseAttribute = function (personageAttribute) {

        var maxPrice = 8;

        var modifier = getAttributeModifier(personageAttribute.Attribute);

        var costCoefficient = 1.5;
        if (personageAttribute.value >= 3) {
            costCoefficient = 2;
        }
        if (personageAttribute.value >= 6) {
            costCoefficient = 3;
        }
        if (personageAttribute.value >= 9) {
            costCoefficient = 4;
        }

        angular.forEach($scope.raceAttributes, function (raceAttribute) {
            if (raceAttribute.Attribute.id === personageAttribute.Attribute.id) {
                if (personageAttribute.value < maxPrice - raceAttribute.base_cost + 6 + modifier) {
                    if (returnInitialValueIfWasIncreased("Attribute_" + personageAttribute.Attribute.name) === null) {
                        changes.valueIncreased.push({
                            name: "Attribute_" + personageAttribute.Attribute.name,
                            initialValue: personageAttribute.value
                        });
                    }
                    personageAttribute.value++;
                    $scope.personage.experience = $scope.personage.experience - Math.floor(raceAttribute.base_cost * costCoefficient) + modifier;
                    updateAttributePrerequisites(personageAttribute.Attribute.id);
                    updateAttributeAttachedSkillPrerequisites(personageAttribute.Attribute.id);
                } else {
                    exceedLimit(personageAttribute.Attribute.name);
                }
            }
        });

        recalculateBasicCharacteristics(true);

    };

    $scope.isAttributeDecreasingPossible = function (personageAttribute) {
        var isDecreasingPossible = true;
        var initialValue = returnInitialValueIfWasIncreased("Attribute_" + personageAttribute.Attribute.name);
        if (initialValue !== null) {
            if (personageAttribute.value <= initialValue) {
                isDecreasingPossible = false;
            }
        } else {
            isDecreasingPossible = false;
        }
        return isDecreasingPossible;
    };

    $scope.decreaseAttribute = function (personageAttribute) {
        if (personageAttribute.value > 1) {
            var costCoefficient = 1.5;
            if (personageAttribute.value > 3) {
                costCoefficient = 2;
            }
            if (personageAttribute.value > 6) {
                costCoefficient = 3;
            }
            if (personageAttribute.value > 9) {
                costCoefficient = 4;
            }

            checkAttributeRelatedPrerequisites(personageAttribute).then(function (changesConfirmed) {
                if (changesConfirmed) {
                    personageAttribute.value--;
                    recalculateBasicCharacteristics(true);
                    angular.forEach($scope.raceAttributes, function (raceAttribute) {
                        if (raceAttribute.Attribute.id === personageAttribute.Attribute.id) {
                            $scope.personage.experience = $scope.personage.experience + Math.floor(raceAttribute.base_cost * costCoefficient) - getAttributeModifier(personageAttribute.Attribute);
                            updateAttributePrerequisites(personageAttribute.Attribute.id);
                            updateAttributeAttachedSkillPrerequisites(personageAttribute.Attribute.id);
                        }
                    });
                }
            });
        }
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

    function checkAttributeRelatedPrerequisites(personageAttribute) {
        $scope.itemsToDelete = [];
        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritAttributes, function (meritAttribute) {
                if (personageAttribute.Attribute.id === meritAttribute.Attribute.id) {
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
                if (personageAttribute.Attribute.id === meritAttributeAttachedSkill.Attribute.id) {
                    angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                        if (personageAttachedSkill.AttachedSkill.id === meritAttributeAttachedSkill.AttachedSkill.id) {
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

        return showAffectedMeritsModal();
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
                if (spellInSchool.spell.id === spell.id) {
                    spellInSchool.personageSpell = personageSpell;
                }
            });
        });

        if (!wasAdded("Spell_" + spell.name)) {
            changes.added.push("Spell_" + spell.name);
        }

        $scope.personage.experience = $scope.personage.experience - spell.cost;
    };

    $scope.isDeletingSpellPossible = function (personageSpell) {
        var isDeletingPossible = false;
        if (personageSpell !== null) {
            if (wasAdded("Spell_" + personageSpell.Spell.name)) {
                isDeletingPossible = true;
            }
        }
        return isDeletingPossible;
    };

    $scope.deletePersonageSpell = function (personageSpell) {
        var index = $scope.personageSpells.indexOf(personageSpell);
        if (index !== -1) {
            var level = personageSpell.level;
            for (var i = 0; i < level; i++) {
                $scope.decreaseSpellLevel(personageSpell);
                personageSpell.level--;
            }

            $scope.personageSpells.splice(index, 1);

            angular.forEach($scope.spellsBySchool, function (school) {
                angular.forEach(school.spells, function (spellInSchool) {
                    if (spellInSchool.spell.id === personageSpell.Spell.id && spellInSchool.personageSpell !== null) {
                        spellInSchool.personageSpell = null;
                    }
                });
            });

            $scope.personage.experience = $scope.personage.experience + personageSpell.Spell.cost;
        }
    };

    $scope.increaseSpellLevel = function (personageSpell) {
        var increaseLevel = $q.defer();

        function success(data) {
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

            if (returnInitialValueIfWasIncreased("Spell_" + personageSpell.Spell.name) === null) {
                changes.valueIncreased.push({
                    name: "Spell_" + personageSpell.Spell.name,
                    initialValue: personageSpell.level
                });
            }

            personageSpell.level++;
            $scope.personage.experience = $scope.personage.experience - cost;
            $http.post('/history', {
                key: 'SPELL_LEVEL_' + personageSpell.level.toString() + '_UP_' + personageId + '_' + personageSpell.SpellId,
                value: cost.toString()
            }).then(function () {
                increaseLevel.resolve();
            });
        } else {
            increaseLevel.resolve();
        }
    };

    $scope.isSpellDecreasingPossible = function (personageSpell) {
        var isDecreasingPossible = true;
        if (personageSpell !== null) {
            var initialValue = returnInitialValueIfWasIncreased("Spell_" + personageSpell.Spell.name);
            if (initialValue !== null) {
                if (personageSpell.level <= initialValue) {
                    isDecreasingPossible = false;
                }
            } else {
                isDecreasingPossible = false;
            }
        } else {
            isDecreasingPossible = false;
        }
        return isDecreasingPossible;
    };

    $scope.decreaseSpellLevel = function (personageSpell) {
        var decreaseLevel = $q.defer();

        function success(data) {
        }

        var all = $q.all([decreaseLevel.promise]);
        all.then(success);

        if (personageSpell.level > 0) {
            $http.get('/byKey/' + 'SPELL_LEVEL_' + personageSpell.level.toString() + '_UP_' + personageId + '_' + personageSpell.SpellId).then(function (response) {
                var value = personageSpell.Spell.cost * 2;
                if (response.data.result !== null) {
                    value = response.data.result.value;
                }
                $scope.personage.experience = $scope.personage.experience + parseInt(value);
                personageSpell.level--;
            }).then(function () {
                decreaseLevel.resolve();
            });
        } else {
            decreaseLevel.resolve();
        }
    };

    $scope.increaseAttachedSkill = function (personageAttachedSkill) {

        var wisdomDoubleValue = $scope.wisdom * 2;

        if (personageAttachedSkill.AttachedSkill.theoretical) {
            if (personageAttachedSkill.value < wisdomDoubleValue) {
                if (returnInitialValueIfWasIncreased("AttachedSkill_" + personageAttachedSkill.AttachedSkill.name) === null) {
                    changes.valueIncreased.push({
                        name: "AttachedSkill_" + personageAttachedSkill.AttachedSkill.name,
                        initialValue: personageAttachedSkill.value
                    });
                }
                personageAttachedSkill.value++;
                updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                if (personageAttachedSkill.AttachedSkill.difficult) {
                    $scope.personage.experience = $scope.personage.experience - personageAttachedSkill.value * 2;
                } else {
                    $scope.personage.experience = $scope.personage.experience - personageAttachedSkill.value;
                }
            } else {
                exceedWisdom(personageAttachedSkill.AttachedSkill.name);
            }
        } else {
            if (returnInitialValueIfWasIncreased("AttachedSkill_" + personageAttachedSkill.AttachedSkill.name) === null) {
                changes.valueIncreased.push({
                    name: "AttachedSkill_" + personageAttachedSkill.AttachedSkill.name,
                    initialValue: personageAttachedSkill.value
                });
            }
            personageAttachedSkill.value++;
            updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
            updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
            if (personageAttachedSkill.AttachedSkill.difficult) {
                $scope.personage.experience = $scope.personage.experience - personageAttachedSkill.value * 2;
            } else {
                $scope.personage.experience = $scope.personage.experience - personageAttachedSkill.value;
            }
        }

    };

    $scope.increaseTriggerSkillLevel = function (personageTriggerSkill) {


        var increaseLevel = $q.defer();

        function success() {
        }

        var all = $q.all([increaseLevel.promise]);
        all.then(success);

        var nextLevel = personageTriggerSkill.currentLevel + 1;
        var isIncreased = false;
        $http.get('/skillLevelsByTriggerSkillId/' + personageTriggerSkill.TriggerSkillId).then(function (response) {
            if (response.data.data.length === 0) {
                exceedTriggerSkillLevel(personageTriggerSkill.TriggerSkill.name);
                increaseLevel.resolve();
            } else {
                angular.forEach(response.data.data, function (skillLevel) {
                    if (skillLevel.level === nextLevel) {
                        isIncreased = true;
                        var cost = skillLevel.cost;
                        if (returnInitialValueIfWasIncreased("TriggerSkill_" + personageTriggerSkill.TriggerSkill.name) === null) {
                            changes.valueIncreased.push({
                                name: "TriggerSkill_" + personageTriggerSkill.TriggerSkill.name,
                                initialValue: personageTriggerSkill.currentLevel
                            });
                        }
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
                            key: 'TRIGGER_LEVEL_' + skillLevel.level.toString() + '_UP_' + personageId + '_' + personageTriggerSkill.TriggerSkillId,
                            value: cost.toString()
                        }).then(function () {
                            updateTriggerSkillPrerequisites(personageTriggerSkill.TriggerSkillId);
                            increaseLevel.resolve();
                        });
                    }
                });
                if (!isIncreased) {
                    exceedTriggerSkillLevel(personageTriggerSkill.TriggerSkill.name);
                    increaseLevel.resolve();
                }
            }
        });
    };

    $scope.isTriggerSkillDecreasingPossible = function (personageTriggerSkill) {
        var isDecreasingPossible = true;
        if (personageTriggerSkill !== null) {
            var initialValue = returnInitialValueIfWasIncreased("TriggerSkill_" + personageTriggerSkill.TriggerSkill.name);
            if (initialValue !== null) {
                if (personageTriggerSkill.currentLevel <= initialValue) {
                    isDecreasingPossible = false;
                }
            } else {
                isDecreasingPossible = false;
            }
        } else {
            isDecreasingPossible = false;
        }
        return isDecreasingPossible;
    };

    $scope.decreaseTriggerSkillLevel = function (personageTriggerSkill, deletion) {
        var previousLevel = personageTriggerSkill.currentLevel - 1;
        var currentLevel = personageTriggerSkill.currentLevel;

        checkTriggerSkillRelatedPrerequisites(personageTriggerSkill, false).then(function (result) {
            if (result) {
                $http.get('/skillLevelsByTriggerSkillId/' + personageTriggerSkill.TriggerSkillId).then(function (response) {
                    if (previousLevel === 0) {
                        console.log('decrease: ' + currentLevel);
                        personageTriggerSkill.currentLevel--;
                    }
                    angular.forEach(response.data.data, function (skillLevel) {
                        if (skillLevel.level === previousLevel) {
                            personageTriggerSkill.currentLevel--;
                            console.log('decrease: ' + currentLevel);
                            updateTriggerSkillPrerequisites(personageTriggerSkill.TriggerSkillId);
                        }
                        if (skillLevel.level === currentLevel) {
                            $http.get('/byKey/' + 'TRIGGER_LEVEL_' + skillLevel.level.toString() + '_UP_' + personageId + '_' + personageTriggerSkill.TriggerSkillId).then(function (response) {
                                $scope.personage.experience = $scope.personage.experience + parseInt(response.data.result.value);
                                if (deletion && currentLevel !== 0) {
                                    $scope.decreaseTriggerSkillLevel(personageTriggerSkill, true);
                                }
                            });
                        }
                    });
                });
            }
        });
    };

    $scope.isAttachedSkillDecreasingPossible = function (personageAttachedSkill) {
        var isDecreasingPossible = true;
        if (personageAttachedSkill !== null) {
            var initialValue = returnInitialValueIfWasIncreased("AttachedSkill_" + personageAttachedSkill.AttachedSkill.name);
            if (initialValue !== null) {
                if (personageAttachedSkill.value <= initialValue) {
                    isDecreasingPossible = false;
                }
            } else {
                isDecreasingPossible = false;
            }
        } else {
            isDecreasingPossible = false;
        }
        return isDecreasingPossible;
    };

    $scope.decreaseAttachedSkill = function (personageAttachedSkill) {
        if (personageAttachedSkill.value > 1) {
            checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, 'decrease').then(function (confirmedChanges) {
                if (confirmedChanges) {
                    personageAttachedSkill.value--;
                    updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                    updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                    if (personageAttachedSkill.AttachedSkill.difficult) {
                        $scope.personage.experience = $scope.personage.experience + (personageAttachedSkill.value + 1) * 2;
                    } else {
                        $scope.personage.experience = $scope.personage.experience + personageAttachedSkill.value + 1;
                    }
                }
            });
        } else if (personageAttachedSkill.AttachedSkill.default_skill && personageAttachedSkill.value > 0) {
            checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, 'decrease').then(function (confirmedChanges) {
                if (confirmedChanges) {
                    personageAttachedSkill.value--;
                    updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                    updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                    if (personageAttachedSkill.AttachedSkill.difficult) {
                        $scope.personage.experience = $scope.personage.experience + (personageAttachedSkill.value + 1) * 2;
                    } else {
                        $scope.personage.experience = $scope.personage.experience + personageAttachedSkill.value + 1;
                    }
                }
            });
        }
    };

    function checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, action) {
        $scope.itemsToDelete = [];

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritAttachedSkills, function (meritAttachedSkill) {
                if (personageAttachedSkill.AttachedSkill.id === meritAttachedSkill.AttachedSkill.id) {
                    if (action === 'delete') {
                        if (personageAttachedSkill.value >= meritAttachedSkill.value) {
                            $scope.itemsToDelete.push({
                                targetMerit: personageMerit,
                                prerequisiteName: personageAttachedSkill.AttachedSkill.name,
                                prerequisiteValue: meritAttachedSkill.value
                            });
                        }
                    }
                    if (action === 'decrease') {
                        if (personageAttachedSkill.value === meritAttachedSkill.value) {
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
                if (personageAttachedSkill.AttachedSkill.id === meritAttributeAttachedSkill.AttachedSkill.id) {
                    angular.forEach($scope.personageAttributes, function (personageAttribute) {
                        if (personageAttribute.Attribute.id === meritAttributeAttachedSkill.Attribute.id) {
                            if (action === 'delete') {
                                if (personageAttachedSkill.value + personageAttribute.value >= meritAttributeAttachedSkill.value) {
                                    $scope.itemsToDelete.push({
                                        targetMerit: personageMerit,
                                        prerequisiteName: personageAttachedSkill.AttachedSkill.name + '+' + personageAttribute.Attribute.name,
                                        prerequisiteValue: meritAttributeAttachedSkill.value
                                    });
                                }
                            }
                            if (action === 'decrease') {
                                if (personageAttachedSkill.value + personageAttribute.value === meritAttributeAttachedSkill.value) {
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

        return showAffectedMeritsModal();
    }

    function showAffectedMeritsModal() {
        var result = $q.defer();
        if ($scope.itemsToDelete.length > 0) {
            var checkMeritPromises = [];
            angular.forEach($scope.itemsToDelete, function (item) {
                checkMeritPromises.push(checkMeritRelatedPrerequisites(item.targetMerit, 'delete'));
            });
            var stringValue = '';
            angular.forEach($scope.itemsToDelete, function (item) {
                stringValue = stringValue + ", <strong>" + item.targetMerit.Merit.name + "</strong>" +
                    " имеет пререквизит <strong>" + item.prerequisiteName + ": " + item.prerequisiteValue + "</strong>"
            });

            stringValue = stringValue.substring(2);

            $q.all(checkMeritPromises).then(function () {
                swal({
                    title: "Вы уверены?",
                    html: "Данное изменение приведет к удалению достоинств: " + stringValue,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: "Согласен!",
                    cancelButtonText: "Отменить"
                }).then(function success() {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                }, function cancel() {
                    result.resolve(false);
                });
            });
        } else {
            result.resolve(true);
        }
        return result.promise;
    }

    function getPrerequisites(merit) {
        var invalidPrerequisites = [];

        if (merit.MeritAttributes.length !== 0) {
            angular.forEach(merit.MeritAttributes, function (meritAttribute) {
                angular.forEach($scope.personageAttributes, function (personageAttribute) {
                    if (meritAttribute.AttributeId === personageAttribute.AttributeId) {
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

        if (merit.MeritAttachedSkills.length !== 0) {
            angular.forEach(merit.MeritAttachedSkills, function (meritAttachedSkill) {
                var expected = {
                    name: meritAttachedSkill.AttachedSkill.name,
                    expectedValue: meritAttachedSkill.value
                };
                var isPresent = false;
                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    if (meritAttachedSkill.AttachedSkillId === personageAttachedSkill.AttachedSkillId) {
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

        if (merit.MeritAttributeAttachedSkills.length !== 0) {
            angular.forEach(merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                var expected = {
                    name: meritAttributeAttachedSkill.Attribute.name + '+' + meritAttributeAttachedSkill.AttachedSkill.name,
                    expectedValue: meritAttributeAttachedSkill.value
                };
                var isPresent = false;
                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    if (meritAttributeAttachedSkill.AttachedSkillId === personageAttachedSkill.AttachedSkillId) {
                        isPresent = true;
                        angular.forEach($scope.personageAttributes, function (personageAttribute) {
                            if (meritAttributeAttachedSkill.AttributeId === personageAttribute.AttributeId) {
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


        if (merit.MeritTriggerSkills.length !== 0) {
            angular.forEach(merit.MeritTriggerSkills, function (meritTriggerSkill) {
                var expected = {
                    name: meritTriggerSkill.TriggerSkill.name,
                    expectedValue: getLevelName(meritTriggerSkill.level)
                };
                if ($scope.personageTriggerSkills.length === 0) {
                    invalidPrerequisites.push(expected);
                }
                var isPresent = false;
                angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
                    if (meritTriggerSkill.TriggerSkillId === personageTriggerSkill.TriggerSkillId) {
                        isPresent = true;
                        if (personageTriggerSkill.currentLevel < meritTriggerSkill.level) {
                            invalidPrerequisites.push(expected);
                        }
                    }
                });
                if (!isPresent && $scope.personageTriggerSkills.length !== 0) {
                    invalidPrerequisites.push(expected);
                }
            });
        }

        if (merit.MeritInherents.length !== 0) {
            angular.forEach(merit.MeritInherents, function (meritInherent) {
                var isPresent = false;
                angular.forEach($scope.personageInherents, function (personageInherent) {
                    if (personageInherent.InherentId === meritInherent.InherentId) {
                        if (personageInherent.value !== null) {
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
                                    if (personageInherent.value !== meritInherent.value) {
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

        if (merit.MeritFlaws.length !== 0) {
            angular.forEach(merit.MeritFlaws, function (meritFlaw) {
                var isPresent = false;
                angular.forEach($scope.personageFlaws, function (personageFlaw) {
                    if (meritFlaw.FlawId === personageFlaw.FlawId) {
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

        if (merit.MeritMerits.length !== 0) {
            angular.forEach(merit.MeritMerits, function (meritMerit) {
                var isPresent = false;
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    if (meritMerit.PrerequisiteMeritId === personageMerit.MeritId) {
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

        if (invalidPrerequisites.length === 0) {
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

    function animateButtons(buttons, animatedStyle) {
        angular.forEach(buttons, function (button) {
            button.removeClass(animatedStyle + ' animated').addClass(animatedStyle + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass(animatedStyle + ' animated');
            });
        });
    }

    $scope.hitPiercePunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Скорость')
        ], 'shake');
    };

    $scope.hitChopPunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Силa')
        ], 'shake');
    };

    $scope.hitChopPunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Сила')
        ], 'shake');
    };

    $scope.rangedHitAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Восприятие')
        ], 'shake');
    };

    $scope.parryPiercePunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Скорость'),
            $('#Реакция')
        ], 'shake');
    };

    $scope.parryChopPunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Реакция'),
            $('#Сила')
        ], 'shake');
    };

    $scope.dodgeAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Реакция'),
            $('#Ловкость')
        ], 'shake');
    };

    $scope.generalActionPointsAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Интеллект'),
            $('#Скорость')
        ], 'shake');
    };

    $scope.mentalActionPointsAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Интеллект')
        ], 'shake');
    };

    $scope.endurancePointsAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Выносливость')
        ], 'shake');
    };

    $scope.initiativeAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Реакция')
        ], 'shake');
    };

    function exceedLimit(name) {
        $.notify({
            icon: 'fa fa-exclamation',
            message: 'Значение <strong>"' + name + '"</strong> достигло максимума'
        }, {
            placement: {
                align: "center"
            },
            type: 'danger',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
    }

    function exceedWisdom(name) {
        $.notify({
            icon: 'fa fa-exclamation',
            message: 'Значение <strong>"' + name + '"</strong> не может быть выше, чем удвоенная Мудрость персонажа'
        }, {
            placement: {
                align: "center"
            },
            type: 'danger',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
    }

    function exceedTriggerSkillLevel(name) {
        $.notify({
            icon: 'fa fa-exclamation',
            message: 'Уровень <strong>"' + name + '"</strong> на данный момент максимален'
        }, {
            placement: {
                align: "center"
            },
            type: 'danger',
            animate: {
                enter: 'animated lightSpeedIn',
                exit: 'animated lightSpeedOut'
            }
        });
    }

    $scope.isDeletingMeritPossible = function (personageMerit) {
        var isDeletingPossible = false;
        if (personageMerit !== null) {
            if (wasAdded("Merit_" + personageMerit.Merit.name)) {
                isDeletingPossible = true;
            }
        }
        return isDeletingPossible;
    };

    $scope.addPersonageMerit = function (merit) {
        var personageMerit = {
            Merit: merit,
            MeritId: merit.id,
            PersonageId: personageId
        };

        $scope.personageMerits.push(personageMerit);

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach($scope.meritsMixed, function (meritMixed) {
                if (personageMerit.Merit.id === meritMixed.merit.id && meritMixed.personageMerit === null) {
                    meritMixed.personageMerit = personageMerit;
                }
            });
        });
        updateMeritPrerequisites(merit.id);

        if (!wasAdded("Merit_" + merit.name)) {
            changes.added.push("Merit_" + merit.name);
        }

        $scope.personage.experience = $scope.personage.experience - merit.cost;
    };

    $scope.checkPrerequisitesAndDeletePersonageMerit = function (personageMerit) {
        $scope.itemsToDelete = [];
        checkMeritRelatedPrerequisites(personageMerit, 'delete').then(function () {
            if ($scope.itemsToDelete.length > 0) {
                var result = $q.defer();

                var stringValue = '';
                angular.forEach($scope.itemsToDelete, function (item) {
                    stringValue = stringValue + ", <strong>" + item.targetMerit.Merit.name + "</strong>" +
                        " имеет пререквизит <strong>" + item.prerequisiteName + ": " + item.prerequisiteValue + "</strong>"
                });

                stringValue = stringValue.substring(2);

                swal({
                    title: "Вы уверены?",
                    html: "Данное изменение приведет к удалению достоинств: " + stringValue,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: "Удалить!",
                    cancelButtonText: "Отменить"
                }).then(function success() {
                    angular.forEach($scope.itemsToDelete, function (item) {
                        deletePersonageMerit(item.targetMerit);
                    });
                    result.resolve(true);
                }, function cancel() {
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
            if (meritMixed.merit.id === personageMerit.Merit.id && meritMixed.personageMerit !== null) {
                meritMixed.personageMerit = null;
            }
        });

        updateMeritPrerequisites(personageMerit.Merit.id);
        if (index !== -1) {
            $scope.personage.experience = $scope.personage.experience + personageMerit.Merit.cost;
        }

    }

    function checkMeritRelatedPrerequisites(personageMerit, action) {
        var defer = $q.defer();
        var resolved = false;
        angular.forEach($scope.personageMerits, function (personageMeritFromList) {
            var personageMeritToDelete = personageMeritFromList;
            angular.forEach(personageMeritFromList.Merit.MeritMerits, function (meritMerit) {
                if (personageMerit.Merit.id === meritMerit.MeritPrerequisite.id) {
                    if (meritMerit.presentAbsent && action === 'delete') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMeritToDelete,
                            prerequisiteName: meritMerit.MeritPrerequisite.name,
                            prerequisiteValue: 'присутствует'
                        });
                        checkMeritRelatedPrerequisites(personageMeritToDelete, 'delete');
                        resolved = true;
                        defer.resolve();
                    }
                    if (!meritMerit.presentAbsent && action === 'add') {
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

    $scope.deletePersonageFlaw = function (personageFlaw) {
        checkFlawRelatedPrerequisites(personageFlaw, 'delete').then(function (confirmedChanges) {
            if (confirmedChanges) {
                var index = $scope.personageFlaws.indexOf(personageFlaw);
                $scope.personageFlaws.splice(index, 1);


                var result = $.grep($scope.flawsToShow, function (flawToShow) {
                    return flawToShow.personageFlaw.id === personageFlaw.id;
                });
                if (result.length !== 0) {
                    result[0].deleted = true;
                }

                updateFlawPrerequisites(personageFlaw.Flaw.id);
                $scope.personage.experience = $scope.personage.experience - personageFlaw.Flaw.cost;
            }
        });
    };

    $scope.addPersonageFlaw = function (flaw) {
        var personageFlaw = {
            Flaw: flaw,
            FlawId: flaw.id,
            PersonageId: personageId
        };
        checkFlawRelatedPrerequisites(personageFlaw, 'add').then(function (confirmedChanges) {
            if (confirmedChanges) {
                $scope.personageFlaws.push(personageFlaw);

                var result = $.grep($scope.flawsToShow, function (flawToShow) {
                    return flawToShow.personageFlaw.FlawId === personageFlaw.FlawId;
                });
                if (result.length !== 0) {
                    result[0].deleted = false;
                }

                updateFlawPrerequisites(flaw.id);
                $scope.personage.experience = $scope.personage.experience + flaw.cost;
            }
        });
    };

    function checkFlawRelatedPrerequisites(personageFlaw, action) {
        $scope.itemsToDelete = [];

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritFlaws, function (meritFlaw) {
                if (personageFlaw.Flaw.id === meritFlaw.Flaw.id) {
                    if (meritFlaw.presentAbsent && action === 'delete') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMerit,
                            prerequisiteName: meritFlaw.Flaw.name,
                            prerequisiteValue: 'присутствует'
                        });
                    }
                    if (!meritFlaw.presentAbsent && action === 'add') {
                        $scope.itemsToDelete.push({
                            targetMerit: personageMerit,
                            prerequisiteName: meritFlaw.Flaw.name,
                            prerequisiteValue: 'отсутствует'
                        });
                    }
                }
            });
        });

        return showAffectedMeritsModal();
    }

    $scope.addPersonageAttachedSkill = function (attachedSkill) {
        var wizardDefer = $q.defer();
        var isWizard = false;
        if (attachedSkill.name.toLowerCase().includes('магия') || attachedSkill.name === 'Алхимия') {
            angular.forEach($scope.personageInherents, function (personageInherent) {
                if (personageInherent.Inherent.name === 'Маг') {
                    isWizard = true;
                }
            });

            if (isWizard) {
                wizardDefer.resolve(true);
            } else {
                swal({
                    title: "Вы уверены?",
                    text: "У вас нет врожденной особенности \"Маг\". " +
                    "Вы будете ограничены в использовании магических навыков: " +
                    "заклинания вы сможете использовать только в виде свитков, для " +
                    "написания которых вам понадобятся также навыки Древний Язык и Каллиграфия. " +
                    "Вы уверены, что хотите взять этот навык?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: "Да!",
                    cancelButtonText: "Нет"
                }).then(function success() {
                    wizardDefer.resolve(true);
                }, function cancel() {
                    wizardDefer.resolve(false);
                });
            }
        } else {
            wizardDefer.resolve(true);
        }

        wizardDefer.promise.then(function (result) {
            if (result) {
                $scope.personageAttachedSkills.push({
                    AttachedSkill: attachedSkill,
                    AttachedSkillId: attachedSkill.id,
                    PersonageId: personageId,
                    value: 1
                });

                angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                    angular.forEach($scope.attachedSkillsMixed, function (attachedSkillMixed) {
                        if (personageAttachedSkill.AttachedSkill.id === attachedSkillMixed.attachedSkill.id && attachedSkillMixed.personageAttachedSkill === null) {
                            attachedSkillMixed.personageAttachedSkill = personageAttachedSkill;
                        }
                    });
                });

                if (!wasAdded("AttachedSkill_" + attachedSkill.name)) {
                    changes.added.push("AttachedSkill_" + attachedSkill.name);
                }

                if (attachedSkill.difficult) {
                    $scope.personage.experience = $scope.personage.experience - 10;
                } else {
                    $scope.personage.experience = $scope.personage.experience - 5;
                }
                updateAttachedSkillPrerequisites(attachedSkill.id);
                updateAttributeAttachedSkillPrerequisites(attachedSkill.id);
                calculateAddedSchools();
            }
        });
    };

    $scope.addNotAddedClass = function (isAdded) {
        if (isAdded === null) {
            return 'not_added';
        }
    };

    $scope.openDetails = [];
    $scope.showHideDescription = function (item) {
        var index = $scope.openDetails.indexOf(item.id);
        if (index === -1) {
            $scope.openDetails.push(item.id);
        } else {
            $scope.openDetails.splice(index, 1);
        }
        if (isMobile()) {
            $('tr').find('td.mobile:contains("' + item.name + '")').nextAll('td').toggle();
        }
    };

    $scope.getLevelName = function (levelNumber) {
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
    };

    $scope.isShowItem = function (id) {
        return $scope.openDetails.includes(id);
    };

    $scope.addDisableOrNotAddedClass = function (available, isAdded) {
        if (!$scope.addedSpellsFilter) {
            if (available !== true) {
                return 'unavailable';
            } else if (isAdded === null) {
                return 'not_added';
            }
        }
    };

    $scope.addPersonageTriggerSkill = function (triggerSkill) {
        var talented = false;
        angular.forEach($scope.personageMerits, function (personageMerit) {
            if (personageMerit.Merit.name.includes(triggerSkill.name)) {
                talented = true;
            }
        });

        $scope.personageTriggerSkills.push({
            TriggerSkill: triggerSkill,
            TriggerSkillId: triggerSkill.id,
            PersonageId: personageId,
            currentLevel: 0,
            talented: talented,
            tutored: false
        });

        angular.forEach($scope.personageTriggerSkills, function (personageTriggerSkill) {
            angular.forEach($scope.triggerSkillsMixed, function (triggerSkillMixed) {
                if (personageTriggerSkill.TriggerSkill.id === triggerSkillMixed.triggerSkill.id && triggerSkillMixed.personageTriggerSkill === null) {
                    triggerSkillMixed.personageTriggerSkill = personageTriggerSkill;
                }
            });
        });

        if (!wasAdded("TriggerSkill_" + triggerSkill.name)) {
            changes.added.push("TriggerSkill_" + triggerSkill.name);
        }

        $scope.personage.experience = $scope.personage.experience - triggerSkill.cost;
        updateTriggerSkillPrerequisites(triggerSkill.id);

    };

    $scope.isDeletingAttachedSkillPossible = function (personageAttachedSkill) {
        var isDeletingPossible = false;
        if (personageAttachedSkill !== null) {
            if (wasAdded("AttachedSkill_" + personageAttachedSkill.AttachedSkill.name)) {
                isDeletingPossible = true;
            }
        }
        return isDeletingPossible;
    };

    $scope.deletePersonageAttachedSkill = function (personageAttachedSkill) {
        checkSpellsAddedToSchool(personageAttachedSkill).then(function (deleteSpells) {
            if (deleteSpells) {
                checkAttachedSkillRelatedPrerequisites(personageAttachedSkill, 'delete').then(function (result) {
                    if (result) {
                        var index = $scope.personageAttachedSkills.indexOf(personageAttachedSkill);
                        $scope.personageAttachedSkills.splice(index, 1);

                        angular.forEach($scope.attachedSkillsMixed, function (attachedSkillMixed) {
                            if (attachedSkillMixed.attachedSkill.id === personageAttachedSkill.AttachedSkill.id && attachedSkillMixed.personageAttachedSkill !== null) {
                                attachedSkillMixed.personageAttachedSkill = null;
                            }
                        });

                        if (personageAttachedSkill.AttachedSkill.difficult) {
                            $scope.personage.experience = $scope.personage.experience + 10 + calculateExperienceSumForAttachedSKill(personageAttachedSkill.value) * 2;
                        } else {
                            $scope.personage.experience = $scope.personage.experience + 5 + calculateExperienceSumForAttachedSKill(personageAttachedSkill.value);
                        }
                        updateAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                        updateAttributeAttachedSkillPrerequisites(personageAttachedSkill.AttachedSkill.id);
                        calculateAddedSchools();
                    }
                });
            }
        });
    };

    function calculateExperienceSumForAttachedSKill(initialValue) {
        if (initialValue > 1) {
            var result = initialValue;
            if (initialValue > 2) {
                initialValue--;
                result = result + calculateExperienceSumForAttachedSKill(initialValue);
            }
            return result;
        } else {
            return 0;
        }
    }

    function checkSpellsAddedToSchool(personageAttachedSkill) {
        var personageSpellsToDelete = [];
        var spellNamesToDelete = '';
        var result = $q.defer();

        if (personageAttachedSkill.AttachedSkill.spells_connected) {
            angular.forEach($scope.personageSpells, function (personageSpell) {
                if (personageSpell.Spell.AttachedSkillId === personageAttachedSkill.AttachedSkill.id) {
                    personageSpellsToDelete.push(personageSpell);
                    spellNamesToDelete = spellNamesToDelete + ', ' + personageSpell.Spell.name;
                }
            });
            spellNamesToDelete = spellNamesToDelete.substring(2);
        }

        if (personageSpellsToDelete.length > 0) {
            swal({
                title: "Вы уверены?",
                html: "Данное изменение приведет к удалению заклинаний из данной школы: <strong>" + spellNamesToDelete
                + "</strong>",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Согласен!",
                cancelButtonText: "Отменить"
            }).then(function success() {
                angular.forEach(personageSpellsToDelete, function (personageSpell) {
                    $scope.deletePersonageSpell(personageSpell);
                });
                result.resolve(true);
            }, function cancel() {
                result.resolve(false);
            });
        } else {
            result.resolve(true);
        }

        return result.promise;
    }

    $scope.isDeletingTriggerSkillPossible = function (personageTriggerSkill) {
        var isDeletingPossible = false;
        if (personageTriggerSkill !== null) {
            if (wasAdded("TriggerSkill_" + personageTriggerSkill.TriggerSkill.name)) {
                isDeletingPossible = true;
            }
        }
        return isDeletingPossible;
    };

    $scope.deletePersonageTriggerSkill = function (personageTriggerSkill) {
        checkTriggerSkillRelatedPrerequisites(personageTriggerSkill, true).then(function (result) {
            if (result) {
                $scope.decreaseTriggerSkillLevel(personageTriggerSkill, true);

                var index = $scope.personageTriggerSkills.indexOf(personageTriggerSkill);
                $scope.personageTriggerSkills.splice(index, 1);

                angular.forEach($scope.triggerSkillsMixed, function (triggerSkillMixed) {
                    if (triggerSkillMixed.triggerSkill.id === personageTriggerSkill.TriggerSkill.id && triggerSkillMixed.personageTriggerSkill !== null) {
                        triggerSkillMixed.personageTriggerSkill = null;
                    }
                });

                updateTriggerSkillPrerequisites(personageTriggerSkill.TriggerSkill.id);
                $scope.personage.experience = $scope.personage.experience + personageTriggerSkill.TriggerSkill.cost;
            }
        });
    };

    function checkTriggerSkillRelatedPrerequisites(personageTriggerSkill, deletion) {
        $scope.itemsToDelete = [];

        angular.forEach($scope.personageMerits, function (personageMerit) {
            angular.forEach(personageMerit.Merit.MeritTriggerSkills, function (meritTriggerSkill) {
                if (personageTriggerSkill.TriggerSkill.id === meritTriggerSkill.TriggerSkill.id) {
                    if (deletion) {
                        if (meritTriggerSkill.level <= personageTriggerSkill.currentLevel) {
                            $scope.itemsToDelete.push({
                                targetMerit: personageMerit,
                                prerequisiteName: personageTriggerSkill.TriggerSkill.name,
                                prerequisiteValue: getLevelName(personageTriggerSkill.currentLevel)
                            });
                        }
                    } else {
                        if (meritTriggerSkill.level === personageTriggerSkill.currentLevel) {
                            $scope.itemsToDelete.push({
                                targetMerit: personageMerit,
                                prerequisiteName: personageTriggerSkill.TriggerSkill.name,
                                prerequisiteValue: getLevelName(personageTriggerSkill.currentLevel)
                            });
                        }
                    }
                }
            });
        });

        return showAffectedMeritsModal();
    }

    $scope.makeDraggable = function () {
        var attrTable = $('#attrTable');
        attrTable.addClass('sorted_table');
        attrTable.find('tr').addClass('draggable');
        $('.sorted_table').sortable({
            containerSelector: 'table',
            itemPath: '> tbody',
            itemSelector: 'tr',
            group: 'serialization',
            placeholder: '<tr class="placeholder"/>',
            onDrop: function ($item, container, _super) {
                var ser = $('.sorted_table').sortable("serialize").get()[0];
                var count = 1;
                angular.forEach(ser, function (item) {
                    item.$scope.personageAttribute.position = count;
                    $http.put('/personageAttributes/' + item.$scope.personageAttribute.id, item.$scope.personageAttribute);
                    count++;
                });
                _super($item, container);
            }
        });
    };

    $scope.makeUnDraggable = function () {
        $('.sorted_table').sortable('disable');
        var attrTable = $('#attrTable');
        attrTable.removeClass('sorted_table');
        attrTable.find('tr').removeClass('draggable');
    };

    $scope.showNotice = function (notice) {
        swal({
            title: notice.name,
            html: '<pre>' + notice.description + '</pre>' +
            '<div class="modal-footer hidden-xs-down hidden-sm-down">' +
            '<button type="button" class="btn btn-info ok">Ок</button>' +
            '<button type="button" class="btn btn-success update">Изменить</button>' +
            '<button type="button" class="btn btn-danger delete">Удалить</button>' +
            '</div>' +
            '<div class="modal-footer hidden-md-up">' +
            '<button type="button" class="btn btn-sm btn-info ok">Ок</button>' +
            '<button type="button" class="btn btn-sm btn-success update">Изменить</button>' +
            '<button type="button" class="btn btn-sm btn-danger delete">Удалить</button>' +
            '</div>',
            showConfirmButton: false,
            onOpen: function () {
                $('.ok').click(function () {
                    swal.close();
                });
                $('.update').click(function () {
                    swal({
                        title: 'Multiple inputs',
                        html: '<form>' +
                        '<div class="form-group">' +
                        '<label for="noticeTitle" class="form-control-label">Заголовок:</label>' +
                        '<input type="text" class="form-control" id="noticeTitle" value="' + notice.name + '">' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<label for="noticeBody" class="form-control-label">Текст:</label>' +
                        '<textarea id="noticeDescription" class="form-control">' + notice.description + '</textarea>' +
                        '</div>' +
                        '</form>',
                        showCancelButton: true,
                        cancelButtonText: "Отменить",
                        confirmButtonText: "Сохранить",
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
                            $http.get("/noticesByPersonageId/" + personageId).then(function (response) {
                                $scope.notices = response.data.data;
                                swal.close();
                            });
                        });
                    });
                });
                $('.delete').click(function () {
                    $http.delete('/notices/' + notice.id).then(function () {
                        $http.get("/noticesByPersonageId/" + personageId).then(function (response) {
                            $scope.notices = response.data.data;
                            $scope.personage.experience = $scope.personage.experience + notice.experience;
                            $http.put('/personages/' + personageId, {
                                race_id: $scope.personage.RaceId,
                                name: $scope.personage.name,
                                age: $scope.age,
                                max_age: $scope.max_age,
                                generated: false,
                                experience: $scope.personage.experience,
                                notes: $scope.notes
                            });
                        });
                    });
                    swal.close();
                });
            }
        });
    };

    $scope.addNotice = function () {

        swal({
            title: 'Добавить заметку',
            html: '<form>' +
            '<div class="form-group">' +
            '<label for="noticeTitle" class="form-control-label">Заголовок:</label>' +
            '<input type="text" class="form-control" id="noticeTitle">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="noticeBody" class="form-control-label">Текст:</label>' +
            '<textarea id="noticeDescription" class="form-control"></textarea>' +
            '</div>' +
            '<p>Опыт:</p>' +
            '</form>',
            showCancelButton: true,
            cancelButtonText: "Отменить",
            confirmButtonText: "Добавить",
            showLoaderOnConfirm: true,
            input: 'number',
            inputValidator: function (value) {
                return new Promise(function (resolve, reject) {
                    if ($('#noticeTitle').val() !== '') {
                        if (value !== '') {
                            if (parseInt(value) > 0) {
                                resolve()
                            } else {
                                reject('Количество опыта должно быть положительным!')
                            }
                        } else {
                            resolve();
                        }
                    } else {
                        reject('Заголовок не может быть пустым!')
                    }
                })
            },
            preConfirm: function (value) {
                return new Promise(function (resolve) {
                    resolve([
                        $('#noticeTitle').val(),
                        value,
                        $('#noticeDescription').val()
                    ])
                })
            },
            onOpen: function () {
                $('#noticeTitle').focus();
                autosize($('#noticeDescription'));
            }
        }).then(function success(result) {
            var experienceValue = 0;
            if (result[1] !== '') {
                experienceValue = result[1];
                $scope.personage.experience = $scope.personage.experience - experienceValue;
                $http.put('/personages/' + personageId, {
                    race_id: $scope.personage.RaceId,
                    name: $scope.personage.name,
                    age: $scope.age,
                    max_age: $scope.max_age,
                    generated: false,
                    experience: $scope.personage.experience,
                    notes: $scope.notes
                });
            }
            $http.post('/notices', {
                personage_id: personageId,
                name: result[0],
                experience: experienceValue,
                description: result[2]
            }).then(function () {
                $http.get("/noticesByPersonageId/" + personageId).then(function (response) {
                    $scope.notices = response.data.data;
                });
            });
        });
    };

    $scope.reset = function () {
        location.reload();
    };

    $scope.savePersonage = function () {

        var deferred = $q.defer();

        if ($scope.personage.generated) {
            deferred.resolve(true);
        } else {
            swal({
                title: "Вы уверены?",
                text: "После внесения изменений вы не сможете больше вернуться на страницу создания персонажа!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Сохранить и продолжить",
                cancelButtonText: "Отменить"
            }).then(function success() {
                $scope.personage.generated = true;
                deferred.resolve(true);
            }, function cancel() {
                deferred.resolve(false);
            });
        }

        deferred.promise.then(function (result) {
            if (result) {
                $('#loader').show();
                $('section').addClass('hide');

                function success() {
                    changes.added = [];
                    changes.valueIncreased = [];
                    calculateFlawsToShow();
                    $('#loader').hide();
                    $('section').removeClass('hide');
                }

                var personage = $q.defer();
                var personageAttributeAllPromise = $q.defer();
                var personageMeritAllPromise = $q.defer();
                var personageFlawAllPromise = $q.defer();
                var personageAttachedSkillAllPromise = $q.defer();
                var personageTriggerSkillAllPromise = $q.defer();
                var personageSpellsAllPromise = $q.defer();

                $q.all([personageAttributeAllPromise.promise, personage.promise,
                    personageMeritAllPromise.promise,
                    personageFlawAllPromise.promise, personageAttachedSkillAllPromise.promise,
                    personageTriggerSkillAllPromise.promise, personageSpellsAllPromise.promise])
                    .then(success);

                $http.put('/personages/' + personageId, {
                    race_id: $scope.personage.RaceId,
                    name: $scope.personage.name,
                    age: $scope.age,
                    max_age: $scope.max_age,
                    generated: $scope.personage.generated,
                    experience: $scope.personage.experience,
                    notes: $scope.notes
                }).then(function (response) {
                    personage.resolve();
                });


                var personageAttributePromises = [];
                angular.forEach($scope.personageAttributes, function (personageAttribute) {
                    personageAttributePromises.push($http.put('/personageAttributes/' + personageAttribute.id, {
                        value: personageAttribute.value,
                        position: personageAttribute.position
                    }));
                });

                $q.all(personageAttributePromises).then(function () {
                    personageAttributeAllPromise.resolve();
                });

                if ($scope.personageMerits !== null) {
                    $http.get('/personageMeritsByPersonageId/' + personageId).then(function (response) {
                        var deletePromises = [];

                        angular.forEach(response.data.data, function (personageMerit) {
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

                if ($scope.personageFlaws !== null) {
                    $http.get('/personageFlawsByPersonageId/' + personageId).then(function (response) {
                        var deletePromises = [];

                        angular.forEach(response.data.data, function (personageFlaw) {
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

                if ($scope.personageAttachedSkills !== null) {
                    $http.get('/personageAttachedSkillsByPersonageId/' + personageId).then(function (response) {
                        var deletePromises = [];

                        angular.forEach(response.data.data, function (personageAttachedSkill) {
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

                if ($scope.personageTriggerSkills !== null) {
                    $http.get('/personageTriggerSkillsByPersonageId/' + personageId).then(function (response) {
                        var deletePromises = [];

                        angular.forEach(response.data.data, function (personageTriggerSkill) {
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


                if ($scope.personageSpells !== null) {
                    $http.get('/personageSpellsByPersonageId/' + personageId).then(function (response) {
                        var deletePromises = [];

                        angular.forEach(response.data.personageSpells, function (personageSpell) {
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
            }
        });
    };
});