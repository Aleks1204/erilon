/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("raceManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("raceListController", function ($scope, $http, $q, $localStorage, $i18next) {
    var racesTable = $('#racesTable');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Race', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('Race', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = racesTable.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "ajax": '/racesWithRelations',
            columnDefs: [
                { responsivePriority: 1, targets: 1 }
            ],
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {"data": "max_age"},
                {
                    data: "description",
                    orderable: false
                },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        var returned = '';
                        angular.forEach(row.RaceAttributes, function (raceAttribute) {
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + raceAttribute.Attribute.name + ': ' + raceAttribute.base_cost + '</span>';
                        });

                        return returned;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        var returned = '';
                        angular.forEach(row.RaceMerits, function (raceMerit) {
                            var raceCost = raceMerit.race_cost;
                            if (raceMerit.race_default) {
                                raceCost = 'По умолчанию'
                            }
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + raceMerit.Merit.name + ': ' + raceCost + '</span>';
                        });

                        angular.forEach(row.RaceFlaws, function (raceFlaw) {
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + raceFlaw.Flaw.name + ': ' + $i18next.t('by_default') + '</span>';
                        });

                        angular.forEach(row.RaceInherents, function (raceInherent) {
                            var raceProbability = '1/' + raceInherent.race_probability;
                            if (raceInherent.race_probability === 1) {
                                raceProbability = $i18next.t('by_default')
                            }
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + raceInherent.Inherent.name + ': ' + raceProbability + '</span>';
                        });

                        return returned;
                    }
                },
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a href="race.html?id=' + data + '" class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline" type="button" ' + disableEditButton() + '></a>' +
                            '<button class="btn btn-icon btn-danger btn-rounded fa fa-close margin-inline delete" value="'
                            + data + '" type="button" ' + disableDeleteButton() + '></button>';
                    }
                }
            ]
        });

        table.columns().iterator( 'column', function (ctx, idx) {
            $( table.column(idx).header() ).append('<span class="sort-icon"/>');
        });

        racesTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if (tr.find('td').length < 6 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
                if (row.child.isShown()) {
                    $(this).find('.icmn-circle-down2').remove();
                    $(this).prepend('<i class="icmn-circle-up2 margin-right-10"></i>');
                }
                else {
                    $(this).find('.icmn-circle-up2').remove();
                    $(this).prepend('<i class="icmn-circle-down2 margin-right-10"></i>');
                }
            }
        } );

        racesTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: $i18next.t('confirm_title'),
                text: $i18next.t('delete_race_title'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('delete_button'),
                cancelButtonText: $i18next.t('cancel_button')
            }).then(function success() {
                $http.delete('/races/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        $scope.showAddDialog = function () {
            swal({
                title: $i18next.t('add_race_title'),
                html:
                '<form>' +
                    '<div class="form-group">' +
                '<label for="name" class="form-control-label">' + $i18next.t('add_race_name') + '</label>' +
                        '<input type="text" class="form-control" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                '<label for="description" class="form-control-label">' + $i18next.t('add_race_description') + '</label>' +
                        '<textarea class="form-control" id="description"></textarea>' +
                    '</div>' +
                '<p>' + $i18next.t('add_race_max_age') + '</p>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: $i18next.t('cancel_button'),
                confirmButtonText: $i18next.t('add_button'),
                showLoaderOnConfirm: true,
                input: 'number',
                preConfirm: function (value) {
                    return new Promise(function (resolve) {
                        resolve([
                            value,
                            $('#name').val(),
                            $('#description').val()
                        ])
                    })
                },
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if ($('#name').val() !== '') {
                            if (value !== '') {
                                if (parseInt(value) >= 10) {
                                    resolve()
                                } else {
                                    reject($i18next.t('max_age_less10_error_message'))
                                }
                            } else {
                                reject($i18next.t('max_age_empty_error_message'))
                            }
                        } else {
                            reject($i18next.t('race_name_empty_error_message'))
                        }
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                }
            }).then(function success(result) {
                $http.post('/races', {
                    name: result[1],
                    max_age: result[0],
                    description: result[2]
                }).then(function (response) {
                    var attributes = $q.defer();

                    $http.get('/attributes').then(function (response) {
                        attributes.resolve(response.data.data);
                    });

                    $q.all([attributes.promise]).then(function (attributes) {
                        var attributePromises = [];
                        angular.forEach(attributes[0], function (attribute) {
                            attributePromises.push($http.post('/raceAttributes', {
                                race_id: response.data.race.id,
                                attribute_id: attribute.id,
                                base_cost: 5,
                                max_value: 12
                            }));
                        });

                        $q.all(attributePromises).then(function () {
                            table.ajax.reload(null, false)
                        });
                    });
                });
            });
        };
    }
});
