'use strict';

/*
 * Controllers for detection demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('detectionController', ['$log', '$scope', 'Detection',
    function ($log, $scope, Detection) {
        $log.debug('detectionController loading');

        $scope.detect = Detection;

        Detection.testOnlineStatus();
        Detection.testBandwidth();
    }]);
