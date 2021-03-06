/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("inherentManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("inherentListController", function ($scope, $http, $q, $localStorage, $i18next) {

    var inherentsTable = $('#inherents');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Inherent', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('Inherent', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = inherentsTable.DataTable({
            responsive: true,
            "language": {
                "search": $i18next.t('table.label.search'),
                "paginate": {
                    "first": $i18next.t('table.pagination.first_page'),
                    "last": $i18next.t('table.pagination.last_page'),
                    "next": $i18next.t('table.pagination.next_page'),
                    "previous": $i18next.t('table.pagination.previous_page')
                },
                "lengthMenu": $i18next.t('table.pagination.show') + " _MENU_"
            },
            stateSave: true,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, $i18next.t('table.pagination.all')]],
            "info": false,
            "ajax": '/inherents',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {
                    data: 'probability',
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        return '1/' + data;
                    }
                },
                {
                    data: 'min_limit',
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        if (data === null) {
                            return '<i class="icmn-minus"></i>';
                        } else {
                            return data;
                        }
                    }
                },
                {
                    data: 'max_limit',
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        if (data === null) {
                            return '<i class="icmn-minus"></i>';
                        } else {
                            return data;
                        }
                    }
                },
                {
                    data: 'description',
                    orderable: false
                },
                {
                    data: 'permanent_bonus',
                    orderable: false
                },
                {
                    data: 'situation_bonus',
                    orderable: false
                },
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline edit" value="'
                            + data + '"  type="button" ' + disableEditButton() + '></button>' +
                            '<button class="btn btn-icon btn-danger btn-rounded fa fa-close margin-inline delete" value="'
                            + data + '" type="button" ' + disableDeleteButton() + '></button>';
                    }
                }
            ]
        });

        table.columns().iterator( 'column', function (ctx, idx) {
            $( table.column(idx).header() ).append('<span class="sort-icon"/>');
        });

        inherentsTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if (tr.find('td').length < 7 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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

        inherentsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.inherents.delete.text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
            }).then(function success() {
                $http.delete('/inherents/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        inherentsTable.on('click', '.edit', function () {
            $http.get('/inherents/' + this.value).then(function (response) {
                var inherent = response.data.inherent;

                swal({
                    title: $i18next.t('page.inherents.edit.title'),
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="name" class="form-control-label">' + $i18next.t('page.inherents.edit.name') + '</label>' +
                        '<input type="text" class="form-control" id="name" value="' + inherent.name + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="probability" class="form-control-label">' + $i18next.t('page.inherents.edit.probability') + '</label>' +
                        '1/<input type="number" class="form-control" id="probability" value="' + inherent.probability + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="min_limit" class="form-control-label">' + $i18next.t('page.inherents.edit.min') + '</label>' +
                        '<input type="number" class="form-control" id="min_limit" value="' + inherent.min_limit + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="max_limit" class="form-control-label">' + $i18next.t('page.inherents.edit.max') + '</label>' +
                        '<input type="number" class="form-control" id="max_limit" value="' + inherent.max_limit + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">' + $i18next.t('page.inherents.edit.description') + '</label>' +
                        '<textarea id="description" class="form-control">' + inherent.description + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="permanent_bonus" class="form-control-label">' + $i18next.t('page.inherents.edit.permanent_bonus') + '</label>' +
                    '<textarea id="permanent_bonus" class="form-control">' + inherent.permanent_bonus + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="situation_bonus" class="form-control-label">' + $i18next.t('page.inherents.edit.situation_bonus') + '</label>' +
                    '<textarea id="situation_bonus" class="form-control">' + inherent.situation_bonus + '</textarea>' +
                    '</div>' +
                    '</form>',
                    showCancelButton: true,
                    cancelButtonText: $i18next.t('popup.cancel_button'),
                    confirmButtonText: $i18next.t('popup.save_button'),
                    showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                $('#name').val(),
                                $('#probability').val(),
                                $('#min_limit').val(),
                                $('#max_limit').val(),
                                $('#description').val(),
                                $('#permanent_bonus').val(),
                                $('#situation_bonus').val()
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();
                    }
                }).then(function success(result) {
                    var min = null;
                    var max = null;
                    if (result[2] !== '') {
                        min = result[2];
                    }
                    if (result[3] !== '') {
                        max = result[3];
                    }
                    $http.put('/inherents/' + inherent.id, {
                        name: result[0],
                        probability: result[1],
                        min_limit: min,
                        max_limit: max,
                        description: result[4],
                        permanent_bonus: result[5],
                        situation_bonus: result[6]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: $i18next.t('page.inherents.add.title'),
                html: '<form>' +
                '<div class="form-group">' +
                '<label for="name" class="form-control-label">' + $i18next.t('page.inherents.add.name') + '</label>' +
                    '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="probability" class="form-control-label">' + $i18next.t('page.inherents.add.probability') + '</label>' +
                    '1/<input type="number" class="form-control" id="probability">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="min_limit" class="form-control-label">' + $i18next.t('page.inherents.add.min') + '</label>' +
                    '<input type="number" class="form-control" id="min_limit">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="max_limit" class="form-control-label">' + $i18next.t('page.inherents.add.max') + '</label>' +
                    '<input type="number" class="form-control" id="max_limit">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">' + $i18next.t('page.inherents.add.description') + '</label>' +
                    '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="permanent_bonus" class="form-control-label">' + $i18next.t('page.inherents.add.permanent_bonus') + '</label>' +
                '<textarea id="permanent_bonus" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="situation_bonus" class="form-control-label">' + $i18next.t('page.inherents.add.situation_bonus') + '</label>' +
                '<textarea id="situation_bonus" class="form-control"></textarea>' +
                '</div>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: $i18next.t('popup.cancel_button'),
                confirmButtonText: $i18next.t('popup.add_button'),
                showLoaderOnConfirm: true,
                input: 'text',
                inputClass: 'hide',
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        var name = $('#name').val();
                        var equal = false;
                        $http.get('/inherents').then(function (response) {
                            angular.forEach(response.data.data, function (inherent) {
                                if (inherent.name.toLowerCase() === name.toLowerCase()) {
                                    equal = true;
                                }
                            });
                            if (equal) {
                                reject($i18next.t('page.inherents.error_message.already_exists'))
                            } else {
                                resolve()
                            }
                        });
                    })
                },
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        resolve([
                            $('#name').val(),
                            $('#probability').val(),
                            $('#min_limit').val(),
                            $('#max_limit').val(),
                            $('#description').val(),
                            $('#permanent_bonus').val(),
                            $('#situation_bonus').val()
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();
                }
            }).then(function success(result) {
                var min = null;
                var max = null;
                if (result[2] !== '') {
                    min = result[2];
                }
                if (result[3] !== '') {
                    max = result[3];
                }
                $http.post('/inherents/', {
                    name: result[0],
                    probability: result[1],
                    min_limit: min,
                    max_limit: max,
                    description: result[4],
                    permanent_bonus: result[5],
                    situation_bonus: result[6]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
