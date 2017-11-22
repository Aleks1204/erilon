var triggerSkillId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("triggerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("skillLevelListController", function ($scope, $http, $q, $i18next) {
    $http.get('/triggerSkills/' + triggerSkillId).then(function (response) {
        $scope.triggerSkill = response.data.triggerSkill;
        $scope.levels = [
            {
                "name": $i18next.t('level.expert'),
                "id": 1
            }, {
                "name": $i18next.t('level.master'),
                "id": 2
            }, {
                "name": $i18next.t('level.magister'),
                "id": 3
            }, {
                "name": $i18next.t('level.grandmaster'),
                "id": 4
            }
        ];
    });

    function getLevelName(levelNumber) {
        var levelName = '';
        switch (levelNumber) {
            case 0:
                levelName = $i18next.t('level.base');
                break;
            case 1:
                levelName = $i18next.t('level.expert');
                break;
            case 2:
                levelName = $i18next.t('level.master');
                break;
            case 3:
                levelName = $i18next.t('level.magister');
                break;
            case 4:
                levelName = $i18next.t('level.grandmaster');
                break;
            default:
                levelName = $i18next.t('level.none');
                break;
        }
        return levelName;
    }

    function calculateSkillLevelsToShow() {
        var deferred = $q.defer();
        $http.get('/skillLevelsByTriggerSkillId/' + triggerSkillId).then(function (response) {
            $scope.selectLevels = '{';
            angular.forEach($scope.levels, function (level) {
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

    calculateSkillLevelsToShow().then(function () {
        var levelsTable = $('#levels');

        var table = levelsTable.DataTable({
            responsive: true,
            stateSave: true,
            "info": false,
            "paging": false,
            searching: false,
            "language": {
                "emptyTable": $i18next.t('table.pagination.no_levels_found')
            },
            "ajax": '/skillLevelsByTriggerSkillId/' + triggerSkillId,
            "columns": [
                {
                    data: "level",
                    render: function (data, type, row) {
                        return getLevelName(data);
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

        levelsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.trigger_skill.delete.text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
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
                    title: $i18next.t('page.trigger_skill.edit.title') + ' ' + getLevelName(level.level),
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">' + $i18next.t('page.trigger_skill.edit.description') + '</label>' +
                    '<textarea id="description" class="form-control">' + level.description + '</textarea>' +
                    '</div>' +
                    '<p>' + $i18next.t('page.trigger_skill.edit.cost') + '</p>',
                    input: 'number',
                    inputValue: level.cost,
                    inputClass: 'form-control',
                    showCancelButton: true,
                    confirmButtonText: $i18next.t('popup.save_button'),
                    cancelButtonText: $i18next.t('popup.cancel_button'),
                    inputValidator: function (value) {
                        return new Promise(function (resolve, reject) {
                            if (value !== '') {
                                if ($('#description').val() !== '') {
                                    resolve()
                                } else {
                                    reject($i18next.t('page.trigger_skill.error_message.empty_description'))
                                }
                            } else {
                                reject($i18next.t('page.trigger_skill.error_message.empty_cost'))
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
                    title: $i18next.t('page.trigger_skill.add.title'),
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">' + $i18next.t('page.trigger_skill.add.description') + '</label>' +
                    '<textarea id="description" class="form-control"></textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="cost" class="form-control-label">' + $i18next.t('page.trigger_skill.add.cost') + '</label>' +
                    '<input type="number" class="form-control" id="cost">' +
                    '</div>' +
                    '</form>' +
                    '<p>' + $i18next.t('page.trigger_skill.add.level') + '</p>',
                    input: 'select',
                    inputClass: 'form-control',
                    inputOptions: $scope.selectLevels,
                    inputPlaceholder: $i18next.t('page.trigger_skill.add.level_placeholder'),
                    confirmButtonText: $i18next.t('popup.add_button'),
                    cancelButtonText: $i18next.t('popup.cancel_button'),
                    showCancelButton: true,
                    inputValidator: function (value) {
                        return new Promise(function (resolve, reject) {
                            if (value !== '') {
                                if ($('#cost').val() !== '') {
                                    if ($('#description').val() !== '') {
                                        resolve()
                                    } else {
                                        reject($i18next.t('page.trigger_skill.error_message.empty_description'))
                                    }
                                } else {
                                    reject($i18next.t('page.trigger_skill.error_message.empty_cost'))
                                }
                            } else {
                                reject($i18next.t('page.trigger_skill.error_message.empty_level'))
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
});