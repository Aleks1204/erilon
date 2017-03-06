var app = angular.module("triggerSkillManagerApp", ['ngStorage']);

app.controller("addTriggerSkillController", function ($scope, $http) {
    $scope.difficult = false;

    $scope.createTriggerSkill = function () {
        $http.post('/triggerSkills', {
            name: $scope.triggerSkill_name,
            cost: $scope.cost,
            description: $scope.description,
            difficult: $scope.difficult
        }).success(function (data) {
            $http.post('/merits', {
                name: 'Талант к ' + $scope.triggerSkill_name,
                cost: 10,
                creation_only: true,
                description: '',
                action_level_bonus: ''
            });
            location.reload();
        });
    };
});

app.controller("triggerSkillListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/triggerSkills').
    success(function (data) {
        $scope.triggerSkills = data.triggerSkills.sort();
        $scope.loader = false;
    });

    $scope.deleteTriggerSkill = function (id) {
        $http.get('/triggerSkills/' + id).
        success(function(result) {
            $http.get('/merits').
            success(function (data) {
                angular.forEach(data.merits, function (merit) {
                    if (merit.name.indexOf(result.triggerSkill.name) > -1) {
                        $http.delete('/merits/' + merit.id);
                    }
                });
                $http.delete('/triggerSkills/' + id).
                success(function (data) {
                    location.reload();
                });
            });
        });
    };
});