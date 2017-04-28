var meritId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("meritApp", ['ngStorage']);

app.controller("prerequisitesListController", function ($scope, $http, $timeout) {
    $scope.lessMoreEqual = 0;
    $scope.presentAbsent = false;
    $scope.types = [
        {
            "name": "Атрибут",
            "id": 1
        }, {
            "name": "Прикрепленный навык",
            "id": 2
        }, {
            "name": "Атрибут+навык",
            "id": 3
        }, {
            "name": "Тригерный навык",
            "id": 4
        }, {
            "name": "Врожденная особенность",
            "id": 5
        }, {
            "name": "Достоинство",
            "id": 6
        }, {
            "name": "Недостаток",
            "id": 7
        }
    ];

    $scope.levels = [
        {
            "name": "База",
            "id": 0
        }, {
            "name": "Эксперт",
            "id": 1
        }, {
            "name": "Мастер",
            "id": 2
        }, {
            "name": "Магистр",
            "id": 3
        }, {
            "name": "ГроссМейстер",
            "id": 4
        }
    ];

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

    recalculateTables();

    function recalculateTables() {
        $http.get('/merits/' + meritId).then(function (response) {
            $scope.merit = response.data.merit;
            $scope.meritAttributes = response.data.merit.MeritAttributes;
            $scope.meritAttachedSkills = response.data.merit.MeritAttachedSkills;
            $scope.meritAttributeAttachedSkills = response.data.merit.MeritAttributeAttachedSkills;
            $scope.meritTriggerSkills = response.data.merit.MeritTriggerSkills;
            $scope.meritInherents = response.data.merit.MeritInherents;
            $scope.meritFlaws = response.data.merit.MeritFlaws;
            $scope.meritMerits = response.data.merit.MeritMerits;

            $('#mainPanel').empty();

            angular.forEach(response.data.merit.MeritAttachedSkills, function (meritAttachedSkill) {
                addPrerequisitesElement(meritAttachedSkill.AttachedSkill.name, meritAttachedSkill.value, '/meritAttachedSkills/' + meritAttachedSkill.id);
            });

            angular.forEach(response.data.merit.MeritAttributes, function (meritAttribute) {
                addPrerequisitesElement(meritAttribute.Attribute.name, meritAttribute.value, '/meritAttributes/' + meritAttribute.id);
            });

            angular.forEach(response.data.merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                addPrerequisitesElement(meritAttributeAttachedSkill.AttachedSkill.name + '+' + meritAttributeAttachedSkill.Attribute.name, meritAttributeAttachedSkill.value, '/meritAttributeAttachedSkills/' + meritAttributeAttachedSkill.id);
            });

            angular.forEach(response.data.merit.MeritTriggerSkills, function (meritTriggerSkill) {
                addPrerequisitesElement(meritTriggerSkill.TriggerSkill.name, getLevelName(meritTriggerSkill.level), '/meritTriggerSkills/' + meritTriggerSkill.id);
            });

            angular.forEach(response.data.merit.MeritInherents, function (meritInherent) {
                var sign = '=';
                if (meritInherent.lessMoreEqual === 1) {
                    sign = '>';
                }
                if (meritInherent.lessMoreEqual === -1) {
                    sign = '<';
                }

                if (meritInherent.value === null) {
                    addPrerequisitesElement(meritInherent.Inherent.name, 'Присутствует', '/meritInherents/' + meritInherent.id);
                } else {
                    addPrerequisitesElement(meritInherent.Inherent.name, meritInherent.value, '/meritInherents/' + meritInherent.id, sign);
                }
            });

            angular.forEach(response.data.merit.MeritFlaws, function (meritFlaw) {
                var presence = 'Отсутствует';
                if (meritFlaw.presentAbsent) {
                    presence = 'Присутствует';
                }
                addPrerequisitesElement(meritFlaw.Flaw.name, presence, '/meritFlaws/' + meritFlaw.id);
            });

            angular.forEach(response.data.merit.MeritMerits, function (meritMerit) {
                var presence = 'Отсутствует';
                if (meritMerit.presentAbsent) {
                    presence = 'Присутствует';
                }
                addPrerequisitesElement(meritMerit.MeritPrerequisite.name, presence, '/meritMerits/' + meritMerit.id);
            });

            $timeout(function () {
                $('#merit_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#flaw_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#inherent_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#attribute_id').selectpicker();
            }, 1000);

            $timeout(function () {
                $('#attached_skill_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#trigger_skill_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#level').selectpicker();
            }, 1000);
        });
    }

    function addPrerequisitesElement(prerequisite, value, id, sign) {
        if (sign === undefined) {
            sign = '';
        }
        $('#mainPanel').append(
            '<div class="btn-group margin-inline">' +
                '<div class="btn-group">' +
                    '<button style="cursor: auto" class="btn btn-rounded btn-sm btn-success">' + prerequisite + ': ' + sign + value + '</button>' +
                '</div>' +
                '<div class="btn-group">' +
                    '<button class="btn btn-rounded btn-sm btn-danger-outline delete">' +
                        '<i class="icmn-minus"></i>' +
                        '<input id="prerequisiteId" type="hidden" value="' + id + '"/> ' +
                    '</button>' +
                '</div>' +
            '</div>'
        )
    }

    $('#mainPanel').on('click', '.delete', function () {
        var url = this.querySelectorAll('#prerequisiteId')[0].value;

        $http.delete(url).then(function () {
            recalculateTables();
        });
    });

    $http.get('/attributes').then(function (response) {
        $scope.attributes = response.data.data;
    });

    $http.get('/attachedSkills').then(function (response) {
        $scope.attachedSkills = response.data.data;
    });

    $http.get('/triggerSkills').then(function (response) {
        $scope.triggerSkills = response.data.data;
    });

    $http.get('/inherents').then(function (response) {
        $scope.inherents = response.data.data;
    });

    $http.get('/flaws').then(function (response) {
        $scope.flaws = response.data.data;
    });

    $http.get('/merits').then(function (response) {
        $scope.merits = [];
        angular.forEach(response.data.data, function (merit) {
            if (merit.id !== meritId) {
                $scope.merits.push(merit);
            }
        });
    });

    $scope.createPrerequisite = function () {
        switch ($scope.type) {
            case 1:
                $http.post('/meritAttributes', {
                    merit_id: meritId,
                    attribute_id: $scope.attribute_id,
                    value: $scope.value
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 2:
                $http.post('/meritAttachedSkills', {
                    merit_id: meritId,
                    attached_skill_id: $scope.attached_skill_id,
                    value: $scope.value
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 3:
                $http.post('/meritAttributeAttachedSkills', {
                    merit_id: meritId,
                    attribute_id: $scope.attribute_id,
                    attached_skill_id: $scope.attached_skill_id,
                    value: $scope.value
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 4:
                $http.post('/meritTriggerSkills', {
                    merit_id: meritId,
                    attached_skill_id: $scope.trigger_skill_id,
                    level: $scope.level
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 5:
                $http.post('/meritInherents', {
                    merit_id: meritId,
                    inherent_id: $scope.inherent_id,
                    lessMoreEqual: $scope.lessMoreEqual,
                    value: $scope.inherentValue
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 6:
                $http.post('/meritMerits', {
                    merit_id: meritId,
                    prerequisite_merit_id: $scope.merit_id,
                    presentAbsent: $scope.presentAbsent
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 7:
                $http.post('/meritFlaws', {
                    merit_id: meritId,
                    flaw_id: $scope.flaw_id,
                    presentAbsent: $scope.presentAbsent
                }).then(function () {
                    recalculateTables();
                });
                break;
        }
    };

    $scope.isInherentValueRequired = false;

    $scope.isValuePresent = function () {
        $http.get('/inherents/' + $scope.inherent_id).then(function (response) {
            $scope.isInherentValueRequired = response.data.inherent.max_limit !== null && response.data.inherent.min_limit !== null;
        });
    };
});