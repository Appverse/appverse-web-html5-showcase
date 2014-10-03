'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SERVER PUSH CLIENT
// PRIMARY MODULE (AppServerPush)
////////////////////////////////////////////////////////////////////////////


/**
* @ngdoc module
* @name AppServerPush
* @description
* This module handles server data communication when it pushes them to the client
* exposing the factory SocketFactory, which is an API for instantiating sockets
* that are integrated with Angular's digest cycle.
* It is now based on SocketIO (http://socket.io/). Why?
*
* Using WebSockets is a modern, bidirectional protocol that enables an interactive communication
* session between the browser and a server. Its main current drawback is
* that implementation is generally only available in the latest browsers. However, by
* using Socket.IO, this low level detail is abstracted away and we, as programmers,
* are relieved of the need to write browser-specific code.
*
* The current release of socket.io is 0.9.10.
*
* The module AppServerPush is included in the main module.
*
* The private module AppSocketIO simply wraps SocketIO API to be used by AppServerPush.
*
* So, AppServerPush is ready to integrate other Server Push approaches (e.g. Atmosphere) only by including
* a new module and injecting it to AppServerPush.
*
*
* NOTE ABOUT CLIENT DEPENDENCIES WITH SOCKET.IO
*
* The Socket.IO server will handle serving the correct version of the Socket.IO client library;
*
* We should not be using one from elsewhere on the Internet. From the top example on http://socket.io/:
*
*  <script src="/socket.io/socket.io.js"></script>
*
* This works because we wrap our HTTP server in Socket.IO (see the example at How To Use) and it intercepts
* requests for /socket.io/socket.io.js and sends the appropriate response automatically.
*
* That is the reason it is not a dependency handled by bower.
*/
angular.module('AppServerPush', ['AppSocketIO', 'AppConfiguration'])
/*
     To make socket error events available across an app, in one of the controllers:

     controller('MyCtrl', function ($scope) {
         $scope.on('socket:error', function (ev, data) {
            ...
     });
     */
.run(['$log', 'socket',
    function ($log, socket) {
        $log.info('AppServerPush run');
        socket.forward('error');
    }])
/**
 * @ngdoc service
 * @name AppServerPush.factory:SocketFactory
 * @requires $rootScope
 * @requires socket
 *
 * @description
 * Although Socket.IO exposes an io variable on the window, it's better to encapsulate it
 * into the AngularJS's Dependency Injection system.
 * So, we'll start by writing a factory to wrap the socket object returned by Socket.IO.
 * This will make easier to test the application's controllers.
 * Notice that the factory wrap each socket callback in $scope.$apply.
 * This tells AngularJS that it needs to check the state of the application and update
 * the templates if there was a change after running the callback passed to it by using dirty checking.
 * Internally, $http works in the same way. After some XHR returns, it calls $scope.$apply,
 * so that AngularJS can update its views accordingly.
 */
.factory('SocketFactory', ['$rootScope', 'socket',
        function ($rootScope, socket) {
        var factory = {};

        /**
             @ngdoc method
             @name AppServerPush.factory:SocketFactory#listen
             @methodOf AppServerPush.factory:SocketFactory
             @param {string} eventName The name of the event/channel to be listened
             The communication is bound to rootScope.
             @param {object} callback The function to be passed as callback.
             @description Establishes a communication listening an event/channel from server.
             Use this method for background communication although the current scope is destyroyed.
             You should cancel communication manually or when the $rootScope object is destroyed.
             */
        factory.listen = function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        /**
             @ngdoc method
             @name AppServerPush.factory:SocketFactory#sendMessage
             @methodOf AppServerPush.factory:SocketFactory
             @param {string} eventName The name of the event/channel to be sent to server
             @param {object} scope The scope object to be bound to the listening.
             The communication will be cancelled when the scope is destroyed.
             @param {object} callback The function to be passed as callback.
             @description Establishes a communication listening an event/channel from server.
             It is bound to a given $scope object.
             */
        factory.sendMessage = function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        };

        /**
             @ngdoc method
             @name AppServerPush.factory:SocketFactory#unsubscribeCommunication
             @methodOf AppServerPush.factory:SocketFactory
             @param {object} callback The function to be passed as callback.
             @description Cancels all communications to server.
             The communication will be cancelled without regarding other consideration.
             */
        factory.unsubscribeCommunication = function (callback) {
            socket.off(callback());
        };


        return factory;

}])
    
/**
 * @ngdoc service
 * @name AppServerPush.factory:WebSocketService
 * @requires $log
 * @requires $window
 * @requires WEBSOCKETS_CONFIG
 *
 * @description
 */   
.factory('WebSocketFactory', ['$log', 'WEBSOCKETS_CONFIG',
    function($log, WEBSOCKETS_CONFIG) {
        var factory = {};
        
        /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#connect
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {string} itemId The id of the item 
            @description Establishes a connection to a swebsocket endpoint.
        */
        factory.connect = function(url) {
             
            if(factory.ws) { 
                return; 
            };

            var ws;
            if ('WebSocket' in window) {
                ws = new WebSocket(url);
            } else if ('MozWebSocket' in window) {
                ws = new MozWebSocket(url);
            }
            ws.onopen = function () {
                if (ws != null) {
                    ws.send('');
                    factory.callback(WEBSOCKETS_CONFIG.WS_CONNECTED);
                } else {
                    factory.callback(WEBSOCKETS_CONFIG.WS_DISCONNECTED);
                 }
            };

            ws.onerror = function() {
              factory.callback(WEBSOCKETS_CONFIG.WS_FAILED_CONNECTION);
            };

            ws.onmessage = function(message) {
              factory.callback(message.data);
            };
            
            ws.onclose = function () {
                if (ws != null) {
                    ws.close();
                    ws = null;
                }
            };

            factory.ws = ws;
        };
        
        /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#send
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {object} message Message payload in JSON format. 
            @description Send a message to the ws server.
        */
        factory.send = function(message) {
          $log.debug('factory.ws: ' + factory.ws);
          factory.ws.send(message);
        };
        /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#subscribe
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {object} callback . 
            @description Retrieve the currentcallback of the endpoint connection.
        */
        factory.subscribe = function(callback) {
          factory.callback = callback;
        };
        
        /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#disconnect
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {string} itemId The id of the item 
            @description Close the WebSocket connection.
        */
        factory.disconnect = function() {
            factory.ws.close();
        };
        
        
        
         /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#status
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {string} itemId The id of the item 
            @description WebSocket connection status.
        */
        factory.status = function() {
            if (factory.ws == null || angular.isUndefined(factory.ws)){
                return WebSocket.CLOSED;
            }
            return factory.ws.readyState;
        };

        /**
            @ngdoc method
            @name AppServerPush.factory:WebSocketFactory#statusAsText
            @methodOf AppServerPush.factory:WebSocketFactory
            @param {string} itemId The id of the item 
            @description Returns WebSocket connection status as text.
        */
        factory.statusAsText = function() {
                    var readyState = factory.status();
                    if (readyState == WebSocket.CONNECTING){
                            return WEBSOCKETS_CONFIG.CONNECTING;
                    } else if (readyState == WebSocket.OPEN){
                            return WEBSOCKETS_CONFIG.OPEN;
                    } else if (readyState == WebSocket.CLOSING){
                            return WEBSOCKETS_CONFIG.WS_CLOSING;
                    } else if (readyState == WebSocket.CLOSED){
                            return WEBSOCKETS_CONFIG.WS_CLOSED;
                    } else {
                            return WEBSOCKETS_CONFIG.WS_UNKNOWN;
                    }
        };
        

        return factory;
}]);




//////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// PRIVATE MODULE (AppSocketIO)
////////////////////////////////////////////////////////////////////////////

/**
 * @ngdoc module
 * @name AppSocketIO
 * @description
 * Private module implementing SocketIO. It provides the common API module AppServerpush
 * with the socket object wrapping the SocketIO client. This is initializated according
 * to the pre-existing external configuration.
 */
angular.module('AppSocketIO', ['AppConfiguration'])

/**
 * @ngdoc provider
 * @name AppSocketIO.provider:socket
 * @description
 * This provider provides the appserverpush module with the SocketIO client object from pre-existing configuration in application.
 *
 * This object helps the common API module  making  easier to add/remove listeners in a way that works with AngularJS's scope.
 *
 * socket.on / socket.addListener: Takes an event name and callback. Works just like the method of the same name from Socket.IO.
 *
 * socket.removeListener: Takes an event name and callback. Works just like the method of the same name from Socket.IO.
 *
 * socket.emit: sends a message to the server. Optionally takes a callback.
 * Works just like the method of the same name from Socket.IO.
 *
 * socket.forward: allows you to forward the events received by Socket.IO's socket to AngularJS's event system.
 * You can then listen to the event with $scope.$on. By default, socket-forwarded events are namespaced with socket:.
 * The first argument is a string or array of strings listing the event names to be forwarded.
 * The second argument is optional, and is the scope on which the events are to be broadcast.
 * If an argument is not provided, it defaults to $rootScope.
 * As a reminder, broadcasted events are propagated down to descendant scopes.
 */
 .provider('socket', ['SERVERPUSH_CONFIG',
    function (SERVERPUSH_CONFIG) {

        // when forwarding events, prefix the event name
        var prefix = 'socket:',
            ioSocket;

        // expose to provider
        this.$get = function ($rootScope, $timeout) {

            /*
            Initialization of the socket object by using params in configuration module.
            Please read below for configuration detals:
            * Client configuration: https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO#client
            * Server configuration: https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO#server
            */
            var socket = ioSocket || io.connect(
                SERVERPUSH_CONFIG.BaseUrl, {
                    'resource': SERVERPUSH_CONFIG.Resource,
                    'connect timeout': SERVERPUSH_CONFIG.ConnectTimeout,
                    'try multiple transports': SERVERPUSH_CONFIG.TryMultipleTransports,
                    'reconnect': SERVERPUSH_CONFIG.Reconnect,
                    'reconnection delay': SERVERPUSH_CONFIG.ReconnectionDelay,
                    'reconnection limit': SERVERPUSH_CONFIG.ReconnectionLimit,
                    'max reconnection attempts': SERVERPUSH_CONFIG.MaxReconnectionAttempts,
                    'sync disconnect on unload': SERVERPUSH_CONFIG.SyncDisconnectOnUnload,
                    'auto connect': SERVERPUSH_CONFIG.AutoConnect,
                    'flash policy port': SERVERPUSH_CONFIG.FlashPolicyPort,
                    'force new connection': SERVERPUSH_CONFIG.ForceNewConnection
                }
            );

            var asyncAngularify = function (callback) {
                return function () {
                    var args = arguments;
                    $timeout(function () {
                        callback.apply(socket, args);
                    }, 0);
                };
            };

            var addListener = function (eventName, callback) {
                socket.on(eventName, asyncAngularify(callback));
            };

            var removeListener = function () {
                socket.removeAllListeners();
            };


            var wrappedSocket = {
                on: addListener,
                addListener: addListener,
                off: removeListener,

                emit: function (eventName, data, callback) {
                    if (callback) {
                        socket.emit(eventName, data, asyncAngularify(callback));
                    } else {
                        socket.emit(eventName, data);
                    }
                },

                //                removeListener: function () {
                //                    var args = arguments;
                //                    return socket.removeListener.apply(socket, args);
                //                },

                forward: function (events, scope) {
                    if (events instanceof Array === false) {
                        events = [events];
                    }
                    if (!scope) {
                        scope = $rootScope;
                    }
                    angular.forEach(events, function (eventName) {
                        var prefixed = prefix + eventName;
                        var forwardEvent = asyncAngularify(function (data) {
                            scope.$broadcast(prefixed, data);
                        });
                        scope.$on('$destroy', function () {
                            socket.removeListener(eventName, forwardEvent);
                        });
                        socket.on(eventName, forwardEvent);
                    });
                }
            };

            return wrappedSocket;
        };

        this.prefix = function (newPrefix) {
            prefix = newPrefix;
        };

        this.ioSocket = function (socket) {
            ioSocket = socket;
        };
    }]);
