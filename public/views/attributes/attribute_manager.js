var app = angular.module("attributeManagerApp", ['ngStorage']);

app.controller("addAttributeController", function ($scope, $http) {
    $scope.createAttribute = function () {
        $http.post('/attributes', {
            name: $scope.attribute_name,
            action_level_bonus: $scope.action_level_bonus
        }).
        success(function (result) {
            $http.get('/races').success(function (results){
                angular.forEach(results.races, function(race) {
                    $http.post('/raceAttributes', {
                        race_id: race.id,
                        attribute_id: result.attribute.id,
                        base_cost: 5,
                        max_value: 12
                    });
                });
                location.reload();
            });

        });
    };
});

app.controller("attributeListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/attributes').
    success(function (data) {
        $scope.attributes = data.attributes;
        $scope.loader = false;
    });

    $scope.deleteAttribute = function (id) {
        $http.delete('/attributes/' + id).
        success(function (data) {
            location.reload();
        });
    };
});