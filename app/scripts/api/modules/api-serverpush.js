'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SERVER PUSH CLIENT MODULE (AppServerPush)
////////////////////////////////////////////////////////////////////////////
// This module handles server data communication when it pushes them to the client.
// It is based on SocketIO. Why?
// Using WebSockets is a modern, bidirectional protocol that enables an interactive communication
// session between the browser and a server. Its main current drawback is
// that implementation is generally only available in the latest browsers. However, by
// using Socket.IO, this low level detail is abstracted away and we, as programmers,
// are relieved of the need to write browser-specific code.
//
// Implementation by btford.socket-io (License MIT)
//
//
////////////////////////////////////////////////////////////////////////////

angular.module('AppServerPush', [
        'btford.socket-io',
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