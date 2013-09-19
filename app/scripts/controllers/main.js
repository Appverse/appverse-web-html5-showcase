'use strict';

angular.module('appverseClientIncubatorApp')
  .controller('MainShowIntro', function ($scope) {
    $scope.issuesList = [
      'Security',
      'Integration to external systems',
      'Styling management',
      'Client/Server communication',
      'Performance',
      'Document Management',
      'Decoupled Application Configuration',
      'Testing',
      'and other important aspects'
    ];
  });
