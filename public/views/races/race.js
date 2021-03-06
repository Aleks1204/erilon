var raceId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("raceManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("raceListController", function ($scope, $http, $timeout, $i18next) {
    $http.get('/races/' + raceId).then(function (response) {
        $scope.race = response.data.race;
        var raceAttributesTableSelector = $('#racesAttributesTable');

        var raceAttributesTable = raceAttributesTableSelector.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "ajax": '/raceAttributesByRaceId/' + raceId,
            "columns": [
                {"data": "Attribute.name"},
                {"data": "base_cost"},
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-success btn-sm btn-rounded icmn-pencil3 margin-right-10 edit" value="'
                            + data + '"  type="button"></button>';
                    }
                }
            ]
        });

        raceAttributesTableSelector.on('click', '.edit', function () {
            $http.get('/raceAttributes/' + this.value).then(function (response) {
                var raceAttribute = response.data.raceAttribute;
                swal({
                    title: $i18next.t('page.race.edit_attribute_base_cost') + ' "' + raceAttribute.Attribute.name + '"',
                    showCancelButton: true,
                    cancelButtonText: $i18next.t('popup.cancel_button'),
                    confirmButtonText: $i18next.t('popup.save_button'),
                    input: 'number',
                    inputValue: raceAttribute.base_cost,
                    inputValidator: function (value) {
                        return new Promise(function (resolve, reject) {
                            if (value !== '') {
                                if (parseInt(value) > 0) {
                                    resolve()
                                } else {
                                    reject($i18next.t('page.race.edit_attribute_less_one'))
                                }
                            } else {
                                reject($i18next.t('page.race.edit_attribute_empty_cost'))
                            }
                        })
                    }
                }).then(function success(result) {
                    $http.put('/raceAttributes/' + raceAttribute.id, {
                        base_cost: result[0]
                    }).then(function () {
                        raceAttributesTable.ajax.reload(null, false)
                    });
                });
            });
        });
    });

    $http.get('/merits').then(function (response) {
        $scope.merits = response.data.data;
        var raceMeritsTableSelector = $('#racesMeritsTable');

        var raceMeritsTable = raceMeritsTableSelector.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "language": {
                "emptyTable": $i18next.t('page.race.empty_merits_table')
            },
            "ajax": '/raceMeritsByRaceId/' + raceId,
            "columns": [
                {"data": "Merit.name"},
                {
                    data: "race_default",
                    orderable: false,
                    render: function (data, type, row) {
                        if (data) {
                            return $i18next.t('general.by_default')
                        } else {
                            return row.race_cost;
                        }
                    }

                },
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-danger btn-sm btn-rounded fa fa-close delete-race-merit" value="' + data + '" type="button"></button>';
                    }
                }
            ]
        });

        $scope.addRaceMerit = function () {
            if ($scope.merit_race_cost === '') {
                $scope.merit_race_cost = 0;
            }
            $http.post('/raceMerits', {
                race_id: raceId,
                merit_id: $scope.merit_id,
                race_cost: $scope.merit_race_cost,
                race_default: $scope.merit_race_default
            }).then(function () {
                jQuery('#addRaceMeritModal').modal('hide');
                $('#addRaceMeritModal').on('hidden.bs.modal', function () {
                    raceMeritsTable.ajax.reload(null, false);
                });
            });
        };

        raceMeritsTableSelector.on('click', '.delete-race-merit', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.race.delete_merit_text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
            }).then(function success() {
                $http.delete('/raceMerits/' + id).then(function () {
                    raceMeritsTable.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });
    });

    $http.get('/flaws').then(function (response) {
        $scope.flaws = response.data.data;
        var raceFlawsTableSelector = $('#racesFlawsTable');

        var raceFlawsTable = raceFlawsTableSelector.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "language": {
                "emptyTable": $i18next.t('page.race.empty_flaws_table')
            },
            "ajax": '/raceFlawsByRaceId/' + raceId,
            "columns": [
                {"data": "Flaw.name"},
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-danger btn-sm btn-rounded fa fa-close delete-race-flaw" value="' + data + '" type="button"></button>';
                    }
                }
            ]
        });

        $scope.addRaceFlaw = function () {
            $http.post('/raceFlaws', {
                race_id: raceId,
                flaw_id: $scope.flaw_id
            }).then(function () {
                jQuery('#addRaceFlawModal').modal('hide');
                $('#addRaceFlawModal').on('hidden.bs.modal', function () {
                    raceFlawsTable.ajax.reload(null, false);
                });
            });
        };

        raceFlawsTableSelector.on('click', '.delete-race-flaw', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.race.delete_flaw_text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
            }).then(function success() {
                $http.delete('/raceFlaws/' + id).then(function () {
                    raceFlawsTable.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });
    });

    $http.get('/inherents').then(function (response) {
        $scope.inherents = response.data.data;
        var raceInherentsTableSelector = $('#racesInherentsTable');

        var raceInherentsTable = raceInherentsTableSelector.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "language": {
                "emptyTable": $i18next.t('page.race.empty_inherents_table')
            },
            "ajax": '/raceInherentsByRaceId/' + raceId,
            "columns": [
                {"data": "Inherent.name"},
                {
                    data: "race_probability",
                    orderable: false,
                    render: function (data, type, row) {
                        if (data === 1) {
                            return $i18next.t('general.by_default')
                        } else {
                            return '1/' + data;
                        }
                    }

                },
                {
                    data: "race_min",
                    orderable: false,
                    render: function (data, type, row) {
                        if (data === null) {
                            return $i18next.t('general.by_default')
                        } else {
                            return data;
                        }
                    }

                },
                {
                    data: "race_max",
                    orderable: false,
                    render: function (data, type, row) {
                        if (data === null) {
                            return $i18next.t('general.by_default')
                        } else {
                            return data;
                        }
                    }

                },
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-danger btn-sm btn-rounded fa fa-close delete-race-inherent" value="' + data + '" type="button"></button>';
                    }
                }
            ]
        });

        $scope.addRaceInherent = function () {
            if ($scope.inherent_race_probability === '') {
                $scope.inherent_race_probability = 1;
            }
            if ($scope.race_min === '') {
                $scope.race_min = null;
            }
            if ($scope.race_max === '') {
                $scope.race_max = null;
            }
            $http.post('/raceInherents', {
                race_id: raceId,
                inherent_id: $scope.inherent_id,
                race_probability: $scope.inherent_race_probability,
                race_min: $scope.race_min,
                race_max: $scope.race_max
            }).then(function () {
                jQuery('#addRaceInherentModal').modal('hide');
                $('#addRaceInherentModal').on('hidden.bs.modal', function () {
                    raceInherentsTable.ajax.reload(null, false);
                });
            });
        };

        raceInherentsTableSelector.on('click', '.delete-race-inherent', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.race.delete_inherent_text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
            }).then(function success() {
                $http.delete('/raceInherents/' + id).then(function () {
                    raceInherentsTable.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });
    });

    autosize($('#raceDescription'));

    $timeout(function () {
        $('#merit_id').selectpicker({liveSearch: true});
    }, 3000);

    $timeout(function () {
        $('#flaw_id').selectpicker({liveSearch: true});
    }, 3000);

    $timeout(function () {
        $('#inherent_id').selectpicker({liveSearch: true});
    }, 3000);

    $scope.hideEditBlock = true;
    $scope.hideEditDescriptionBlock = true;

    $scope.saveRace = function () {
        $http.put('/races/' + raceId, {
            name: $scope.race.name,
            max_age: $scope.race.max_age,
            description: $scope.race.description
        }).then(function () {
            $scope.hideEditBlock = true;
            $scope.hideEditDescriptionBlock = true;
        });
    };

    $scope.clearRaceMeritForm = function () {
        $scope.merit_race_cost = '';
        $scope.merit_race_default = false;
    };

    $scope.clearRaceInherentForm = function () {
        $scope.inherent_race_probability = '';
    };

    $scope.inherentHasValue = false;
    $scope.checkInherentValues = function (inherent_id) {
        $scope.inherentHasValue = false;
        angular.forEach($scope.inherents, function (inherent) {
            if (inherent.id === inherent_id) {
                if (inherent.min_limit !== null) {
                    $scope.inherentHasValue = true;
                }
            }
        });
    };
});
