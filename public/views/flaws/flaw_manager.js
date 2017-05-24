/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("flawManagerApp", ['ngStorage']);

app.controller("flawListController", function ($scope, $http, $q, $localStorage) {

    var flawsTable = $('#flaws');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Flaw', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('Flaw', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = flawsTable.DataTable({
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
            "ajax": '/flaws',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {"data": "category"},
                {"data": "cost"},
                {
                    data: 'unremovable',
                    className: 'text-center',
                    orderable: false,
                    render: function (data, type, row) {
                        if (data) {
                            return '<i class="icmn-plus"></i>';
                        } else {
                            return '<i class="icmn-minus"></i>';
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

        flawsTable.on('click', 'td', function () {
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

        flawsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить данный недостаток?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Удалить!",
                cancelButtonText: "Отменить"
            }).then(function success() {
                $http.delete('/flaws/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        flawsTable.on('click', '.edit', function () {
            $http.get('/flaws/' + this.value).then(function (response) {
                var flaw = response.data.flaw;
                var unremovable = '';
                if (flaw.unremovable) {
                    unremovable = 'checked';
                }
                swal({
                    title: 'Изменить недостаток',
                    html: '<form>' +
                    '<div class="form-group">' +
                        '<label for="name" class="form-control-label">Имя:</label>' +
                        '<input type="text" class="form-control" value="' + flaw.name + '" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="cost" class="form-control-label">Стоимость:</label>' +
                        '<input type="number" class="form-control" id="cost" value="' + flaw.cost + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="category" class="form-control-label">Категории:</label>' +
                        '<select class="form-control" title="Выберите категорию..." id="category" multiple>' +
                            '<option value="физические">физические</option>' +
                            '<option value="социальные">социальные</option>' +
                            '<option value="ментальные">ментальные</option>' +
                            '<option value="кодекс чести">кодекс чести</option>' +
                            '<option value="внешность">внешность</option>' +
                            '<option value="мистические">мистические</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="description" class="form-control-label">Описание:</label>' +
                        '<textarea id="description" class="form-control">' + flaw.description + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="action_level_bonus" class="form-control-label">Бонус:</label>' +
                        '<textarea id="action_level_bonus" class="form-control">' + flaw.action_level_bonus + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                            '<input id="unremovable" name="unremovable" type="checkbox" ' + unremovable + '>' +
                            '<label for="unremovable">Неудаляемый</label>' +
                        '</div>' +
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
                                $('#category').val().toString(),
                                $('#cost').val(),
                                $('#description').val(),
                                $('#action_level_bonus').val(),
                                $('#unremovable').prop("checked")
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();

                        autosize($('#action_level_bonus'));
                        if (flaw.category === null) {
                            $('#category').selectpicker();
                        } else {
                            $('#category').selectpicker('val', flaw.category.split(','));
                        }
                        $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                    }
                }).then(function success(result) {
                    $http.put('/flaws/' + flaw.id, {
                        name: result[0],
                        category: result[1],
                        cost: result[2],
                        description: result[3],
                        action_level_bonus: result[4],
                        unremovable: result[5]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: 'Добавить недостаток',
                html: '<form>' +
                '<div class="form-group">' +
                    '<label for="name" class="form-control-label">Имя:</label>' +
                    '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="cost" class="form-control-label">Стоимость:</label>' +
                    '<input type="number" class="form-control" id="cost">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="category" class="form-control-label">Категории:</label>' +
                    '<select class="form-control" title="Выберите категорию..." id="category" multiple>' +
                        '<option value="физические">физические</option>' +
                        '<option value="социальные">социальные</option>' +
                        '<option value="ментальные">ментальные</option>' +
                        '<option value="кодекс чести">кодекс чести</option>' +
                        '<option value="внешность">внешность</option>' +
                        '<option value="мистические">мистические</option>' +
                    '</select>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="description" class="form-control-label">Описание:</label>' +
                    '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label for="action_level_bonus" class="form-control-label">Бонус:</label>' +
                    '<textarea id="action_level_bonus" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                        '<input id="unremovable" name="unremovable" type="checkbox">' +
                        '<label for="unremovable">Неудаляемый</label>' +
                    '</div>' +
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
                        $http.get('/flaws').then(function (response) {
                            angular.forEach(response.data.data, function (flaw) {
                                if (flaw.name.toLowerCase() === name.toLowerCase()) {
                                    equal = true;
                                }
                            });
                            if (equal) {
                                reject('Недостаток с таким именем уже существует!')
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
                            $('#category').val().toString(),
                            $('#cost').val(),
                            $('#description').val(),
                            $('#action_level_bonus').val(),
                            $('#unremovable').prop("checked")
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                    autosize($('#action_level_bonus'));
                    $('#category').selectpicker();
                    $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                }
            }).then(function success(result) {
                $http.post('/flaws', {
                    name: result[0],
                    category: result[1],
                    cost: result[2],
                    description: result[3],
                    action_level_bonus: result[4],
                    unremovable: result[5]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
