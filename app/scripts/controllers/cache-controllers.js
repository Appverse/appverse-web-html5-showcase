'use strict';

/*
 * Controllers for cache demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('cacheController', ['$log',
    function ($log) {
        $log.debug('cacheController loading');
    }])

.controller('cacheState1Controller', ['$log',
    function ($log) {
        $log.debug('cacheState1Controller loading');
    }])

.controller('cacheState2Controller', ['$log',
    function ($log) {
        $log.debug('cacheState2Controller loading');
    }]);
