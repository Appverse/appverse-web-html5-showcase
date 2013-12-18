'use strict';

/*
 * Controllers for development topics management.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('TopicsController', ['$log', '$scope', '$state', '$stateParams', 'utils', 'RESTFactory',
        function ($log, $scope, $state, $stateParams, utils, RESTFactory) {

        $scope.alltopics = RESTFactory.readList('topics');

        $scope.goToRandom = function () {
            if ($scope.topics) {
                var randId = utils.newRandomKey($scope.topics, 'id', $state.params.topicId);

                // $state.go() can be used as a high level convenience method
                // for activating a state programmatically.
                $state.go('topics.detail', {
                    topicId: randId
                });
            } else {
                $scope.topicsError = true;
            }
        };
    }])

.controller('TopicDetailsItemController',
    function ($scope, $stateParams, $state) {

        $scope.edit = function () {
            // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
            // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
            // Here we are going down to the child state 'edit' (full name of 'topics.detail.item.edit')
            $state.go('.edit', $stateParams);
        };
    })

.controller('TopicDetailsItemEditController',
    function ($log, $scope, $stateParams, $state, Restangular) {

        $scope.done = function () {

            $log.debug("Updating item", $scope.item);

            Restangular.copy($scope.item).put().then(function () {

                // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.
                $state.go('^', $stateParams);
            });
        };
    });
