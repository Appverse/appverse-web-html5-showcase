/*jshint node:true */
/*globals expect:true */

var chai = require("chai");

var expect = chai.expect;

module.exports = function () {

    'use strict';

    this.Given(/^I go to Content\/RestEntity$/, function (callback) {
        browser.get('#/rest');
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Given(/^data is shown in the table$/, function (callback) {

        element.all(by.css('div.ngRow')).then(function (items) {
            expect(items).to.have.length.above(0);
            callback();
        });
    });

    this.When(/^I set a filter text: (.*)$/, function (name, callback) {
        element(by.model('gridOptions.filterOptions.filterText')).sendKeys(name);
        callback();
    });

    this.Then(/^one row is shows in the table with name: (.*)$/, function (name, callback) {
        element.all(by.css('div.ngRow')).then(function (items) {
            expect(items).to.have.length(1);
            items[0].getInnerHtml().then(function (html) {
                expect(html).to.include(name);
                callback();
            });
        });
    });

    this.When(/^I click on AddUser button$/, function (callback) {
        element(by.buttonText('Add User')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Given(/^enter name: (.*)$/, function (name, callback) {
        element(by.model('user.name')).sendKeys(name);
        callback();
    });

    this.Given(/^enter name: (.*), gender: (.*), company: (.*), age: (.*)$/, function (name, gender, company, age, callback) {
        element(by.model('user.name')).sendKeys(name);
        element(by.cssContainingText('option', gender)).click();
        element(by.model('user.company')).sendKeys(company);
        element(by.model('user.age')).sendKeys(age);
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Given(/^click Add Button$/, function (callback) {
        element(by.buttonText('Add')).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });

    this.Then(/^the add button is disabled$/, function (callback) {
        element(by.buttonText('Add')).getAttribute('disabled').then(function (attr) {
            expect(attr).to.equal('true');
            callback();
        });
    });

    this.Then(/^total items is (\d+)$/, function (number, callback) {
        element.all(by.css('div.ngRow')).then(function (items) {
            expect(items).to.have.length(number);
            callback();
        });
    });

    this.When(/^I click at bin button for name: (.*)$/, function (name, callback) {
        element.all(by.cssContainingText('.ngRow', name)).then(function (items) {
            expect(items).to.have.length(1);
            items[0].all(by.css('.glyphicon-trash')).then(function (items) {
                expect(items).to.have.length(1);
                items[0].click().then(function () {
                    browser.waitForAngular().then(function () {
                        callback();
                    });
                });
            });
        });
    });

    this.Given(/^click OK on confirmation window$/, function (callback) {
        browser.switchTo().activeElement().click();
        browser.switchTo().alert().accept().then(function () {
            callback();
        });
    });

    this.Then(/^an alert is shown indicating failed operation$/, function (callback) {
        element.all(by.css('button.close')).then(function (items) {
            expect(items).to.have.length(1);
            //            items[0].click();
            callback();
        });
    });

    this.Given(/^click Cancel on confirmation window$/, function (callback) {
        browser.switchTo().activeElement().click();
        browser.switchTo().alert().dismiss().then(function () {
            callback();
        });
    });

    this.When(/^I click at (.*) tab$/, function (tabname, callback) {
        element.all(by.cssContainingText('a.ng-binding', tabname)).then(function (items) {
            expect(items).to.have.length(1);
            items[0].click();
            callback();
        });
    });

    this.Then(/^tab content changed starting by: (.*)$/, function (content, callback) {
        element.all(by.css('div.tab-pane.active>pre>pre>code')).then(function (items) {
            expect(items).to.have.length(1);
            items[0].getText().then(function (text) {
                expect(text.replace(/\n/g, '').substr(0, content.length)).to.equal(content);
                callback();
            });
        });
    });

    this.Given(/^I resize window width to (\d+)$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Given(/^Explanation frame appears next to the table float left and width (\d+)$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.When(/^I resize window width to (\d+)$/, function (arg1, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });

    this.Then(/^Explanation frame appears below the table$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });
};
