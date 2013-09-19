'use strict';

angular.module('appverseClientIncubatorApp', [])
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
