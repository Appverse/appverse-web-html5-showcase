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
.controller('GooglePlusLoginCtrl', ['$scope', '$log', 'GOOGLE_AUTH', 'AUTHORIZATION_DATA', 'AuthenticationService', 'UserService', 'CacheFactory',
    function($scope, $log, GOOGLE_AUTH, AUTHORIZATION_DATA, AuthenticationService, UserService, CacheFactory) {
//    $log.debug('GOOGLE_AUTH.scopeURL: ' + GOOGLE_AUTH.scopeURL);
//    $log.debug('GOOGLE_AUTH.requestvisibleactionsURL: ' + GOOGLE_AUTH.requestvisibleactionsURL);
//    $log.debug('GOOGLE_AUTH.clientID: ' + GOOGLE_AUTH.clientID);
//    $log.debug('GOOGLE_AUTH.theme: ' + GOOGLE_AUTH.theme);
//    $log.debug('GOOGLE_AUTH.cookiepolicy: ' + GOOGLE_AUTH.cookiepolicy);
//    $log.debug('GOOGLE_AUTH.revocationURL: ' + GOOGLE_AUTH.revocationURL);
    
    
    var parameters = {"scope": GOOGLE_AUTH.scopeURL,
      "requestvisibleactions": GOOGLE_AUTH.requestvisibleactionsURL,
      "clientId": GOOGLE_AUTH.clientID,
      "theme": GOOGLE_AUTH.theme, 
      "callback":function(authResult) {
          $scope.onSignInCallback(authResult)
      },
      "cookiepolicy": GOOGLE_AUTH.cookiepolicy
    };
    //$log.debug('LOGIN STATUS IN CACHE: ' + CacheFactory.getScopeCache('login_status'));
    if(CacheFactory.getScopeCache('login_status')){
        $scope.loginStatus =  CacheFactory.getScopeCache('login_status');
        $scope.profile = CacheFactory.getScopeCache('userProfile');
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
                
                //$log.info('User succesfully logged.');

		var request = gapi.client.plus.people.get( {'userId' : 'me'} );
		request.execute( function(profile) {
                        
                        /*
                         * The authenticated user is set by using the UserService.
                         */
                        var roles = new Array();
                         //$log.debug('profile.displayName: ' +profile.displayName);
                         //$log.debug('AUTHORIZATION_DATA.userRoleMatrix.longitud: ' + AUTHORIZATION_DATA.userRoleMatrix.length);
                         
                        for(var i = 0; i < AUTHORIZATION_DATA.userRoleMatrix.length; i++) {
                            //$log.debug('AUTHORIZATION_DATA.userRoleMatrix.user: ' + AUTHORIZATION_DATA.userRoleMatrix[i].user);
                            if(AUTHORIZATION_DATA.userRoleMatrix[i].user === profile.displayName){
                                var counter=0;
                                //$log.debug('FOUND ROLES: ' + AUTHORIZATION_DATA.userRoleMatrix[i].roles.length);
                                for (var y = 0; y < AUTHORIZATION_DATA.userRoleMatrix[i].roles.length; y++){
                                    roles[counter] = AUTHORIZATION_DATA.userRoleMatrix[i].roles[y];
                                    counter++;
                                }
                                break;
                            }
                        }
                        
                        
                        //$log.debug('Roles list for the user ' + profile.displayName + ': ' + roles);
                        var currentUser = new User(profile.displayName, roles, authResult['access_token'], true);
                        AuthenticationService.login(currentUser)
                    
                        var cache = CacheFactory.setBrowserStorage(2);
                        //$log.debug('+++++++++USER IN CACHE| ' + cache.currentUser.print());
                        
                        CacheFactory.setScopeCache('login_status', 'connected');
                        CacheFactory.setScopeCache('userProfile', profile);
                        //$log.debug('CONTENT IN SCOPE CACHE: ' + CacheFactory.getScopeCache('login_status'));
                        
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
              //AuthenticationService.logOut();
              //$scope.apply();
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
          async: false,
          contentType: 'application/json',
          dataType: 'jsonp',
          success: function(result) {
            $log.debug("User disconnected");
            CacheFactory.setScopeCache('login_status', 'Not connected');
            AuthenticationService.logOut();
            $scope.loginStatus = 'Not connected'
            $scope.$apply();
            $log.debug("User disconnected..end");
          },
          error: function(e) {
            $log.error("Error when trying disconnecting from Google: " + e);
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
}]);