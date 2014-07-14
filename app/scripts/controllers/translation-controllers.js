'use strict';

/*
 * Controllers for translation demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('translationController', ['$scope', '$translate', '$log', 'tmhDynamicLocale',
        function ($scope, $translate, $log, tmhDynamicLocale) {

        $scope.now = new Date();
        $scope.name = 'Alicia';
        $scope.age = '25';

        $scope.setLocale = function (locale) {
            $log.debug("LOCALE: " + locale);
            $translate.use(locale);
            tmhDynamicLocale.set(locale.toLowerCase());
        };
    }]);
