var meritId = /id=(\d+)/.exec(window.location.href)[1];
var app = angular.module("meritApp", ['ngStorage', 'ngSanitize', 'jm.i18next']);

app.controller("prerequisitesListController", function ($scope, $http, $timeout, $i18next) {
    $scope.lessMoreEqual = 0;
    $scope.presentAbsent = false;

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

    $timeout(function () {
        $('#type').selectpicker();
    }, 1000);

    recalculateTables();

    function recalculateTables() {
        $http.get('/merits/' + meritId).then(function (response) {
            $scope.merit = response.data.merit;
            $scope.meritAttributes = response.data.merit.MeritAttributes;
            $scope.meritAttachedSkills = response.data.merit.MeritAttachedSkills;
            $scope.meritAttributeAttachedSkills = response.data.merit.MeritAttributeAttachedSkills;
            $scope.meritTriggerSkills = response.data.merit.MeritTriggerSkills;
            $scope.meritInherents = response.data.merit.MeritInherents;
            $scope.meritFlaws = response.data.merit.MeritFlaws;
            $scope.meritMerits = response.data.merit.MeritMerits;

            $('#mainPanel').empty();

            angular.forEach(response.data.merit.MeritAttachedSkills, function (meritAttachedSkill) {
                addPrerequisitesElement(meritAttachedSkill.AttachedSkill.name, meritAttachedSkill.value, '/meritAttachedSkills/' + meritAttachedSkill.id);
            });

            angular.forEach(response.data.merit.MeritAttributes, function (meritAttribute) {
                addPrerequisitesElement(meritAttribute.Attribute.name, meritAttribute.value, '/meritAttributes/' + meritAttribute.id);
            });

            angular.forEach(response.data.merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                addPrerequisitesElement(meritAttributeAttachedSkill.AttachedSkill.name + '+' + meritAttributeAttachedSkill.Attribute.name, meritAttributeAttachedSkill.value, '/meritAttributeAttachedSkills/' + meritAttributeAttachedSkill.id);
            });

            angular.forEach(response.data.merit.MeritTriggerSkills, function (meritTriggerSkill) {
                addPrerequisitesElement(meritTriggerSkill.TriggerSkill.name, getLevelName(meritTriggerSkill.level), '/meritTriggerSkills/' + meritTriggerSkill.id);
            });

            angular.forEach(response.data.merit.MeritInherents, function (meritInherent) {
                var sign = '=';
                if (meritInherent.lessMoreEqual === 1) {
                    sign = '>';
                }
                if (meritInherent.lessMoreEqual === -1) {
                    sign = '<';
                }

                if (meritInherent.value === null) {
                    addPrerequisitesElement(meritInherent.Inherent.name, $i18next.t('general.present'), '/meritInherents/' + meritInherent.id);
                } else {
                    addPrerequisitesElement(meritInherent.Inherent.name, meritInherent.value, '/meritInherents/' + meritInherent.id, sign);
                }
            });

            angular.forEach(response.data.merit.MeritFlaws, function (meritFlaw) {
                var presence = $i18next.t('general.absent');
                if (meritFlaw.presentAbsent) {
                    presence = $i18next.t('general.present');
                }
                addPrerequisitesElement(meritFlaw.Flaw.name, presence, '/meritFlaws/' + meritFlaw.id);
            });

            angular.forEach(response.data.merit.MeritMerits, function (meritMerit) {
                var presence = $i18next.t('general.absent');
                if (meritMerit.presentAbsent) {
                    presence = $i18next.t('general.present');
                }
                addPrerequisitesElement(meritMerit.MeritPrerequisite.name, presence, '/meritMerits/' + meritMerit.id);
            });

            $timeout(function () {
                $('#merit_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#flaw_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#inherent_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#attribute_id').selectpicker();
            }, 1000);

            $timeout(function () {
                $('#attached_skill_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#trigger_skill_id').selectpicker({liveSearch: true});
            }, 1000);

            $timeout(function () {
                $('#level').selectpicker();
            }, 1000);
        });
    }

    function addPrerequisitesElement(prerequisite, value, url, sign) {
        if (sign === undefined) {
            sign = '';
        }
        $('#mainPanel').append(
            '<div class="btn-group margin-inline">' +
                '<div class="btn-group">' +
                    '<button style="cursor: auto" class="btn btn-rounded btn-sm btn-success">' + prerequisite + ': ' + sign + value + '</button>' +
                '</div>' +
                '<div class="btn-group">' +
                    '<button class="btn btn-rounded btn-sm btn-danger-outline delete">' +
                        '<i class="icmn-minus"></i>' +
                        '<input class="prerequisite-id" type="hidden" value="' + url + '"/> ' +
                    '</button>' +
                '</div>' +
            '</div>'
        )
    }

    $('#mainPanel').on('click', '.delete', function () {
        var url = this.querySelectorAll('.prerequisite-id')[0].value;

        $http.delete(url).then(function () {
            recalculateTables();
        });
    });

    $http.get('/attributes').then(function (response) {
        $scope.attributes = response.data.data;
    });

    $http.get('/attachedSkills').then(function (response) {
        $scope.attachedSkills = response.data.data;
    });

    $http.get('/triggerSkills').then(function (response) {
        $scope.triggerSkills = response.data.data;
    });

    $http.get('/inherents').then(function (response) {
        $scope.inherents = response.data.data;
    });

    $http.get('/flaws').then(function (response) {
        $scope.flaws = response.data.data;
    });

    $http.get('/merits').then(function (response) {
        $scope.merits = [];
        angular.forEach(response.data.data, function (merit) {
            if (merit.id.toString() !== meritId) {
                $scope.merits.push(merit);
            }
        });
    });

    $scope.createPrerequisite = function () {
        switch (parseInt($scope.type)) {
            case 1:
                $http.post('/meritAttributes', {
                    merit_id: meritId,
                    attribute_id: $scope.attribute_id,
                    value: $scope.value
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 2:
                $http.post('/meritAttachedSkills', {
                    merit_id: meritId,
                    attached_skill_id: $scope.attached_skill_id,
                    value: $scope.value
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 3:
                $http.post('/meritAttributeAttachedSkills', {
                    merit_id: meritId,
                    attribute_id: $scope.attribute_id,
                    attached_skill_id: $scope.attached_skill_id,
                    value: $scope.value
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 4:
                $http.post('/meritTriggerSkills', {
                    merit_id: meritId,
                    attached_skill_id: $scope.trigger_skill_id,
                    level: $scope.level
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 5:
                $http.post('/meritInherents', {
                    merit_id: meritId,
                    inherent_id: $scope.inherent_id,
                    lessMoreEqual: $scope.lessMoreEqual,
                    value: $scope.inherentValue
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 6:
                $http.post('/meritMerits', {
                    merit_id: meritId,
                    prerequisite_merit_id: $scope.merit_id,
                    presentAbsent: $scope.presentAbsent
                }).then(function () {
                    recalculateTables();
                });
                break;
            case 7:
                $http.post('/meritFlaws', {
                    merit_id: meritId,
                    flaw_id: $scope.flaw_id,
                    presentAbsent: $scope.presentAbsent
                }).then(function () {
                    recalculateTables();
                });
                break;
        }
    };

    $scope.isInherentValueRequired = false;

    $scope.isValuePresent = function () {
        $http.get('/inherents/' + $scope.inherent_id).then(function (response) {
            $scope.isInherentValueRequired = response.data.inherent.max_limit !== null && response.data.inherent.min_limit !== null;
        });
    };
});