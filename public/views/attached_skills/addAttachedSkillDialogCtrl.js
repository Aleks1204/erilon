function AddDialogCtrl($mdDialog, $http) {
    var self = this;
    self.difficult = false;
    self.theoretical = false;
    self.default_skill = false;
    self.spells_connected = false;

    this.cancel = function () {
        $mdDialog.cancel();
    };
    this.save = function () {
        $http.post('/attachedSkills', {
            name: self.attachedSkill_name,
            category: self.category,
            description: self.description,
            difficult: self.difficult,
            theoretical: self.theoretical,
            default_skill: self.default_skill,
            spells_connected: self.spells_connected
        }).success(function (data) {
            $mdDialog.hide();
            location.reload();
        });
    };
}