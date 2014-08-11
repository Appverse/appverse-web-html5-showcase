'use strict';

//////////////////////// COMMON API - MAIN //////////////////////////
// The Main module includes other API modules:
// - Bootstrap-based styling and gadgets
// - Routing
// - External Configuration
// - REST Integration
// - Cache Service
// - ServerPush
// - Security
// - Internationalization
// - Logging
/////////////////////////////////////////////////////////////////////


/* Optional modules initialization */
var optionalModules = ['xeditable', 'ja.qr', 'vr.directives.slider', 'ui.bootstrap', 'AppDetection', 'AppREST', 'AppTranslate', 'AppModal', 'AppLogging', 'AppServerPush'];

angular.forEach(optionalModules, function (element) {
    try {
        angular.module(element);
    } catch (e) {
        angular.module(element, []);
    }
});

/* Main module */
angular.module('COMMONAPI', optionalModules.concat(['ui.router', 'AppCache', 'AppConfiguration', 'jqm', 'AppSecurity', 'AppPerformance']))

.run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }])

.config(['$compileProvider',
    function ($compileProvider) {

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|itms-services):/);
        }]);
