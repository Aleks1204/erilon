(function (i) {
    var e = /iPhone/i, n = /iPod/i, o = /iPad/i, t = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, r = /Android/i, d = /BlackBerry/i, s = /Opera Mini/i, a = /IEMobile/i, b = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, h = RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"), c = function (i, e) {
        return i.test(e)
    }, l = function (i) {
        var l = i || navigator.userAgent;
        this.apple = {
            phone: c(e, l),
            ipod: c(n, l),
            tablet: c(o, l),
            device: c(e, l) || c(n, l) || c(o, l)
        }, this.android = {
            phone: c(t, l),
            tablet: !c(t, l) && c(r, l),
            device: c(t, l) || c(r, l)
        }, this.other = {
            blackberry: c(d, l),
            opera: c(s, l),
            windows: c(a, l),
            firefox: c(b, l),
            device: c(d, l) || c(s, l) || c(a, l) || c(b, l)
        }, this.seven_inch = c(h, l), this.any = this.apple.device || this.android.device || this.other.device || this.seven_inch
    }, v = i.isMobile = new l;
    v.Class = l
})(window);

var app = angular.module("spells", ['ngStorage']);

app.controller("spellsController", function ($scope, $http) {
    $scope.loader = false;
    $scope.isMobile = isMobile.android.phone;
    $scope.instant = false;
    $scope.mana_sup_time = 'в раунд';

    $scope.schools = [];

    $http.get('/attachedSkills').
    success(function (data) {
        angular.forEach(data.attachedSkills, function (attachedSkill) {
            if (attachedSkill.spells_connected) {
                $scope.schools.push(attachedSkill);
            }
        });
    });

    $scope.setCreatingComplexity = function () {
        $scope.creating_complexity = $scope.complexity;
    };

    $scope.setSchool = function (id) {
        $scope.attached_skill_id = id;
    };

    $scope.addSpell = function () {
        $http.post('/spells', {
            name: $scope.name,
            attached_skill_id: $scope.attached_skill_id,
            complexity: $scope.complexity,
            creating_complexity: $scope.creating_complexity,
            mana: $scope.mana,
            mana_support: $scope.mana_support,
            mana_sup_time: $scope.mana_sup_time,
            cost: $scope.cost,
            instant: $scope.instant,
            effect: $scope.effect,
            description: $scope.description
        }).success(function (data) {
            location.reload();
        });
    };

    $scope.deleteSpell = function (id) {
        $http.delete('/spells/' + id).
        success(function (data) {
            location.reload();
        });
    };

});