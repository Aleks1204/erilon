var app = angular.module("raceManagerApp", ['ngStorage']);

app.controller("addRaceController", function ($scope, $http, $q) {
    function success(data) {
        location.reload();
    }

    var race = $q.defer();
    var attributeAllPromise = $q.defer();

    $q.all([race.promise, attributeAllPromise.promise]).then(success);

    $scope.createRace = function () {
        $scope.loader = true;
        $http.post('/races', {
            name: $scope.race_name,
            max_age: $scope.max_age
        }).
        success(function (result) {

            var attributes = $q.defer();

            $http.get('/attributes').success(function (results) {
                attributes.resolve(results.attributes);
            });

            $q.all([attributes.promise]).then(function (attributes) {
                var attributePromises = [];
                angular.forEach(attributes[0], function (attribute) {
                    attributePromises.push($http.post('/raceAttributes', {
                        race_id: result.race.id,
                        attribute_id: attribute.id,
                        base_cost: 5,
                        max_value: 12
                    }));
                });

                $q.all(attributePromises).then(function () {
                    attributeAllPromise.resolve();
                });
            });

            race.resolve();
        });
    };
});

app.controller("racesListController", function ($scope, $http) {
    $scope.loader = true;
    $http.get('/races').
    success(function (data) {
        $scope.races = data.races;
        $scope.loader = false;
    });

    $scope.deleteRace = function (id) {
        $http.delete('/races/' + id).
        success(function (data) {
            location.reload();
        });
    };
});