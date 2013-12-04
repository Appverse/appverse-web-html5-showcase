'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SERVER PUSH CLIENT
// PRIMARY MODULE (AppServerPush)
////////////////////////////////////////////////////////////////////////////
// This module handles server data communication when it pushes them to the client.
// It is based on SocketIO (http://socket.io/). Why?
// Using WebSockets is a modern, bidirectional protocol that enables an interactive communication
// session between the browser and a server. Its main current drawback is
// that implementation is generally only available in the latest browsers. However, by
// using Socket.IO, this low level detail is abstracted away and we, as programmers,
// are relieved of the need to write browser-specific code.
// The current release of socket.io is 0.9.10.
//
// The module AppServerPush is included in the main module.
// The module AppSocketIO simply wraps SocketIO API to be used by AppServerPush.
// So, AppServerPush is ready to integrate other Server Push approaches (e.g. Atmosphere) only by including
// a new module and injecting it to AppServerPush.
//
//////////////////////////////////////////////////////////////////////////////
// NOTE ABOUT CLIENT DEPENDENCIES WITH SOCKET.IO
// The Socket.IO server will handle serving the correct version of the Socket.IO client library;
// We should not be using one from elsewhere on the Internet. From the top example on http://socket.io/:
//  <script src="/socket.io/socket.io.js"></script>
// This works because we wrap our HTTP server in Socket.IO (see the example at How To Use) and it intercepts
// requests for /socket.io/socket.io.js and sends the appropriate response automatically.
// That is the reason it is not a dependency handled by bower.
////////////////////////////////////////////////////////////////////////////

angular.module('AppServerPush', [
        'AppSocketIO',
        'AppConfiguration'])
    .config(['socketProvider', 'SERVERPUSH_CONFIG',
        function (socketProvider, SERVERPUSH_CONFIG) {
            /*
             The $provide service is responsible for telling Angular how to create
             new injectable things (services).
             The standardSocket service will be injected in the SocketFactory.
             Basically it is a socket object with the defined configuration.
             */
            $provide.provider('standardSocket', function() {
                /*
                Previous configuration of the socket object
                we are going to use in the module.
                 */
                var standardSocket = io.connect(SERVERPUSH_CONFIG.BaseUrl, {
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
                });
                return socketProvider.ioSocket(standardSocket);
            });
        }])
    /*
     To make socket error events available across an app, in one of the controllers:

     controller('MyCtrl', function ($scope) {
         $scope.on('socket:error', function (ev, data) {
            ...
     });
     */
    .run(function (socket) {
        socket.forward('error');
    })
    /*
     * Factory Name: 'SocketFactory'
     * Although Socket.IO exposes an io variable on the window, it's better to encapsulate it
     * into the AngularJS's Dependency Injection system.
     * So, we'll start by writing a factory to wrap the socket object returned by Socket.IO.
     * This will make easier to test the application's controllers.
     *
     * Notice that the factory wrap each socket callback in $scope.$apply.
     * This tells AngularJS that it needs to check the state of the application and update
     * the templates if there was a change after running the callback passed to it by using dirty checking.
     * Internally, $http works in the same way. After some XHR returns, it calls $scope.$apply,
     * so that AngularJS can update its views accordingly.
     */
    .factory('SocketFactory', ['$rootScope', 'standardSocket',
        function ($rootScope, standardSocket) {

            return {
                /*
                 We handle the data transmission from the server.
                 */
                on: function (eventName, callback) {
                    standardSocket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(standardSocket, args);
                        });
                    });
                },
                /*
                 It sends eventName message to the server so that the data can be sent.
                 */
                emit: function (eventName, data, callback) {
                    standardSocket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(standardSocket, args);
                            }
                        });
                    })
                }
                //Note that this service doesn't wrap the entire Socket.IO API
                // TODO Complete with all socket methods
            };
        }]);

//////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SECONDARY MODULE (AppSocketIO)
////////////////////////////////////////////////////////////////////////////
angular.module('AppSocketIO', []).
    provider('socket', function () {

        // when forwarding events, prefix the event name
        var prefix = 'socket:',
            ioSocket;

        // expose to provider
        this.$get = function ($rootScope, $timeout) {

            var socket = ioSocket || io.connect();

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

            var wrappedSocket = {
                on: addListener,
                addListener: addListener,

                emit: function (eventName, data, callback) {
                    if (callback) {
                        socket.emit(eventName, data, asyncAngularify(callback));
                    } else {
                        socket.emit(eventName, data);
                    }
                },

                removeListener: function () {
                    var args = arguments;
                    return socket.removeListener.apply(socket, args);
                },

                forward: function (events, scope) {
                    if (events instanceof Array === false) {
                        events = [events];
                    }
                    if (!scope) {
                        scope = $rootScope;
                    }
                    events.forEach(function (eventName) {
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
    });