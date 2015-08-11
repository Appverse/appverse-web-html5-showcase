/*jshint node:true */
'use strict';

describe('E2E: Testing components view', function () {

    beforeAll(function () {
        browser.setLocation('components');
    });

    it('should have a working /components route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/components');
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
