'use strict';

describe("E2E: Testing Controllers", function () {

    var root = 'http://localhost:9090/';
    browser.get(root);

    it('should have a working home page controller', function () {
        browser.setLocation('/home');
        expect(browser.getLocationAbsUrl()).toBe(root + "#/home");
        //        element.all(by.css('[ui-view]')).then(function (items) {
        //            expect(items[0].getInnerHtml()).toContain('ng-controller="OauthLoginCtrl"');
        // });
    });

});
