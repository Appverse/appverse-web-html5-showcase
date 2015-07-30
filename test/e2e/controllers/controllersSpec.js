"use strict";

describe("E2E: Testing Controllers", function () {

    it('should have a working home page controller', function () {
        browser.setLocation('home');
        expect(browser.getLocationAbsUrl()).toBe("/home");
        var title = element.all(by.css('h1'));
        title.count().then(function (count) {
            expect(count).toEqual(1);
        });
    });

});
