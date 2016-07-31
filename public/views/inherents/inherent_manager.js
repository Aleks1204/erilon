var app = angular.module("inherentManagerApp", ['ngStorage']);

app.controller("addInherentController", function ($scope, $http) {
    $scope.createInherent = function () {
        $http.post('/inherents', {
            name: $scope.inherent_name,
            probability: $scope.probability,
            max_limit: $scope.max_limit,
            min_limit: $scope.min_limit,
            description: $scope.description,
            action_level_bonus: $scope.action_level_bonus
        }).success(function (data) {
            location.reload();
        });
    };
});

app.controller("inherentListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/inherents').
    success(function (data) {
        $scope.inherents = data.inherents.sort();
        $scope.loader = false;
    });

    $scope.deleteInherent = function (id) {
        $http.delete('/inherents/' + id).
        success(function (data) {
            location.reload();
        });
    };
});