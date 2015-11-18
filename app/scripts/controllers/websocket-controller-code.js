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
angular.module('App.Controllers')

.controller('WebsocketController',
    function($scope, WebSocketFactory, $log) {
        'use strict';

        var subscription, lastMessage;

        WebSocketFactory.open('https://appverse.gftlabs.com/websockets/services/websocket/stats');

        WebSocketFactory.connect('user', 'password', function(frame) {

            $log.debug('connected', frame);
        });

        $scope.labels = [];
        $scope.series = ['CPU %'];
        $scope.data = [
            []
        ];
        $scope.options = {
            animation: false
        };

        $scope.values = {
            last: 10
        };

        $scope.start = function() {

            subscription = WebSocketFactory.subscribe("/cpu", function(message) {

                var now = new Date();

                if (!lastMessage || now.getTime() - lastMessage > 700) {

                    $scope.labels.push(now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds());
                    $scope.data[0].push(parseFloat(message.body));

                    if ($scope.labels.length > $scope.values.last) {
                        var diff = $scope.labels.length - $scope.values.last;
                        $scope.labels.splice(0, diff);
                        $scope.data[0].splice(0, diff);
                    }
                    $scope.$applyAsync();
                    lastMessage = now.getTime();
                }
            });
        };

        $scope.stop = function() {
            if (subscription) {
                subscription.unsubscribe();
            }
        };

        $scope.$on('$destroy', function() {

            $log.debug('$destroy');

            $scope.stop();
            WebSocketFactory.client.disconnect(function() {
                $log.debug('disconnected');
                WebSocketFactory.client = null;
            });
            WebSocketFactory.close();
            WebSocketFactory.ws = null;
        });
    });
