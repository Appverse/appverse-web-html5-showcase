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
/* globals Modernizr:false */

/*
 * Controllers for server messages demo.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('serverPushController', ['$scope', '$log', 'SocketFactory',
        function ($scope, $log, SocketFactory) {
        //Checks if the initial stock data set is displayed.
        var loaded = false;

        /*
             Listening the error event from the serverpush module.
             */
        $scope.$on('socket:error', function (eventName, data) {
            $log.error("Error in socket.io client | Event: " + eventName + ", Data: " + data);
        });

        /*
             Listening the destroy event of the current scope.
             So, communication is bound to the current scope and ends when the scope is destroyed.
             */
        $scope.$on('$destroy', function () {
            SocketFactory.unsubscribeCommunication(function (s) {
                $log.debug("Disconnected from server when the scope was destroyed: " + s);
            });
        });

        /*
             This function starts communication with server:
             1-requestData sends handshake to server as first communication
             2-initExchangeData populates the table
             3-exchangeData retrieves pushed data from server with changes into the table
             */
        $scope.startPush = function () {
            /*
                 Optional
                 It stops communication after 10 seconds
                 */
            //            setInterval(
            //                function(){
            //                    SocketFactory.unsubscribeCommunication(function() {
            //                        $log.debug("Disconnected from server after 10 seconds.");
            //                    });
            //                },10000);


            /*
                 Initializes communication to server
                 */
            SocketFactory.sendMessage('requestData', {}, function () {
                console.log("Requested Data to server.");
            });


            /*
                 Retrieves the initial data set.
                 The callback is attaching the stock data to the scope.
                 */
            SocketFactory.listen('initExchangeData', function (data) {
                $scope.stocks = data.exchangeData;
                loaded = true;
            });

            /*
                 Retrieves updates for the data set.
                 The callback is updating the stock data in the scope.
                 */
            SocketFactory.listen('exchangeData', function (deltas) {
                if (loaded) {
                    changeValue(deltas);

                    console.log('TP|data.exchangeData.st: ' + deltas.st);
                    //                    console.log('TP|data.exchangeData.tp: ' + deltas.tp);
                    //                    console.log('TP|data.exchangeData.tv: ' + deltas.tv);
                    //
                    //                    console.log('TP|data.exchangeData.b1p: ' + deltas.b1p);
                    //                    console.log('TP|data.exchangeData.b2p: ' + deltas.b2p);
                    //                    console.log('TP|data.exchangeData.b3p: ' + deltas.b3p);
                    //                    console.log('TP|data.exchangeData.b4p: ' + deltas.b4p);
                    //                    console.log('TP|data.exchangeData.b5p: ' + deltas.b5p);
                    //
                    //                    console.log('TP|data.exchangeData.b1v: ' + deltas.b1v);
                    //                    console.log('TP|data.exchangeData.b2v: ' + deltas.b2v);
                    //                    console.log('TP|data.exchangeData.b3v: ' + deltas.b3v);
                    //                    console.log('TP|data.exchangeData.b4v: ' + deltas.b4v);
                    //                    console.log('TP|data.exchangeData.b5v: ' + deltas.b5v);
                    //
                    //                    console.log('TP|data.exchangeData.a1p: ' + deltas.a1p);
                    //                    console.log('TP|data.exchangeData.a2p: ' + deltas.a2p);
                    //                    console.log('TP|data.exchangeData.a3p: ' + deltas.a3p);
                    //                    console.log('TP|data.exchangeData.a4p: ' + deltas.a4p);
                    //                    console.log('TP|data.exchangeData.a5p: ' + deltas.a5p);
                    //
                    //                    console.log('TP|data.exchangeData.a1v: ' + deltas.a1v);
                    //                    console.log('TP|data.exchangeData.a2v: ' + deltas.a2v);
                    //                    console.log('TP|data.exchangeData.a3v: ' + deltas.a3v);
                    //                    console.log('TP|data.exchangeData.a4v: ' + deltas.a4v);
                    //                    console.log('TP|data.exchangeData.a5v: ' + deltas.a5v);
                }
            });
        };

        $scope.endPush = function () {
            $log.debug("The user has tried to stop server push communication.");
            SocketFactory.unsubscribeCommunication(function () {
                $log.debug("Disconnected from server for pushing purposes.");
            });

        };

        // -----------------
        // Private helpers
        // -----------------

        /*
             Updates the specific stock price/value pair
             */
        var changeValue = function (deltas) {
            var i;
            for (i = 0; i < $scope.stocks.length; i++) {
                if ($scope.stocks[i].st === deltas.st) {

                    $scope.stocks[i].tp = deltas.tp;
                    $scope.stocks[i].tv = deltas.tv;

                    $scope.stocks[i].b1p = deltas.b1p;
                    $scope.stocks[i].b2p = deltas.b2p;
                    $scope.stocks[i].b3p = deltas.b3p;
                    $scope.stocks[i].b4p = deltas.b4p;
                    $scope.stocks[i].b5p = deltas.b5p;

                    $scope.stocks[i].b1v = deltas.b1v;
                    $scope.stocks[i].b2v = deltas.b2v;
                    $scope.stocks[i].b3v = deltas.b3v;
                    $scope.stocks[i].b4v = deltas.b4v;
                    $scope.stocks[i].b5v = deltas.b5v;

                    $scope.stocks[i].a1p = deltas.a1p;
                    $scope.stocks[i].a2p = deltas.a2p;
                    $scope.stocks[i].a3p = deltas.a3p;
                    $scope.stocks[i].a4p = deltas.a4p;
                    $scope.stocks[i].a5p = deltas.a5p;

                    $scope.stocks[i].a1v = deltas.a1v;
                    $scope.stocks[i].a2v = deltas.a2v;
                    $scope.stocks[i].a3v = deltas.a3v;
                    $scope.stocks[i].a4v = deltas.a4v;
                    $scope.stocks[i].a5v = deltas.a5v;
                }
            }
        };

    }])

.controller('wsController_CPU', ['$scope', '$log', 'WebSocketFactory', 'WEBSOCKETS_CONFIG',
        function ($scope, $log, WebSocketFactory, WEBSOCKETS_CONFIG) {

        $scope.wsSupported = Modernizr.websockets;
        $scope.wsIsSupportedMessage = WEBSOCKETS_CONFIG.WS_SUPPORTED;
        $scope.wsIsNotSupportedMessage = WEBSOCKETS_CONFIG.WS_NOT_SUPPORTED;
        $scope.wsf = WebSocketFactory;

        //Making loading spinner disappear
        $('#load_statistics_loading').hide();
        $('#load_statistics_content').show();

        var options = {
            series: {
                shadowSize: 1
            },
            lines: {
                show: true,
                lineWidth: 0.5,
                fill: true,
                fillColor: {
                    colors: [{
                            opacity: 0.1
                    }, {
                            opacity: 1
                    }
                    ]
                }
            },
            yaxis: {
                min: 0,
                max: 100,
                tickFormatter: function (v) {
                    return v + "%";
                }
            },
            xaxis: {
                show: false
            },
            colors: ["#6ef146"],
            grid: {
                tickColor: "#a8a3a3",
                borderWidth: 0
            }
        };

        var data = [];
        var totalPoints = 250;

        // random data generator for plot charts

        function getRandomData() {
                if (data.length > 0) data = data.slice(1);
                // do a random walk
                while (data.length < totalPoints) {
                    var prev = data.length > 0 ? data[data.length - 1] : 50;
                    var y = 0;
                    if (y < 0) y = 0;
                    if (y > 100) y = 100;
                    data.push(0);
                }
                // zip the generated y values with the x values
                var res = [];
                for (var i = 0; i < data.length; ++i) res.push([i, data[i]])
                return res;
            }
            // random data generator for plot charts

        function getCPUData() {
            if (data.length > 0) data = data.slice(1);
            // do a random walk
            while (data.length < totalPoints) {
                var prev = data.length > 0 ? data[data.length - 1] : 50;
                var y = 0;
                if (y < 0) y = 0;
                if (y > 100) y = 100;
                data.push(0);
            }
            // zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) res.push([i, data[i]])
            return res;
        }

        var plot = $.plot($("#load_statistics"), [getRandomData()], options);


        $scope.status = 'No connection.';

        $scope.start = function () {


            $scope.status = 'Connecting...';

            WebSocketFactory.subscribe(function (message) {

                //if (message && message.charAt(0) === '{' && JSON) {
                var a = JSON.parse(message);
                data.push(a);
                plot.setData([getCPUData()]);
                plot.draw();
                /*} else {
                    $log.debug('Websocket message:', message);
                }*/
            });
            WebSocketFactory.connect(WEBSOCKETS_CONFIG.WS_CPU_URL);

            WebSocketFactory.ws.onopen = function (event) {
                $log.debug(event);
                WebSocketFactory.ws.send('');
                $scope.status = 'Connection opened!';
                $scope.$digest();
            };

            WebSocketFactory.ws.onerror = function (event) {
                $log.debug(event);
                $scope.status = 'Connection error.';
                $scope.$digest();
            };

            WebSocketFactory.ws.onclose = function (event) {
                $log.debug(event);
                $scope.status = 'Connection closed.';
                WebSocketFactory.ws = null;
                $scope.$digest();
            };
        };

        $scope.stop = function () {
            WebSocketFactory.disconnect();
            $scope.status = 'Disconnecting...';
        };
}]);
