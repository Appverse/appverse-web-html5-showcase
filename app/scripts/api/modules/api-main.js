'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COMMON API - MAIN
// The Main module includes other API modules:
// - UI Bootstrap
// - UI Router
// - REST Integration
// - Cache Service
// - Feature Detection
// - ServerPush
// - Security
// - Internationalization
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////
angular.module('COMMONAPI', ['ui.bootstrap', 'ui.router', 'AppCache', 'AppConfiguration', 'AppDetection', 'AppLogging', 'AppREST', 'AppSecurity', 'AppServerPush', 'AppTranslate'])
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }]);
