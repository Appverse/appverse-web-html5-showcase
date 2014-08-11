/*jshint -W030 */

"use strict";

describe('Unit: Testing AppSecurity module', function () {

    beforeEach(module('AppSecurity'));

    it('should contain a Oauth_Endpoint factory',
        inject(function (Oauth_Endpoint) {

            expect(Oauth_Endpoint).to.be.an.object;
        })
    );

    it('should contain a Oauth_AccessToken factory',
        inject(function (Oauth_AccessToken) {

            expect(Oauth_AccessToken).to.be.an.object;
        })
    );

//    it('should contain a Oauth_Profile factory',
//        inject(function (Oauth_Profile) {
//
//            expect(Oauth_Profile).to.be.an.object;
//        })
//    );

    it('should contain a RoleService factory',
        inject(function (RoleService) {

            expect(RoleService).to.be.an.object;
        })
    );

    it('should contain a AuthenticationService factory',
        inject(function (AuthenticationService) {

            expect(AuthenticationService).to.be.an.object;
        })
    );
});
