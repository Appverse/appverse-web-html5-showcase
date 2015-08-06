/*jshint node:true */
'use strict';

describe("E2E: Testing Routes", function () {

    it('should jump to the /home path when / is accessed', function () {
        browser.setLocation('');
        expect(browser.getLocationAbsUrl()).toBe("/home");
    });

    it('should have a working /home route', function () {
        browser.setLocation('theme');
        expect(browser.getLocationAbsUrl()).toBe("/theme");
    });

    it('should have a working /home route', function () {
        browser.setLocation('components');
        expect(browser.getLocationAbsUrl()).toBe("/components");
    });

    it('should have a working /home route', function () {
        browser.setLocation('charts');
        expect(browser.getLocationAbsUrl()).toBe("/charts");
    });

    it('should have a working /home route', function () {
        browser.setLocation('about');
        expect(browser.getLocationAbsUrl()).toBe("/about");
    });
});
