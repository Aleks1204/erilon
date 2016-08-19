/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("attachedSkillManagerApp", ['ngStorage', 'ngMaterial', 'ngMessages']);

app.controller("attachedSkillListController", function ($scope, $http, $mdDialog) {
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

    $scope.showAddDialog = function () {
        $mdDialog.show({
            controller: AddDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'addEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    };

    $scope.showEditDialog = function (attachedSkill) {
        $mdDialog.show({
            locals: {attachedSkill: attachedSkill},
            controller: UpdateDialogCtrl,
            controllerAs: 'ctrl',
            templateUrl: 'addEditDialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        })
    };
});
