function UpdateDialogCtrl($mdDialog, $http, attachedSkill) {
    var self = this;
    self.attachedSkill_name = attachedSkill.name;
    self.description = attachedSkill.description;
    self.difficult = attachedSkill.difficult;
    self.theoretical = attachedSkill.theoretical;
    self.default_skill = attachedSkill.default_skill;
    self.spells_connected = attachedSkill.spells_connected;

    this.cancel = function () {
        $mdDialog.cancel();
    };
    this.save = function () {
        $http.put('/attachedSkills/' + attachedSkill.id, {
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