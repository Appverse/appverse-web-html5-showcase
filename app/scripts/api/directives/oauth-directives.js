'use strict';

angular.module('AppSecurity')

/**
 * @ngdoc directive
 * @name AppSecurity.directive:oauth
 * @restrict B
 * @requires AppConfiguration.constant:SECURITY_OAUTH
 * @requires AppSecurity.factory:Oauth_AccessToken
 * @requires AppSecurity.factory:Oauth_Endpoint
 * @requires AppSecurity.factory:Oauth_Profile
 * @requires $location
 * @requires $rootScope
 * @requires $compile
 * @requires $http
 * @requires $templateCache
 *
 * @description
 * Oauth Login Directive.
 * You can use the directive with or without data in the directive declaration.
 * If data are not included they will be loaded from configuration files.
 * Data in declaration overwrites data from configuration files.
 * 
 * 
 * @example
 <example module="AppSecurity">
    <file name="index.html">
        <p>OAuth test</p>
        <oauth ng-cloak
            site="http://myoauthserver.com"
            client="e72c43c75adc9665e4d4c13354c41f337d5a2e439d3da1243bb47e39745f435c"
            redirect="http://localhost:9000"
            scope="resources"
            profile="http://myoauthserver.com/me"
            storage="cookies">Sign In
        </oauth>
    </file>
</example>

 * Note ng-cloak directive (http://docs.angularjs.org/api/ng.directive:ngCloak)
 * is used to prevent the Angular html template from being briefly displayed by
 * the browser in its raw (uncompiled) form while your application is loading.
 */
.directive('oauth', ['SECURITY_OAUTH', 'Oauth_AccessToken', 'Oauth_Endpoint', 'Oauth_Profile', '$rootScope', '$compile', '$http', '$templateCache',
  function (SECURITY_OAUTH, AccessToken, Endpoint, Profile, $rootScope, $compile, $http, $templateCache) {

        var definition = {
            restrict: 'AE',
            replace: false,
            scope: {
                site: '@', // (required) set the oauth2 server host
                client: '@', // (required) client id
                redirect: '@', // (required) client redirect uri
                scope: '@', // (optional) scope
                flow: '@', // (required) flow (e.g password, implicit)
                view: '@', // (optional) view (e.g standard, popup)
                storage: '@', // (optional) storage (e.g none, cookies)
                profile: '@', // (optional) user info URL
                template: '@' // (optional) template to render
            }
        };

        definition.link = function postLink(scope, element, attrs) {
            scope.show = 'none';

            scope.$watch('client', function (value) {
                init(); // set defaults
                compile(); // gets the template and compile the desired layout
                Endpoint.set(scope); // set the oauth client url for authorization
                AccessToken.set(scope); // set the access token object (from fragment or cookies)
                initProfile(); // get the profile info
                initView(); // set the actual visualization status for the widget
            });


            /**
             * @function
             * @description set defaults into the scope object
             */
            function init() {
                scope.site = scope.site || SECURITY_OAUTH.scopeURL;
                scope.clientID = scope.clientID || SECURITY_OAUTH.clientID;
                scope.redirect = scope.redirect || SECURITY_OAUTH.redirect;
                scope.scope = scope.scope || SECURITY_OAUTH.scope;
                scope.flow = scope.flow || SECURITY_OAUTH.flow;
                scope.view = scope.view || SECURITY_OAUTH.view;
                scope.storage = scope.storage || SECURITY_OAUTH.storage;
                scope.scope = scope.scope || SECURITY_OAUTH.scope;
                scope.authorizePath = scope.authorizePath || SECURITY_OAUTH.scope_authorizePath;
                scope.tokenPath = scope.tokenPath || SECURITY_OAUTH.scope_tokenPath;
                scope.template = scope.template || SECURITY_OAUTH.scope_template;
            }

            /**
             * @function
             * @description
             * Gets the template and compile the desired layout.
             * Based on $compile, it compiles a piece of HTML string or DOM into the retrieved
             * template and produces a template function, which can then be used to link scope and
             * the template together.
             */
            function compile() {
                $http.get(scope.template, {
                    //This allows you can get the template again by consuming the
                    //$templateCache service directly.
                    cache: $templateCache
                })
                    .success(function (html) {
                        element.html(html);
                        $compile(element.contents())(scope);
                    });
            };

            /**
             * @function
             * @description
             * Gets the profile info.
             */
            function initProfile() {
                var token = AccessToken.get();
                if (token && token.access_token && SECURITY_OAUTH.profile)
                    scope.profile = Profile.get();
            }

            /**
             * @function
             * @description
             * Sets the actual visualization status for the widget.
             */
            function initView(token) {
                var token = AccessToken.get();
                // There is not token: without access token it's logged out
                if (!token) {
                    return loggedOut()
                }
                // The request exists: if there is the access token we are done
                if (token.access_token) {
                    return loggedIn()
                }
                // The request is denied: if the request has been denied we fire the denied event
                if (token.error) {
                    return denied()
                }
            }

            scope.login = function () {
                Endpoint.redirect();
            }

            scope.logout = function () {
                AccessToken.destroy(scope);
                loggedOut();
            }

            /**
             * @function
             * @description -
             */
            function loggedIn() {
                $rootScope.$broadcast('oauth:success', AccessToken.get());
                scope.show = 'logout';
            }

            /**
             * @function
             * @description -
             */
            function loggedOut() {
                $rootScope.$broadcast('oauth:logout');
                scope.show = 'login';
            }

            /**
             * @function
             * @description -
             */
            function denied() {
                scope.show = 'denied';
                $rootScope.$broadcast('oauth:denied');
            }

            scope.$on('oauth:template', function (event, template) {
                scope.template = template;
                compile(scope);
            });
        };

        return definition;
}]);
