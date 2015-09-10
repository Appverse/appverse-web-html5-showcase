/*jshint node:true */
/*globals expect:true */

var chai = require("chai");

var expect = chai.expect;

module.exports = function () {

    'use strict';

    var initialNumOfItems = 0;

    this.Given(/^I go to Content\/Cache/, function (callback) {
        browser.get('#/cache');
        browser.waitForAngular();
        callback();
    });

    this.Given(/^data is shown in the table$/, function (callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            initialNumOfItems = items.length;
            expect(items).to.have.length.above(0);
            callback();
        });
    });





    this.When(/^I enter title: (.*), item description: (.*)$/, function (title, description, callback) {
        element(by.model('note.title')).sendKeys(title);
        element(by.model('note.body')).sendKeys(description);
        callback();
    });

    this.When(/^click on the Create\/Update Button$/, function (callback) {
        element(by.buttonText('Create/Update')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Then(/^total items is initial number of items plus one new item$/, function (callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            expect(items.length).to.equal(initialNumOfItems + 1);
            callback();
        });
    });

    this.When(/^I click on the Clear Form for a new Note button$/, function (callback) {
        element(by.buttonText('Clear Form for a new Note')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.When(/^I enter title: (.*), item description: (.*)$/, function (title, description, callback) {
        element(by.model('note.title')).sendKeys(title);
        element(by.model('note.body')).sendKeys(description);
        callback();
    });

    this.When(/^click on the Create\/Update Button$/, function (callback) {
        element(by.buttonText('Create/Update')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Then(/^total items is initial number of items plus two new items$/, function (callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            expect(items.length).to.equal(initialNumOfItems + 2);
            callback();
        });
    });





    this.When(/^I click the first row in the table$/, function (callback) {
        element.all(by.repeater('note in notes').row(0)).then(function() {
            element(by.binding('note.title')).click();
            callback();
        });
    });

    this.When(/^I enter title: (.*), item description: (.*)$/, function (title, description, callback) {
        element(by.model('note.title')).clear().sendKeys(title);
        element(by.model('note.body')).clear().sendKeys(description);
        callback();
    });

    this.When(/^click on the Create\/Update Button$/, function (callback) {
        element(by.buttonText('Create/Update')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Then(/^the first row item title is (.*) and item description is (.*)$/, function (title, description, callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            items[0].getInnerHtml().then(function (html) {
                expect(html).to.include(title);
                expect(html).to.include(description);
                callback();
            });
        });
    });

    this.Then(/^total items is initial number of items plus the new created item$/, function (callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            expect(items.length).to.equal(initialNumOfItems);
            callback();
        });
    });





    this.When(/^I click the delete button in the first row in the table$/, function (callback) {
        element(by.cssContainingText('.btn-danger', 'Delete')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });


    this.Then(/^the first row item title should not be (.*) and item description should not be (.*)$/, function (title, description, callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            items[0].getInnerHtml().then(function (html) {
                expect(html).not.to.include(title);
                expect(html).not.to.include(description);
                callback();
            });
        });
    });

    this.Then(/^total items is initial number$/, function (callback) {
        element.all(by.repeater('note in notes')).then(function (items) {
            expect(items.length).to.equal(initialNumOfItems - 1);
            callback();
        });
    });

};
