/**
 * Created by artemk on 3/24/16.
 */
"use strict";

app.controller("personageAttributesController", function ($scope) {
    $scope.increaseAttribute = function (id) {
        $scope.loader = true;
        var maxPrice = 8;
        var isPrimaryAttributeSet = false;
        var isSecondaryAttributeSet = 0;

        angular.forEach($scope.raceAttributes, function (raceAttribute) {
            angular.forEach($scope.personageAttributes, function (personageAttribute) {
                if (raceAttribute.Attribute.id == personageAttribute.Attribute.id) {
                    if (personageAttribute.value > maxPrice - raceAttribute.base_cost) {
                        isSecondaryAttributeSet++;
                    }
                    if (personageAttribute.value > maxPrice - raceAttribute.base_cost + 1) {
                        isPrimaryAttributeSet = true;
                    }
                }
            });
        });


        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (personageAttribute.id == id) {
                angular.forEach($scope.raceAttributes, function (raceAttribute) {
                    if (raceAttribute.Attribute.id == personageAttribute.Attribute.id && personageAttribute.value < maxPrice - raceAttribute.base_cost + 2) {
                        if (personageAttribute.value < maxPrice - raceAttribute.base_cost) {
                            personageAttribute.value++;
                            $scope.personage.experience = $scope.personage.experience - raceAttribute.base_cost;
                        } else {
                            if (personageAttribute.value == maxPrice - raceAttribute.base_cost + 1) {
                                if (!isPrimaryAttributeSet) {
                                    personageAttribute.value++;
                                    $scope.personage.experience = $scope.personage.experience - raceAttribute.base_cost;
                                }
                            } else {
                                if (isSecondaryAttributeSet < 3) {
                                    personageAttribute.value++;
                                    $scope.personage.experience = $scope.personage.experience - raceAttribute.base_cost;
                                }
                            }
                        }
                    }
                });
            }
        });

        $scope.recalculateBasicCharacteristics();
        $scope.loader = false;
    };

    $scope.decreaseAttribute = function (id) {
        $scope.loader = true;
        $scope.confirmDecrease = true;
        angular.forEach($scope.personageAttributes, function (personageAttribute) {
            if (personageAttribute.id == id && personageAttribute.value > 1) {
                angular.forEach($scope.personageMerits, function (personageMerit) {
                    angular.forEach(personageMerit.Merit.MeritAttributes, function (meritAttribute) {
                        if (personageAttribute.Attribute.id == meritAttribute.Attribute.id) {
                            if (personageAttribute.value <= meritAttribute.value) {
                                $scope.showConfirmDeletePersonagMerit(personageMerit);
                            }
                        }
                    });

                    angular.forEach(personageMerit.Merit.MeritAttributeAttachedSkills, function (meritAttributeAttachedSkill) {
                        if (personageAttribute.Attribute.id == meritAttributeAttachedSkill.Attribute.id) {
                            angular.forEach($scope.personageAttachedSkills, function (personageAttachedSkill) {
                                if (personageAttachedSkill.AttachedSkill.id == meritAttributeAttachedSkill.AttachedSkill.id) {
                                    if (personageAttachedSkill.value + personageAttribute.value <= meritAttributeAttachedSkill.value) {
                                        $scope.showConfirmDeletePersonagMerit(personageMerit);
                                    }
                                }
                            });
                        }
                    });
                });

                if ($scope.confirmDecrease) {
                    personageAttribute.value--;
                    angular.forEach($scope.raceAttributes, function (raceAttribute) {
                        if (raceAttribute.Attribute.id == personageAttribute.Attribute.id) {
                            $scope.personage.experience = $scope.personage.experience + raceAttribute.base_cost;
                        }
                    });
                }
            }
        });
        $scope.recalculateBasicCharacteristics();
        $scope.loader = false;
    };

    $scope.showConfirmDeletePersonagMerit = function(personageMerit) {
        var confirm = $mdDialog.confirm()
            .title('Подтверждение удаления достоинства')
            .textContent('Данное изменение приведет к удалению достоинства ' + personageMerit.Merit.name + ' так как достоиснтво иммет пререквизиты')
            .ok('Удалить и изменить')
            .cancel('Оставить');
        $mdDialog.show(confirm).then(function() {
            $scope.deletePersonageMerit(personageMerit);
        }, function() {
            $scope.confirmDecrease = false;
        });
    };

});
