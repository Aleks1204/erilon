
function DialogCtrl ($mdDialog, valuesForFilter, addItemFunction) {
    // list of `state` value/display objects
    this.values        = loadAll();
    this.querySearch   = querySearch;
    // ******************************
    // Template methods
    // ******************************
    this.cancel = function() {
        $mdDialog.cancel();
    };
    this.finish = function(id) {
        addItemFunction(id);
        $mdDialog.hide();
    };
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for values... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
        return query ? this.values.filter( createFilterFor(query) ) : this.values;
    }
    /**
     * Build `values` list of key/value pairs
     */
    function loadAll() {
        return valuesForFilter.map( function (value) {
            return {
                value: value.name.toLowerCase(),
                display: value.name,
                id: value.id
            };
        });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) !== -1);
        };
    }
}