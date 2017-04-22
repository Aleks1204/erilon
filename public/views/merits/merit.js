var meritId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("meritApp", ['ngStorage']);

app.controller("prerequisitesListController", function ($scope, $http) {
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
            "name": "Врожденная",
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

    $http.get('/merits/' + meritId).
    success(function (data) {
        $scope.merit = data.merit;
        $scope.meritAttributes = data.merit.MeritAttributes;
        $scope.meritAttachedSkills = data.merit.MeritAttachedSkills;
        $scope.meritAttributeAttachedSkills = data.merit.MeritAttributeAttachedSkills;
        $scope.meritTriggerSkills = data.merit.MeritTriggerSkills;
        $scope.meritInherents = data.merit.MeritInherents;
        $scope.meritFlaws = data.merit.MeritFlaws;
        $scope.meritMerits = data.merit.MeritMerits;
    });

    $http.get('/attributes').
    success(function (response) {
        $scope.attributes = response.data.data;
    });

    $http.get('/attachedSkills').
    success(function (data) {
        $scope.attachedSkills = data.attachedSkills;
    });

    $http.get('/triggerSkills').
    success(function (data) {
        $scope.triggerSkills = data.triggerSkills;
    });

    $http.get('/inherents').
    success(function (data) {
        $scope.inherents = data.inherents;
    });

    $http.get('/flaws').
    success(function (data) {
        $scope.flaws = data.flaws;
    });

    $http.get('/merits').
    success(function (data) {
        $scope.merits = [];
        angular.forEach(data.merits, function (merit) {
            if (merit.id != meritId) {
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
                }).success(function (data) {
                    location.reload();
                });
                break;
            case 2:
                $http.post('/meritAttachedSkills', {
                    merit_id: meritId,
                    attached_skill_id: $scope.attached_skill_id,
                    value: $scope.value
                }).success(function (data) {
                    location.reload();
                });
                break;
            case 3:
                $http.post('/meritAttributeAttachedSkills', {
                    merit_id: meritId,
                    attribute_id: $scope.attribute_id,
                    attached_skill_id: $scope.attached_skill_id,
                    value: $scope.value
                }).success(function (data) {
                    location.reload();
                });
                break;
            case 4:
                $http.post('/meritTriggerSkills', {
                    merit_id: meritId,
                    attached_skill_id: $scope.trigger_skill_id,
                    level: $scope.level
                }).success(function (data) {
                    location.reload();
                });
                break;
            case 5:
                $http.post('/meritInherents', {
                    merit_id: meritId,
                    inherent_id: $scope.inherent_id,
                    lessMoreEqual: $scope.lessMoreEqual,
                    value: $scope.inherentValue
                }).success(function (data) {
                    location.reload();
                });
                break;
            case 6:
                $http.post('/meritMerits', {
                    merit_id: meritId,
                    prerequisite_merit_id: $scope.merit_id,
                    presentAbsent: $scope.presentAbsent
                }).success(function (data) {
                    location.reload();
                });
                break;
            case 7:
                $http.post('/meritFlaws', {
                    merit_id: meritId,
                    flaw_id: $scope.flaw_id,
                    presentAbsent: $scope.presentAbsent
                }).success(function (data) {
                    location.reload();
                });
                break;
        }
    };

    $scope.isInherentValueRequired = false;

    $scope.isValuePresent = function () {
        $http.get('/inherents/' + $scope.inherent_id).
        success(function (result) {
            if (result.inherent.max_limit != null && result.inherent.min_limit != null) {
                $scope.isInherentValueRequired = true;
            } else {
                $scope.isInherentValueRequired = false;
            }
        });
    };

    $scope.deleteMeritAttribute = function (id) {
        $http.delete('/meritAttributes/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.deleteMeritAttachedSkill = function (id) {
        $http.delete('/meritAttachedSkills/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.deleteMeritAttributeAttachedSkill = function (id) {
        $http.delete('/meritAttributeAttachedSkills/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.deleteMeritTriggerSkill = function (id) {
        $http.delete('/meritTriggerSkills/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.deleteMeritInherent = function (id) {
        $http.delete('/meritInherents/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.deleteMeritFlaw = function (id) {
        $http.delete('/meritFlaws/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.deleteMeritMerit = function (id) {
        $http.delete('/meritMerits/' + id).
        success(function (data) {
            location.reload();
        });
    }
});