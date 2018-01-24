var roomId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("roomApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("roomController", function ($scope, $http, $window, $q, $localStorage) {
    $http.get('/room/' + roomId).then(function (response) {
        $scope.room = response.data.room;
        $scope.isOwner = function () {
            return $scope.room.PlayerId === $localStorage.playerId;
        };
        if ($scope.isOwner()) {
            $http.get('/players').then(function (response) {
                $scope.players = response.data.players;
                $('#player_id').selectpicker({'liveSearch': true});
            });
            $http.get('/personages').then(function (response) {
                $scope.personagesForConnect = response.data.personages;
                $('#personage_id').selectpicker({'liveSearch': true});
            });
        } else {
            $http.get('/personagesByPlayerId/' + $localStorage.playerId).then(function (response) {
                $scope.personagesForConnect = response.data.personages;
                $('#personage_id').selectpicker({'liveSearch': true});
            });
        }
    });

    $scope.refreshPersonagesList = function () {
        $('#personage_id').selectpicker('refresh');
    };

    $scope.refreshPlayersList = function () {
        $('#player_id').selectpicker('refresh');
    };

    $scope.connectPersonage = function () {
        $http.put('/setPersonageRoom/' + $scope.personage_id, {"room_id": roomId}).then(function () {
            $http.get('/personagesByRoomId/' + roomId).then(function (response) {
                $scope.personagesInRoom = response.data.personages;
            })
        });
    };

    $scope.changeOwner = function () {
        $http.put('/changeRoomOwner/' + roomId, {"player_id": $scope.player_id}).then(function () {
            location.reload();
        });
    };

    $scope.disconnectPersonage = function (personage) {
        $http.put('/setPersonageRoom/' + personage.id, {"room_id": null}).then(function () {
            $http.get('/personagesByRoomId/' + roomId).then(function (response) {
                $scope.personagesInRoom = response.data.personages;
            })
        });
    };

    $http.get('/personagesByRoomId/' + roomId).then(function (response) {
        $scope.personagesInRoom = response.data.personages;
    });

    $scope.avatar = function (personage_id) {
        var avatar = 'avatar.png';
        angular.forEach($scope.personagesInRoom, function (personage) {
            if (personage.id === personage_id && personage.avatar !== null && personage.avatar !== '') {
                avatar = personage.avatar;
            }
        });
        return avatar;
    };
});