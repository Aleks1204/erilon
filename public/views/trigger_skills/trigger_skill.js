var triggerSkillId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("triggerApp", ['ngStorage']);

app.controller("skillLevelListController", function ($scope, $http, $q) {
    var levels = [
        {
            "name": "Эксперт",
            "id": 1
        }, {
            "name": "Мастер",
            "id": 2
        }, {
            "name": "Магистр",
            "id": 3
        }, {
            "name": "ГроссМейстер",
            "id": 4
        }
    ];

    var levelsTable = $('#levels');

    var table = levelsTable.DataTable({
        responsive: true,
        stateSave: true,
        "info": false,
        "paging": false,
        searching: false,
        "language": {
            "emptyTable": "У данного навыка еще нет уровней владения"
        },
        "ajax": '/skillLevelsByTriggerSkillId/' + triggerSkillId,
        "columns": [
            {
                data: "level",
                render: function (data, type, row) {
                    var currentLevel = '';
                    switch (data) {
                        case 1:
                            currentLevel = 'Эксперт';
                            break;
                        case 2:
                            currentLevel = 'Мастер';
                            break;
                        case 3:
                            currentLevel = 'Магистр';
                            break;
                        case 4:
                            currentLevel = 'Гроссмейстер';
                            break;
                    }
                    return currentLevel;
                }
            },
            {"data": "cost"},
            {
                data: 'description',
                orderable: false
            },
            {
                data: "id",
                orderable: false,
                render: function (data, type, row) {
                    return '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline edit" value="'
                        + data + '"  type="button"></button>' +
                        '<button class="btn btn-icon btn-danger btn-rounded fa fa-close margin-inline delete" value="'
                        + data + '" type="button"></button>';
                }
            }
        ]
    });

    $http.get('/triggerSkills/' + triggerSkillId).then(function (response) {
        $scope.triggerSkill = response.data.triggerSkill;
    });

    function calculateSkillLevelsToShow() {
        var deferred = $q.defer();
        $http.get('/skillLevelsByTriggerSkillId/' + triggerSkillId).then(function (response) {
            $scope.selectLevels = '{';
            angular.forEach(levels, function (level) {
                var alreadyAdded = false;
                angular.forEach(response.data.data, function (skillLevel) {
                    if (skillLevel.level === level.id) {
                        alreadyAdded = true;
                    }
                });

                if (!alreadyAdded) {
                    $scope.selectLevels = $scope.selectLevels + "\"" + level.id + "\"" + ":" + "\"" + level.name + "\",";
                }
            });
            deferred.resolve();
        });
        return deferred.promise;
    }

    calculateSkillLevelsToShow();

    levelsTable.on('click', '.delete', function () {
        var id = this.value;
        swal({
            title: "Вы уверены?",
            text: "Вы уверены что хотите удалить уровень?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Да!",
            cancelButtonText: "Отменить"
        }).then(function success() {
            $http.delete('/skillLevels/' + id).then(function () {
                calculateSkillLevelsToShow();
                table.ajax.reload(null, false)
            });
        }, function cancel() {
        });
    });

    levelsTable.on('click', '.edit', function () {
        var id = this.value;
        $http.get('/skillLevels/' + id).then(function (response) {
            var level = response.data.skillLevel;
            swal({
                title: 'Редактировать уровень',
                html: '<form>' +
                '<div class="form-group">' +
                    '<label for="description" class="form-control-label">Описание:</label>' +
                    '<textarea id="description" class="form-control">' + level.description + '</textarea>' +
                '</div>' +
                '<p>Стоимость:</p>',
                input: 'number',
                inputValue: level.cost,
                inputClass: 'form-control',
                showCancelButton: true,
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value !== '') {
                            if ($('#description').val() !== '') {
                                resolve()
                            } else {
                                reject('Описание не может быть пустым!')
                            }
                        } else {
                            reject('Укажите стоимость за уровень!')
                        }
                    })
                },
                preConfirm: function (value) {
                    return new Promise(function (resolve) {
                        resolve([
                            value,
                            $('#description').val()
                        ])
                    })
                },
                onOpen: function () {
                    $('#description').focus();
                    autosize($('#description'));
                }
            }).then(function (result) {
                $http.put('/skillLevels/' + level.id, {
                    description: result[1],
                    cost: result[0],
                    level: level.level
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        });
    });

    $scope.addLevel = function () {
        calculateSkillLevelsToShow().then(function () {
            $scope.selectLevels = $scope.selectLevels.substring(0, $scope.selectLevels.length - 1) + "}";
            $scope.selectLevels = JSON.parse($scope.selectLevels);
            swal({
                title: 'Добавить уровень',
                html: '<form>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">Описание:</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="cost" class="form-control-label">Стоимость:</label>' +
                '<input type="number" class="form-control" id="cost">' +
                '</div>' +
                '</form>' +
                '<p>Уровень:</p>',
                input: 'select',
                inputClass: 'form-control',
                inputOptions: $scope.selectLevels,
                inputPlaceholder: 'Выберите уровень',
                showCancelButton: true,
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value !== '') {
                            if ($('#cost').val() !== '') {
                                if ($('#description').val() !== '') {
                                    resolve()
                                } else {
                                    reject('Описание не может быть пустым!')
                                }
                            } else {
                                reject('Укажите стоимость за уровень!')
                            }
                        } else {
                            reject('Выберите уровень!')
                        }
                    })
                },
                preConfirm: function (value) {
                    return new Promise(function (resolve) {
                        resolve([
                            value,
                            $('#cost').val(),
                            $('#description').val()
                        ])
                    })
                },
                onOpen: function () {
                    $('#description').focus();
                    autosize($('#description'));
                }
            }).then(function (result) {
                $http.post('/skillLevels', {
                    TriggerSkillId: triggerSkillId,
                    cost: result[1],
                    level: result[0],
                    description: result[2]
                }).then(function () {
                    calculateSkillLevelsToShow();
                    table.ajax.reload(null, false)
                });
            });
        });
    }
});