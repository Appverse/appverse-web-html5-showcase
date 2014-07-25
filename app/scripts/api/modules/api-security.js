'use strict';

////////////////////////////////////////////////////////////////////////////
// COMMON API - 0.1
// SECURITY
// PRIMARY MODULE (AppSecurity)
// CONFIG KEY: AD
////////////////////////////////////////////////////////////////////////////
// 2 services
// A-AUTHENTICATION
// Protect username and password
// Manages authentication operations
// Handles user session
//
// B-REMOTE COMMUNICATION AUTHORIZATION HANDLING
// Based on OAuth 2.0 integration (RFC 6749, October 2012).
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
//1.3.2.  Implicit
//
//   The implicit grant is a simplified authorization code flow optimized
//   for clients implemented in a browser using a scripting language such
//   as JavaScript.  In the implicit flow, instead of issuing the client
//   an authorization code, the client is issued an access token directly
//   (as the result of the resource owner authorization).  The grant type
//   is implicit, as no intermediate credentials (such as an authorization
//   code) are issued (and later used to obtain an access token).
//
//   When issuing an access token during the implicit grant flow, the
//   authorization server does not authenticate the client.  In some
//   cases, the client identity can be verified via the redirection URI
//   used to deliver the access token to the client.  The access token may
//   be exposed to the resource owner or other applications with access to
//   the resource owner's user-agent.
//
//   Implicit grants improve the responsiveness and efficiency of some
//   clients (such as a client implemented as an in-browser application),
//   since it reduces the number of round trips required to obtain an
//   access token.  However, this convenience should be weighed against
//   the security implications of using implicit grants, such as those
//   described in Sections 10.3 and 10.16, especially when the
//   authorization code grant type is available.
//
//
//   APP AUTHENTICATION (OAuth2: Client Credentials Grant)
//
//     The backend offers applications the ability to issue authenticated requests on behalf of the application itself
//     (as opposed to on behalf of a specific user). The backend implementation should be based on the Client Credentials Grant.
//     Since the client authentication is used as the authorization grant, no additional authorization request is needed.
//     (http://tools.ietf.org/html/rfc6749#section-4.4) flow of the OAuth 2 specification.
//
//     The application-only auth flow follows these steps:
//     1-An application encodes its consumer key and secret into a specially encoded set of credentials.
//     2-An application makes a request to the POST oauth2/token endpoint to exchange these credentials for a bearer token.
//     3-When accessing the REST API, the application uses the bearer token to authenticate.
//
//     The client credentials grant type MUST only be used by confidential clients.
//
//     +---------+                                  +---------------+
//     |         |                                  |               |
//     |         |>--(A)- Client Authentication --->| Authorization |
//     | Client  |                                  |     Server    |
//     |         |<--(B)---- Access Token ---------<|               |
//     |         |                                  |               |
//     +---------+                                  +---------------+
//
//C-INTERNAL AUTHORIZATION
// It handles access to site sections
// Includes roles management and rights checking
//////////////////////////////////////////////////////////////////////////////
// NOTES
// 1-INNER STRUCTURE
// The module comprises 4 services and one directive.
// It must be pre-configured.
// DIRECTIVE: oauth
// FACTORY: Oauth_AccessToken
// FACTORY: Oauth_Endpoint
// FACTORY: Oauth_RequestWrapper
// FACTORY: Oauth_Profile
// CONFIGURATION: SECURITY_OAUTH
//////////////////////////////////////////////////////////////////////////////

/*@ngdoc module
 * @name AppSecurity
 * @description
 * 3 services:
 *
 *  A-AUTHENTICATION
 *  Protect username and password
 *  Manages authentication operations
 *  Handles user session
 *
 * B-REMOTE COMMUNICATION AUTHORIZATION HANDLING
 *  Based on OAuth 2.0 integration (RFC 6749, October 2012).
 *  It handles token for the current user session.
 *
 * C-INTERNAL AUTHORIZATION
 *  It handles access to site sections
 *  Includes roles management and rights checking
 */
angular.module('AppSecurity', [
    'ngCookies', // Angular support for cookies
    'AppCache', // Common API Module: cache services
    'AppConfiguration', // Common API Module: configuration
    'AppUtils',
    'AppREST'
])


.run(['$log',
            function ($log) {
        $log.info('AppSecurity run');
            }])

/**
 * @ngdoc service
 * @name AppSecurity.factory:Oauth_Endpoint
 * @requires AppSecurity.factory:Oauth_AccessToken
 * @requires $location
 * @description
 * OAuth Endpoint service.
 * Contains one factory managing the authorization's (endpoint) URL.
 */
.factory('Oauth_Endpoint', ['Oauth_AccessToken', '$location',
  function (AccessToken, $location) {

        var factory = {};
        var url;



        //TODO Check against other oauth providers (linkedin, twitter).

        /*
         *NOTE
         *Google uses the same url for authentication and authorization, so just
         *redirect your users to the authorize url with the appropriate parameters in
         *the query string. Google then determines if the user needs to login,
         *authorize your app, or both.
         *The flow would go something like this...
         *1-Get the request token
         *2-Redirect your users to the authorization link
         *https://www.google.com/accounts/OAuthAuthorizeToken?scope=http%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds&oauth_token=REQUEST_TOKEN&oauth_callback=http%3A%2F%2Fwww.mysite.com%2Fcallback
         *3-User authorizes your app, then exchange the request token for an access token.
         */


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_Endpoint#set
         * @methodOf AppSecurity.factory:Oauth_Endpoint
         * @param {object} scope The current scope
         * @description Defines the authorization URL with correct attributes.
         * @returns {String} The URL for the oauth endpoint
         */
        factory.set = function (scope) {
            url = scope.site +
                scope.authorizePath +
                '?response_type=token' + '&' +
                'client_id=' + scope.client + '&' +
                'redirect_uri=' + scope.redirect + '&' +
                'scope=' + scope.scope + '&' +
                'state=' + $location.url();

            return url;
        }

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_Endpoint#get
         * @methodOf AppSecurity.factory:Oauth_Endpoint
         * @description Returns the authorization URL.
         * @returns {String} The URL for the oauth endpoint
         */
        factory.get = function () {
            return url;
        }

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_Endpoint#redirect
         * @methodOf AppSecurity.factory:Oauth_Endpoint
         * @description Redirects the app to the authorization URL.
         */
        factory.redirect = function () {
            window.location.replace(url);
        }

        return factory;
}])

/**
 * @ngdoc service
 * @name AppSecurity.factory:Oauth_AccessToken
 * @requires $location
 * @requires $cookies
 * @requires CacheFactory
 * @description
 * OAuth access token service.
 * Management of the access token.
 */
.factory('Oauth_AccessToken', ['$location', '$cookies', 'CacheFactory', 'UserService',
            function ($location, $cookies, CacheFactory, UserService) {

        var factory = {};
        var token = null;
        var xsrfToken = null;


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#get
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @description Returns the access token.
         * @returns {object} The user token from the oauth server
         */
        factory.get = function () {
            getTokenFromCache();
            return token;
        };

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#getXSRF
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @description Returns the XSRF token to be input in each request header.
         * @returns {object} The xsrf token from the oauth server in the current session
         */
        factory.getXSRF = function () {
            getXSRFTokenFromCache();
            return xsrfToken;
        };


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#set
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} scope The current scope
         * @description Sets and returns the access token taking it from the fragment URI or eventually
         * from the cookies. Use `AccessToken.init()` to load (at boot time) the access token.
         * @returns {object} The user token from the oauth server
         */
        factory.set = function (scope) {
            setTokenFromString(scope); // take the token from the query string and eventually save it in the cookies
            setTokenFromCookies(scope); // take the from the cookies
            return token
        };


        factory.setFromHeader = function (token) {
            setTokenInCurrentUser(token);
            return token
        };

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#destroy
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} scope The current scope
         * @description Delete the access token and remove the cookies.
         * @returns {object} The user token from the oauth server
         */
        factory.destroy = function (scope) {
            token = null;
            xsrfToken = null;
            delete $cookies[scope.client];
            return token;
        }


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#expired
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @description Tells when the access token is expired.
         * @returns {boolean} True or false if the token is expired
         */
        factory.expired = function () {
            return (token && token.expires_at && token.expires_at < new Date())
        }



        /////////////////////////////Private methods///////////////////////////////////

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#setTokenFromString
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} scope The current scope
         * @description
         * Get the access token from a string and save it
         */
        function setTokenFromString(scope) {
            var token = getTokenFromString($location.hash());

            if (token) {
                removeFragment();
                setToken(token, scope);
            }
        };



        function getTokenFromCache() {
            var user = UserService.getCurrentUser();
            if (user) {
                token = user.bToken;
            }
        }

        function getXSRFTokenFromCache() {
            var user = UserService.getCurrentUser();
            if (user) {
                xsrfToken = user.xsrfToken;
            }
        }
        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#getTokenFromString
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} hash The initial string
         * @description
         * Parse the fragment URI into an object
         * @returns {object} The value of the token
         */
        function getTokenFromString(hash) {
            var splitted = hash.split('&');
            var params = {};

            for (var i = 0; i < splitted.length; i++) {
                var param = splitted[i].split('=');
                var key = param[0];
                var value = param[1];
                params[key] = value
            }

            if (params.access_token || params.error) {
                return params;
            }
        }


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#setTokenFromCookies
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} scope The current scope
         * @description
         * Set the access token from the cookies.
         * Returns the access token only when the storage attribute is set to 'cookies'.
         */
        function setTokenFromCookies(scope) {
            if (scope.storage === 'cookies') {
                if ($cookies[scope.client]) {
                    var params = JSON.parse($cookies[scope.client]);
                    setToken(params, scope);
                }
            }
        }


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#setTokenInCookies
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} scope The current scope
         * @param {object} params with token value hash
         * @description
         * Save the access token into a cookie identified by the application ID
         * Save the access token only when the storage attribute is set to 'cookies'.
         */
        function setTokenInCookies(scope, params) {
            if (scope.storage === SECURITY_OAUTH.storage_cookies) {
                if (params && params.access_token) {
                    $cookies[scope.client] = JSON.stringify(params);
                }
            }
        }


        function setTokenInCurrentUser(scope, params) {
            if (params && params.access_token) {
                token = params.access_token;
                //token =  JSON.stringify(params);
            } else {
                //If not exist takes the saved token from cache
                token = factory.get();
            }
            var user = UserService.getCurrentUser();
            if (user) {
                user.bToken = token;
                UserService.setCurrentUser(user);
            }

        }


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#setToken
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} params The object with the token
         * @param {object} scope The current scope
         * @description
         * Set the access token in cookies.
         * @returns {object} The token value
         */
        function setToken(params, scope) {
            token = token || {} // init the token
            angular.extend(token, params); // set the access token params
            setExpiresAt(); // set the expiring time
            setTokenInCookies(scope, params); // save the token into a cookie

            setTokenInCurrentUser(token);

            return token;
        };


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#setExpiresAt
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @description
         * Set the access token expiration date (useful for refresh logics)
         */
        function setExpiresAt() {
            if (token) {
                var expires_at = new Date();
                expires_at.setSeconds(expires_at.getSeconds() + parseInt(token.expires_in) - 60); // 60 seconds less to secure browser and response latency
                token.expires_at = expires_at;
            }
        };


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#removeFragment
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @param {object} scope The current scope
         * @description
         * Remove the fragment URI
         */
        function removeFragment(scope) {
            //TODO we need to let the fragment live if it's not the access token
            $location.hash('');
        }


        return factory;
            }])


/**
 * @ngdoc service
 * @name AppSecurity.factory:Oauth_Endpoint
 * @requires AppSecurity.factory:Oauth_AccessToken
 * @requires $location
 * @description
 * OAuth Endpoint service.
 * Contains one factory managing the authorization's (endpoint) URL.
 */
.factory('Oauth_Endpoint', ['$location',
            function ($location) {

        var factory = {};
        var url;



        //TODO Check against other oauth providers (linkedin, twitter).

        /*
         *NOTE
         *Google uses the same url for authentication and authorization, so just
         *redirect your users to the authorize url with the appropriate parameters in
         *the query string. Google then determines if the user needs to login,
         *authorize your app, or both.
         *The flow would go something like this...
         *1-Get the request token
         *2-Redirect your users to the authorization link
         *https://www.google.com/accounts/OAuthAuthorizeToken?scope=http%3A%2F%2Fwww.google.com%2Fm8%2Ffeeds&oauth_token=REQUEST_TOKEN&oauth_callback=http%3A%2F%2Fwww.mysite.com%2Fcallback
         *3-User authorizes your app, then exchange the request token for an access token.
         */


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_Endpoint#set
         * @methodOf AppSecurity.factory:Oauth_Endpoint
         * @param {object} scope The current scope
         * @description Defines the authorization URL with correct attributes.
         * @returns {String} The URL for the oauth endpoint
         */
        factory.set = function (scope) {
            url = scope.site +
                scope.authorizePath +
                '?response_type=token' + '&' +
                'client_id=' + scope.client + '&' +
                'redirect_uri=' + scope.redirect + '&' +
                'scope=' + scope.scope + '&' +
                'state=' + $location.url();

            return url;
        }

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_Endpoint#get
         * @methodOf AppSecurity.factory:Oauth_Endpoint
         * @description Returns the authorization URL.
         * @returns {String} The URL for the oauth endpoint
         */
        factory.get = function () {
            return url;
        }

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_Endpoint#redirect
         * @methodOf AppSecurity.factory:Oauth_Endpoint
         * @description Redirects the app to the authorization URL.
         */
        factory.redirect = function () {
            window.location.replace(url);
        }

        return factory;
            }])


/**
 * @ngdoc service
 * @name AppSecurity.factory:Oauth_RequestWrapper
 * @requires AppSecurity.factory:Oauth_AccessToken
 * @requires AppSecurity.factory:Oauth_Endpoint
 * @requires $http
 *
 * @description
 * Requests wrapper. It wraps every request setting needed header by injecting
 * the access token into the header
 */
.factory('Oauth_RequestWrapper', ['$log', '$browser', 'Oauth_AccessToken', 'REST_CONFIG', 'SECURITY_GENERAL',
            function ($log, $browser, Oauth_AccessToken, REST_CONFIG, SECURITY_GENERAL) {
        var factory = {};
        //var token;

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_RequestWrapper#wrapRequest
         * @methodOf AppSecurity.factory:Oauth_RequestWrapper
         * @param {object} Restangular object
         * @param {object} actions Array with actions
         * @description Wraps every request with the Restangular object
         * @returns {object} the modified Restangular object
         */
        factory.wrapRequest = function (restangular) {
            var token = Oauth_AccessToken.get();
            var wrappedRestangular = restangular;
            
            if (token) {
                 $log.debug("OAuth token is present and valid. The wrapped request is secure.");
                setRequestHeaders(token, restangular);
            } else {
                $log.debug("OAuth token is not present yet. The wrapped request will not be secure.");
            }


            return wrappedRestangular;
        };



        /////////////////////////////Private methods///////////////////////////////////

        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_RequestWrapper#setRequestHeaders
         * @methodOf AppSecurity.factory:Oauth_RequestWrapper
         * @param {string} token The token value from the oauth server
         * @description
         * Set security request headers
         *
         */
        function setRequestHeaders(token, wrappedRestangular) {
            $log.debug('token: ' + token);
            $log.debug('is same domain? ' + isSameDomain(REST_CONFIG.BaseUrl, $browser.url()));

            /*
            The XSRF policy type is the level of complexity to calculate the value to be returned in the xsrf header in request
            against the authorization server:
            0: No value is included (The domain is the same one)
            1: $http service built-in solution. The $http service will extract this token from the response header,
             and then included in the X-XSRF-TOKEN header to every HTTP request. The server must check the token
             on each request, and then block access if it is not valid.
            2: Additional calculation of the cookie value using a secret hash. The value is included in the X-XSRF-TOKEN
             request header.
             */
            if (token) {
                var xsrfHeaderValue;
                if (isSameDomain(REST_CONFIG.BaseUrl, $browser.url())) {
                    $log.debug("*** isSameDomain");
                    if (SECURITY_GENERAL.XSRFPolicyType === 0) {
                        $log.debug("*** case 0");
                        wrappedRestangular.setDefaultHeaders({
                            'Authorization': 'Bearer' + token,
                            'Content-Type': REST_CONFIG.DefaultContentType
                        });
                    } else if (SECURITY_GENERAL.XSRFPolicyType === 1) {
                        $log.debug("*** case 1");
                        xsrfHeaderValue = Oauth_AccessToken.getXSRF();
                        wrappedRestangular.setDefaultHeaders({
                            'Authorization': 'Bearer' + token,
                            'Content-Type': REST_CONFIG.DefaultContentType,
                            'X-XSRF-TOKEN': xsrfHeaderValue
                        });
                    } else if (SECURITY_GENERAL.XSRFPolicyType === 2) {
                        $log.debug("*** case 2");
                        xsrfHeaderValue = $browser.cookies()[SECURITY_GENERAL.XSRFCSRFCookieName];
                        wrappedRestangular.setDefaultHeaders({
                            'Authorization': 'Bearer' + token,
                            'Content-Type': REST_CONFIG.DefaultContentType,
                            'X-XSRF-TOKEN': xsrfHeaderValue
                        });
                    }
                };


            }
            return wrappedRestangular;
        };


        return factory;
            }])


/**
 * @ngdoc service
 * @name AppSecurity.factory:Oauth_Profile
 * @requires AppSecurity.factory:Oauth_RequestWrapper
 * @requires $resource
 * @requires SECURITY_OAUTH
 *
 * @description
 * Profile model. *
 */
.factory('Oauth_Profile', ['Oauth_RequestWrapper', '$resource', 'SECURITY_OAUTH',
            function (RequestWrapper, $resource, SECURITY_OAUTH) {

        var resource = $resource(SECURITY_OAUTH.profile, {}, {
            //get: { method: 'JSONP', params: { callback: 'JSON_CALLBACK' } }
        });
        return RequestWrapper.wrap(resource, ['get']);
            }])


/**
 * @ngdoc service
 * @name AppSecurity.factory:RoleService
 * @requires $log
 * @requires AppConfiguration.constant:AUTHORIZATION_DATA
 * @requires AppCache.factory:CacheFactory
 * @description
 * Manages user's roles.
 */
.factory('RoleService', ['$log', 'AUTHORIZATION_DATA', 'CacheFactory',
            function ($log, AUTHORIZATION_DATA, CacheFactory) {


        return {
            /**
             * @ngdoc method
             * @name AppSecurity.factory:RoleService#validateRoleAdmin
             * @methodOf AppSecurity.factory:RoleService
             * @description Check if the passed user has a role in the adminsitrator family
             * @returns {boolean} True if the role of the usder has admin previleges
             */
            validateRoleAdmin: function () {
                var roles = CacheFactory._browserCache.get('loggedUser').roles;
                $log.debug('roles in session: ' + roles);

                var result;
                if (roles && AUTHORIZATION_DATA.adminRoles) {
                    for (var j = 0; j < AUTHORIZATION_DATA.adminRoles.length; j++) {
                        if (_.contains(roles, AUTHORIZATION_DATA.adminRoles[j])) {
                            result = true;
                            break;
                        } else {
                            result = false;
                        }
                    }
                    return result;
                } else {
                    return false;
                }
            },
            /**
             * @ngdoc method
             * @name AppSecurity.factory:RoleService#validateRoleInUserOther
             * @methodOf AppSecurity.factory:RoleService
             * @param {string} role The role to be validated
             * @description Check if the passed user has a given role
             * @returns {boolean} True if the user has that role
             */
            validateRoleInUserOther: function (role) {
                if (CacheFactory._browserCache.currentUser) {
                    var user = CacheFactory._browserCache.currentUser;
                    return _.contains(role, user.roles);
                } else {
                    return false;
                }

            }
        };
            }])


/**
 * @ngdoc service
 * @name AppSecurity.factory:AuthenticationService
 * @requires AppSecurity.factory:UserService
 * @description
 * Exposes some useful methods for apps developers.
 */
.factory('AuthenticationService', ['$rootScope', 'UserService', 'Base64', '$http', '$q', '$log', 'SECURITY_GENERAL',
            function ($rootScope, UserService, Base64, $http, $q, $log, SECURITY_GENERAL) {

        return {
            sendLoginRequest: function (credentials) {
                var deferred = $q.defer();
                var encoded = Base64.encode(credentials.name + ':' + credentials.password);

                $http({
                    method: SECURITY_GENERAL.loginHTTPMethod,
                    url: SECURITY_GENERAL.loginURL,
                    headers: {
                        'Authorization': 'Basic ' + encoded,
                        'Content-Type': SECURITY_GENERAL.Headers_ContentType
                    },
                    timeout: 30000,
                    cache: false
                })
                    .success(function (data, status, headers, config) {
                        var results = [];
                        results.data = data;
                        results.headers = headers;
                        results.status = status;
                        results.config = config;

                        deferred.resolve(results);
                    })
                    .error(function (data, status) {
                        deferred.reject(data, status);
                    });
                return deferred.promise;
            },

            sendLogoutRequest: function (credentials) {
                var deferred = $q.defer();

                $http({
                    method: SECURITY_GENERAL.logoutHTTPMethod,
                    url: SECURITY_GENERAL.logoutURL,
                    headers: {
                        'Content-Type': SECURITY_GENERAL.Headers_ContentType
                    },
                    timeout: 30000,
                    cache: false
                })
                    .success(function (data, status, headers, config) {
                        var results = [];
                        results.data = data;
                        results.headers = headers;
                        results.status = status;
                        results.config = config;

                        deferred.resolve(results);
                    })
                    .error(function (data, status) {
                        deferred.reject(data, status);
                    });
                return deferred.promise;
            },

            /**
             * @ngdoc method
             * @name AppSecurity.factory:AuthenticationService#login
             * @methodOf AppSecurity.factory:AuthenticationService
             * @param {string} name Name of the user
             * @param {object} roles Set of roles of the user as array
             * @param {string} token The token from the oauth server
             * @param {boolean} isLogged If the user is logged or not
             * @param {string} role The role to be validated
             * @description Sets the new logged user
             */
            login: function (name, roles, bToken, xsrfToken, isLogged) {
                //$log.debug(' -- bToken -- : ' + bToken);
                var user = new User(name, roles, bToken, xsrfToken, isLogged);
                $log.debug(user.print());
                UserService.setCurrentUser(user);
            },
            /**
             * @ngdoc method
             * @name AppSecurity.factory:AuthenticationService#isLoggedIn
             * @methodOf AppSecurity.factory:AuthenticationService
             * @param {string} role The role to be validated
             * @description Check if the user is logged
             * @returns {boolean}  true if is already logged
             */
            isLoggedIn: function () {
                if (UserService.getCurrentUser()) {
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * @ngdoc method
             * @name AppSecurity.factory:AuthenticationService#logOut
             * @methodOf AppSecurity.factory:AuthenticationService
             * @param {AppSecurity.global:User} user The User object to be logged out
             * @description Removes the current user from the app
             */
            logOut: function (user) {
                UserService.removeUser(user);
            }

        };
            }])


/**
 * @ngdoc service
 * @name AppSecurity.factory:UserService
 * @requires $log
 * @requires AppCache.factory:CacheFactory
 * @description
 * Handles the user in the app.
 */
.factory('UserService', ['$log', 'CacheFactory',
            function ($log, CacheFactory) {


        return {
            /**
             * @ngdoc method name, roles, bToken, xsrfToken, isLogged
             * @name AppSecurity.factory:UserService#setCurrentUser
             * @methodOf AppSecurity.factory:UserService
             * @param {AppSecurity.global:User} loggedUser The currently logged user
             * @description Writes the current user in cache ('currentUser').
             */
            setCurrentUser: function (loggedUser) {

                CacheFactory._browserCache.put('loggedUser', {
                    username: loggedUser.name,
                    roles: loggedUser.roles,
                    bToken: loggedUser.bToken,
                    xsrfToken: loggedUser.xsrfToken,
                    isLogged: loggedUser.isLogged
                });

                $log.debug('New user has been stored to cache.');
            },
            /**
             * @ngdoc method
             * @name AppSecurity.factory:UserService#getCurrentUser
             * @methodOf AppSecurity.factory:UserService
             * @description Retrieves the current user from cache ('currentUser').
             * @returns {AppSecurity.global:User} The currently logged user
             */
            getCurrentUser: function () {
                var loggedUser = CacheFactory._browserCache.get('loggedUser');

                if (loggedUser && loggedUser.isLogged) {
                    return new User(loggedUser.username, loggedUser.roles, loggedUser.bToken, loggedUser.xsrfToken, loggedUser.isLogged);
                }
            },
            /**
             * @ngdoc method
             * @name AppSecurity.factory:UserService#removeUser
             * @methodOf AppSecurity.factory:UserService
             * @param {AppSecurity.global:User} loggedUser The currently logged user
             * @description Removes the current user from the app, including cache.
             */
            removeUser: function (loggedUser) {
                CacheFactory._browserCache.remove('loggedUser');
            }
        }
            }])

/* @doc function
 * @name AppSecurity.global:User
 * @param {string} name The name of the user to be registered
 * @param {object} roles Array with the list of assigned roles
 * @param {string} bToken The provided encrypted oauth token
 * @param {int} xsrfToken The XSRF token provided by the server
 * @param {boolean} isLogged The user is logged or not
 * @description Entity with main data about a user to be handled by the module
 */
function User(name, roles, bToken, xsrfToken, isLogged) {
    this.name = name;
    //Array
    this.roles = roles;
    //string
    this.bToken = bToken;
    //string
    this.xsrfToken = xsrfToken;
    //boolean
    this.isLogged = isLogged;
}

User.prototype.print = function () {
    return 'User data. Name:' + this.name + '| Roles: ' + this.roles.toString() + '| Bearer Token: ' + this.bToken + '| XSRFToken: ' + this.xsrfToken + '| Logged: ' + this.isLogged;
};

/**
 * @function
 * @param {string} requestUrl The url of the request.
 * @param {string} locationUrl The current browser location url.
 * @returns {boolean} Whether the request is for the same domain.
 * @description Parse a request and location URL and determine whether this is a same-domain request.
 */
function isSameDomain(requestUrl, locationUrl) {
    var IS_SAME_DOMAIN_URL_MATCH = /^(([^:]+):)?\/\/(\w+:{0,1}\w*@)?([\w\.-]*)?(:([0-9]+))?(.*)$/;
    var match = IS_SAME_DOMAIN_URL_MATCH.exec(requestUrl);
    // if requestUrl is relative, the regex does not match.
    if (match == null)
        return true;

    var domain1 = {
        protocol: match[2],
        host: match[4],
        port: int(match[6]) || DEFAULT_PORTS[match[2]] || null,
        // IE8 sets unmatched groups to '' instead of undefined.
        relativeProtocol: match[2] === undefined || match[2] === ''
    };

    match = URL_MATCH.exec(locationUrl);
    var domain2 = {
        protocol: match[1],
        host: match[3],
        port: int(match[5]) || DEFAULT_PORTS[match[1]] || null
    };

    return (domain1.protocol == domain2.protocol || domain1.relativeProtocol) &&
        domain1.host == domain2.host &&
        (domain1.port == domain2.port || (domain1.relativeProtocol &&
            domain2.port == DEFAULT_PORTS[domain2.protocol]));
};

/* @function
 * @param {string} requestUrl The url of the request.
 * @param {string} locationUrl The current browser location url.
 * @returns {boolean} Whether the request is for the same domain.
 * @description Parse a request and location URL and determine whether this is a same-domain request.
 */
function calculatexsrfHeader(providedCookie, xsrfPolicyType) {

};
