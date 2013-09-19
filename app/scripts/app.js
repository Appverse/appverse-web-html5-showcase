'use strict';

/* 
 * It is needed to add the ui.bootstrap module 
 * as a dependency to the Angular modules.
 */
angular.module('appverseClientIncubatorApp', ['ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainShowIntro'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
