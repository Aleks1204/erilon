/**
 * Created by artemk on 4/16/16.
 */

var app = angular.module("attributeManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("attributeListController", function ($scope, $http, $q, $localStorage, $i18next) {
    var attributesTable = $('#attributesTable');

    var players = $q.defer();

    $http.get('/players/' + $localStorage.playerId).then(function (response) {
        players.resolve(response.data);
        $scope.player = response.data.player;
    });

    $q.all([players.promise])
        .then(success);

    function success(data) {

        function disableEditButton() {
            if (hasPermission('Attribute', 'edit', data[0].player.Role)) {
                return '';
            } else {
                return 'disabled'
            }
        }

        var table = attributesTable.DataTable({
            responsive: true,
            info: false,
            paging: false,
            searching: false,
            "ajax": '/attributes',
            "columns": [
                {
                    data: "name",
                    render: function (data, type, full, meta, row) {
                        return '<i class="icmn-circle-down2 margin-right-10"></i>' + data;
                    }
                },
                {
                    data: 'action_level_bonus',
                    orderable: false
                },
                {
                    data: 'description',
                    orderable: false
                },
                {
                    data: "id",
                    orderable: false,
                    render: function (data, type, row) {
                        return '<button class="btn btn-icon btn-success btn-rounded icmn-pencil3 margin-inline edit" value="'
                            + data + '"  type="button" ' + disableEditButton() + '></button>';
                    }
                }
            ]
        });

        table.columns().iterator( 'column', function (ctx, idx) {
            $( table.column(idx).header() ).append('<span class="sort-icon"/>');
        });

        attributesTable.on('click', 'td', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if (tr.find('td').length < 4 && $(this).index() === 0 && tr.find('td').attr('class') !== 'child') {
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

        attributesTable.on('click', '.edit', function () {
            $http.get('/attributes/' + this.value).then(function (response) {
                var attribute = response.data.attribute;
                swal({
                    title: $i18next.t('edit_attribute_title'),
                    html: '<form>' +
                    '<div class="form-group">' +
                    '<label for="description" class="form-control-label">' + $i18next.t('edit_attribute_description') + '</label>' +
                    '<textarea id="description" class="form-control">' + attribute.description + '</textarea>' +
                    '</div>' +
                    '<p>' + $i18next.t('edit_attribute_bonus') + '</p>' +
                    '</form>',
                    showCancelButton: true,
                    cancelButtonText: $i18next.t('cancel_button'),
                    confirmButtonText: $i18next.t('save_button'),
                    showLoaderOnConfirm: true,
                    input: 'textarea',
                    inputValue: attribute.action_level_bonus,
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
                }).then(function success(result) {
                    $http.put('/attributes/' + attribute.id, {
                        description: result[1],
                        action_level_bonus: result[0]
                    }).then(function () {
                        table.ajax.reload(null, false)
                    });
                });
            });
        });


        $scope.showAddDialog = function () {
            swal({
                title: $i18next.t('add_attribute_title'),
                html: '<form>' +
                '<div class="form-group">' +
                '<label for="name" class="form-control-label">' + $i18next.t('add_attribute_name') + '</label>' +
                '<input type="text" class="form-control" id="name">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="description" class="form-control-label">' + $i18next.t('edit_attribute_description') + '</label>' +
                '<textarea id="description" class="form-control"></textarea>' +
                '</div>' +
                '<p>' + $i18next.t('edit_attribute_description') + '</p>' +
                '</form>',
                showCancelButton: true,
                cancelButtonText: $i18next.t('cancel_button'),
                confirmButtonText: $i18next.t('add_button'),
                showLoaderOnConfirm: true,
                input: 'textarea',
                preConfirm: function (value) {
                    return new Promise(function (resolve) {
                        resolve([
                            value,
                            $('#name').val(),
                            $('#description').val()
                        ])
                    })
                },
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        var name = $('#name').val();
                        if (name !== '') {
                            var equal = false;
                            $http.get('/attributes').then(function (response) {
                                angular.forEach(response.data.data, function (attribute) {
                                    if (attribute.name.toLowerCase() === name.toLowerCase()) {
                                        equal = true;
                                    }
                                });
                                if (equal) {
                                    reject($i18next.t('attribute_exists_error_message'))
                                } else {
                                    resolve()
                                }
                            });
                        } else {
                            reject($i18next.t('attribute_name_empty_error_message'))
                        }
                    })
                },
                onOpen: function () {
                    $('#name').focus();

                }
            }).then(function success(result) {
                $http.post('/attributes', {
                    name: result[1],
                    description: result[2],
                    action_level_bonus: result[0]
                }).then(function () {
                    table.ajax.reload(null, false)
                });
            });
        };
    }
});
