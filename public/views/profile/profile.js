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

    $scope.uploadPlayerAvatar = function (player_id) {
        var file = '';
        var date = new Date();
        var name = 'player_avatar_' + player_id + '_' + date.getTime() + '.png';
        swal({
            title: 'Загрузить аватар игрока',
            input: 'file',
            inputAttributes: {
                accept: 'image/*'
            },
            inputClass: 'dropify',
            onOpen: function () {
                var input = $('.swal2-file.dropify');
                input.attr('data-max-file-size', '3M');
                input.dropify({
                    messages: {
                        'default': 'Перетащите картинку в область или кликните для загрузки',
                        'replace': 'Перетащите картинку в область или кликните для загрузки',
                        'remove': 'Удалить',
                        'error': 'Уппссс... что то пошло не так'
                    },
                    error: {
                        'fileSize': 'Нельзя загружать аватар больше {{ value }}.',
                        'minWidth': 'The image width is too small ({{ value }}}px min).',
                        'maxWidth': 'The image width is too big ({{ value }}}px max).',
                        'minHeight': 'The image height is too small ({{ value }}}px min).',
                        'maxHeight': 'The image height is too big ({{ value }}px max).',
                        'imageFormat': 'The image format is not allowed ({{ value }} only).'
                    }
                });
                file = $('.dropify-render img').attr('src');
            },
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function () {
                return new Promise(function (resolve) {
                    file = $('.dropify-render img').attr('src');
                    if (file !== undefined) {
                        $http.put('/players/' + player_id, {
                            avatar: name
                        }).then(function () {
                            $http.post('/uploadPlayerAvatar/' + player_id, {
                                file: file,
                                name: name
                            }).then(function () {
                                location.reload();
                            });
                        });
                    } else {
                        resolve();
                    }
                })
            }
        });
    };

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
