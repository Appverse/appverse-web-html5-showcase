'use strict';
  
// Make sure to include dependencies.
angular.module('appverseClientIncubatorApp', ['ui.bootstrap', 'ui.router','CacheService'])
    .run(['$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }]);
  
/*
* Factory Name: 'CacheService'
* 
* Based on $cacheFactory, creates a cache called CacheService.
* Use it to communicate data across different scopes.
* 1-Put data in cache: CacheService.put(1,'value-1');
* 2-Retrieve data from cache: CacheService.get(1);
*/
angular.module('CacheService', ['ng'])
    .factory('CacheService', function($cacheFactory) {
    return $cacheFactory('CacheService');
});
    
