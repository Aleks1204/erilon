var app = angular.module("profileApp", ['ngStorage']);

app.controller("profileController", function ($scope, $http, $q, $localStorage) {
    $http.get('/playerAttributesByPlayerId/' + $localStorage.playerId).then(function (response) {
        $scope.playerAttributes = response.data.playerAttributes;
        var attrTable = $('#attrTable');
        $('.sorted_table').sortable({
            containerSelector: 'table',
            itemPath: '> tbody',
            itemSelector: 'tr',
            group: 'serialization',
            placeholder: '<tr class="placeholder"/>',
            onDrop: function ($item, container, _super) {
                var ser = $('.sorted_table').sortable("serialize").get()[0];
                var count = 1;
                angular.forEach(ser, function (item) {
                    item.$scope.playerAttribute.position = count;
                    $http.put('/playerAttributes/' + item.$scope.playerAttribute.id, item.$scope.playerAttribute);
                    count++;
                });
                _super($item, container);
            }
        });
    });

    // $scope.setInitialPositionsForAttributes = function () {
    //     var attributesDefer = $q.defer();
    //     var playersDefer = $q.defer();
    //
    //     $http.get('/attributes/').then(function (response) {
    //         $scope.attributes = response.data.data;
    //         attributesDefer.resolve();
    //     });
    //
    //     $http.get('/players/').then(function (response) {
    //         $scope.players = response.data.players;
    //         playersDefer.resolve();
    //     });
    //
    //     $q.all([attributesDefer.promise, playersDefer.promise]).then(function () {
    //         angular.forEach($scope.players, function (player) {
    //             angular.forEach($scope.attributes, function (attribute) {
    //                 console.log('Create position for ' + attribute.name + ' and player ' + player.name);
    //                 $http.post('/playerAttributes', {
    //                     player_id: player.id,
    //                     attribute_id: attribute.id,
    //                     position: 0
    //                 });
    //             });
    //         });
    //     });
    // }
});
