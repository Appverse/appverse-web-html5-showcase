/*jshint node:true */
'use strict';

describe('E2E: Testing oauth view', function () {

    beforeAll(function () {
        browser.setLocation('oauth');
    });

    it('should have a working /oauth route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/oauth');
    });
});

describe('E2E: Testing roles view', function () {

    beforeAll(function () {
        browser.setLocation('roles');
    });

    it('should redirect to /roles/login page', function () {

        expect(browser.getLocationAbsUrl()).toBe('/roles/login');
    });

    it('should fail login with wrong user', function () {

        element(by.model('username')).clear().sendKeys('admin');
        element(by.model('password')).clear().sendKeys('wrongPassword');
        element(by.buttonText('Login')).click();
    });

    it('should login with admin user', function () {

        element(by.model('username')).clear().sendKeys('admin');
        element(by.model('password')).clear().sendKeys('admin');
        element(by.css('button[type="submit"]')).click();
    });

    it('should access to /roles/help page', function () {

        browser.setLocation('roles/help');
        expect(browser.getLocationAbsUrl()).toBe('/roles/help');
    });

    it('should access to /roles/profile page', function () {

        browser.setLocation('roles/profile');
        expect(browser.getLocationAbsUrl()).toBe('/roles/profile');
    });

    it('should denied access to /roles/customer page', function () {

        browser.setLocation('roles/customer');
        expect(browser.getLocationAbsUrl()).toBe('/roles/routeDenied');
    });

    it('should logout user', function () {

        element(by.buttonText('Logout')).click();
    });
});
