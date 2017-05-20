var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage']);

function isMobile() {
    return navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i);
}

app.controller("personageController", function ($scope, $http, $q, $timeout) {
    $scope.loader = true;

    var personage = $q.defer();
    var raceAttributes = $q.defer();

    table('/personageFlawsByPersonageId/' + personageId, '#flaws', [
        {"data": "Flaw.name"}
    ], 1);

    table('/noticesByPersonageId/' + personageId, '#notices', [
        {
            data: "name",
            render: function (data, type, full, meta, row) {
                if(isMobile()) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                } else {
                    return data;
                }
            }
        },
        {"data": "description"}
    ], 2);

    table('/personageMeritsByPersonageId/' + personageId, '#merits', [
        {"data": "Merit.name"}
    ], 1);

    table('/personageAttachedSkillsByPersonageId/' + personageId, '#attachedSkills', [
        {"data": "AttachedSkill.name"},
        {"data": "value"}
    ], 2);

    table('/personageInherentsByPersonageId/' + personageId, '#inherents', [
        {
            data: "Inherent.name",
            render: function (data, type, full, meta, row) {
                if(isMobile()) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                } else {
                    return data;
                }
            }
        },
        {"data": "value"}
    ], 2);

    table('/personageTriggerSkillsByPersonageId/' + personageId, '#triggerSkills', [
        {
            data: "TriggerSkill.name",
            render: function (data, type, full, meta, row) {
                if(isMobile()) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                } else {
                    return data;
                }
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
        }
    ], 3);

    function animateButtons(buttons, animatedStyle) {
        angular.forEach(buttons, function (button) {
            button.removeClass(animatedStyle + ' animated').addClass(animatedStyle + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass(animatedStyle + ' animated');
            });
        });
    }

    $scope.hitPiercePunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Скорость')
        ], 'shake');
    };

    $scope.hitChopPunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Силa')
        ], 'shake');
    };

    $scope.hitChopPunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Сила')
        ], 'shake');
    };

    $scope.rangedHitAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Ловкость'),
            $('#Восприятие')
        ], 'shake');
    };

    $scope.parryPiercePunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Скорость'),
            $('#Реакция')
        ], 'shake');
    };

    $scope.parryChopPunchAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Реакция'),
            $('#Сила')
        ], 'shake');
    };

    $scope.dodgeAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Реакция'),
            $('#Ловкость')
        ], 'shake');
    };

    $scope.generalActionPointsAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Интеллект'),
            $('#Скорость')
        ], 'shake');
    };

    $scope.mentalActionPointsAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Интеллект')
        ], 'shake');
    };

    $scope.endurancePointsAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Выносливость')
        ], 'shake');
    };

    $scope.initiativeAnimateRelatedAttributes = function () {
        animateButtons([
            $('#Реакция')
        ], 'shake');
    };

    function success() {
        calculateBasicCharacteristics();
        $scope.loader = false;
    }

    function table(dataUrl, tableId, columns, maxSize) {
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
                "zeroRecords":    "Ничего с таким именем не найдено",
                "emptyTable":     "Нет ни одной записи",
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
            var row = table.row( tr );

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
        } );
    }

    var all = $q.all([personage.promise, raceAttributes.promise]);

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
        $scope.experienceValid = function () {
            return $scope.personage.experience < 0;
        };
        $scope.personageAttributes = response.data.personage.PersonageAttributes;
        personage.resolve();
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
                    data: "name",
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
            var row = table.row( tr );

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
        } );
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

    var personageSpellsClicked = false;
    $scope.getPersonageSpells = function () {
        if (!personageSpellsClicked) {
            personageSpellsClicked = true;
            $scope.loader = true;
            $http.get('/personageSpellsByPersonageId/' + personageId).then(function (response) {
                $scope.personageSpells = response.data.personageSpells;
                $scope.calculateMagicSchools();
                $scope.loader = false;
            });
        }
    };
});