var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage', 'hmTouchEvents']);

app.controller("personageController", function ($scope, $http, $q, $localStorage) {
    var personage = $q.defer();
    var raceAttributes = $q.defer();

    function animateButtons(buttons, animatedStyle) {
        angular.forEach(buttons, function (button) {
            button.removeClass(animatedStyle + ' animated').addClass(animatedStyle + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass(animatedStyle + ' animated');
            });
        });
    }

    $scope.setActive = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Ловкость') {
            $('#hitPiercePunch').addClass('derivedActive');
            $('#hitChopPunch').addClass('derivedActive');
            $('#rangedHit').addClass('derivedActive');
            $('#dodge').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Скорость') {
            $('#hitPiercePunch').addClass('derivedActive');
            $('#parryPiercePunch').addClass('derivedActive');
            $('#generalActionPoints').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Сила') {
            $('#hitChopPunch').addClass('derivedActive');
            $('#parryChopPunch').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Восприятие') {
            $('#rangedHit').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Реакция') {
            $('#parryPiercePunch').addClass('derivedActive');
            $('#parryChopPunch').addClass('derivedActive');
            $('#dodge').addClass('derivedActive');
            $('#initiative').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Выносливость') {
            $('#endurancePoints').addClass('derivedActive');
        }
        if ($($event.currentTarget).find('td:eq(0)').attr('id') === 'Интеллект') {
            $('#mentalActionPoints').addClass('derivedActive');
            $('#generalActionPoints').addClass('derivedActive');
        }
    };

    $scope.hitPiercePunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Ловкость').parent('tr').addClass('derivedActive');
        $('#Скорость').parent('tr').addClass('derivedActive');
    };

    $scope.hitChopPunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Ловкость').parent('tr').addClass('derivedActive');
        $('#Сила').parent('tr').addClass('derivedActive');
    };

    $scope.rangedHitAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Ловкость').parent('tr').addClass('derivedActive');
        $('#Восприятие').parent('tr').addClass('derivedActive');
    };

    $scope.parryPiercePunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Скорость').parent('tr').addClass('derivedActive');
        $('#Реакция').parent('tr').addClass('derivedActive');
    };

    $scope.parryChopPunchAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Реакция').parent('tr').addClass('derivedActive');
        $('#Сила').parent('tr').addClass('derivedActive');
    };

    $scope.dodgeAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Ловкость').parent('tr').addClass('derivedActive');
        $('#Реакция').parent('tr').addClass('derivedActive');
    };

    $scope.generalActionPointsAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Интеллект').parent('tr').addClass('derivedActive');
        $('#Скорость').parent('tr').addClass('derivedActive');
    };

    $scope.mentalActionPointsAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Интеллект').parent('tr').addClass('derivedActive');
    };

    $scope.endurancePointsAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Выносливость').parent('tr').addClass('derivedActive');
    };

    $scope.initiativeAnimateRelatedAttributes = function ($event) {
        $('.derivedActive').removeClass('derivedActive');
        $($event.currentTarget).addClass('derivedActive');
        $('#Реакция').parent('tr').addClass('derivedActive');
    };

    function success() {
        calculateBasicCharacteristics();
        $('#loader').hide();
        $('section').removeClass('hide');
        table('/personageFlawsByPersonageId/' + personageId, '#flaws', [
            {
                data: "Flaw.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "Flaw.description"}
        ], 2, "недостатки");

        table('/personageMeritsByPersonageId/' + personageId, '#merits', [
            {
                data: "Merit.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "Merit.description"}
        ], 2, "достоинства");

        table('/personageAttachedSkillsByPersonageId/' + personageId, '#attachedSkills', [
            {
                data: "AttachedSkill.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "value"},
            {
                data: "AttachedSkill",
                orderable: false,
                render: function (data, type, row) {
                    var returned = '';
                    angular.forEach(data.AttachedSkillAttributes, function (attachedSkillAttribute) {
                        var value = getPersonageAttributeValue(attachedSkillAttribute.Attribute) + row.value;
                        returned = returned + '<h4 class="margin-bottom-0"><small>' + attachedSkillAttribute.Attribute.name + '+' + attachedSkillAttribute.AttachedSkill.name + '=' + value + ':</small></h4>' + attachedSkillAttribute.description;
                    });
                    return returned;
                }
            },
            {"data": "AttachedSkill.description"}
        ], 4, "прикрепленные навыки");

        table('/personageInherentsByPersonageId/' + personageId, '#inherents', [
            {
                data: "Inherent.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {"data": "value"},
            {"data": "Inherent.description"}
        ], 3, "врожденные особенности");

        table('/personageTriggerSkillsByPersonageId/' + personageId, '#triggerSkills', [
            {
                data: "TriggerSkill.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {
                "targets": 0,
                "data": function (row, type, val, meta) {
                    if (row.currentLevel === 0) {
                        return "";
                    }
                    if (row.currentLevel === 1) {
                        return "Эксперт";
                    }
                    if (row.currentLevel === 2) {
                        return "Мастер";
                    }
                    if (row.currentLevel === 3) {
                        return "Магистр";
                    }
                    if (row.currentLevel === 4) {
                        return "Гроссмейтер";
                    }
                }
            },
            {
                "targets": 0,
                "data": function (row, type, val, meta) {
                    if (row.talented) {
                        return "Да";
                    } else {
                        return "";
                    }
                }
            },
            {"data": "TriggerSkill.description"}
        ], 4, "тригерные навыки");
    }

    function table(dataUrl, tableId, columns, maxSize, itemName) {
        var table = $(tableId).DataTable({
            responsive: true,
            "language": {
                "search": "Поиск:",
                "paginate": {
                    "first": "Первая",
                    "last": "Последняя",
                    "next": "След.",
                    "previous": "Пред."
                },
                "loadingRecords": "Подождите, " + itemName + " загружаются...",
                "zeroRecords": "Ничего с таким именем не найдено",
                "emptyTable": "Нет ни одной записи",
                "lengthMenu": "Показать _MENU_"
            },
            stateSave: true,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "Все"]],
            "info": false,
            "ajax": dataUrl,
            "columns": columns,
            "pagingType": "numbers"
        });
        $(tableId + '_filter').addClass("pull-right");
        $(tableId + '_paginate').addClass("pull-right");

        $(tableId).on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (tr.find('td').length < maxSize && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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
        table.columns().iterator('column', function (ctx, idx) {
            $(table.column(idx).header()).append('<span class="sort-icon"/>');
        });
        return table;
    }

    var playerAttributes = $q.defer();
    var all = $q.all([personage.promise, raceAttributes.promise, playerAttributes.promise]);

    all.then(success);

    $http.get('/personages/' + personageId).then(function (response) {
        $scope.personage = response.data.personage;
        $scope.age = response.data.personage.age;
        if (response.data.personage.max_age !== 0) {
            $scope.max_age = response.data.personage.max_age;
        } else {
            $scope.max_age = response.data.personage.Race.max_age;
        }
        $http.get('/raceAttributesByRaceId/' + response.data.personage.RaceId).then(function (data) {
            $scope.raceAttributes = response.data.raceAttributes;
            raceAttributes.resolve();
        });
        $scope.personageAttributes = response.data.personage.PersonageAttributes;
        personage.resolve();
    });

    $http.get('/playerAttributesByPlayerId/' + $localStorage.playerId).then(function (response) {
        $scope.playerAttributes = response.data.playerAttributes;
        playerAttributes.resolve();
    });

    function magicTable(id, name, attachedSkill) {
        var spells = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            angular.forEach(attachedSkill.Spells, function (spell) {
                if (spell.id === personageSpell.SpellId) {
                    spells.push({personageSpell: personageSpell, spell: spell});
                }
            });
        });
        $('#spells').append('<div class="row">' +
            '<div id="' + id + 'MagicPanel" class="panel" style="box-shadow: 0 2px 10px -2px rgba(55, 58, 60, 0.3); width: 99.2%;">' +
            '<h3 class="panel-heading">' + name + '</h3>' +
            '<div class="panel-body table-responsive">' +
            '<table id="' + id + 'Magic" class="table table-hover nowrap" width="100%">' +
            '<thead>' +
            '<tr>' +
            '<th>Заклинание</th>' +
            '<th>Сложность</th>' +
            '<th>Мана</th>' +
            '<th>Поддержание</th>' +
            '<th>Сложность создания</th>' +
            '<th>Мгновенное</th>' +
            '<th>Уровень</th>' +
            '<th>Эффект</th>' +
            '<th>Описание</th>' +
            '</tr>' +
            '</thead>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '</div>');
        var tableSelector = $('#' + id + 'Magic');
        var table = tableSelector.DataTable({
            responsive: true,
            stateSave: true,
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
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "Все"]],
            "info": false,
            data: spells,
            columns: [
                {
                    data: "spell.name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {data: 'spell.complexity'},
                {data: 'spell.mana'},
                {
                    data: 'spell.mana_support',
                    render: function (data, type, row) {
                        if (row.spell.instant) {
                            return "-";
                        }
                        return row.spell.mana_support + ' ' + row.spell.mana_sup_time;
                    }
                },
                {data: 'spell.creating_complexity'},
                {
                    data: 'spell.instant',
                    render: function (data, type, row) {
                        if (data) {
                            return "Да";
                        } else {
                            return "Нет";
                        }
                    }
                },
                {data: 'personageSpell.level'},
                {
                    data: 'spell.effect',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0);' + row.spell.id + '" class="link-underlined link-blue hidden-md-up effect">' +
                            'Эффект' +
                            '</a>' +
                            '<div id="spellEffect' + row.spell.id + '" style="display: none">' +
                            '<br>' +
                            '<div>' + data + '</div>' +
                            '</div> <div class="hidden-xs-down">' + data + '</div>'
                    }
                },
                {
                    data: 'spell.description',
                    render: function (data, type, row) {
                        return '<a href="javascript:void(0);' + row.spell.id + '" class="link-underlined link-blue hidden-md-up description">' +
                            'Описание' +
                            '</a>' +
                            '<div id="spellDescription' + row.spell.id + '" style="display: none">' +
                            '<br>' +
                            '<div>' + data + '</div>' +
                            '</div> <div class="hidden-xs-down">' + data + '</div>'

                    }
                }
            ],
            "pagingType": "numbers"
        });
        $('#' + id + 'Magic' + '_filter').addClass("pull-right");
        $('#' + id + 'Magic' + '_paginate').addClass("pull-right");
        $('#' + id + 'Magic').on('click', '.description', function () {
            var spellId = this.href.substring(this.href.indexOf(';') + 1);
            $('#spellDescription' + spellId).toggle();
        });
        $('#' + id + 'Magic').on('click', '.effect', function () {
            var spellId = this.href.substring(this.href.indexOf(';') + 1);
            $('#spellEffect' + spellId).toggle();
        });
        tableSelector.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

            if (tr.find('td').length < 9 && $(this).index() === 0) {
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
    }

    $scope.calculateMagicSchools = function () {
        $scope.schools = [];
        var buffer = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (buffer.indexOf(personageSpell.Spell.AttachedSkillId) === -1) {
                buffer.push(personageSpell.Spell.AttachedSkillId);
            }
        });

        angular.forEach(buffer, function (attachedSkillId) {
            $http.get('/attachedSkills/' + attachedSkillId).then(function (response) {
                $scope.schools.push(response.data.attachedSkill);
                if (response.data.attachedSkill.name === 'Магия воздуха') {
                    magicTable('air', 'Воздух', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия земли') {
                    magicTable('earth', 'Земля', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия огня') {
                    magicTable('fire', 'Огонь', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия воды') {
                    magicTable('aqua', 'Вода', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия смерти') {
                    magicTable('death', 'Смерть', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия духа') {
                    magicTable('astral', 'Дух', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия иллюзий') {
                    magicTable('illusion', 'Иллюзии', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия призыва') {
                    magicTable('call', 'Призыв', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия природы') {
                    magicTable('nature', 'Природа', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия разума') {
                    magicTable('mind', 'Разум', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия тела') {
                    magicTable('body', 'Тело', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Магия тени') {
                    magicTable('shadow', 'Тень', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Начертательная магия') {
                    magicTable('pentagram', 'Начертательная магия', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Знахарство') {
                    magicTable('herbs', 'Знахарство', response.data.attachedSkill);
                }
                if (response.data.attachedSkill.name === 'Алхимия') {
                    magicTable('alchemy', 'Алхимия', response.data.attachedSkill);
                }
            });
        });
    };

    $scope.isCategoryAttributesMenuClose = true;

    var attributesCategoriesFilerMenu = new Menu({
        wrapper: '.o-wrapper-attributes',
        type: 'slide-bottom',
        mask: '.c-mask',
        size: 390
    });

    $scope.openHideAttributesCategoriesFilterMenu = function () {
        if ($scope.isCategoryAttributesMenuClose) {
            attributesCategoriesFilerMenu.open();
            $scope.isCategoryAttributesMenuClose = false;
        } else {
            attributesCategoriesFilerMenu.close();
            $scope.isCategoryAttributesMenuClose = true;
        }
    };

    function calculateBasicCharacteristics() {
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            switch (personageAttribute.Attribute.name) {
                case "Сила":
                    $scope.power = personageAttribute.value;
                    break;
                case "Ловкость":
                    $scope.dexterity = personageAttribute.value;
                    break;
                case "Скорость":
                    $scope.speed = personageAttribute.value;
                    break;
                case "Реакция":
                    $scope.reaction = personageAttribute.value;
                    break;
                case "Восприятие":
                    $scope.perception = personageAttribute.value;
                    break;
                case "Выносливость":
                    $scope.endurance = personageAttribute.value;
                    break;
                case "Живучесть":
                    $scope.vitality = personageAttribute.value;
                    break;
                case "Мудрость":
                    $scope.wisdom = personageAttribute.value;
                    break;
                case "Интеллект":
                    $scope.intelligence = personageAttribute.value;
                    break;
                case "Воля":
                    $scope.will = personageAttribute.value;
                    break;
                case "Харизма":
                    $scope.charisma = personageAttribute.value;
                    break;
            }
        });

        $scope.hitPiercePunch = $scope.dexterity + $scope.speed;
        $scope.hitChopPunch = $scope.dexterity + $scope.power;
        $scope.rangedHit = $scope.dexterity + $scope.perception;
        $scope.parryPiercePunch = $scope.reaction + $scope.speed;
        $scope.parryChopPunch = $scope.power + $scope.reaction;
        $scope.dodge = $scope.dexterity + $scope.reaction;
        if ($scope.speed < $scope.intelligence) {
            $scope.generalActionPoints = $scope.speed;
        } else {
            $scope.generalActionPoints = $scope.intelligence;
        }
        $scope.mentalActionPoints = $scope.intelligence;
        $scope.initiative = $scope.reaction;
        $scope.endurancePoints = $scope.endurance * 20;
    }

    $scope.getAttributePosition = function (personageAttribute) {
        var position = 0;
        angular.forEach($scope.playerAttributes, function (playerAttribute) {
            if (personageAttribute.AttributeId === playerAttribute.AttributeId) {
                position = playerAttribute.position;
            }
        });
        return position;
    };

    $scope.ifMagic = function (personageAttribute) {
        return personageAttribute.Attribute.name === 'Магия' && personageAttribute.value === 0;
    };

    function getPersonageAttributeValue(attribute) {
        var attributeValue = 0;
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (attribute.id === personageAttribute.Attribute.id) {
                attributeValue = personageAttribute.value;
            }
        });
        return attributeValue;
    }

    var personageSpellsClicked = false;
    $scope.getPersonageSpells = function () {
        if (!personageSpellsClicked) {
            personageSpellsClicked = true;
            $http.get('/personageSpellsByPersonageId/' + personageId).then(function (response) {
                $scope.personageSpells = response.data.personageSpells;
                $scope.calculateMagicSchools();
                $scope.loader = false;
            });
        }
    };

    $scope.showNotices = function () {
        $scope.noticeTable = table('/noticesByPersonageId/' + personageId, '#noticesTable', [
            {
                data: "name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                }
            },
            {
                data: "id",
                orderable: false,
                render: function (data, type, row) {
                    return '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline margin-bottom-0 edit" value="'
                        + data + '"  type="button"></button>' +
                        '<button class="btn btn-icon btn-danger btn-rounded fa fa-close margin-inline margin-bottom-0 delete" value="'
                        + data + '" type="button"></button>';
                }
            },
            {
                "data": "description",
                "bSearchable": false
            }
        ], 3, "заметки");

        $scope.noticeTable.on('click', '.edit', function () {
            $http.get('/notices/' + this.value).then(function (response) {
                var notice = response.data.notice;
                swal({
                    title: 'Изменить заметку',
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="noticeTitle" class="form-control-label">Заголовок:</label>' +
                    '<input type="text" class="form-control" id="noticeTitle" value="' + notice.name + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="noticeBody" class="form-control-label">Текст:</label>' +
                    '<textarea id="noticeDescription" class="form-control">' + notice.description + '</textarea>' +
                    '</div>' +
                    '</form>',
                    showCancelButton: true,
                    cancelButtonText: "Отменить",
                    confirmButtonText: "Сохранить",
                    showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                $('#noticeTitle').val(),
                                $('#noticeDescription').val()
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#noticeTitle').focus();
                        autosize($('#noticeDescription'));
                    }
                }).then(function success(result) {
                    $http.put('/notices/' + notice.id, {
                        name: result[0],
                        experience: notice.experience,
                        description: result[1]
                    }).then(function () {
                        $scope.noticeTable.ajax.reload(null, false)
                    });
                });
            });
        });

        $scope.noticeTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: "Вы уверены?",
                text: "Вы уверены что хотите удалить заметку?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: "Удалить!",
                cancelButtonText: "Отменить"
            }).then(function success() {
                $http.delete('/notices/' + id).then(function () {
                    $scope.noticeTable.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });
    };

    $scope.addNotice = function () {
        swal({
            title: 'Добавить заметку',
            html: '<form>' +
            '<div class="form-group">' +
            '<label for="noticeTitle" class="form-control-label">Заголовок:</label>' +
            '<input type="text" class="form-control" id="noticeTitle">' +
            '</div>' +
            '<div class="form-group">' +
            '<label for="noticeBody" class="form-control-label">Текст:</label>' +
            '<textarea id="noticeDescription" class="form-control"></textarea>' +
            '</div>',
            showCancelButton: true,
            cancelButtonText: "Отменить",
            confirmButtonText: "Добавить",
            showLoaderOnConfirm: true,
            input: 'text',
            inputClass: 'hide',
            inputValidator: function (value) {
                return new Promise(function (resolve, reject) {
                    if ($('#noticeTitle').val() !== '') {
                        resolve()
                    } else {
                        reject('Заголовок не может быть пустым!')
                    }
                })
            },
            preConfirm: function (value) {
                return new Promise(function (resolve) {
                    resolve([
                        $('#noticeTitle').val(),
                        $('#noticeDescription').val()
                    ])
                })
            },
            onOpen: function () {
                $('#noticeTitle').focus();
            }
        }).then(function success(result) {
            $http.post('/notices', {
                personage_id: personageId,
                name: result[0],
                experience: 0,
                description: result[1]
            }).then(function () {
                $scope.noticeTable.ajax.reload(null, false)
            });
        });
    };
});