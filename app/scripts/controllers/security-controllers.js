'use strict';
/*
 * Set of controllers for security ops.
 *
 */
angular.module('App.Controllers')

/**
 * @ngdoc object
 * @name GooglePlusLoginCtrl
 * @requires $scope
 * @requires $log
 * @requires GOOGLE_AUTH
 * @requires AUTHORIZATION_DATA
 * @requires SECURITY_GENERAL
 * @requires AuthenticationService
 * @requires CacheFactory
 *
 * @description
 * GooglePlusLoginCtrl is controller to handle Google+ authentication.
 *
 */
.controller('GooglePlusLoginCtrl', ['$scope', '$log', 'GOOGLE_AUTH', 'AUTHORIZATION_DATA', 'SECURITY_GENERAL', 'AuthenticationService', 'CacheFactory',
    function($scope, $log, GOOGLE_AUTH, AUTHORIZATION_DATA, SECURITY_GENERAL, AuthenticationService, CacheFactory) {

    if(SECURITY_GENERAL.securityEnabled){
        var parameters = {"scope": GOOGLE_AUTH.scopeURL,
            "requestvisibleactions": GOOGLE_AUTH.requestvisibleactionsURL,
            "clientId": GOOGLE_AUTH.clientID,
            "theme": GOOGLE_AUTH.theme,
            "callback":function(authResult) {
                $scope.onSignInCallback(authResult)
            },
            "cookiepolicy": GOOGLE_AUTH.cookiepolicy
        };

        //$log.debug('LOGIN STATUS IN CACHE: ' + CacheFactory._scopeCache.get('login_status'));
        if(CacheFactory._scopeCache.get('login_status')){
            $scope.loginStatus =  CacheFactory._scopeCache.get('login_status');
            $scope.profile = CacheFactory._scopeCache.get('userProfile');
        }else{
            $scope.loginStatus =  'Not connected';
        }

        /**
         *
         * @param {type} authResult
         * @returns {undefined}
         * @description Sign in to Google+ and initializes the user information
         * after authentication.
         */
        gapi.signin.render('gButton',parameters);
        $scope.onSignInCallback = function(authResult) {
             gapi.client.load('plus','v1', function(){
                if (authResult['error'] == undefined) {
                    $scope.loginStatus = 'connected';
                    $scope.$apply();

                    var request = gapi.client.plus.people.get( {'userId' : 'me'} );
                    request.execute( function(profile) {

                            //We find out the roles for the user
                            var roles = new Array();

                            for(var i = 0; i < AUTHORIZATION_DATA.userRoleMatrix.length; i++) {
                                if(AUTHORIZATION_DATA.userRoleMatrix[i].user === profile.displayName){
                                    var counter=0;
                                    for (var y = 0; y < AUTHORIZATION_DATA.userRoleMatrix[i].roles.length; y++){
                                        roles[counter] = AUTHORIZATION_DATA.userRoleMatrix[i].roles[y];
                                        counter++;
                                    }
                                    break;
                                }
                            }
                            //The authenticated user is set by using the AuthenticationService.
                            AuthenticationService.login(profile.displayName, roles, authResult['access_token'], '', true);

                            CacheFactory._scopeCache.put('login_status', 'connected');
                            CacheFactory._scopeCache.put('userProfile', profile);

                            $scope.profile = profile;
                            $scope.$apply();
                    });
                }else if (authResult['error']) {
                  // There was an error.
                  // Possible error codes:
                  //   "access_denied" - User denied access to your app
                  //   "immediate_failed" - Could not automatially log in the user
                  if(authResult['error'] == 'immediate_failed'){
                      $log.error('There was an error when connecting to Google+: Could not automatically log in the user.');
                  }else if(authResult['error'] == 'access_denied'){
                      $log.error('There was an error when connecting to Google+: User denied access to your app.');
                  };
                  $scope.loginStatus = 'Not Connected';
                  $scope.loginMessage = 'Login failed: ' + authResult['error'];
                }
            })
        }

       /**
        * @function
        * @description Revoke user token.
        * It uses jQuery's $.ajax whether the REST module is not available.
        */
       $scope.logout = function() {
             $log.debug('Revoking user token: ' + gapi.auth.getToken().access_token);
             $.ajax({
              type: 'GET',
              url: GOOGLE_AUTH.revocationURL + gapi.auth.getToken().access_token,
              async: true,
              contentType: 'application/json',
              dataType: 'jsonp',
              success: function(result) {
                $log.debug("Disconnecting user..");
                CacheFactory._scopeCache.put('login_status', 'Not connected');
                AuthenticationService.logOut();
                $scope.loginStatus = 'Not connected'
                $scope.$apply();
                $log.debug("User disconnected and erased from cache");
              },
              error: function(e) {
                $log.error("Error when trying disconnecting from Google: " + e);
              }
            });
        };


    }else{
        $scope.loginStatus =  'Security not enabled';
        $log.info('SECURITY NOT ENABLED. LoginStatus values is: ' + $scope.loginStatus);
    }


}])


.controller('OauthLoginCtrl', ['$scope', '$modal', '$log', 'AuthenticationService', 'UserService', 'CacheFactory', 'SECURITY_GENERAL',
    function($scope, $modal, $log, AuthenticationService, UserService, CacheFactory, SECURITY_GENERAL) {

        if(SECURITY_GENERAL.securityEnabled){
            /*
             * Check if the user is already loggedin
             */
            $scope.user = UserService.getCurrentUser();

            if($scope.user && $scope.user.isLogged){
                $scope.login_status = SECURITY_GENERAL.connected;
                CacheFactory._scopeCache.put('login_status', SECURITY_GENERAL.connected);
            }else{
                $scope.login_status = SECURITY_GENERAL.disconnected;
                CacheFactory._scopeCache.put('login_status', SECURITY_GENERAL.disconnected);
            }

            $scope.open = function (credentials) {
                $scope.credentials = credentials;

                var modalInstance = $modal.open({
                    templateUrl: 'modalLoginForm.html',
                    backdrop: true,
                    windowClass: 'modal',
                    controller: LoginCtrl,
                    resolve: {
                        credentials: function () {
                           return $scope.credentials;
                        }
                    }
                });
                modalInstance.result.then(function (response) {

                    AuthenticationService.login(
                        response.data.username,
                        response.data.roles,
                        response.headers(SECURITY_GENERAL.BearerTokenResponseHeader),
                        response.headers(SECURITY_GENERAL.XSRFCSRFResponseCookieName),
                        true
                    );

                    $scope.login_status = SECURITY_GENERAL.connected;
                    CacheFactory._scopeCache.put('login_status', SECURITY_GENERAL.connected);
                    $scope.user = UserService.getCurrentUser();
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /**
            * @function
            * @description Revoke user token.
            * It uses jQuery's $.ajax whether the REST module is not available.
            */
            $scope.logout = function() {
                 $log.debug('Revoking user token: ' + $scope.user.bToken);
                 AuthenticationService.logOut();
                 $scope.login_status = SECURITY_GENERAL.disconnected;
                 $log.debug("User disconnected and erased from cache");
            };

            var LoginCtrl = function ($scope, $modalInstance, AuthenticationService, credentials){
                $scope.errorMessage = '';
                $scope.credentials = credentials;
                $scope.login_status = SECURITY_GENERAL.disconnected;
                CacheFactory._scopeCache.put('login_status', SECURITY_GENERAL.disconnected);
                $scope.submit = function () {
                    AuthenticationService.sendLoginRequest(credentials)
                    .then(function (response) {
                        $log.info('Successfull authentication');
                        $modalInstance.close(response);
                    }, function (error) {
                        $log.error("The user has not connected nor authenticated against the server: " + error);
                        $scope.errorMessage = "Credentials are not valid. Please enter new user and password.";
                        //$modalInstance.dismiss('cancel');
                    });


                }
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                }
            };
        }else{
            $scope.login_status =  SECURITY_GENERAL.notEnabled;
            $log.warn("Security is not enabled in this application.");
        }


}]);
