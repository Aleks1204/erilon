/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("meritManagerApp", ['ngStorage']);

app.controller("meritListController", function ($scope, $http, $q, $localStorage) {

    var meritsTable = $('#merits');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Merit', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('Merit', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = meritsTable.DataTable({
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
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]],
            "info": false,
            "ajax": '/merits',
            "columns": [
                {"data": "name"},
                {"data": "category"},
                {"data": "cost"},
                {
                    data: 'creation_only',
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
                    data: null,
                    orderable: false,
                    render: function (data, type, row) {
                        var returned = '';
                        angular.forEach(row.MeritAttachedSkills, function (meritAttachedSkill) {
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritAttachedSkill.AttachedSkill.name + ': ' + meritAttachedSkill.value + '</span>';
                        });

                        angular.forEach(row.MeritAttributes, function (meritAttribute) {
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritAttribute.Attribute.name + ': ' + meritAttribute.value + '</span>';
                        });

                        angular.forEach(row.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritAttributeAttachedSkill.Attribute.name + '+' + meritAttributeAttachedSkill.AttachedSkill.name + ': ' + meritAttributeAttachedSkill.value + '</span>';
                        });

                        angular.forEach(row.MeritTriggerSkills, function (meritTriggerSkill) {
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritTriggerSkill.TriggerSkill.name + ': ' + meritTriggerSkill.level + '</span>';
                        });

                        angular.forEach(row.MeritInherents, function (meritInherent) {
                            var sign = '=';
                            if (meritInherent.lessMoreEqual === 1) {
                                sign = '>';
                            }
                            if (meritInherent.lessMoreEqual === -1) {
                                sign = '<';
                            }

                            if (meritInherent.value === null) {
                                returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritInherent.Inherent.name + ': присутствует</span>';
                            } else {
                                returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritInherent.Inherent.name + ': ' + sign + meritInherent.value + '</span>';
                            }
                        });

                        angular.forEach(row.MeritFlaws, function (meritFlaw) {
                            var presence = 'Отсутствует';
                            if (meritFlaw.presentAbsent) {
                                presence = 'Присутствует';
                            }
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritFlaw.Flaw.name + ': ' + presence + '</span>';
                        });

                        angular.forEach(row.MeritMerits, function (meritMerit) {
                            var presence = 'Отсутствует';
                            if (meritMerit.presentAbsent) {
                                presence = 'Присутствует';
                            }
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritMerit.MeritPrerequisite.name + ': ' + presence + '</span>';
                        });

                        return returned;
                    }
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

        meritsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить данный недостаток?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Да!",
                cancelButtonText: "Отменить"
            }).then(function success() {
                $http.delete('/merits/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        meritsTable.on('click', '.edit', function () {
            $http.get('/merits/' + this.value).then(function (response) {
                var merit = response.data.merit;
                var creation_only = '';
                if (merit.creation_only) {
                    creation_only = 'checked';
                }
                swal({
                    title: 'Изменить достоинство',
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="name" class="form-control-label">Имя:</label>' +
                    '<input type="text" class="form-control" value="' + merit.name + '" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="cost" class="form-control-label">Стоимость:</label>' +
                    '<input type="number" class="form-control" id="cost" value="' + merit.cost + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="category" class="form-control-label">Категории:</label>' +
                    '<input type="text" class="form-control" value="' + merit.category + '" id="category">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">Описание:</label>' +
                    '<textarea id="description" class="form-control">' + merit.description + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="action_level_bonus" class="form-control-label">Бонус:</label>' +
                    '<textarea id="action_level_bonus" class="form-control">' + merit.action_level_bonus + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="creation_only" name="creation_only" type="checkbox" ' + creation_only + '>' +
                    '<label for="creation_only">Только при создании</label>' +
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
                                $('#category').val().replace(/\s/g, ''),
                                $('#cost').val(),
                                $('#description').val(),
                                $('#action_level_bonus').val(),
                                $('#creation_only').prop("checked")
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();
                        autosize($('#description'));
                        autosize($('#action_level_bonus'));
                    }
                }).then(function success(result) {
                    $http.put('/merits/' + merit.id, {
                        name: result[0],
                        category: result[1],
                        cost: result[2],
                        description: result[3],
                        action_level_bonus: result[4],
                        creation_only: result[5]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: 'Добавить достоинство',
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
                '<input type="text" class="form-control" id="category">' +
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
                '<input id="creation_only" name="creation_only" type="checkbox">' +
                '<label for="creation_only">Только при создании</label>' +
                '</div>' +
                '</div>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: "Отменить",
                confirmButtonText: "Добавить",
                showLoaderOnConfirm: true,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        resolve([
                            $('#name').val(),
                            $('#category').val().replace(/\s/g, ''),
                            $('#cost').val(),
                            $('#description').val(),
                            $('#action_level_bonus').val(),
                            $('#creation_only').prop("checked")
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();
                    autosize($('#description'));
                    autosize($('#action_level_bonus'));
                }
            }).then(function success(result) {
                $http.post('/merits', {
                    name: result[0],
                    category: result[1],
                    cost: result[2],
                    description: result[3],
                    action_level_bonus: result[4],
                    creation_only: result[5]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
