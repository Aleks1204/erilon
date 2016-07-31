var raceId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("raceApp", ['ngStorage']);

app.controller("raceAttributeListController", function ($scope, $http) {
    $http.get('/raceAttributesByRaceId/' + raceId).
    success(function (data) {
        $scope.raceAttributes = data.raceAttributes;
    });

    $http.get('/races/' + raceId).
    success(function (data) {
        $scope.race = data.race;
    });

    var changingAttributeIds = [];
    $scope.show = function (id) {
        var show = false;
        angular.forEach(changingAttributeIds, function (changingAttributeId) {
            if (changingAttributeId == id) {
                show = true;
            }
        });
        return show;
    };

    $scope.changeRaceAttribute = function (id) {
        changingAttributeIds.push(id);
    };

    $scope.saveRaceAttribute = function (id) {

        angular.forEach($scope.raceAttributes, function (raceAttribute) {
            if (raceAttribute.id == id) {
                $http.put('/raceAttributes/' + id, {
                    base_cost: raceAttribute.base_cost
                });
            }
        });

        var index = changingAttributeIds.indexOf(id);
        changingAttributeIds.splice(index, 1);
    };

    $scope.deleteRaceAttribute = function (id) {
        $http.delete('/raceAttributes/' + id).
        success(function (data) {
            location.reload();
        });
    }
});

app.controller("raceMeritListController", function ($scope, $http) {
    $http.get('/raceMeritsByRaceId/' + raceId).
    success(function (data) {
        $scope.raceMerits = data.raceMerits;
    });

    $scope.deleteRaceMerit = function (id) {
        $http.delete('/raceMerits/' + id).
        success(function (data) {
            location.reload();
        });
    };
});

app.controller("raceFlawListController", function ($scope, $http) {
    $http.get('/raceFlawsByRaceId/' + raceId).
    success(function (data) {
        $scope.raceFlaws = data.raceFlaws;
    });

    $scope.deleteRaceFlaw = function (id) {
        $http.delete('/raceFlaws/' + id).
        success(function (data) {
            location.reload();
        });
    };
});

app.controller("raceInherentListController", function ($scope, $http) {
    $http.get('/raceInherentsByRaceId/' + raceId).
    success(function (data) {
        $scope.raceInherents = data.raceInherents;
    });

    $scope.deleteRaceInherent = function (id) {
        $http.delete('/raceInherents/' + id).
        success(function (data) {
            location.reload();
        });
    };
});

app.controller("addRaceMeritController", function ($scope, $http) {
    $scope.race_default = false;
    $scope.race_cost = 0;

    $scope.createRaceMerit = function () {
        $http.post('/raceMerits', {
            merit_id: $scope.merit_id,
            race_id: raceId,
            race_cost: $scope.race_cost,
            race_default: $scope.race_default
        }).
        success(function (data) {
            location.reload();
        });
    };

    $http.get('/merits').
    success(function (data) {
        $scope.merits = data.merits;
    });

    $scope.isCheckboxChecked = function () {
        return $scope.race_default;
    }
});

app.controller("addRaceFlawController", function ($scope, $http) {

    $scope.createRaceFlaw = function () {
        $http.post('/raceFlaws', {
            flaw_id: $scope.flaw_id,
            race_id: raceId
        }).
        success(function (data) {
            location.reload();
        });
    };

    $http.get('/flaws').
    success(function (data) {
        $scope.flaws = data.flaws;
    });
});

app.controller("addRaceInherentController", function ($scope, $http) {
    $scope.race_default = false;
    $scope.race_cost = 0;

    $scope.createRaceInherent = function () {
        $http.post('/raceInherents', {
            inherent_id: $scope.inherent_id,
            race_id: raceId,
            race_probability: $scope.race_probability
        }).
        success(function (data) {
            location.reload();
        });
    };

    $http.get('/inherents').
    success(function (data) {
        $scope.inherents = data.inherents;
    });
});