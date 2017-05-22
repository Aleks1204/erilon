var app = angular.module("spells", ['ngStorage']);

app.controller("spellsController", function ($scope, $http, $q, $localStorage) {

    var players = $q.defer();
    var schools = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $http.get('/attachedSkills').then(function (response) {
        var magicSchools = [];
        angular.forEach(response.data.data, function (attachedSkill) {
            if (attachedSkill.spells_connected) {
                magicSchools.push(attachedSkill);
            }
        });
        schools.resolve(magicSchools);
    });

    $q.all([players.promise, schools.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Spell', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('Spell', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function hideAddButton() {
            if (hasPermission('Spell', 'create', data[0].player.Role)) {
                return '';
            } else {
                return ' style = "display: none"';
            }
        }

        function magicTable(school) {
            $('#spells').append(
                '<div class="row">' +
                    '<div id="' + school.id + 'MagicPanel" class="panel">' +
                        '<h3 class="panel-heading">' + school.name + ' <a ' + hideAddButton() + ' href="#" class="link-underlined link-blue add">Добавить</a></h3>' +
                        '<div class="panel-body table-responsive">' +
                            '<table id="' + school.id + 'Magic" class="table table-hover nowrap" width="100%">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th>Заклинание</th>' +
                                        '<th>Стоимость</th>' +
                                        '<th>Сложность</th>' +
                                        '<th>Сложность создания</th>' +
                                        '<th>Мана</th>' +
                                        '<th>Поддержание</th>' +
                                        '<th>Мгновенное</th>' +
                                        '<th>Эффект</th>' +
                                        '<th>Описание</th>' +
                                        '<th>Действия</th>' +
                                    '</tr>' +
                                '</thead>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                '</div>');
            var currentMagicTableSelector = $('#' + school.id + 'Magic');

            var currentMagicTable = currentMagicTableSelector.DataTable({
                responsive: true,
                stateSave: true,
                "language": {
                    "emptyTable": "Здесь еще нет заклинаний",
                    "loadingRecords": "Подождите, заклинания загружаются...",
                    "search": "Поиск:",
                    "paginate": {
                        "first": "Первая",
                        "last": "Последняя",
                        "next": "След.",
                        "previous": "Пред."
                    },
                    "lengthMenu": "Показать _MENU_"
                },
                "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "Все"]],
                "info": false,
                "ajax": '/spellsBySchoolId/' + school.id,
                columns: [
                    {
                        data: "name",
                        render: function (data, type, full, meta, row) {
                            return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                        }
                    },
                    {
                        data: 'cost',
                        className: 'text-center'
                    },
                    {
                        data: 'complexity',
                        className: 'text-center'
                    },
                    {
                        data: 'creating_complexity',
                        className: 'text-center'
                    },
                    {
                        data: 'mana',
                        className: 'text-center'
                    },
                    {
                        data: 'mana_support',
                        className: 'text-center',
                        orderable: false,
                        render: function (data, type, row) {
                            if (row.instant) {
                                return "-";
                            }
                            return row.mana_support + ' ' + row.mana_sup_time;
                        }
                    },
                    {
                        data: 'instant',
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
                        data: 'effect',
                        orderable: false,
                        render: function (data, type, row) {
                            return '<a href="javascript:void(0);' + row.id + '" class="link-underlined link-blue hidden-md-up effect">' +
                                'Эффект' +
                                '</a>' +
                                '<div id="spellEffect' + row.id + '" style="display: none">' +
                                '<br>' +
                                '<div>' + data + '</div>' +
                                '</div> <div class="hidden-xs-down">' + data + '</div>'
                        }
                    },
                    {
                        data: 'description',
                        orderable: false,
                        render: function (data, type, row) {
                            return '<a href="javascript:void(0);' + row.id + '" class="link-underlined link-blue hidden-md-up description">' +
                                'Описание' +
                                '</a>' +
                                '<div id="spellDescription' + row.id + '" style="display: none">' +
                                '<br>' +
                                '<div>' + data + '</div>' +
                                '</div> <div class="hidden-xs-down">' + data + '</div>'

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

            currentMagicTableSelector.on('click', 'td', function () {
                var tr = $(this).closest('tr');
                var row = currentMagicTable.row( tr );

                if (tr.find('td').length < 10 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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

            currentMagicTableSelector.on('click', '.description', function () {
                var spellId = this.href.substring(this.href.indexOf(';') + 1);
                $('#spellDescription' + spellId).toggle();
            });
            currentMagicTableSelector.on('click', '.effect', function () {
                var spellId = this.href.substring(this.href.indexOf(';') + 1);
                $('#spellEffect' + spellId).toggle();
            });

            currentMagicTableSelector.on('click', '.delete', function () {
                var id = this.value;
                swal({
                    title: "Вы уверены?",
                    text: "Вы уверены что хотите удалить данное заклинание?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: "Да!",
                    cancelButtonText: "Отменить"
                }).then(function success() {
                    $http.delete('/spells/' + id).then(function () {
                        currentMagicTable.ajax.reload(null, false)
                    });
                }, function cancel() {
                });
            });

            currentMagicTableSelector.on('click', '.edit', function () {
                $http.get('/spells/' + this.value).then(function (response) {
                    var spell = response.data.spell;
                    var instant = '';
                    if (spell.instant) {
                        instant = 'checked';
                    }
                    var mana_support = '';
                    if (spell.mana_support !== null) {
                        mana_support = spell.mana_support;
                    }
                    var inRound = '';
                    var inMinute = '';
                    var inHour = '';
                    var template = ' selected="selected"';
                    if (spell.mana_sup_time === 'в раунд') {
                        inRound = template;
                    }
                    if (spell.mana_sup_time === 'в минуту') {
                        inMinute = template;
                    }
                    if (spell.mana_sup_time === 'в час') {
                        inHour = template;
                    }
                    swal({
                        title: 'Добавить заклинание',
                        html:
                        '<form id="addSpellForm">' +
                            '<div class="form-group">' +
                                '<label for="name" class="form-control-label">Имя:</label>' +
                                '<input type="text" class="form-control" id="name" value="' + spell.name + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="cost" class="form-control-label">Стоимость:</label>' +
                                '<input type="number" class="form-control" id="cost" value="' + spell.cost + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="complexity" class="form-control-label">Сложность:</label>' +
                                '<input type="text" class="form-control" id="complexity" value="' + spell.complexity + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="creating_complexity" class="form-control-label">Сложность создания:</label>' +
                                '<input type="text" class="form-control" id="creating_complexity" value="' + spell.creating_complexity + '">' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                                    '<input id="instant" name="instant" type="checkbox" class="instant" ' + instant + '>' +
                                    '<label for="instant">Мгновенное</label>' +
                                '</div>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="mana" class="form-control-label">Мана:</label>' +
                                '<input type="text" class="form-control" id="mana" value="' + spell.mana + '">' +
                            '</div>' +
                            '<label class="form-control-label">Поддержание:</label>' +
                                '<div class="row">' +
                                    '<div class="col-md-6">' +
                                        '<div class="form-group">' +
                                            '<input type="text" class="form-control" id="mana_support" value="' + mana_support + '">' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="col-md-6">' +
                                        '<div class="form-group">' +
                                            '<select class="form-control" id="mana_sup_time">' +
                                                '<option value="в раунд"' + inRound + '>в раунд</option>' +
                                                '<option value="в минуту"' + inMinute + '>в минуту</option>' +
                                                '<option value="в час"' + inHour + '>в час</option>' +
                                            '</select>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '<div class="form-group">' +
                                '<label for="effect" class="form-control-label">Эффект:</label>' +
                                '<textarea id="effect" class="form-control">' + spell.effect + '</textarea>' +
                            '</div>' +
                            '<div class="form-group">' +
                                '<label for="description" class="form-control-label">Описание:</label>' +
                                '<textarea id="description" class="form-control">' + spell.description + '</textarea>' +
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
                                    $('#cost').val(),
                                    $('#complexity').val(),
                                    $('#creating_complexity').val(),
                                    $('#instant').prop("checked"),
                                    $('#mana').val(),
                                    $('#mana_support').val(),
                                    $('#mana_sup_time').val(),
                                    $('#effect').val(),
                                    $('#description').val()
                                ])
                            })
                        },
                        onOpen: function () {
                            $('#name').focus();

                            autosize($('#effect'));
                        }
                    }).then(function success(result) {
                        $http.put('/spells/' + spell.id, {
                            name: result[0],
                            cost: result[1],
                            complexity: result[2],
                            creating_complexity: result[3],
                            instant: result[4],
                            mana: result[5],
                            mana_support: result[6],
                            mana_sup_time: result[7],
                            effect: result[8],
                            description: result[9]
                        }).then(function () {
                            currentMagicTable.ajax.reload(null, false);
                        });
                    });
                });
            });

            $('#' + school.id + 'MagicPanel').on('click', '.add', function () {
                swal({
                    title: 'Добавить заклинание',
                    html:
                    '<form id="addSpellForm">' +
                        '<div class="form-group">' +
                            '<label for="name" class="form-control-label">Имя:</label>' +
                            '<input type="text" class="form-control" id="name">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="cost" class="form-control-label">Стоимость:</label>' +
                            '<input type="number" class="form-control" id="cost">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="complexity" class="form-control-label">Сложность:</label>' +
                            '<input type="text" class="form-control" id="complexity">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="creating_complexity" class="form-control-label">Сложность создания:</label>' +
                            '<input type="text" class="form-control" id="creating_complexity">' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                                '<input id="instant" name="difficultSkill" type="checkbox" class="instant">' +
                                '<label for="instant">Мгновенное</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="mana" class="form-control-label">Мана:</label>' +
                            '<input type="text" class="form-control" id="mana">' +
                        '</div>' +
                        '<label class="form-control-label">Поддержание:</label>' +
                        '<div class="row">' +
                            '<div class="col-md-6">' +
                                '<div class="form-group">' +
                                    '<input type="text" class="form-control" id="mana_support">' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-md-6">' +
                                '<div class="form-group">' +
                                    '<select class="form-control" id="mana_sup_time">' +
                                        '<option value="в раунд">в раунд</option>' +
                                        '<option value="в минуту">в минуту</option>' +
                                        '<option value="в час">в час</option>' +
                                    '</select>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="effect" class="form-control-label">Эффект:</label>' +
                            '<textarea id="effect" class="form-control"></textarea>' +
                        '</div>' +
                        '<div class="form-group">' +
                            '<label for="description" class="form-control-label">Описание:</label>' +
                            '<textarea id="description" class="form-control"></textarea>' +
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
                            $http.get('/spells').then(function (response) {
                                angular.forEach(response.data.spells, function (spell) {
                                    if (spell.name.toLowerCase() === name.toLowerCase()) {
                                        equal = true;
                                    }
                                });
                                if (equal) {
                                    reject('Заклинание с таким именем уже существует!')
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
                                $('#cost').val(),
                                $('#complexity').val(),
                                $('#creating_complexity').val(),
                                $('#instant').prop("checked"),
                                $('#mana').val(),
                                $('#mana_support').val(),
                                $('#mana_sup_time').val(),
                                $('#effect').val(),
                                $('#description').val()
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();

                        autosize($('#effect'));
                    }
                }).then(function success(result) {
                    $http.post('/spells', {
                        attached_skill_id: school.id,
                        name: result[0],
                        cost: result[1],
                        complexity: result[2],
                        creating_complexity: result[3],
                        instant: result[4],
                        mana: result[5],
                        mana_support: result[6],
                        mana_sup_time: result[7],
                        effect: result[8],
                        description: result[9]
                    }).then(function () {
                        currentMagicTable.ajax.reload(null, false);
                    });
                });
            });
        }

        var magicSchools = data[1];

        angular.forEach(magicSchools, function (magicSchool) {
            magicTable(magicSchool);
        });

    }
});