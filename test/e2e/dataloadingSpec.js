/*jshint node:true */
"use strict";

describe("E2E: Testing dataloading view", function () {

    beforeAll(function () {
        browser.setLocation('demos/dataloading');
    });

    it('should have a working /demos/dataloading route', function () {
        expect(browser.getLocationAbsUrl()).toBe("/demos/dataloading");
    });

    it('should have indicate the number of rows in the footer', function () {

        element.all(by.binding('maxRows()')).then(function (items) {
            expect(items.length).toBe(3);
            expect(items[0].getText()).toBe('Total Items: 20000');
        });
    });
});
