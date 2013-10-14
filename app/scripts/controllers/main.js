'use strict';

angular.module('appverseClientIncubatorApp')
  .controller('TopicsController', 
      function ($scope,   $state,   topics,   utils) {
                // Add a 'topics' field in this abstract parent's scope, so that all
                // child state views can access it in their scopes. Please note: scope
                // inheritance is not due to nesting of states, but rather choosing to
                // nest the templates of those states. It's normal scope inheritance.
                $scope.topics = topics;

                $scope.goToRandom = function () {
                  var randId = utils.newRandomKey($scope.topics, "id", $state.params.topicId);

                  // $state.go() can be used as a high level convenience method
                  // for activating a state programmatically.
                  $state.go('topics.detail', { topicId: randId });
                };
  });
