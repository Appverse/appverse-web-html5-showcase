/*jshint node:true */
'use strict';

describe('E2E: Testing UI Bootstrap view', function () {

    beforeAll(function () {
        browser.setLocation('ui-bootstrap');
    });

    it('should have a working /ui-bootstrap route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/ui-bootstrap');
    });

    it('should open a large modal and cancel it', function () {

        element(by.buttonText('Large modal')).click();

        browser.waitForAngular();

        element.all(by.css('.modal-title')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('I\'m a modal!');
        });

        element(by.buttonText('Cancel')).click();

        browser.waitForAngular();
    });

    it('should open a small modal and ok it', function () {

        element(by.buttonText('Small modal')).click();

        browser.waitForAngular();

        element.all(by.css('.modal-title')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('I\'m a modal!');
        });

        element(by.buttonText('OK')).click();

        browser.waitForAngular();
    });

});
