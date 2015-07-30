/*jshint node:true */
'use strict';

describe("E2E: Testing Routes", function () {

    it('should jump to the /home path when / is accessed', function () {
        browser.setLocation('');
        expect(browser.getLocationAbsUrl()).toBe("/home");
    });

    it('should have a working /home route', function () {
        browser.setLocation('home');
        expect(browser.getLocationAbsUrl()).toBe("/home");
    });

//    it('should collect coverage', function (done) {
//        browser.driver.executeScript('return __coverage__;').then(function (val) {
//            console.log('my istanbul coverage: ' + val);
//            console.log(val);
//            browser.coverage=val;
//            done();
//        });
//    });
});
