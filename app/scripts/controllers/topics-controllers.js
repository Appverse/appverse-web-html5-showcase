/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf.
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

/*
 * Controllers for development topics management.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

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
