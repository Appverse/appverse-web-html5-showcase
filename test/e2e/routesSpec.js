/*jshint node:true */
'use strict';

describe("E2E: Testing Routes", function () {

    it('should jump to the /home path when / is accessed', function () {
        browser.setLocation('');
        expect(browser.getLocationAbsUrl()).toBe("/home");
    });

    it('should have a working /theme route', function () {
        browser.setLocation('theme');
        expect(browser.getLocationAbsUrl()).toBe("/theme");
    });

    it('should have a working /charts route', function () {
        browser.setLocation('charts');
        expect(browser.getLocationAbsUrl()).toBe("/charts");
    });

    it('should have a working /generator route', function () {
        browser.setLocation('generator');
        expect(browser.getLocationAbsUrl()).toBe("/generator");
    });

    it('should have a working /doc route', function () {
        browser.setLocation('doc');
        expect(browser.getLocationAbsUrl()).toBe("/doc");
    });

    it('should have a working /links route', function () {
        browser.setLocation('links');
        expect(browser.getLocationAbsUrl()).toBe("/links");
    });
});
