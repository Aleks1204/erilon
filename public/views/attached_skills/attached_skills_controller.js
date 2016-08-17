'use strict';

var app = angular.module("attachedSkillManagerApp", ['ngMaterial', 'mdDataTable', 'ngStorage']);
app.controller('attachedSkillListController', function ($scope, $http, $mdDialog) {
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

    $scope.showDialog = function() {
        console.log('test dialog');
    };
});


