'use strict';

angular.module('App.Controllers')

.controller('mobileController', ['$log', '$scope', 'Detection',
        function ($log, $scope, Detection) {

        $scope.isMobile = Detection.hasAppverseMobile || Detection.isMobileBrowser;
    }]);
