'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SERVER PUSH CLIENT MODULE (AppServerPush)
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
        'AppCache',
        'AppConfiguration'])
    .config(['socketProvider', 'CacheFactory', 'SERVERPUSH_CONFIG', 'CACHE_CONFIG',
        function (socketProvider, CacheFactory, SERVERPUSH_CONFIG, CACHE_CONFIG) {

            var standardSocket = io.connect(SERVERPUSH_CONFIG.BaseUrl, {
                'resource': SERVERPUSH_CONFIG.Resource
            });
            socketProvider.ioSocket(standardSocket);


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
     * in AngularJS's Dependency Injection system.
     * So, we'll start by writing a service to wrap the socket object returned by Socket.IO.
     * This will make it easier to test the app's controllers later.
     *
     * Notice that the factory wrap each socket callback in $scope.$apply.
     * This tells AngularJS that it needs to check the state of the application and update
     * the templates if there was a change after running the callback passed to it by using dirty checking.
     * Internally, $http works in the same way. After some XHR returns, it calls $scope.$apply,
     * so that AngularJS can update its views accordingly.
     */
    .factory('SocketFactory', ['$rootScope',
        function ($rootScope) {
            var socket = io.connect();
            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },
                emit: function (eventName, data, callback) {
                    socket.emit(eventName, data, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback.apply(socket, args);
                            }
                        });
                    })
                }
                //Note that this service doesn't wrap the entire Socket.IO API
                // TODO Complete with all socket methods
            };
        }]);


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

                // when socket.on('someEvent', fn (data) { ... }),
                // call scope.$broadcast('someEvent', data)
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