var app = angular.module("personageManagerApp", ['ngStorage']);

$('.icons-block div').each(function () {
    $(this).tooltip({
        title: $(this).find('.tooltips').attr('title')
    });
});

app.controller("addPersonageController", function ($scope, $http, $window, $q, $localStorage) {
    $scope.loader = false;

    $scope.selectRefresh = function () {
        $('select').selectpicker('refresh');
    };

    $scope.createPersonage = function () {
        $scope.loader = true;

        function success(data) {
            $window.location.href = '/views/personage_logic/create_personage.html?id=' + data[0];
        }

        var personage = $q.defer();
        var raceAttributeAllPromise = $q.defer();
        var raceMeritAllPromise = $q.defer();
        var raceFlawAllPromise = $q.defer();
        var defaultAttachedSkillAllPromise = $q.defer();

        $q.all([personage.promise, raceAttributeAllPromise.promise,
            raceMeritAllPromise.promise, raceFlawAllPromise.promise,
            defaultAttachedSkillAllPromise.promise])
            .then(success);


        $http.post('/personages', {
            name: $scope.name,
            race_id: $scope.race_id,
            player_id: $localStorage.playerId,
            age: 0,
            max_age: 0,
            experience: $scope.experience,
            generated: false
        }).then(function (response) {
            var raceAttributesByRaceId = $q.defer();
            $http.get('/raceAttributesByRaceId/' + response.data.personage.RaceId).then(function (response) {
                raceAttributesByRaceId.resolve(response.data.raceAttributes);
            });

            $q.all([raceAttributesByRaceId.promise]).then(function (raceAttributes) {
                var raceAttributePromises = [];
                for (var i = 0; i < raceAttributes[0].length; i++) {
                    raceAttributePromises.push($http.post('/personageAttributes', {
                        personage_id: response.data.personage.id,
                        attribute_id: raceAttributes[0][i].AttributeId,
                        value: 1,
                        position: i + 1
                    }));
                }

                $q.all(raceAttributePromises).then(function () {
                    raceAttributeAllPromise.resolve();
                });
            });

            var raceMeritsByRaceId = $q.defer();
            $http.get('/raceMeritsByRaceId/' + response.data.personage.RaceId).then(function (response) {
                raceMeritsByRaceId.resolve(response.data.raceMerits);
            });

            $q.all([raceMeritsByRaceId.promise]).then(function (raceMerits) {
                var raceMeritPromises = [];
                for (var i = 0; i < raceMerits[0].length; i++) {
                    raceMeritPromises.push($http.post('/personageMerits', {
                        personage_id: response.data.personage.id,
                        merit_id: raceMerits[0][i].MeritId,
                        unremovable: true
                    }));
                }

                $q.all(raceMeritPromises).then(function () {
                    raceMeritAllPromise.resolve();
                });
            });

            var raceFlawsByRaceId = $q.defer();
            $http.get('/raceFlawsByRaceId/' + response.data.personage.RaceId).then(function (response) {
                raceFlawsByRaceId.resolve(response.data.raceFlaws);
            });

            $q.all([raceFlawsByRaceId.promise]).then(function (raceFlaws) {
                var raceFlawPromises = [];
                for (var i = 0; i < raceFlaws[0].length; i++) {
                    raceFlawPromises.push($http.post('/personageFlaws', {
                        personage_id: response.data.personage.id,
                        flaw_id: raceFlaws[0][i].FlawId,
                        personage_race_default: true
                    }));
                }

                $q.all(raceFlawPromises).then(function () {
                    raceFlawAllPromise.resolve();
                });
            });

            var attachedSkills = $q.defer();

            $http.get('/attachedSkills/').then(function (response) {
                attachedSkills.resolve(response.data.attachedSkills);
            });

            $q.all([attachedSkills.promise]).then(function (attachedSkills) {
                var defaultAttachedSkillPromises = [];
                angular.forEach(attachedSkills[0], function (attachedSkill) {
                    if (attachedSkill.default_skill) {
                        defaultAttachedSkillPromises.push($http.post('/personageAttachedSkills', {
                            personage_id: response.data.personage.id,
                            attachedSkill_id: attachedSkill.id,
                            value: 0
                        }));
                    }
                });

                $q.all(defaultAttachedSkillPromises).then(function () {
                    defaultAttachedSkillAllPromise.resolve();
                    console.log('attached skills done');
                });
            });
            personage.resolve(response.data.personage.id);
        });
    };

    $http.get('/races').then(function (response) {
        $scope.races = response.data.races;
    });
});

app.controller("personageListController", function ($scope, $http, $localStorage) {

    $scope.showMyPersonages = function () {
        $scope.loader = true;
        $http.get('/personagesByPlayerId/' + $localStorage.playerId).then(function (response) {
            $scope.personages = response.data.personages;
            $scope.loader = false;
        });
    };

    $scope.showAllPersonages = function () {
        $scope.loader = true;
        $http.get('/personages').then(function (response) {
            $scope.personages = response.data.personages;
            $scope.loader = false;
        });
    };

    $scope.showMyPersonages();

    $scope.deletePersonage = function (personage) {
        swal({
            title: "Вы уверены?",
            text: "Вы уверены что хотите удалить персонажа, его невозможно восстановить!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Удалить!",
            cancelButtonText: "Отменить",
            closeOnConfirm: true
        }).then(function success() {
            $http.delete('/personages/' + personage.id).then(function () {
                var index = $scope.personages.indexOf(personage);
                $scope.personages.splice(index, 1);
            });
        }, function cancel() {
        });
    };
});