"use strict";

app.controller("personageAttachedSkillsController", function ($scope, $http) {
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
});