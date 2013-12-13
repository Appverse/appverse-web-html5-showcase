'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SECURITY
// PRIMARY MODULE (AppSecurity)
// CONFIG KEY: AD
////////////////////////////////////////////////////////////////////////////
// 3 services
// A-AUTHENTICATION
// Protect username and password
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

angular.module('AppSecurity', ['restangular', 'AppCache', 'AppConfiguration'])
    .run(['$log', 'Restangular', 'CacheFactory', 'REST_CONFIG', 'CACHE_CONFIG',
        function ($log, Restangular, CacheFactory, REST_CONFIG, CACHE_CONFIG) {
            $log.info('AppSecurity run');
        }])


    .factory('AuthService', ['UserModel',
        function (UserModel) {
            var factory = {};

            return factory;
        }
    ])

    .factory('UserModel', function () {
        var authenticationModel = {
            userName: '',
            isLoggedIn: false,
            assignedRoles: '',
            appAuthenticationToken: {},
            authenticationToken: {}
        };

        return authenticationModel;
    })

    .controller('loginController', ['$scope', '$http', 'AuthService',
        function(scope, $http, AuthService) {

        }
    ])

/*
     APP AUTHENTICATION (OAuth2: Client Credentials Grant)

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
.factory('AppClientCredentialsGrantFactory', ['AD_CONFIG', 'Restangular',
    function (AD_CONFIG, Restangular) {
        var factory = {};

        /*
             @function
             @param
             @param
             @description
             */
        factory.connectAppOnly = function () {
            var appToken = function () {
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
            $http({
                method: 'POST',
                url: oAuthurl,
                headers: headers,
                data: 'grant_type=client_credentials'
            }).
            success(function (data, status) {
                scope.status = status;
                scope.data = data;
            }).
            error(function (data, status) {
                scope.status = status;
                scope.data = data || "Request failed";
            });
        };

        factory.userService = function () {
            var User = {
                isLogged: false,
                username: ''
            };


            $http(config)//Call the authentication service in backend and check credentials (headers, cookies, token)
                .success(function (data, status, headers, config) {
                    if (data.status) {
                        // succefull login
                        User.isLogged = true;

                        User.username = data.username;
                    } else {
                        User.isLogged = false;
                        User.username = '';
                    }
                })
                .error(function (data, status, headers, config) {
                    User.isLogged = false;
                    User.username = '';
                });

            return User;
        };

        return factory;
    }


    ])


/*
    USER AUTHENTICATION


     angular.module('exampleAppModule')
     .controller('LifeLoggerController', function($scope, AuthenticationModel, AuthenticationService, EventService) {
         'use strict';

         $scope.authenticationModel = AuthenticationModel;

         $scope.categories = [];
         $scope.events = [];
         $scope.labels = [];

         ...

         $scope.login = function() {
            AuthenticationService.login(false).then(function(authenticationModel) {
                $scope.authenticationModel = authenticationModel;
                EventService.loadEvents().then(function(events) {
                    $scope.events = events;
                });
            });
         };
     });
     */



.service('UserAuthenticationService', function ($q, $rootScope, AuthenticationModel) {
    var authenticationToken = {};
    var deferred = {};

    this.login = function (initialLogin) {
        deferred = $q.defer();
        doLogin(initialLogin);
        return deferred.promise;
    };

    var doLogin = function (mode) {
        var opts = {
            // localhost client id (make sure this is set to port 9000 in google api console)
            client_id: 'your_client_id.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/userinfo.email',
            immediate: mode,
            response_type: 'token id_token'
        };
        gapi.auth.authorize(opts, handleLogin);
    };

    var handleLogin = function () {
        gapi.client.oauth2.userinfo.get().execute(function (response) {
            if (!response.code) {
                authenticationToken = gapi.auth.getToken();
                authenticationToken.access_token = authenticationToken.id_token;
                AuthenticationModel.isLoggedIn = true;
                AuthenticationModel.authenticationToken = authenticationToken;
                $rootScope.$apply(function () {
                    deferred.resolve(AuthenticationModel);
                });
            }
        });
    };
})

.service('InitializationService', function ($q, $rootScope) {
    this.initialize = function () {
        var deferred = $q.defer();
        var apisToLoad = 2;

        var loginCallback = function () {
            if (--apisToLoad === 0) {
                $rootScope.$apply(function () {
                    // console.log('finished loading up client libraries - should be resolving');
                    deferred.resolve();
                });
            }
        };

        gapi.client.load('events', 'v1', loginCallback, 'http://localhost:8888/_ah/api');
        gapi.client.load('oauth2', 'v2', loginCallback);

        return deferred.promise;
    };
})

.factory('AuthenticationModel', function () {
    var authenticationModel = {
        isLoggedIn: false,
        appAuthenticationToken: {},
        authenticationToken: {}
    };

    return authenticationModel;
});
