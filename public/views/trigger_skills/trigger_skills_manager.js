/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("triggerSkillManagerApp", ['ngStorage']);

app.controller("triggerSkillListController", function ($scope, $http, $q, $localStorage) {
    var skillsTable = $('#skills');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $http.get('/triggerSkills').then(function (response) {
        $scope.triggerSkillsOptions = '{';
        angular.forEach(response.data.data, function (triggerSkill) {
            $scope.triggerSkillsOptions = $scope.triggerSkillsOptions + "\"" + triggerSkill.id + "\"" + ":" + "\"" + triggerSkill.name + "\",";
        });
        $scope.triggerSkillsOptions = $scope.triggerSkillsOptions + "\"\":\"Нет базового навыка\",";
        $scope.triggerSkillsOptions = $scope.triggerSkillsOptions.substring(0, $scope.triggerSkillsOptions.length - 1) + "}";
        $scope.triggerSkillsOptions = JSON.parse($scope.triggerSkillsOptions);
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
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "Все"]],
            "info": false,
            "ajax": '/triggerSkills',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {"data": "category"},
                {
                    data: 'BaseTriggerSkill',
                    orderable: false,
                    render: function (data, type, row) {
                        if (data === null) {
                            return '-';
                        } else {
                            return data.name;
                        }
                    }
                },
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
                        return '<a href="trigger_skill.html?id=' + data + '" class="btn btn-icon btn-primary btn-rounded icmn-upload9 margin-inline" type="button"></a>' +
                            '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline edit" value="'
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

        skillsTable.on('click', 'td', function () {
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

        skillsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить данный навык?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Удалить!",
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
                var triggerSkillId = "";
                if (skill.TriggerSkillId !== null) {
                    triggerSkillId = skill.TriggerSkillId;
                }
                if (skill.difficult) {
                    isDifficult = 'checked';
                }
                swal({
                    title: 'Изменить навык',
                    html: '<form>' +
                    '<div class="form-group">' +
                        '<label for="name" class="form-control-label">Имя:</label>' +
                        '<input type="text" class="form-control" value="' + skill.name + '" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="cost" class="form-control-label">Стоимость:</label>' +
                        '<input type="number" class="form-control" value="' + skill.cost + '" id="cost">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="category" class="form-control-label">Категории:</label>' +
                        '<select class="form-control" title="Выберите категорию..." id="category" multiple>' +
                            '<option value="боевые">боевые</option>' +
                            '<option value="небоевые">небоевые</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label for="description" class="form-control-label">Описание:</label>' +
                        '<textarea id="description" class="form-control">' + skill.description + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                            '<input id="difficultSkill" name="difficultSkill" type="checkbox" ' + isDifficult + '>' +
                            '<label for="difficultSkill">Сложный</label>' +
                        '</div>' +
                    '</div>' +
                    '<p>Базовый навык:</p>' +
                    '</form>',
                    input: 'select',
                    inputOptions: $scope.triggerSkillsOptions,
                    inputValue: triggerSkillId.toString(),
                    inputClass: 'form-control',
                    showCancelButton: true,
                    cancelButtonText: "Отменить",
                    confirmButtonText: "Сохранить",
                    showLoaderOnConfirm: true,
                    preConfirm: function (value) {
                        return new Promise(function (resolve) {
                            resolve([
                                $('#name').val(),
                                $('#category').val().toString(),
                                $('#cost').val(),
                                $('#description').val(),
                                $('#difficultSkill').prop("checked"),
                                value
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();

                        if (skill.category === null) {
                            $('#category').selectpicker();
                        } else {
                            $('#category').selectpicker('val', skill.category.split(','));
                        }
                        $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                    }
                }).then(function success(result) {
                    var triggerSkillId = null;
                    if (result[5] !== '') {
                        triggerSkillId = result[5]
                    }
                    $http.put('/triggerSkills/' + skill.id, {
                        name: result[0],
                        category: result[1],
                        cost: result[2],
                        description: result[3],
                        difficult: result[4],
                        trigger_skill_id: triggerSkillId
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
                    '<select class="form-control" title="Выберите категорию..." id="category" multiple>' +
                        '<option value="боевые">боевые</option>' +
                        '<option value="небоевые">небоевые</option>' +
                    '</select>' +
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
                '<p>Базовый навык (не обязательно):</p>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: "Отменить",
                confirmButtonText: "Добавить",
                showLoaderOnConfirm: true,
                input: 'select',
                inputOptions: $scope.triggerSkillsOptions,
                inputPlaceholder: 'Выберите навык...',
                inputClass: 'form-control',
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        var name = $('#name').val();
                        var equal = false;
                        $http.get('/triggerSkills').then(function (response) {
                            angular.forEach(response.data.data, function (triggerSkill) {
                                if (triggerSkill.name.toLowerCase() === name.toLowerCase()) {
                                    equal = true;
                                }
                            });
                            if (equal) {
                                reject('Навык с таким именем уже существует!')
                            } else {
                                resolve()
                            }
                        });
                    })
                },
                preConfirm: function (value) {
                    return new Promise(function (resolve) {
                        resolve([
                            $('#name').val(),
                            $('#cost').val(),
                            $('#category').val().toString(),
                            $('#description').val(),
                            $('#difficultSkill').prop("checked"),
                            value
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                    $('#category').selectpicker();
                    $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                }
            }).then(function success(result) {
                var triggerSkillId = null;
                if (result[5] !== '') {
                    triggerSkillId = result[5]
                }
                $http.post('/triggerSkills', {
                    name: result[0],
                    cost: result[1],
                    category: result[2],
                    description: result[3],
                    difficult: result[4],
                    trigger_skill_id: triggerSkillId
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});

