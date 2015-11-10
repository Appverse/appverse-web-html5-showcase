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

.controller('SecurityController',
    function($scope, $log, $http, $window, $interval, $rootScope) {

        'use strict';

        $log.debug('SecurityController');

        $scope.url = $window.location.href;

        $scope.remembered = JSON.parse(localStorage.getItem('remember'));

        var response = JSON.parse(localStorage.getItem('oauth_response'));

        $log.debug('localStorage oauth_response', response);

        if (response) {
            checkResponse(response);
        }

        var expirationInterval;

        var code = localStorage.getItem('code');

        if (code) {
            $log.debug('localStorage code', code);
            getToken(code);
            localStorage.removeItem('code');
        } else if (!$scope.isAuthenticated) {
            $scope.isAuthenticated = false;
        }

        function checkResponse(response) {

            var token_date = localStorage.getItem('token_date');

            if (token_date) {

                $log.debug('token_date', token_date);

                $scope.oauth_response = response;

                expirationInterval = $interval(function() {
                    $scope.expiration_seconds = Math.round((response.expires_in * 1000 - new Date().getTime() + new Date(parseInt(token_date)).getTime()) / 1000);
                    if ($scope.expiration_seconds < 1) {
                        $interval.cancel(expirationInterval);
                        refreshToken();
                    }
                    $scope.$applyAsync();
                }, 1000, 0, false);

                $scope.$on('$destroy', function() {
                    if (expirationInterval) {
                        $interval.cancel(expirationInterval);
                    }
                });

                $scope.isAuthenticated = true;
            }
        }

        function refreshToken() {

            $log.debug('refreshToken');

            if (!$scope.oauth_response || !$scope.oauth_response.refresh_token) {
                return;
            }

            $http({
                method: 'POST',
                url: '/oauth-server/oauth/token',
                data: $.param({
                    code: code,
                    grant_type: 'refresh_token',
                    refresh_token: $scope.oauth_response.refresh_token,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization': 'Basic ' + btoa('oauth-server-showcase-client:our-secret')
                }
            }).then(function(response) {
                $log.debug('refreshToken response', response);

                $scope.oauth_response = response.data;

                if (localStorage.getItem('remember')) {
                    localStorage.setItem('oauth_response', JSON.stringify($scope.oauth_response));
                } else {
                    localStorage.removeItem('oauth_response');
                }
                localStorage.setItem('token_date', new Date().getTime());

                checkResponse($scope.oauth_response);
            });
        }

        function getToken(code) {

            $log.debug('getToken', code);

            $http({
                method: 'POST',
                url: '/oauth-server/oauth/token',
                data: $.param({
                    code: code,
                    grant_type: 'authorization_code',
                    client_id: 'oauth-server-showcase-client',
                    redirect_uri: $window.location.href
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization': 'Basic ' + btoa('oauth-server-showcase-client:our-secret')
                }
            }).success(function(response) {
                $log.debug('getToken success', response);

                $scope.oauth_response = response;

                if (localStorage.getItem('remember')) {
                    localStorage.setItem('oauth_response', JSON.stringify($scope.oauth_response));
                } else {
                    localStorage.removeItem('oauth_response');
                }
                localStorage.setItem('token_date', new Date().getTime());

                checkResponse($scope.oauth_response);
            }).error(function(response, statusCode) {
                $log.debug('getToken error', response);

                if (statusCode === 400) {
                    $scope.isAuthenticated = false;
                }
            });
        }

        $scope.remember = function() {

            $log.debug('remembered', $scope.remembered);

            if ($scope.remembered) {
                localStorage.setItem('remember', true);
            } else {
                localStorage.removeItem('remember');
            }
        };

        $scope.logOut = function() {

            $http({
                method: 'POST',
                url: '/oauth-server/api/sec/logout',
                data: $.param({
                    access_token: $scope.oauth_response.access_token
                })
            }).then(function(response) {
                $log.debug('logOut response', response);
                $scope.logOutSuccess = true;

                localStorage.removeItem('oauth_response');
                localStorage.removeItem('token_date');
                $scope.isAuthenticated = false;
                $scope.oauth_response = null;
                $interval.cancel(expirationInterval);
            });
        };

        $scope.sendLog = function() {

            $log.debug('sendLog');

            if (!$scope.oauth_response || !$scope.oauth_response.access_token) {
                $scope.oauth_response = {
                    access_token: null
                };
            }

            $scope.isSending = true;
            $scope.sendLogResponse = null;

            $http({
                method: 'POST',
                url: '/oauth-server/api/remotelog/log',
                data: {
                    "logLevel": "DEBUG",
                    "message": "string",
                    "userAgent": "string"
                },
                headers: {
                    'authorization': 'Bearer ' + $scope.oauth_response.access_token
                },
            }).success(function(data, status, headers) {
                $log.debug('remotelog response', status);
                $scope.isSending = false;
                $scope.sendLogResponse = {
                    statusCode: status,
                    body: data,
                    headers: headers()
                };
            }).error(function(response) {
                $log.debug('remotelog error', response);
                $scope.isSending = false;
                $scope.sendLogResponse = response;
                $rootScope.preventNextLocation = true;
            });
        };
    });