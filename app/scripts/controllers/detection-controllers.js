'use strict';

/*
 * Controllers for detection demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('detectionController', ['$log', '$scope', 'DetectionFactory',
    function ($log, $scope, DetectionFactory) {
        $log.debug('detectionController loading');

        $scope.detect = DetectionFactory;
    }]);
