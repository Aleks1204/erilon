var attachedSkillId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("attachedSkillApp", ['ngStorage']);

app.controller("attachedSkillController", function ($scope, $http, $timeout) {
    $http.get('/attachedSKills/' + attachedSkillId).then(function (response) {
        $scope.attachedSkill = response.data.attachedSkill;
    });

    $http.get('/attributes').then(function (response) {
        $scope.attributes = response.data.data;
    });

    $timeout(function () {
        $('#attribute_id').selectpicker();
    }, 3000);

    var rollsTableSelector = $('#rollsTable');

    var rollsTable = rollsTableSelector.DataTable({
        responsive: true,
        "language": {
            "search": "Поиск:",
            "paginate": {
                "first": "Первая",
                "last": "Последняя",
                "next": "След.",
                "previous": "Пред."
            },
            "zeroRecords": "Ничего с таким именем не найдено",
            "emptyTable": "Нет ни одной записи",
            "lengthMenu": "Показать _MENU_"
        },
        stateSave: true,
        "lengthMenu": [[5, 10, 50, -1], [5, 10, 50, "Все"]],
        "info": false,
        "ajax": '/attachedSkillAttributesByAttachedSKillId/' + attachedSkillId,
        "columns": [
            {
                data: "Attribute.name",
                render: function (data, type, row) {
                    return '<i class="icmn-circle-down2 margin-inline"></i>' + data + '+' + row.AttachedSkill.name;
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

    rollsTable.columns().iterator( 'column', function (ctx, idx) {
        $( rollsTable.column(idx).header() ).append('<span class="sort-icon"/>');
    });

    rollsTableSelector.on('click', 'td', function () {
        var tr = $(this).closest('tr');
        var row = rollsTable.row( tr );

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
    } );

    rollsTableSelector.on('click', '.edit', function () {
        $http.get('/attachedSkillAttributes/' + this.value).then(function (response) {
            var rollItem = response.data.attachedSkillAttribute;
            swal({
                title: 'Изменить описание броска "' + rollItem.Attribute.name + '" + "' + rollItem.AttachedSkill.name + '"',
                showCancelButton: true,
                cancelButtonText: "Отменить",
                confirmButtonText: "Сохранить",
                input: 'text',
                inputValue: rollItem.description,
                inputValidator: function (value) {
                    return new Promise(function (resolve, reject) {
                        if (value !== '') {
                            resolve()
                        } else {
                            reject('Описание не может быть пустым!')
                        }
                    })
                }
            }).then(function success(result) {
                $http.put('/attachedSkillAttributes/' + rollItem.id, {
                    description: result
                }).then(function () {
                    rollsTable.ajax.reload(null, false)
                });
            });
        });
    });

    rollsTableSelector.on('click', '.delete', function () {
        var id = this.value;
        swal({
            title: "Вы уверены?",
            text: "Вы уверены что хотите удалить бросок?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Да!",
            cancelButtonText: "Отменить"
        }).then(function success() {
            $http.delete('/attachedSkillAttributes/' + id).then(function () {
                rollsTable.ajax.reload(null, false)
            });
        }, function cancel() {
        });
    });

    $scope.clearForm = function () {
        $scope.roll_description = '';
    };

    $scope.addAttributeAttachedSkill = function () {
        $http.post('/attachedSkillAttributes', {
            attribute_id: $scope.attribute_id,
            attached_skill_id: attachedSkillId,
            description: $scope.roll_description
        }).then(function () {
            jQuery('#addRoll').modal('hide');
            $('#addRoll').on('hidden.bs.modal', function () {
                rollsTable.ajax.reload(null, false);
            });
        });
    };

});
