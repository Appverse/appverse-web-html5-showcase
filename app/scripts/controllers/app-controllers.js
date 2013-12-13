'use strict';

/*
 * Controllers for development topics management.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('appverseClientIncubatorApp')

.controller('TopicsController', ['$log', '$scope', '$state', '$stateParams', 'utils', 'RESTFactory',
    function ($log, $scope, $state, $stateParams, utils, RESTFactory) {

        $scope.alltopics = RESTFactory.readList('topics.json');

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

        $scope.findById = function (object, id) {
            //            $log.debug('object', object);
            //            $log.debug('id', id);
            if (object) {
                return utils.findById(object, id);
            }
        };
    }])

.controller('TopicDetailsController',
    function ($log) {
        $log.debug('TopicDetailsController loading...');
    })

.controller('TopicDetailsItemController',
    function ($scope, $stateParams, $state) {

        $scope.getSelectedItem = function () {
            if ($scope.topic) {
                return $scope.findById($scope.topic.items, $stateParams.itemId);
            }
        };

        $scope.edit = function () {
            // Here we show off go's ability to navigate to a relative state. Using '^' to go upwards
            // and '.' to go down, you can navigate to any relative state (ancestor or descendant).
            // Here we are going down to the child state 'edit' (full name of 'topics.detail.item.edit')
            $state.go('.edit', $stateParams);
        };
    })

.controller('TopicDetailsItemEditController',
    function ($log, $scope, $stateParams, $state, Restangular) {

        $scope.getSelectedItem = function () {
            if ($scope.topic) {
                return $scope.findById($scope.topic.items, $stateParams.itemId);
            }
        };

        $scope.done = function () {
            // Go back up. '^' means up one. '^.^' would be up twice, to the grandparent.

            Restangular.copy($scope.topic).put();

            $state.go('^', $stateParams);
        };
    })

.controller('cacheController',
    function () {
        console.log('cacheController loading');
    })

.controller('translationController', ['$scope', '$translate', 'tmhDynamicLocale',
    function ($scope, $translate, tmhDynamicLocale) {

        $scope.now = new Date();
        $scope.name = 'Alicia';
        $scope.age = '25';

        $scope.setLocale = function (locale) {
            $translate.uses(locale);
            tmhDynamicLocale.set(locale.toLowerCase());
        };
    }]);
