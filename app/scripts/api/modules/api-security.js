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

/**
 * @ngdoc module
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
    'AppConfiguration' // Common API Module: configuration
])


.run(['$log',
    function ($log) {
        $log.info('AppSecurity run');
    }])

// HTML5 mode
//.config(['$locationProvider', function($locationProvider) {
//  $locationProvider.html5Mode(true).hashPrefix('!');
//}])

/**
 * @ngdoc service
 * @name AppSecurity.factory:Oauth_AccessToken
 * @requires $location
 * @requires $cookies
 * @description
 * OAuth access token service.
 * Management of the access token.
 */
.factory('Oauth_AccessToken', ['$location', '$cookies',
  function ($location, $cookies) {

        var factory = {};
        var token = null;


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_AccessToken#get
         * @methodOf AppSecurity.factory:Oauth_AccessToken
         * @description Returns the access token.
         * @returns {object} The user token from the oauth server
         */
        factory.get = function () {
            return token
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
            if (scope.storage === 'cookies') {
                if (params && params.access_token) {
                    $cookies[scope.client] = JSON.stringify(params);
                }
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
 * @name AppSecurity.factory:Oauth_RequestWrapper
 * @requires AppSecurity.factory:Oauth_AccessToken
 * @requires AppSecurity.factory:Oauth_Endpoint
 * @requires $http
 *
 * @description
 * Requests wrapper. It wraps every request setting needed header by injecting
 * the access token into the header
 */
.factory('Oauth_RequestWrapper', ['Oauth_AccessToken', 'Oauth_Endpoint', '$http',
    function (AccessToken, Endpoint, $http) {
        var factory = {};
        var token;


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_RequestWrapper#wrap
         * @methodOf AppSecurity.factory:Oauth_RequestWrapper
         * @param {object} resource Array with resources
         * @param {object} actions Array with actions
         * @param {object} options Array with options
         * @description Wraps every request.
         * @returns {object} the request wrapped resource
         */
        factory.wrap = function (resource, actions, options) {
            var wrappedResource = resource;
            for (var i = 0; i < actions.length; i++) {
                request(wrappedResource, actions[i]);
            };
            return wrappedResource;
        };


        /////////////////////////////Private methods///////////////////////////////////


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_RequestWrapper#request
         * @methodOf AppSecurity.factory:Oauth_RequestWrapper
         * @param {object} resource The resource
         * @param {object} action The action
         * @description Verify if the access token exists and based on it set or unset the header request.
         * @returns {string} the request resource
         */
        function request(resource, action) {
            resource['_' + action] = resource[action];

            resource[action] = function (params, data, success, error) {
                var token = AccessToken.get();
                if (token && AccessToken.expired()) {
                    Endpoint.redirect()
                }

                setAuthorizationHeader(token);
                return resource['_' + action].call(this, params, data, success, error);
            };
        };


        /**
         * @ngdoc method
         * @name AppSecurity.factory:Oauth_RequestWrapper#setAuthorizationHeader
         * @methodOf AppSecurity.factory:Oauth_RequestWrapper
         * @param {string} token The token avlue from the oauth server
         * @description Set the oauth request header
         */
        function setAuthorizationHeader(token) {
            if (token)
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + token.access_token;
            else
                delete $http.defaults.headers.common['Authorization']
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

                var roles = CacheFactory._browserCache.currentUser.roles
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
.factory('AuthenticationService', ['UserService',
    function (UserService) {

        'use strict';

        return {

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
            login: function (name, roles, token, isLogged) {
                var user = new User(name, roles, token, isLogged);
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
             * @ngdoc method
             * @name AppSecurity.factory:UserService#setCurrentUser
             * @methodOf AppSecurity.factory:UserService
             * @param {AppSecurity.global:User} loggedUser The currently logged user
             * @description Writes the current user in cache ('currentUser').
             */
            setCurrentUser: function (loggedUser) {
                $log.debug('Setting new user:');
                $log.debug(loggedUser.print());
                CacheFactory._browserCache.currentUser = loggedUser;
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
                return CacheFactory._browserCache.currentUser;
            },

            /**
             * @ngdoc method
             * @name AppSecurity.factory:UserService#removeUser
             * @methodOf AppSecurity.factory:UserService
             * @param {AppSecurity.global:User} loggedUser The currently logged user
             * @description Removes the current user from the app, including cache.
             */
            removeUser: function (loggedUser) {
                CacheFactory._browserCache.currentUser = null;
                CacheFactory._scopeCache.put('login_status', 'Not connected');
                CacheFactory._scopeCache.put('userProfile', null);
            }
        }
}]);




/**
 * @doc function
 * @name AppSecurity.global:User
 * @param {string} name The name of the user to be registered
 * @param {object} roles Array with the list of assigned roles
 * @param {string} token The provided encrypted oauth token
 * @param {boolean} isLogged The user is logged or not
 * @description Entity with main data about a user to be handled by the module
 */
function User(name, roles, token, isLogged) {
    this.name = name;
    //Array
    this.roles = roles;
    //string
    this.token = token;
    //boolean
    this.isLogged = isLogged;
};

User.prototype.print = function () {
    return 'User data. Name:' + this.name + '| Roles: ' + this.roles.toString() + '| Token: ' + this.token + '| Logged: ' + this.isLogged;
}
