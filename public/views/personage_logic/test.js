
function DialogCtrl ($mdDialog, valuesForFilter) {
    // list of `state` value/display objects
    this.values        = loadAll();
    this.querySearch   = querySearch;
    // ******************************
    // Template methods
    // ******************************
    this.cancel = function() {
        $mdDialog.cancel();
    };
    this.finish = function() {
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
                display: value.name
            };
        });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };
    }
}