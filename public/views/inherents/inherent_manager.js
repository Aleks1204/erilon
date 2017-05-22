/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("inherentManagerApp", ['ngStorage']);

app.controller("inherentListController", function ($scope, $http, $q, $localStorage) {

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
                "search": "Поиск:",
                "paginate": {
                    "first": "Первая",
                    "last": "Последняя",
                    "next": "След.",
                    "previous": "Пред."
                },
                "lengthMenu": "Показать _MENU_"
            },
            stateSave: true,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "Все"]],
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
                    data: 'action_level_bonus',
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

        inherentsTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if (tr.find('td').length < 7 && $(this).index() === 0) {
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
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить данную особенность?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Да!",
                cancelButtonText: "Отменить"
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
                    title: 'Изменить особенность',
                    html: '<form>' +
                    '<div class="form-group">' +
                        '<label for="name" class="form-control-label">Имя:</label>' +
                        '<input type="text" class="form-control" id="name" value="' + inherent.name + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="probability" class="form-control-label">Вероятность:</label>' +
                        '1/<input type="number" class="form-control" id="probability" value="' + inherent.probability + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="min_limit" class="form-control-label">Минимум:</label>' +
                        '<input type="number" class="form-control" id="min_limit" value="' + inherent.min_limit + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="max_limit" class="form-control-label">Максимум:</label>' +
                        '<input type="number" class="form-control" id="max_limit" value="' + inherent.max_limit + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="description" class="form-control-label">Описание:</label>' +
                        '<textarea id="description" class="form-control">' + inherent.description + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="action_level_bonus" class="form-control-label">Бонус:</label>' +
                        '<textarea id="action_level_bonus" class="form-control">' + inherent.action_level_bonus + '</textarea>' +
                    '</div>' +
                    '</form>',
                    showCancelButton: true,
                    cancelButtonText: "Отменить",
                    confirmButtonText: "Сохранить",
                    showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                $('#name').val(),
                                $('#probability').val(),
                                $('#min_limit').val(),
                                $('#max_limit').val(),
                                $('#description').val(),
                                $('#action_level_bonus').val()
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();

                        autosize($('#action_level_bonus'));
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
                        action_level_bonus: result[5]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: 'Добавить особенность',
                html: '<form>' +
                '<div class="form-group">' +
                    '<label for="name" class="form-control-label">Имя:</label>' +
                    '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="probability" class="form-control-label">Вероятность:</label>' +
                    '1/<input type="number" class="form-control" id="probability">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="min_limit" class="form-control-label">Минимум:</label>' +
                    '<input type="number" class="form-control" id="min_limit">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="max_limit" class="form-control-label">Максимум:</label>' +
                    '<input type="number" class="form-control" id="max_limit">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="description" class="form-control-label">Описание:</label>' +
                    '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="action_level_bonus" class="form-control-label">Бонус:</label>' +
                    '<textarea id="action_level_bonus" class="form-control"></textarea>' +
                '</div>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: "Отменить",
                confirmButtonText: "Добавить",
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
                                reject('Врожденная особенность с таким именем уже существует!')
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
                            $('#action_level_bonus').val()
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                    autosize($('#action_level_bonus'));
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
                    action_level_bonus: result[5]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
