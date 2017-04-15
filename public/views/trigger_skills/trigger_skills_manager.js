/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("triggerSkillManagerApp", ['ngStorage']);

app.controller("triggerSkillListController", function ($scope, $http, $q, $localStorage) {
    $http.get('/triggerSkills').then(function (response) {
        $scope.triggerSkills = response.data.triggerSkills;
    });

    var skillsTable = $('#skills');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('TriggerSkill', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('TriggerSkill', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = skillsTable.DataTable({
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
            "ajax": '/triggerSkills',
            "columns": [
                {"data": "name"},
                {"data": "category"},
                {"data": "cost"},
                {
                    data: 'difficult',
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

        skillsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить данный навык?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Да!",
                cancelButtonText: "Отменить"
            }).then(function success() {
                $http.delete('/triggerSkills/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        skillsTable.on('click', '.edit', function () {
            $http.get('/triggerSkills/' + this.value).then(function (response) {
                var skill = response.data.triggerSkill;
                var isDifficult = '';
                if (skill.difficult) {
                    isDifficult = 'checked';
                }
                swal({
                    title: 'Изменить навык',
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="noticeTitle" class="form-control-label">Имя:</label>' +
                    '<input type="text" class="form-control" value="' + skill.name + '" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="noticeExperience" class="form-control-label">Категории:</label>' +
                    '<input type="text" class="form-control" value="' + skill.category + '" id="category">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="noticeBody" class="form-control-label">Описание:</label>' +
                    '<textarea id="description" class="form-control">' + skill.description + '</textarea>' +
                    '</div>' +
                    '<div class="row form-group">' +
                    '<div class="col-md-4">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="difficultSkill" name="difficultSkill" type="checkbox" ' + isDifficult + '>' +
                    '<label for="difficultSkill">Сложный</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="defaultSkill" name="defaultSkill" type="checkbox" ' + isDefault + '>' +
                    '<label for="defaultSkill">По умолчанию</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="theoreticalSkill" name="theoreticalSkill" type="checkbox" ' + isTheoretical + '>' +
                    '<label for="theoreticalSkill">Теоретическсий</label>' +
                    '</div>' +
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
                                $('#description').val(),
                                $('#difficultSkill').prop("checked"),
                                $('#defaultSkill').prop("checked"),
                                $('#theoreticalSkill').prop("checked")
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();
                        autosize($('#description'));
                    }
                }).then(function success(result) {
                    $http.put('/triggerSkills/' + skill.id, {
                        name: result[0],
                        category: result[1],
                        description: result[2],
                        difficult: result[3],
                        theoretical: result[5],
                        default_skill: result[4],
                        spells_connected: false
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: 'Добавить навык',
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
                '<label for="noticeExperience" class="form-control-label">Категории:</label>' +
                '<input type="text" class="form-control" id="category">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="noticeBody" class="form-control-label">Описание:</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="difficultSkill" name="difficultSkill" type="checkbox">' +
                '<label for="difficultSkill">Сложный</label>' +
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
                            $('#cost').val(),
                            $('#category').val().replace(/\s/g, ''),
                            $('#description').val(),
                            $('#difficultSkill').prop("checked")
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();
                    autosize($('#description'));
                }
            }).then(function success(result) {
                $http.post('/triggerSkills', {
                    name: result[0],
                    cost: result[1],
                    category: result[2],
                    description: result[3],
                    difficult: result[4]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});

