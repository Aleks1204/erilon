var app = angular.module("meritManagerApp", ['ngStorage']);

app.controller("addMeritController", function ($scope, $http) {
    $scope.creation_only = false;

    $scope.createMerit = function () {
        $http.post('/merits', {
            name: $scope.merit_name,
            cost: $scope.cost,
            creation_only: $scope.creation_only,
            description: $scope.description,
            action_level_bonus: $scope.action_level_bonus
        }).success(function (data) {
            location.reload();
        });
    };
});

app.controller("meritListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/merits').
    success(function (data) {
        $scope.merits = data.merits;
        $scope.loader = false;
    });

    $scope.deleteMerit = function (id) {
        $http.delete('/merits/' + id).
        success(function (data) {
            location.reload();
        });
    };
});