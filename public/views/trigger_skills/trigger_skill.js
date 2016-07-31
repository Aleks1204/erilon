var triggerSkillId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("triggerApp", ['ngStorage']);

app.controller("skillLevelListController", function ($scope, $http) {
    $scope.levels = [
        {
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

    $http.get('/skillLevelsByTriggerSkillId/' + triggerSkillId).
    success(function (data) {
        $scope.selectLevels = [];
        angular.forEach($scope.levels, function (level) {
            var alreadyAdded = false;
            angular.forEach(data.skillLevels, function (skillLevel) {
                if (skillLevel.level == level.id) {
                    alreadyAdded = true;
                }
            });

            if (!alreadyAdded) {
                $scope.selectLevels.push(level);
            }
        });
        $scope.skillLevels = data.skillLevels;
    });

    $http.get('/triggerSkills/' + triggerSkillId).
    success(function (data) {
        $scope.triggerSkill = data.triggerSkill;
    });

    $scope.deleteSkillLevel = function (id) {
        $http.delete('/skillLevels/' + id).
        success(function (data) {
            location.reload();
        });
    };

    $scope.createSkillLevel = function () {
        $http.post('/skillLevels', {
            TriggerSkillId: triggerSkillId,
            cost: $scope.cost,
            level: $scope.level,
            description: $scope.description
        }).
        success(function (result) {
            location.reload();
        });
    }
});