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

        /**
         * @function
         * @param accessToken
         * @description Validates the passed access token. The TokenInfo endpoint will respond with a JSON array
         * that describes the token or an error. Below is a table of the fields included in the non-error case:
         * audience:	The application that is the intended target of the token.
         * scope:	The space-delimited set of scopes that the user consented to.
         * userid:	This field is only present if the profile scope was present in the request.
         * The value of this field is an immutable identifier for the logged-in user, and may be used when creating
         * and managing user sessions in your application. This identifier is the same regardless of the client ID.
         * This provides the ability to correlate profile information across multiple applications in the same
         * organization.
         * expires_in:	The number of seconds left in the lifetime of the token.
         */
        $scope.validateToken = function(accessToken) {
            $log.debug('Validating user token: ' + accessToken);
            $.ajax({
                type: 'GET',
                url: 'https://www.googleapis.com/oauth2/v1/tokeninfo',
                async: true,
                contentType: 'application/json',
                dataType: 'jsonp',
                params: {
                    access_token: accessToken.token,
                    callback: 'JSON_CALLBACK'
                },
                success: function(result) {
                    // The token is still valid.
                    $log.debug('The log is still valid.');
                },
                error: function(e) {
                    // The token is not valid anymore
                    $log.debug('The log is not yet valid. Token renewal policy must be applied.');
                    if(GOOGLE_AUTH.tokenRenewalPolicy == GOOGLE_AUTH.automatic_renovation){
                        //TODO renewal
                    }else if(GOOGLE_AUTH.tokenRenewalPolicy == GOOGLE_AUTH.manual_renovation){
                        var r = confirm("The access token is invalid. Do you wish renew it?");
                        var x;
                        if (r == true){
                            x = "Yes";
                        }else{
                            x = "No";
                        }
                        $log.debug("The answer to token renewal was: " + x);
                        //TODO renewal
                    }else if(GOOGLE_AUTH.tokenRenewalPolicy == GOOGLE_AUTH.revocation){
                        $log.debug("Disconnecting user..");
                        CacheFactory._scopeCache.put('login_status', 'Not connected');
                        AuthenticationService.logOut();
                        $scope.loginStatus = 'Not connected'
                        $scope.$apply();
                        $log.debug("User disconnected and erased from cache");
                    }
                }
            });
        };


    //    $scope.loadTimeLine = function() {
    //         var request = gapi.client.plus.activities.list({'userId' : 'me'});
    //	 request.execute( function(activities) {
    //	    $scope.activities = activities.result.items;
    //	    $scope.$apply();
    //	 });
    //   };


    //   function getEmail(){
    //    // Load oauth2 libraries to enable userinfo methods.
    //    gapi.client.load('oauth2', 'v2', function() {
    //          var request = gapi.client.oauth2.userinfo.get();
    //          request.execute(getEmailCallback);
    //        });
    //  }
    //
    //  function getEmailCallback(obj){
    //    var el = document.getElementById('email');
    //    var email = '';
    //
    //    if (obj['email']) {
    //      email = 'Email: ' + obj['email'];
    //    }
    //
    //    //$log.debug(obj);   // Overview the whole object.
    //
    //    el.innerHTML = email;
    //    toggleElement('email');
    //  }
    }else{
        $scope.loginStatus =  'Security not enabled';
        //$log.debug('SECURITY NOT ENABLED. LoginStatus values is: ' + $scope.loginStatus);
    }
    
    
}]);