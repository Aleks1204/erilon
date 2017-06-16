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

    function checkHalElfMerits() {
        var returned = $q.defer();

        if ($('#race_id').find('option:selected').text() === 'Полуэльф') {
            swal({
                title: 'Особенные достоинства полуэльфов',
                html: '<p>Полуэльфы обладают возможностью приобретать нижеперечисленные атрибуты по цене на 1 ехр ниже при создании. ' +
                'Вы можете выбрать один или несколько атрибутов, или не выбирать ни одного. ' +
                'Каждый выбранный атрибут обойдется вам в 10 ехр сейчас, но, возможно, позволит сэкономить на дальнейшей прокачке. ' +
                '<strong style="font-size: 22px">Это ваш единственный шанс выбрать!</strong></p>' +
                '<form>' +
                '<div class="row form-group">' +
                '<div class="col-md-12">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="elfDexterity" type="checkbox">' +
                '<label for="elfDexterity">Эльфийская ловкость (10 ехр)</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="elfSpeed" type="checkbox">' +
                '<label for="elfSpeed">Эльфийская скорость (10 ехр)</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="elfPerception" type="checkbox">' +
                '<label for="elfPerception">Эльфийское восприятие (10 ехр)</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="elfCharisma" type="checkbox">' +
                '<label for="elfCharisma">Эльфийская харизма (10 ехр)</label>' +
                '</div>' +
                '<div class="col-md-12">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="elfFace" type="checkbox">' +
                '<label for="elfFace">Симпатичность (5 ЕХР) - +1 к границе внешности</label>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: "Отменить",
                confirmButtonText: "Создать",
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        resolve([
                            $('#elfDexterity').prop("checked"),
                            $('#elfSpeed').prop("checked"),
                            $('#elfPerception').prop("checked"),
                            $('#elfCharisma').prop("checked"),
                            $('#elfFace').prop("checked")
                        ])
                    })
                }
            }).then(function success(result) {
                $localStorage.elfDexterity = result[0];
                $localStorage.elfSpeed = result[1];
                $localStorage.elfPerception = result[2];
                $localStorage.elfCharisma = result[3];
                $localStorage.elfFace = result[4];
                returned.resolve(true);
            }, function cancel() {
                returned.resolve(false);
            });
        } else {
            returned.resolve(true);
        }
        return returned.promise;
    }

    $scope.createPersonage = function () {
        checkHalElfMerits().then(function (result) {
            if (result) {
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
                        raceAttributesByRaceId.resolve(response.data.data);
                    });

                    $q.all([raceAttributesByRaceId.promise]).then(function (raceAttributes) {
                        var raceAttributePromises = [];
                        for (var i = 0; i < raceAttributes[0].length; i++) {
                            var value = 1;
                            if (raceAttributes[0][i].Attribute.name === 'Магия') {
                                value = 0;
                            }
                            raceAttributePromises.push(
                                $http.post('/personageAttributes', {
                                    personage_id: response.data.personage.id,
                                    attribute_id: raceAttributes[0][i].AttributeId,
                                    value: value,
                                    position: i + 1
                                })
                            );
                        }

                        $q.all(raceAttributePromises).then(function () {
                            raceAttributeAllPromise.resolve();
                        });
                    });

                    var raceMeritsByRaceId = $q.defer();
                    $http.get('/raceMeritsByRaceId/' + response.data.personage.RaceId).then(function (response) {
                        raceMeritsByRaceId.resolve(response.data.data);
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
                        raceFlawsByRaceId.resolve(response.data.data);
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
                        attachedSkills.resolve(response.data.data);
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
            }
        });
    };

    $http.get('/races').then(function (response) {
        $scope.races = response.data.data;
    });
});

app.controller("personageListController", function ($scope, $http, $localStorage) {
    $scope.avatar = function (personage_id) {
        var avatar = 'avatar.png';
        angular.forEach($scope.personages, function (personage) {
            if (personage.id === personage_id && personage.avatar !== null && personage.avatar !== '') {
                avatar = personage.avatar;
            }
        });
        return avatar;
    };

    $scope.uploadPersonageAvatar = function (personage_id) {
        var file = '';
        var date = new Date();
        var name = 'personage_avatar_' + personage_id + '_' + date.getTime() + '.png';
        swal({
            title: 'Загрузить аватар персонажа',
            input: 'file',
            inputAttributes: {
                accept: 'image/*'
            },
            inputClass: 'dropify',
            onOpen: function () {
                var input = $('.swal2-file.dropify');
                input.attr('data-max-file-size', '100K');
                input.dropify({
                    messages: {
                        'default': 'Перетащите картинку в облать или кликните для загрузки',
                        'replace': 'Перетащите картинку в облать или кликните для загрузки',
                        'remove': 'Удалить',
                        'error': 'Уппссс... что то пошло не так'
                    }
                });
                file = $('.dropify-render img').attr('src');
            },
            preConfirm: function () {
                return new Promise(function (resolve) {
                    file = $('.dropify-render img').attr('src');
                    resolve();
                })
            }
        }).then(function () {
            if (file !== undefined) {
                $http.put('/personages/' + personage_id, {
                    avatar: name
                }).then(function () {
                    $http.post('/uploadAvatar/' + personage_id, {
                        file: file,
                        name: name
                    }).then(function () {
                        $scope.showMyPersonages();
                    });
                });
            }
        })
    };

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