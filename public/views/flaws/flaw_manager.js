/**
 * Created by artem-kalantay on 31.07.16.
 */
var app = angular.module("flawManagerApp", ['ngStorage']);

app.controller("addFlawController", function ($scope, $http) {
    $scope.unremovable = false;

    $scope.createFlaw = function () {
        $http.post('/flaws', {
            name: $scope.flaw_name,
            cost: $scope.cost,
            unremovable: $scope.unremovable,
            description: $scope.description,
            action_level_bonus: $scope.action_level_bonus
        }).success(function (data) {
            location.reload();
        });
    };
});

app.controller("flawListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/flaws').
    success(function (data) {
        $scope.flaws = data.flaws.sort();
        $scope.loader = false;
    });

    $scope.deleteFlaw = function (id) {
        $http.delete('/flaws/' + id).
        success(function (data) {
            location.reload();
        });
    };
});