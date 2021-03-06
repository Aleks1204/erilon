/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("attachedSkillManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("attachedSkillListController", function ($scope, $http, $q, $localStorage, $i18next) {

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
            if (hasPermission('AttachedSkill', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        function disableDeleteButton() {
            if (hasPermission('AttachedSkill', 'delete', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }


        var table = skillsTable.DataTable({
            responsive: true,
            "language": {
                "search": $i18next.t('table.label.search'),
                "paginate": {
                    "first": $i18next.t('table.pagination.first_page'),
                    "last": $i18next.t('table.pagination.last_page'),
                    "next": $i18next.t('table.pagination.next_page'),
                    "previous": $i18next.t('table.pagination.previous_page')
                },
                "zeroRecords": $i18next.t('table.pagination.empty_search_results'),
                "emptyTable": $i18next.t('table.pagination.empty_table'),
                "lengthMenu": $i18next.t('table.pagination.show') + " _MENU_"
            },
            stateSave: true,
            "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, $i18next.t('table.pagination.all')]],
            "info": false,
            "ajax": '/attachedSkills',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-inline"></i>' + data;
                    }
                },
                {"data": "category"},
                {
                    data: 'difficult',
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
                    data: 'theoretical',
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
                    data: 'default_skill',
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
                    data: 'spells_connected',
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
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<a href="attached_skill.html?id=' + data + '" class="btn btn-icon btn-info btn-rounded fa fa-graduation-cap margin-inline" ' +
                            'type="button" ' + disableEditButton() + '></a>' +
                            '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline edit" value="'
                            + data + '"  type="button" ' + disableEditButton() + '></button>' +
                            '<button class="btn btn-icon btn-danger btn-rounded fa fa-close margin-inline delete" value="'
                            + data + '" type="button" ' + disableDeleteButton() + '></button>';
                    }
                }
            ]
        });

        table.columns().iterator('column', function (ctx, idx) {
            $(table.column(idx).header()).append('<span class="sort-icon"/>');
        });

        skillsTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);

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
        });

        skillsTable.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.attached_skills.delete.text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
            }).then(function success() {
                $http.delete('/attachedSkills/' + id).then(function () {
                    table.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });

        skillsTable.on('click', '.edit', function () {
            $http.get('/attachedSkills/' + this.value).then(function (response) {
                var skill = response.data.attachedSkill;
                var isDefault = '';
                var isDifficult = '';
                var isTheoretical = '';
                if (skill.difficult) {
                    isDifficult = 'checked';
                }
                if (skill.default_skill) {
                    isDefault = 'checked';
                }
                if (skill.theoretical) {
                    isTheoretical = 'checked';
                }
                swal({
                    title: $i18next.t('page.attached_skills.edit.title'),
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="name" class="form-control-label">' + $i18next.t('page.attached_skills.edit.name') + '</label>' +
                    '<input type="text" class="form-control" value="' + skill.name + '" id="name">' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="category" class="form-control-label">' + $i18next.t('page.attached_skills.edit.categories') + '</label>' +
                    '<select class="form-control" title="' + $i18next.t('page.attached_skills.options.choose_category') + '" id="category" multiple>' +
                    '<option value="' + $i18next.t('page.attached_skills.options.magic') + '">' + $i18next.t('page.attached_skills.options.magic') + '</option>' +
                    '<option value="' + $i18next.t('page.attached_skills.options.social') + '">' + $i18next.t('page.attached_skills.options.social') + '</option>' +
                    '<option value="' + $i18next.t('page.attached_skills.options.languages') + '">' + $i18next.t('page.attached_skills.options.languages') + '</option>' +
                    '<option value="' + $i18next.t('page.attached_skills.options.lores') + '">' + $i18next.t('page.attached_skills.options.lores') + '</option>' +
                    '<option value="' + $i18next.t('page.attached_skills.options.crafts') + '">' + $i18next.t('page.attached_skills.options.crafts') + '</option>' +
                    '<option value="' + $i18next.t('page.attached_skills.options.professional') + '">' + $i18next.t('page.attached_skills.options.professional') + '</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">' + $i18next.t('page.attached_skills.edit.description') + '</label>' +
                    '<textarea id="description" class="form-control">' + skill.description + '</textarea>' +
                    '</div>' +
                    '<div class="row form-group">' +
                    '<div class="col-md-4">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="difficultSkill" name="difficultSkill" type="checkbox" ' + isDifficult + '>' +
                    '<label for="difficultSkill">' + $i18next.t('page.attached_skills.edit.difficult') + '</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="defaultSkill" name="defaultSkill" type="checkbox" ' + isDefault + '>' +
                    '<label for="defaultSkill">' + $i18next.t('page.attached_skills.edit.default') + '</label>' +
                    '</div>' +
                    '</div>' +
                    '<div class="col-md-4">' +
                    '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                    '<input id="theoreticalSkill" name="theoreticalSkill" type="checkbox" ' + isTheoretical + '>' +
                    '<label for="theoreticalSkill">' + $i18next.t('page.attached_skills.edit.theoretical') + '</label>' +
                    '</div>' +
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
                                $('#description').val(),
                                $('#difficultSkill').prop("checked"),
                                $('#defaultSkill').prop("checked"),
                                $('#theoreticalSkill').prop("checked")
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
                    $http.put('/attachedSkills/' + skill.id, {
                        name: result[0],
                        category: result[1],
                        description: result[2],
                        difficult: result[3],
                        theoretical: result[5],
                        default_skill: result[4],
                        spells_connected: skill.spells_connected
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: $i18next.t('page.attached_skills.add.title'),
                html: '<form>' +
                '<div class="form-group">' +
                '<label for="name" class="form-control-label">' + $i18next.t('page.attached_skills.add.name') + '</label>' +
                '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="category" class="form-control-label">' + $i18next.t('page.attached_skills.add.categories') + '</label>' +
                '<select class="form-control" title="' + $i18next.t('page.attached_skills.options.choose_category') + '" id="category" multiple>' +
                '<option value="' + $i18next.t('page.attached_skills.options.magic') + '">' + $i18next.t('page.attached_skills.options.magic') + '</option>' +
                '<option value="' + $i18next.t('page.attached_skills.options.social') + '">' + $i18next.t('page.attached_skills.options.social') + '</option>' +
                '<option value="' + $i18next.t('page.attached_skills.options.languages') + '">' + $i18next.t('page.attached_skills.options.languages') + '</option>' +
                '<option value="' + $i18next.t('page.attached_skills.options.lores') + '">' + $i18next.t('page.attached_skills.options.lores') + '</option>' +
                '<option value="' + $i18next.t('page.attached_skills.options.crafts') + '">' + $i18next.t('page.attached_skills.options.crafts') + '</option>' +
                '<option value="' + $i18next.t('page.attached_skills.options.professional') + '">' + $i18next.t('page.attached_skills.options.professional') + '</option>' +
                '</select>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">' + $i18next.t('page.attached_skills.add.description') + '</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<div class="row form-group">' +
                '<div class="col-md-4">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="difficultSkill" name="difficultSkill" type="checkbox">' +
                '<label for="difficultSkill">' + $i18next.t('page.attached_skills.add.difficult') + '</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="defaultSkill" name="defaultSkill" type="checkbox">' +
                '<label for="defaultSkill">' + $i18next.t('page.attached_skills.add.default') + '</label>' +
                '</div>' +
                '</div>' +
                '<div class="col-md-4">' +
                '<div class="checkbox checkbox-info" style="font-size: 14px;line-height: 1.3;">' +
                '<input id="theoreticalSkill" name="theoreticalSkill" type="checkbox">' +
                '<label for="theoreticalSkill">' + $i18next.t('page.attached_skills.add.theoretical') + '</label>' +
                '</div>' +
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
                        $http.get('/attachedSkills').then(function (response) {
                            angular.forEach(response.data.data, function (attachedSkill) {
                                if (attachedSkill.name.toLowerCase() === name.toLowerCase()) {
                                    equal = true;
                                }
                            });
                            if (equal) {
                                reject($i18next.t('page.attached_skills.error_message.already_exists'))
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
                            $('#description').val(),
                            $('#difficultSkill').prop("checked"),
                            $('#defaultSkill').prop("checked"),
                            $('#theoreticalSkill').prop("checked")
                        ])
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                    $('#category').selectpicker();
                    $('.bootstrap-select .btn-default').css('border-radius', '.25rem');
                }
            }).then(function success(result) {
                $http.post('/attachedSkills', {
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
        };
    }
});
