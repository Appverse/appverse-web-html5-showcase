/*jshint node:true */
'use strict';

describe('E2E: Testing rest view', function () {

    beforeAll(function () {
        browser.setLocation('rest');
    });

    it('should have a working /rest route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/rest');
    });

    it('should open user modal and cancel it', function () {

        element(by.buttonText('Add User')).click();

        browser.waitForAngular();

        element.all(by.css('.modal-title')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('User');
        });

        element(by.buttonText('Cancel')).click();

        browser.waitForAngular();
    });

    it('should open user modal and save it', function () {

        element.all(by.css('button[ng-click="openUser(row.entity)"]')).then(function (items) {
            items[0].click();
        });

        browser.waitForAngular();

        element.all(by.css('.modal-title')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('User');
        });

        element(by.buttonText('Save')).click();

        browser.waitForAngular();
    });

});
