var app = angular.module("spells", ['ngStorage']);

app.controller("spellsController", function ($scope, $http, $q, $localStorage, $timeout, $window) {

    var players = $q.defer();
    var schools = $q.defer();

    $scope.showEditForm = false;
    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $http.get('/spells').then(function (response) {
        $scope.spells = response.data.spells;
    });

    $http.get('/attachedSkills').then(function (response) {
        $scope.magicSchools = [];
        angular.forEach(response.data.data, function (attachedSkill) {
            if (attachedSkill.spells_connected) {
                $scope.magicSchools.push(attachedSkill);
            }
        });
        schools.resolve($scope.magicSchools);
    });

    var tables = [];

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

        function magicTable(school) {
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
                        data: 'BaseSpell',
                        className: 'text-center',
                        orderable: false,
                        render: function (data, type, row) {
                            if (data === null) {
                                return '-';
                            } else {
                                return data.name;
                            }
                        }
                    },
                    {
                        data: 'modification_needed',
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

            currentMagicTable.columns().iterator('column', function (ctx, idx) {
                $(currentMagicTable.column(idx).header()).append('<span class="sort-icon"/>');
            });

            currentMagicTableSelector.on('click', 'td', function () {
                var tr = $(this).closest('tr');
                var row = currentMagicTable.row(tr);

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
            });

            currentMagicTableSelector.on('click', '.description', function () {
                var spellId = this.href.substring(this.href.indexOf(';') + 1);
                $('#spellDescription' + spellId).toggle();
            });
            currentMagicTableSelector.on('click', '.effect', function () {
                var spellId = this.href.substring(this.href.indexOf(';') + 1);
                $('#spellEffect' + spellId).toggle();
            });

            tables.push({
                tableObject: currentMagicTable,
                school_id: school.id
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
                    confirmButtonText: "Удалить!",
                    cancelButtonText: "Отменить"
                }).then(function success() {
                    $http.delete('/spells/' + id).then(function () {
                        currentMagicTable.ajax.reload(null, false);
                        $('#addFormPanel').hide();
                        $("#spell_id").selectpicker('destroy');

                        var result = $.grep($scope.spells, function (spell) {
                            return spell.id.toString() === id;
                        });
                        if (result.length !== 0) {
                            var index = $scope.spells.indexOf(result[0]);
                            $scope.spells.splice(index, 1);
                        }
                    });
                }, function cancel() {
                });
            });

            currentMagicTableSelector.on('click', '.edit', function () {
                $scope.showEditForm = true;
                $http.get('/spells/' + this.value).then(function (response) {
                    $window.scrollTo(0, 0);
                    $('#addFormPanel').show();
                    var spell = response.data.spell;
                    $scope.current_spell_id = spell.id;
                    $('#school_id').selectpicker('val', 'number:' + spell.AttachedSkillId);
                    $scope.school_id = spell.AttachedSkillId;
                    $scope.name = spell.name;
                    $scope.cost = spell.cost;
                    $scope.complexity = spell.complexity;
                    $scope.creating_complexity = spell.creating_complexity;
                    $scope.instant = spell.instant;
                    $scope.mana = spell.mana;
                    if (!spell.instant) {
                        $scope.mana_support = spell.mana_support;
                        $('#mana_sup_time').selectpicker('val', spell.mana_sup_time);
                    } else {
                        $scope.mana_support = '';
                        $('#mana_sup_time').selectpicker('val', 'в раунд');
                        $scope.mana_sup_time = 'в раунд';
                    }
                    $scope.modification_needed = spell.modification_needed;
                    $scope.effect = spell.effect;
                    $scope.description = spell.description;
                    if (spell.SpellId !== null) {
                        $('#spell_id').selectpicker({liveSearch: true, 'val': 'number:' + spell.SpellId});
                    } else {
                        $('#spell_id').selectpicker({liveSearch: true});
                    }
                    $scope.spell_id = spell.SpellId;
                    $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                });
            });
        }

        $scope.updateSpell = function () {
            $http.put('/spells/' + $scope.current_spell_id, {
                attached_skill_id: $scope.school_id,
                name: $scope.name,
                cost: $scope.cost,
                complexity: $scope.complexity,
                creating_complexity: $scope.creating_complexity,
                instant: $scope.instant,
                mana: $scope.mana,
                mana_support: $scope.mana_support,
                mana_sup_time: $scope.mana_sup_time,
                effect: $scope.effect,
                description: $scope.description,
                spell_id: $scope.spell_id,
                modification_needed: $scope.modification_needed
            }).then(function () {
                refreshTables($scope.school_id);
                $('#addFormPanel').toggle();
                $window.scrollTo(0, 0);
                $scope.name = '';
                $scope.cost = '';
                $scope.complexity = '';
                $scope.creating_complexity = '';
                $scope.instant = false;
                $scope.mana = '';
                $scope.mana_support = '';
                $scope.effect = '';
                $scope.description = '';
                $("#spell_id").selectpicker('destroy');
                $scope.modification_needed = false;
                $scope.showEditForm = false;
            });
        };

        var magicSchools = data[1];

        $timeout(function () {
            angular.forEach(magicSchools, function (magicSchool) {
                magicTable(magicSchool);
            });
        }, 100);

        function refreshTables(school_id) {
            angular.forEach(tables, function (table) {
                if (table.school_id === school_id) {
                    table.tableObject.ajax.reload(null, false);
                }
            });
        }

        $scope.showSpellForm = function () {
            $('#mana_sup_time').selectpicker('val', 'в раунд');
            $scope.mana_sup_time = 'в раунд';
            $('#spell_id').selectpicker({liveSearch: true});
            $('#school_id').selectpicker();
            $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
            $('#addFormPanel').toggle();
        };

        $scope.cancel = function () {
            $('#addFormPanel').hide();
            $scope.showEditForm = false;
            $scope.name = '';
            $scope.cost = '';
            $scope.complexity = '';
            $scope.creating_complexity = '';
            $scope.instant = false;
            $scope.mana = '';
            $scope.mana_support = '';
            $scope.effect = '';
            $scope.description = '';
            var spellSelect = $("#spell_id");
            spellSelect.val('');
            spellSelect.selectpicker("refresh");
            $scope.modification_needed = false;
        };

        function isSpellAlreadyExist(name) {
            var result = $.grep($scope.spells, function (spell) {
                return spell.name.toLowerCase() === name.toLowerCase();
            });
            return result.length !== 0;
        }

        $scope.addSpell = function () {
            if (isSpellAlreadyExist($scope.name)) {
                swal({
                    text: "Заклинание с таким именем уже существует!",
                    type: "warning"
                });
            } else {
                var spell_id = null;
                if ($scope.spell_id !== '') {
                    spell_id = $scope.spell_id;
                }
                $http.post('/spells', {
                    attached_skill_id: $scope.school_id,
                    name: $scope.name,
                    cost: $scope.cost,
                    complexity: $scope.complexity,
                    creating_complexity: $scope.creating_complexity,
                    instant: $scope.instant,
                    mana: $scope.mana,
                    mana_support: $scope.mana_support,
                    mana_sup_time: $scope.mana_sup_time,
                    effect: $scope.effect,
                    description: $scope.description,
                    spell_id: spell_id,
                    modification_needed: $scope.modification_needed
                }).then(function (response) {
                    $scope.spells.push(response.data.spell);
                    refreshTables($scope.school_id);
                    $('#addFormPanel').toggle();
                    $window.scrollTo(0, 0);
                    $scope.name = '';
                    $scope.cost = '';
                    $scope.complexity = '';
                    $scope.creating_complexity = '';
                    $scope.instant = false;
                    $scope.mana = '';
                    $scope.mana_support = '';
                    $scope.effect = '';
                    $scope.description = '';
                    $("#spell_id").selectpicker('destroy');
                    $scope.modification_needed = false;
                });
            }
        };
    }
});