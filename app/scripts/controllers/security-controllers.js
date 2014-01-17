'use strict';
/*
 * Set of controllers for security ops.
 * 
 */
angular.module('appverseClientIncubatorApp')

/**
 * @ngdoc object
 * @name oauth
 * @requires $scope
 * @requires $log
 * @requires GOOGLE_AUTH
 * @requires UserService
 * 
 * @description
 * GooglePlusLoginCtrl is controller to handle Google+ authentication.
 * 
 */
.controller('GooglePlusLoginCtrl', ['$scope', '$log', 'GOOGLE_AUTH', 'AUTHORIZATION_DATA', 'SECURITY_GENERAL', 'AuthenticationService', 'CacheFactory',
    function($scope, $log, GOOGLE_AUTH, AUTHORIZATION_DATA, SECURITY_GENERAL, AuthenticationService, CacheFactory) {
//    $log.debug('GOOGLE_AUTH.scopeURL: ' + GOOGLE_AUTH.scopeURL);
//    $log.debug('GOOGLE_AUTH.requestvisibleactionsURL: ' + GOOGLE_AUTH.requestvisibleactionsURL);
//    $log.debug('GOOGLE_AUTH.clientID: ' + GOOGLE_AUTH.clientID);
//    $log.debug('GOOGLE_AUTH.theme: ' + GOOGLE_AUTH.theme);
//    $log.debug('GOOGLE_AUTH.cookiepolicy: ' + GOOGLE_AUTH.cookiepolicy);
//    $log.debug('GOOGLE_AUTH.revocationURL: ' + GOOGLE_AUTH.revocationURL);
    
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
                    $scope.loginStatus = 'connected'
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
                            AuthenticationService.login(profile.displayName, roles, authResult['access_token'], true);

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
    
    
}]);