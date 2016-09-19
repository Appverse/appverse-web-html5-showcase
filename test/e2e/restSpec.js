/*jshint node:true */
'use strict';

describe('E2E: Testing rest view', function () {

    beforeAll(function () {
        browser.setLocation('rest');
    });

    it('should have a working /rest route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/rest');
    });

    it('should open the add user dialog and cancel it', function () {

        element(by.buttonText('Add User')).click();

        browser.waitForAngular();

        element.all(by.css('.modal-title')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('User');
        });

        element(by.buttonText('Cancel')).click();

        browser.waitForAngular();
    });

    it('should add a user', function () {

        element(by.buttonText('Add User')).click();

        browser.waitForAngular();

        element.all(by.css('.modal-title')).then(function (items) {
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe('User');
        });

        element(by.model('user.name')).sendKeys('testName');
        element(by.cssContainingText('option', 'female')).click();
        element(by.model('user.company')).sendKeys('testCompany');
        element(by.model('user.age')).sendKeys('1');

        element(by.buttonText('Add')).click();

        browser.waitForAngular();

        element.all(by.css('button.close')).then(function (items) {
            expect(items.length).toBe(1);
            items[0].click();
        });
    });

    it('should edit a user modal and save it', function () {

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

        element.all(by.css('button.close')).then(function (items) {
            expect(items.length).toBe(1);
            items[0].click();
        });
    });

    it('should delete a user', function () {

        browser.executeScript('window.confirm = function() {return true;}');

        element.all(by.css('button[av-rest-remove]')).then(function (items) {
            items[0].click();
        });

        element.all(by.css('button.close')).then(function (items) {
            expect(items.length).toBe(1);
            items[0].click();
        });
    });

});

describe('E2E: Testing rest-ng-repeat view', function () {

    beforeAll(function () {
        browser.setLocation('rest-ng-repeat');
    });

    it('should have a working /rest-ng-repeat route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/rest-ng-repeat');
        element.all(by.css('tr[ng-repeat]')).then(function (items) {
            expect(items.length).toBe(9);
        });
    });
});

describe('E2E: Testing rest-ag-grid view', function () {

    beforeAll(function () {
        browser.setLocation('rest-ag-grid');
    });

    it('should have a working /rest-ag-grid route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/rest-ag-grid');
        element.all(by.css('div.ag-row')).then(function (items) {
            expect(items.length).toBe(9);
        });
    });
});
