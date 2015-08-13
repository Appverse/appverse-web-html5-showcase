/*jshint node:true */
"use strict";

describe("E2E: Testing detection view", function () {

    beforeAll(function () {
        browser.setLocation('detection');
    });

    it('should have a working /detection route', function () {
        expect(browser.getLocationAbsUrl()).toBe("/detection");
    });

    it('should have a initial bandwidth greater than 0', function () {
        expect(element(by.binding('detect.bandwidth')).getText()).toBeGreaterThan(0);
    });

});
