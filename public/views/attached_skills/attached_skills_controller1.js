/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("attachedSkillManagerApp", ['ngStorage']);

app.controller("addAttachedSkillController", function ($scope, $http) {
    $scope.difficult = false;
    $scope.theoretical = false;
    $scope.default_skill = false;

    $scope.createAttachedSkill = function () {
        $http.post('/attachedSkills', {
            name: $scope.attachedSkill_name,
            description: $scope.description,
            difficult: $scope.difficult,
            theoretical: $scope.theoretical,
            default_skill: $scope.default_skill,
            spells_connected: $scope.spells_connected
        }).success(function (data) {
            location.reload();
        });
    };
});

app.controller("attachedSkillListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/attachedSkills').
    success(function (data) {
        $scope.attachedSkills = data.attachedSkills;
        $scope.loader = false;
    });

    $scope.deleteAttachedSkill = function (id) {
        $http.delete('/attachedSkills/' + id).
        success(function (data) {
            location.reload();
        });
    };
});
