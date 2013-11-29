'use strict';

/*
 * Controllers for development topics management.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
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
  })
 .controller('TopicDetailsController',
      function (  $scope,   $stateParams,   utils) {
                    $scope.topic = utils.findById($scope.topics, $stateParams.topicId);
                })
 .controller('TopicDetailsItemController',
      function (  $scope,   $stateParams,   $state,   utils) {
                    $scope.item = utils.findById($scope.topic.items, $stateParams.itemId);

                    $scope.edit = function () {
                      // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
                      // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
                      // Here we are going down to the child state 'edit' (full name of 'topics.detail.item.edit')
                      $state.go('.edit', $stateParams);
                    };
                  })
.controller('TopicDetailsItemEditController',
     function (  $scope,   $stateParams,   $state,   utils) {
                    $scope.item = utils.findById($scope.topic.items, $stateParams.itemId);
                    $scope.done = function () {
                      // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                      $state.go('^', $stateParams);
                    };
                  })

.controller('translationController', ['$scope', '$translate',
     function ( $scope, $translate ) {

                    $scope.now = new Date();
                    $scope.name = 'Alex';
                    $scope.age = '20';

                    $scope.setLocale = function(locale) {
                        $translate.uses(locale);
                    };
                  }]);
