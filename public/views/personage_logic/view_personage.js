(function (i) {
    var e = /iPhone/i, n = /iPod/i, o = /iPad/i, t = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, r = /Android/i, d = /BlackBerry/i, s = /Opera Mini/i, a = /IEMobile/i, b = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, h = RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"), c = function (i, e) {
        return i.test(e)
    }, l = function (i) {
        var l = i || navigator.userAgent;
        this.apple = {
            phone: c(e, l),
            ipod: c(n, l),
            tablet: c(o, l),
            device: c(e, l) || c(n, l) || c(o, l)
        }, this.android = {
            phone: c(t, l),
            tablet: !c(t, l) && c(r, l),
            device: c(t, l) || c(r, l)
        }, this.other = {
            blackberry: c(d, l),
            opera: c(s, l),
            windows: c(a, l),
            firefox: c(b, l),
            device: c(d, l) || c(s, l) || c(a, l) || c(b, l)
        }, this.seven_inch = c(h, l), this.any = this.apple.device || this.android.device || this.other.device || this.seven_inch
    }, v = i.isMobile = new l;
    v.Class = l
})(window);

var personageId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("personageApp", ['ngStorage', 'ui.bootstrap']);

app.controller("personageController", function ($scope, $http, $q, $sce) {
    $('[data-toggle="tooltip"]').tooltip();

    $scope.loader = true;
    $scope.isMobile = isMobile.android.phone;
    $scope.meritAvailable = true;
    $scope.currentMerit = null;

    var personage = $q.defer();
    var raceAttributes = $q.defer();

    table('/personageFlawsByPersonageId/' + personageId, '#flaws', [
        {"data": "Flaw.name"}
    ]);

    table('/noticesByPersonageId/' + personageId, '#notices', [
        {"data": "name"},
        {"data": "description"}
    ]);

    table('/personageMeritsByPersonageId/' + personageId, '#merits', [
        {"data": "Merit.name"}
    ]);

    table('/personageAttachedSkillsByPersonageId/' + personageId, '#attachedSkills', [
        {"data": "AttachedSkill.name"},
        {"data": "value"}
    ]);

    table('/personageInherentsByPersonageId/' + personageId, '#inherents', [
        {"data": "Inherent.name"},
        {"data": "value"}
    ]);

    table('/personageTriggerSkillsByPersonageId/' + personageId, '#triggerSkills', [
        {"data": "TriggerSkill.name"},
        {
            "targets": 0,
            "data": function (row, type, val, meta) {
                if (row.currentLevel == 0) {
                    return "";
                }
                if (row.currentLevel == 1) {
                    return "Эксперт";
                }
                if (row.currentLevel == 2) {
                    return "Мастер";
                }
                if (row.currentLevel == 3) {
                    return "Магистр";
                }
                if (row.currentLevel == 4) {
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
    ]);

    function success(data) {
        $scope.recalculateBasicCharacteristics();
        $scope.loader = false;
    }

    function table(dataUrl, tableId, columns) {
        $(tableId).DataTable({
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
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]],
            "info": false,
            "ajax": dataUrl,
            "columns": columns,
            "pagingType": "numbers"
        });
        $(tableId + '_filter').addClass("pull-right");
        $(tableId + '_paginate').addClass("pull-right");
    }

    var all = $q.all([personage.promise, raceAttributes.promise]);

    all.then(success);

    $http.get('/personages/' + personageId).success(function (data) {
        $scope.personage = data.personage;
        $scope.age = data.personage.age;
        if (data.personage.max_age != 0) {
            $scope.max_age = data.personage.max_age;
        } else {
            $scope.max_age = data.personage.Race.max_age;
        }
        $http.get('/raceAttributesByRaceId/' + data.personage.RaceId).success(function (data) {
            $scope.raceAttributes = data.raceAttributes;
            raceAttributes.resolve();
        });
        $scope.experienceValid = function () {
            return $scope.personage.experience < 0;
        };
        $scope.personageAttributes = data.personage.PersonageAttributes;
        personage.resolve();
    });

    function magicTable(id, name, attachedSkill) {
        var spells = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            angular.forEach(attachedSkill.Spells, function (spell) {
                if (spell.id == personageSpell.SpellId) {
                    spells.push({personageSpell: personageSpell, spell: spell});
                }
            });
        });
        $('#spells').append('<div id="' + id + 'MagicPanel" class="panel" style="width: 99.8%;">' +
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
            '<th>Учитель</th>' +
            '</tr>' +
            '</thead>' +
            '</table>' +
            '</div>' +
            '</div>');
        $('#' + id + 'Magic').DataTable({
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
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]],
            "info": false,
            data: spells,
            columns: [
                {data: 'spell.name'},
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
                    data: 'personageSpell.tutored',
                    render: function (data, type, row) {
                        var checked = "";
                        if (data) {
                            checked = 'checked';
                        }
                        return '<div class="checkbox">' +
                                   '<input name="tutored" ' + checked + ' type="checkbox" disabled>' +
                               '</div>';
                    }
                }
            ],
            "pagingType": "numbers"
        });
        $('#' + id + 'Magic' + '_filter').addClass("pull-right");
        $('#' + id + 'Magic' + '_paginate').addClass("pull-right");
    }

    $scope.calculateMagicSchools = function () {
        $scope.schools = [];
        var buffer = [];
        angular.forEach($scope.personageSpells, function (personageSpell) {
            if (buffer.indexOf(personageSpell.Spell.AttachedSkillId) == -1) {
                buffer.push(personageSpell.Spell.AttachedSkillId);
            }
        });

        angular.forEach(buffer, function (attachedSkillId) {
            $http.get('/attachedSkills/' + attachedSkillId).success(function (data) {
                $scope.schools.push(data.attachedSkill);
                if (data.attachedSkill.name == 'Магия воздуха') {
                    magicTable('air', 'Воздух', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия земли') {
                    magicTable('earth', 'Земля', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия огня') {
                    magicTable('fire', 'Огонь', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия воды') {
                    magicTable('aqua', 'Вода', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия смерти') {
                    magicTable('death', 'Смерть', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия духа') {
                    magicTable('astral', 'Дух', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия иллюзий') {
                    magicTable('illusion', 'Иллюзии', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия призыва') {
                    magicTable('call', 'Призыв', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия природы') {
                    magicTable('nature', 'Природа', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия разума') {
                    magicTable('mind', 'Разум', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия тела') {
                    magicTable('body', 'Тело', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Магия тени') {
                    magicTable('shadow', 'Тень', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Начертательная магия') {
                    magicTable('pentagram', 'Начертательная магия', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Знахарство') {
                    magicTable('herbs', 'Знахарство', data.attachedSkill);
                }
                if (data.attachedSkill.name == 'Алхимия') {
                    magicTable('alchemy', 'Алхимия', data.attachedSkill);
                }
            });
        });
    };

    $scope.recalculateBasicCharacteristics = function () {
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

    };

    $scope.showSpellDetail = function (personageSpell) {
        $scope.currentPersonageSpell = personageSpell;
        jQuery('#spellDetails').modal('show');
    };

    var spells = 0;
    $http.get('/personageSpellsByPersonageIdCount/' + personageId).success(function (data) {
        spells = data.spellsAmount;
    });

    $scope.isSpellsEmpty = function () {
        return spells == 0;
    };

    $scope.viewNotice = function (notice_id) {
        jQuery('#' + notice_id + '_view').modal('show');
    };

    $scope.editNotice = function (notice_id) {
        jQuery('#' + notice_id + '_view').modal('hide');
        jQuery('#' + notice_id + '_edit').modal('show');
    };

    $scope.updateNotice = function (notice) {
        $http.put('/notices/' + notice.id, {
            name: notice.name,
            description: notice.description
        }).success(function (data) {
            jQuery('#' + notice.id + '_edit').modal('hide');
            $('#' + notice.id + '_edit').on('hidden.bs.modal', function () {
                $http.get("/noticesByPersonageId/" + personageId).success(function (data) {
                    $scope.notices = data.notices;
                });
            });
        });
    };

    var personageSpellsClicked = false;
    $scope.getPersonageSpells = function () {
        if (!personageSpellsClicked) {
            personageSpellsClicked = true;
            $scope.loader = true;
            $http.get('/personageSpellsByPersonageId/' + personageId).success(function (data) {
                $scope.personageSpells = data.personageSpells;
                $scope.calculateMagicSchools();
                $scope.loader = false;
            });
        }
    };

    $scope.clearNoticeFields = function () {
        $scope.noticeName = '';
        $scope.noticeDescription = '';
    };

    $scope.addNotice = function () {
        $http.post('/notices', {
            personage_id: personageId,
            name: $scope.noticeName,
            description: $scope.noticeDescription
        }).success(function (data) {
            jQuery('#addNotice').modal('hide');
            $('#addNotice').on('hidden.bs.modal', function () {
                $http.get("/noticesByPersonageId/" + personageId).success(function (data) {
                    $scope.notices = data.notices;
                });
            });
        });
    };

    $scope.deleteNotice = function (notice_id) {
        $http.delete('/notices/' + notice_id).success(function (data) {
            jQuery('#' + notice_id + '_view').modal('hide');
            $('#' + notice_id + '_view').on('hidden.bs.modal', function () {
                $http.get("/noticesByPersonageId/" + personageId).success(function (data) {
                    $scope.notices = data.notices;
                });
            });
        });
    };
});