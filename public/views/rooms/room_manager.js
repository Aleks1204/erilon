var app = angular.module("roomManagerApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("roomManagerController", function ($scope, $http, $window, $q, $localStorage, $timeout, $i18next) {
    $http.get("/rooms").then(function (response) {
        $scope.rooms = response.data.rooms;
    });

    $scope.deleteRoom = function (room) {
        $http.delete('/room/' + room.id).then(function () {
            var index = $scope.rooms.indexOf(room);
            $scope.rooms.splice(index, 1);
        });
    };

    $scope.roomOwner = function (room) {
        return room.PlayerId === $localStorage.playerId;
    };

    $scope.showAddDialog = function () {
        swal({
            title: $i18next.t('page.rooms.add.title'),
            html: '<div class="form-group">' +
            '<label for="name" class="form-control-label">' + $i18next.t('page.rooms.add.name') + '</label>' +
            '<input id="name" class="form-control"/>' +
            '</div>' +
            '<p>' + $i18next.t('page.rooms.add.description') + '</p>',
            showCancelButton: true,
            cancelButtonText: $i18next.t('popup.cancel_button'),
            confirmButtonText: $i18next.t('popup.create_button'),
            input: 'textarea',
            inputClass: 'form-control',
            inputValidator: function (value) {
                return new Promise(function (resolve, reject) {
                    if ($('#name').val() !== '') {
                        resolve()
                    } else {
                        reject($i18next.t('page.rooms.error_message.empty_name'))
                    }
                })
            },
            onOpen: function () {
                $('#name').focus();
            },
            preConfirm: function (value) {
                return new Promise(function (resolve) {
                    resolve([
                        $('#name').val(),
                        value
                    ])
                })
            }
        }).then(function success(result) {
            $http.post('/room', {
                player_id: $localStorage.playerId,
                name: result[0],
                description: result[1]
            }).then(function (response) {
                $scope.rooms.push(response.data.room);
                //$window.location.href = '/views/rooms/room.html?id=' + response.data.room.id
            });
        });
    };

    $scope.editRoom = function (room) {
        swal({
            title: $i18next.t('page.rooms.edit.title'),
            html: '<div class="form-group">' +
            '<label for="name" class="form-control-label">' + $i18next.t('page.rooms.add.name') + '</label>' +
            '<input id="name" class="form-control" value="' + room.name + '"/>' +
            '</div>' +
            '<p>' + $i18next.t('page.rooms.add.description') + '</p>',
            showCancelButton: true,
            cancelButtonText: $i18next.t('popup.cancel_button'),
            confirmButtonText: $i18next.t('popup.save_button'),
            input: 'textarea',
            inputClass: 'form-control',
            inputValue: room.description,
            inputValidator: function (value) {
                return new Promise(function (resolve, reject) {
                    if ($('#name').val() !== '') {
                        resolve()
                    } else {
                        reject($i18next.t('page.rooms.error_message.empty_name'))
                    }
                })
            },
            onOpen: function () {
                $('#name').focus();
            },
            preConfirm: function (value) {
                return new Promise(function (resolve) {
                    resolve([
                        $('#name').val(),
                        value
                    ])
                })
            }
        }).then(function success(result) {
            $http.put('/room/' + room.id, {
                name: result[0],
                description: result[1]
            }).then(function () {
                $http.get("/rooms").then(function (response) {
                    $scope.rooms = response.data.rooms;
                });
            });
        });
    }
});