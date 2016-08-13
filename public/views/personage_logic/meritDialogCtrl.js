function MeritDialogCtrl($mdDialog, meritsForFilter, addMeritFunction, validationFunction) {
    // list of `state` value/display objects
    this.values = loadAll();
    var self = this;
    self.meritAvailable = true;
    this.querySearch = querySearch;
    this.selectedItemChange = selectedItemChange;
    // ******************************
    // Template methods
    // ******************************
    this.cancel = function () {
        $mdDialog.cancel();
    };
    this.finishMerit = function (merit) {
        addMeritFunction(merit);
        $mdDialog.hide();
    };

    function selectedItemChange(item) {
        if (item != null) {
            validationFunction(item).then(function (result) {
                self.meritAvailable = result.meritAvailable;
            });

        }
    }

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for values... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        return query ? this.values.filter(createFilterFor(query)) : this.values;
    }

    /**
     * Build `values` list of key/value pairs
     */
    function loadAll() {
        return meritsForFilter.map(function (merit) {
            return merit;
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            var index = item.name.toLowerCase().indexOf(lowercaseQuery);
            return (index === 0);
        };
    }
}