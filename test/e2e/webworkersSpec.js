/*jshint node:true */
"use strict";

describe("E2E: Testing webworkers view", function () {

    beforeAll(function () {
        browser.setLocation('demos/webworkers');
    });

    it('should have a working /demos/webworkers route', function () {
        expect(browser.getLocationAbsUrl()).toBe("/demos/webworkers");
    });
});
