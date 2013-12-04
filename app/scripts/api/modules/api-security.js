'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SECURITY
// PRIMARY MODULE (AppSecurity)
// CONFIG KEY: AD
////////////////////////////////////////////////////////////////////////////
// 3 services
// A-AUTHENTICATION
// Protect username and passowrd
// Manages authentication operations
// Handles user session
//
// B-REMOTE COMMUNICATION AUTHORIZATION HANDLING
// Based on OAuth 2 integration
// It handles token for the current user session.
// OAuth2 Protocol Flow:
//
//    +--------+                               +---------------+
//    |        |--(A)- Authorization Request ->|   Resource    |
//    |        |                               |     Owner     |
//    |        |<-(B)-- Authorization Grant ---|               |
//    |        |                               +---------------+
//    |        |
//    |        |                               +---------------+
//    |        |--(C)-- Authorization Grant -->| Authorization |
//    | Client |                               |     Server    |
//    |        |<-(D)----- Access Token -------|               |
//    |        |                               +---------------+
//    |        |
//    |        |                               +---------------+
//    |        |--(E)----- Access Token ------>|    Resource   |
//    |        |                               |     Server    |
//    |        |<-(F)--- Protected Resource ---|               |
//    +--------+                               +---------------+
//
//
//C-INTERNAL AUTHORIZATION
// It handles access to site sections
// Includes roles management and rights checking
//////////////////////////////////////////////////////////////////////////////
// NOTES
//
////////////////////////////////////////////////////////////////////////////

angular.module('AppSecurity', [
        'restangular',
        'AppCache',
        'AppConfiguration'])
    .config(['RestangularProvider', 'CacheFactory', 'REST_CONFIG', 'CACHE_CONFIG',
        function (RestangularProvider, CacheFactory, REST_CONFIG, CACHE_CONFIG) {

        }])
    /*
     Overview

     The backend offers applications the ability to issue authenticated requests on behalf of the application itself
     (as opposed to on behalf of a specific user). The backend implementation should be based on the Client Credentials Grant.
     Since the client authentication is used as the authorization grant, no additional authorization request is needed.
     (http://tools.ietf.org/html/rfc6749#section-4.4) flow of the OAuth 2 specification.

     The application-only auth flow follows these steps:
     1-An application encodes its consumer key and secret into a specially encoded set of credentials.
     2-An application makes a request to the POST oauth2/token endpoint to exchange these credentials for a bearer token.
     3-When accessing the REST API, the application uses the bearer token to authenticate.

     The client credentials grant type MUST only be used by confidential clients.

     +---------+                                  +---------------+
     |         |                                  |               |
     |         |>--(A)- Client Authentication --->| Authorization |
     | Client  |                                  |     Server    |
     |         |<--(B)---- Access Token ---------<|               |
     |         |                                  |               |
     +---------+                                  +---------------+
     */
    .factory('AppAuthenticationOnlyFactory', ['AD_CONFIG', 'Restangular',
        function (AD_CONFIG, Restangular) {
            var factory = {};

            /*
             @function
             @param
             @param
             @description
             */
            factory.connectAppOnly = function () {
                var appToken = function(){
                    var consumerKey = encodeURIComponent(AD_CONFIG.ConsumerKey);
                    var consumerSecret = encodeURIComponent(AD_CONFIG.ConsumerSecret);
                    var tokenCredentials = btoa(consumerKey + ':' + consumerSecret);

                    return tokenCredentials;
                };
                var oAuthurl = baseUrl + "oauth2/token";

                var headers = {
                    'Authorization': 'Basic ' + appToken(),
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                };
                $http.defaults.useXDomain = true;
                delete $http.defaults.headers.common['X-Requested-With'];
                $http({method: 'POST', url: oAuthurl, headers: headers, data: 'grant_type=client_credentials'}).
                    success(function(data, status){
                        scope.status = status;
                        scope.data = data;
                    }).
                    error(function(data, status){
                        scope.status = status;
                        scope.data = data || "Request failed";
                    });
            };

            factory.userService = function() {
                var User = {
                    isLogged: false,
                    username: ''
                };


                $http(config)
                    .success(function(data, status, headers, config) {
                        if (data.status) {
                            // succefull login
                            User.isLogged = true;
                            User.username = data.username;
                        }
                        else {
                            User.isLogged = false;
                            User.username = '';
                        }
                    })
                    .error(function(data, status, headers, config) {
                        User.isLogged = false;
                        User.username = '';
                    });

                return User;
            };

            return factory;
        }


    ]);