'use strict';

angular.module('appverseClientIncubatorApp')

.controller('mobileController', ['$log', '$scope', 'Detection',
        function ($log, $scope, Detection) {

        $scope.isMobile = Detection.hasAppverseMobile || Detection.isMobileBrowser;
    }]);
