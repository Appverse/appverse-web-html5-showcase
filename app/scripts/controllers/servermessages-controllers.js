'use strict';

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

.controller('wsController_ECHO', ['$scope', '$log', 'WebSocketFactory', 'WEBSOCKETS_CONFIG',
        function ($scope, $log, WebSocketFactory, WEBSOCKETS_CONFIG) {

            $scope.endpointURL = WEBSOCKETS_CONFIG.WsUrl;
            $scope.connStatus;
            $scope.messages = [];
            $scope.wsSupported = Modernizr.websockets;
            $scope.status = WebSocketFactory.statusAsText();
            $scope.wsIsSupportedMessage = WEBSOCKETS_CONFIG.WS_SUPPORTED;
            $scope.wsIsNotSupportedMessage = WEBSOCKETS_CONFIG.WS_NOT_SUPPORTED;

            function updateStatus(){
                $scope.status = WebSocketFactory.statusAsText();
            };

            WebSocketFactory.subscribe(function(message) {
                $scope.messages.push(message);
                updateStatus();
                $scope.$apply();
            });

            /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#connect
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {string} itemId The id of the item
            @description Establishes a connection to the swebsocket endpoint.
            */
            $scope.connect = function() {
                WebSocketFactory.connect();
                updateStatus();
                $log.debug("Connected TO the websockets peer server.");
            }


            $scope.send = function() {
                 WebSocketFactory.send($scope.text);
                 $log.debug("Sent message '" + $scope.text + "' to websockets peer server.");
            }

            /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#disconnect
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {string} itemId The id of the item
            @description Close the WebSocket connection.
            */
            $scope.disconnect = function () {
                WebSocketFactory.disconnect();
                updateStatus();
                $log.debug("Disconnected FROM the websockets peer server.");
            };

            $scope.$watch('status', function(newValue, oldValue) {
                $scope.status = newValue;
                $log.debug('OLD STATUS' + oldValue);
                $log.debug('NEW STATUS' + newValue);
            });




}])


.controller('wsController_CPU', ['$scope', '$log', 'WebSocketFactory', 'WEBSOCKETS_CONFIG',
        function ($scope, $log, WebSocketFactory, WEBSOCKETS_CONFIG) {
            var ws;
            $scope.showButton = true;
            $scope.wsSupported = Modernizr.websockets;
            $scope.wsIsSupportedMessage = WEBSOCKETS_CONFIG.WS_SUPPORTED;
            $scope.wsIsNotSupportedMessage = WEBSOCKETS_CONFIG.WS_NOT_SUPPORTED;

            $scope.stats = function(){
                    $scope.showButton = false;
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

                    //var updateInterval = 30;
                    var updateInterval = WEBSOCKETS_CONFIG.WS_CPU_INTERVAL;

                    var plot = $.plot($("#load_statistics"), [getRandomData()], options);

                    WebSocketFactory.subscribe(function(message) {
                        if(event.data && JSON){
                            var a= JSON.parse(event.data);
                            var res = plot.getData();
                            while(res.length<249){
                                res.push([0,0]);
                            }
                            while(res.length>250){
                                res.shift();
                            }
                            for (var i = 0; i <a.data.length; ++i){
                                res.push([i, a.data[i].value]);
                            }
                            plot.setData([res]);
                            plot.draw();
                        }


                        //$scope.$apply();
                    });

                    function echo() {
                        if (ws != null) {
                            ws.send('');
                        } else {
                            alert('WebSocket connection not established, please connect.');
                        }
                    }

                    function update() {
                        plot.setData([getRandomData()]);
                        plot.draw();
                        setTimeout(update, updateInterval);
                    }
                    WebSocketFactory.connect(WEBSOCKETS_CONFIG.WS_CPU_URL);


            };

}]);
