var attachedSkillId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("attachedSkillApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("attachedSkillController", function ($scope, $http, $timeout, $q, $i18next) {
    $http.get('/attachedSKills/' + attachedSkillId).then(function (response) {
        $scope.attachedSkill = response.data.attachedSkill;
    });

    var promise = $http.get('/attributes').then(function (response) {
        $scope.attributesOptions = '{';
        angular.forEach(response.data.data, function (attribute) {
            $scope.attributesOptions = $scope.attributesOptions + "\"" + attribute.id + "\"" + ":" + "\"" + attribute.name + "\",";
        });
        $scope.attributesOptions = $scope.attributesOptions.substring(0, $scope.attributesOptions.length - 1) + "}";
        $scope.attributesOptions = JSON.parse($scope.attributesOptions);

        $scope.table_header_name = $i18next.t('table.header.name');
        $scope.table_header_roll = $i18next.t('table.header.roll');
        $scope.table_header_description = $i18next.t('table.header.description');
        $scope.table_header_actions = $i18next.t('table.header.actions');
    });

    $timeout(function () {
        $('#attribute_id').selectpicker();
    }, 3000);

    promise.then(function () {
        var rollsTableSelector = $('#rollsTable');

        var rollsTable = rollsTableSelector.DataTable({
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
            "ajax": '/attachedSkillAttributesByAttachedSKillId/' + attachedSkillId,
            "columns": [
                {"data": "name"},
                {
                    data: "Attribute.name",
                    render: function (data, type, row) {
                        if (rollsTableSelector.find('th').length < 3) {
                            return '<i class="icmn-circle-down2 margin-inline"></i>' + data + '+' + row.AttachedSkill.name;
                        } else {
                            return data + '+' + row.AttachedSkill.name;
                        }
                    }
                },
                {"data": "description"},
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

        rollsTable.columns().iterator('column', function (ctx, idx) {
            $(rollsTable.column(idx).header()).append('<span class="sort-icon"/>');
        });

        rollsTableSelector.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = rollsTable.row(tr);

            if (tr.find('td').length < 3 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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

        $scope.showAddDialog = function () {
            swal({
                title: $i18next.t('page.attached_skill.add.title'),
                html: '<div class="form-group">' +
                '<label for="name" class="form-control-label">' + $i18next.t('page.attached_skill.add.name') + '</label>' +
                '<input id="name" class="form-control"/>' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">' + $i18next.t('page.attached_skill.add.description') + '</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<p>' + $i18next.t('page.attached_skill.add.attribute') + '</p>',
                showCancelButton: true,
                cancelButtonText: $i18next.t('popup.cancel_button'),
                confirmButtonText: $i18next.t('popup.add_button'),
                input: 'select',
                inputOptions: $scope.attributesOptions,
                inputPlaceholder: $i18next.t('page.attached_skill.add.attribute_place_holder'),
                inputClass: 'form-control',
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value !== '') {
                            resolve()
                        } else {
                            reject($i18next.t('page.attached_skill.error_message.empty_attribute'))
                        }
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                },
                preConfirm: function (value) {
                    return new Promise(function (resolve) {
                        resolve([
                            value,
                            $('#name').val(),
                            $('#description').val()
                        ])
                    })
                }
            }).then(function success(result) {
                $http.post('/attachedSkillAttributes', {
                    attribute_id: result[0],
                    attached_skill_id: attachedSkillId,
                    name: result[1],
                    description: result[2]
                }).then(function () {
                    rollsTable.ajax.reload(null, false)
                });
            });
        };

        rollsTableSelector.on('click', '.edit', function () {
            $http.get('/attachedSkillAttributes/' + this.value).then(function (response) {
                var rollItem = response.data.attachedSkillAttribute;
                swal({
                    title: $i18next.t('page.attached_skill.edit.title') + ' "' + rollItem.Attribute.name + '" + "' + rollItem.AttachedSkill.name + '"',
                    html: '<div class="form-group">' +
                    '<label for="name" class="form-control-label">' + $i18next.t('page.attached_skill.add.name') + '</label>' +
                    '<input type="text" class="form-control" value="' + rollItem.name + '" id="name">' +
                    '</div>',
                    showCancelButton: true,
                    cancelButtonText: $i18next.t('popup.cancel_button'),
                    confirmButtonText: $i18next.t('popup.save_button'),
                    input: 'textarea',
                    inputValue: rollItem.description,
                    onOpen: function () {
                        $('#name').focus();

                    },
                    preConfirm: function (value) {
                        return new Promise(function (resolve) {
                            resolve([
                                value,
                                $('#name').val()
                            ])
                        })
                    }
                }).then(function success(result) {
                    $http.put('/attachedSkillAttributes/' + rollItem.id, {
                        description: result[0],
                        name: result[1]
                    }).then(function () {
                        rollsTable.ajax.reload(null, false)
                    });
                });
            });
        });

        rollsTableSelector.on('click', '.delete', function () {
            var id = this.value;
            swal({
                title: $i18next.t('popup.confirm_title'),
                text: $i18next.t('page.attached_skill.delete.text'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: $i18next.t('popup.delete_button'),
                cancelButtonText: $i18next.t('popup.cancel_button')
            }).then(function success() {
                $http.delete('/attachedSkillAttributes/' + id).then(function () {
                    rollsTable.ajax.reload(null, false)
                });
            }, function cancel() {
            });
        });
    });

});
