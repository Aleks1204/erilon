/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("attributeManagerApp", ['ngStorage']);

app.controller("attributeListController", function ($scope, $http, $q, $localStorage) {
    var attributesTable = $('#attributesTable');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Attribute', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('Attribute', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = attributesTable.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "ajax": '/attributes',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-right-10"></i>' + data;
                    }
                },
                {
                    data: 'action_level_bonus',
                    orderable: false
                },
                {
                    data: 'description',
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

        attributesTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if (tr.find('td').length < 4 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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

        attributesTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить данный атрибут?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Да!",
                cancelButtonText: "Отменить"
            }).then(function success() {
                $http.delete('/attributes/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        attributesTable.on('click', '.edit', function () {
            $http.get('/attributes/' + this.value).then(function (response) {
                var attribute = response.data.attribute;
                swal({
                    title: 'Изменить атрибут',
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="name" class="form-control-label">Имя:</label>' +
                    '<input type="text" class="form-control" id="name" value="' + attribute.name + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">Описание:</label>' +
                    '<textarea id="description" class="form-control">' + attribute.description + '</textarea>' +
                    '</div>' +
                    '<p>Бонус:</p>' +
                    '</form>',
                    showCancelButton: true,
                    cancelButtonText: "Отменить",
                    confirmButtonText: "Сохранить",
                    showLoaderOnConfirm: true,
                    input: 'textarea',
                    inputValue: attribute.action_level_bonus,
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
                                resolve()
                            } else {
                                reject('Имя навыка не может быть пустым!')
                            }
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();
                        autosize($('#description'));
                    }
                }).then(function success(result) {
                    $http.put('/attributes/' + attribute.id, {
                        name: result[1],
                        description: result[2],
                        action_level_bonus: result[0]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: 'Добавить атрибут',
                html: '<form>' +
                '<div class="form-group">' +
                '<label for="name" class="form-control-label">Имя:</label>' +
                '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">Описание:</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<p>Бонус:</p>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: "Отменить",
                confirmButtonText: "Добавить",
                showLoaderOnConfirm: true,
                input: 'textarea',
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
                        var name = $('#name').val();
                        if (name !== '') {
                            var equal = false;
                            $http.get('/attributes').then(function (response) {
                                angular.forEach(response.data.data, function (attribute) {
                                    if (attribute.name.toLowerCase() === name.toLowerCase()) {
                                        equal = true;
                                    }
                                });
                                if (equal) {
                                    reject('Атрибут с таким именем уже существует!')
                                } else {
                                    resolve()
                                }
                            });
                        } else {
                            reject('Имя навыка не может быть пустым!')
                        }
                    })
                },
                onOpen: function () {
                    $('#name').focus();
                    autosize($('#description'));
                }
            }).then(function success(result) {
                $http.post('/attributes', {
                    name: result[1],
                    description: result[2],
                    action_level_bonus: result[0]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
