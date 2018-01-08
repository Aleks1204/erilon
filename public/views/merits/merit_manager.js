/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("meritManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("meritListController", function ($scope, $http, $q, $localStorage, $i18next) {

    var meritsTable = $('#merits');

    var players = $q.defer();

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
                "search": $i18next.t('table.label.search'),
                "paginate": {
                    "first": $i18next.t('table.pagination.first_page'),
                    "last": $i18next.t('table.pagination.last_page'),
                    "next": $i18next.t('table.pagination.next_page'),
                    "previous": $i18next.t('table.pagination.previous_page')
                },
                "lengthMenu": $i18next.t('table.pagination.show') + " _MENU_"
            },
            stateSave: true,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, $i18next.t('table.pagination.all')]],
            "info": false,
            "ajax": '/merits',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
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
                    data: 'permanent_bonus',
                    orderable: false
                },
                {
                    data: 'situation_bonus',
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
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritTriggerSkill.TriggerSkill.name + ': ' + getLevelName(meritTriggerSkill.level) + '</span>';
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
                                returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritInherent.Inherent.name + ': ' + $i18next.t('general.present') + '</span>';
                            } else {
                                returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritInherent.Inherent.name + ': ' + sign + meritInherent.value + '</span>';
                            }
                        });

                        angular.forEach(row.MeritFlaws, function (meritFlaw) {
                            var presence = $i18next.t('general.absent');
                            if (meritFlaw.presentAbsent) {
                                presence = $i18next.t('general.present');
                            }
                            returned = returned + '<span class="label label-pill label-warning font-size-16 margin-inline">' + meritFlaw.Flaw.name + ': ' + presence + '</span>';
                        });

                        angular.forEach(row.MeritMerits, function (meritMerit) {
                            var presence = $i18next.t('general.absent');
                            if (meritMerit.presentAbsent) {
                                presence = $i18next.t('general.present');
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
                        return '<a href="merit.html?id=' + data + '" class="btn btn-icon btn-info btn-rounded fa fa-graduation-cap margin-inline" ' +
                            'type="button" ' + disableEditButton() + '></a>' +
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

        meritsTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if (tr.find('td').length < 8 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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

        meritsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.merits.delete.text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
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
                    title: $i18next.t('page.merits.edit.title'),
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="name" class="form-control-label">' + $i18next.t('page.merits.edit.name') + '</label>' +
                    '<input type="text" class="form-control" value="' + merit.name + '" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="cost" class="form-control-label">' + $i18next.t('page.merits.edit.cost') + '</label>' +
                    '<input type="number" class="form-control" id="cost" value="' + merit.cost + '">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="category" class="form-control-label">' + $i18next.t('page.merits.edit.categories') + '</label>' +
                    '<select class="form-control" title="' + $i18next.t('page.merits.options.choose_category') + '" id="category" multiple>' +
                    '<option value="' + $i18next.t('page.merits.options.magic') + '">' + $i18next.t('page.merits.options.magic') + '</option>' +
                    '<option value="' + $i18next.t('page.merits.options.speciality') + '">' + $i18next.t('page.merits.options.speciality') + '</option>' +
                    '<option value="' + $i18next.t('page.merits.options.talent') + '">' + $i18next.t('page.merits.options.talent') + '</option>' +
                    '<option value="' + $i18next.t('page.merits.options.fight') + '">' + $i18next.t('page.merits.options.fight') + '</option>' +
                    '<option value="' + $i18next.t('page.merits.options.appearance') + '">' + $i18next.t('page.merits.options.appearance') + '</option>' +
                    '<option value="' + $i18next.t('page.merits.options.others') + '">' + $i18next.t('page.merits.options.others') + '</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">' + $i18next.t('page.merits.edit.description') + '</label>' +
                    '<textarea id="description" class="form-control">' + merit.description + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="permanent_bonus" class="form-control-label">' + $i18next.t('page.merits.edit.permanent_bonus') + '</label>' +
                    '<textarea id="permanent_bonus" class="form-control">' + merit.permanent_bonus + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="situation_bonus" class="form-control-label">' + $i18next.t('page.merits.edit.situation_bonus') + '</label>' +
                    '<textarea id="situation_bonus" class="form-control">' + merit.situation_bonus + '</textarea>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="creation_only" name="creation_only" type="checkbox" ' + creation_only + '>' +
                    '<label for="creation_only">' + $i18next.t('page.merits.edit.creation_only') + '</label>' +
                    '</div>' +
                    '</div>' +
                    '</form>',
                    showCancelButton: true,
                    cancelButtonText: $i18next.t('popup.cancel_button'),
                    confirmButtonText: $i18next.t('popup.save_button'),
                    showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return new Promise(function (resolve) {
                            resolve([
                                $('#name').val(),
                                $('#category').val().toString(),
                                $('#cost').val(),
                                $('#description').val(),
                                $('#permanent_bonus').val(),
                                $('#situation_bonus').val(),
                                $('#creation_only').prop("checked")
                            ])
                        })
                    },
                    onOpen: function () {
                        $('#name').focus();

                        if (merit.category === null) {
                            $('#category').selectpicker();
                        } else {
                            $('#category').selectpicker('val', merit.category.split(','));
                        }
                        $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                    }
                }).then(function success(result) {
                    $http.put('/merits/' + merit.id, {
                        name: result[0],
                        category: result[1],
                        cost: result[2],
                        description: result[3],
                        permanent_bonus: result[4],
                        situation_bonus: result[5],
                        creation_only: result[6]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: $i18next.t('page.merits.add.title'),
                html: '<form>' +
                '<div class="form-group">' +
                '<label for="name" class="form-control-label">' + $i18next.t('page.merits.add.name') + '</label>' +
                '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="cost" class="form-control-label">' + $i18next.t('page.merits.add.cost') + '</label>' +
                '<input type="number" class="form-control" id="cost">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="category" class="form-control-label">' + $i18next.t('page.merits.add.categories') + '</label>' +
                '<select class="form-control" title="' + $i18next.t('page.merits.options.choose_category') + '" id="category" multiple>' +
                '<option value="' + $i18next.t('page.merits.options.magic') + '">' + $i18next.t('page.merits.options.magic') + '</option>' +
                '<option value="' + $i18next.t('page.merits.options.speciality') + '">' + $i18next.t('page.merits.options.speciality') + '</option>' +
                '<option value="' + $i18next.t('page.merits.options.talent') + '">' + $i18next.t('page.merits.options.talent') + '</option>' +
                '<option value="' + $i18next.t('page.merits.options.fight') + '">' + $i18next.t('page.merits.options.fight') + '</option>' +
                '<option value="' + $i18next.t('page.merits.options.appearance') + '">' + $i18next.t('page.merits.options.appearance') + '</option>' +
                '<option value="' + $i18next.t('page.merits.options.others') + '">' + $i18next.t('page.merits.options.others') + '</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">' + $i18next.t('page.merits.add.description') + '</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="permanent_bonus" class="form-control-label">' + $i18next.t('page.merits.add.permanent_bonus') + '</label>' +
                '<textarea id="permanent_bonus" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="situation_bonus" class="form-control-label">' + $i18next.t('page.merits.add.situation_bonus') + '</label>' +
                '<textarea id="situation_bonus" class="form-control"></textarea>' +
                '</div>' +
                '<div class="form-group">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="creation_only" name="creation_only" type="checkbox">' +
                '<label for="creation_only">' + $i18next.t('page.merits.add.creation_only') + '</label>' +
                '</div>' +
                '</div>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: $i18next.t('popup.cancel_button'),
                confirmButtonText: $i18next.t('popup.add_button'),
                showLoaderOnConfirm: true,
                input: 'text',
                inputClass: 'hide',
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        var name = $('#name').val();
                        var equal = false;
                        $http.get('/merits').then(function (response) {
                            angular.forEach(response.data.data, function (merit) {
                                if (merit.name.toLowerCase() === name.toLowerCase()) {
                                    equal = true;
                                }
                            });
                            if (equal) {
                                reject($i18next.t('page.merits.error_message.already_exists'))
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
                            $('#category').val().toString(),
                            $('#cost').val(),
                            $('#description').val(),
                            $('#permanent_bonus').val(),
                            $('#situation_bonus').val(),
                            $('#creation_only').prop("checked")
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                    $('#category').selectpicker();
                    $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                }
            }).then(function success(result) {
                $http.post('/merits', {
                    name: result[0],
                    category: result[1],
                    cost: result[2],
                    description: result[3],
                    permanent_bonus: result[4],
                    situation_bonus: result[5],
                    creation_only: result[6]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
