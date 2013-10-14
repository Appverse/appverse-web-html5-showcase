'use strict';

/* 
 * It is needed to add the ui.bootstrap module 
 * as a dependency to the Angular modules.
 */
//angular.module('appverseClientIncubatorApp', ['ui.bootstrap'])
//  .config(function ($routeProvider) {
//    $routeProvider
//      .when('/', {
//        templateUrl: 'views/main.html',
//        controller: 'MainShowIntro'
//      })
//      .otherwise({
//        redirectTo: '/'
//      });
//  });
  
// Make sure to include the `ui.router` module as a dependency
angular.module('appverseClientIncubatorApp', ['ui.bootstrap', 'ui.router'])
    .run(['$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }]);
