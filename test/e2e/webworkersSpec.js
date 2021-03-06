/*jshint node:true */
"use strict";

describe("E2E: Testing webworkers view", function () {

    beforeAll(function () {
        browser.setLocation('webworkers');
    });

    it('should have a working /webworkers route', function () {
        expect(browser.getLocationAbsUrl()).toBe("/webworkers");
    });
});
