/*jshint node:true */
/*globals expect:true */

var chai = require("chai");

var expect = chai.expect;

module.exports = function () {

    'use strict';

    this.After(function (callback) {
        browser.driver.executeScript('return __coverage__;').then(function (coverageResults) {
            browser.collector.add(coverageResults);
            callback();
        });
    });

    this.Given(/^I go to Content\/RestEntity$/, function () {
        browser.ignoreSynchronization = true;
        return browser.getCurrentUrl().then(function (url) {
            browser.ignoreSynchronization = false;
            if (url !== browser.baseUrl + '/#/rest') {
                browser.get('#/rest');
            }
        });
    });

    this.Given(/^data is shown in the table$/, function () {
        return element.all(by.css('div.ngRow')).then(function (items) {
            expect(items).to.have.length.above(0);
            element(by.model('gridOptions.filterOptions.filterText')).clear();
        });
    });

    this.When(/^I set a filter text: (.*)$/, function (name) {
        return element(by.model('gridOptions.filterOptions.filterText')).clear().sendKeys(name);
    });

    this.Then(/^one row is shows in the table with name: (.*)$/, function (name) {
        return element.all(by.css('div.ngRow')).then(function (items) {
            expect(items).to.have.length(1);
            return items[0].getInnerHtml();
        }).then(function (html) {
            expect(html).to.include(name);
        });
    });

    this.When(/^I click on AddUser button$/, function () {
        return element(by.buttonText('Add User')).click();
    });

    this.Given(/^enter name: (.*)$/, function (name) {
        return element(by.model('user.name')).clear().sendKeys(name);
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

    this.Given(/^click Add Button$/, function () {
        return element(by.buttonText('Add')).click();
    });

    this.Then(/^the add button is disabled$/, function (callback) {
        element(by.buttonText('Add')).getAttribute('disabled').then(function (attr) {
            expect(attr).to.equal('true');
            element(by.buttonText('Cancel')).click().then(function () {
                callback();
            });
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
            expect(items).to.have.length.above(0);
            items[0].click();
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

    this.Given(/^I resize window width to (\d+)$/, function (width, callback) {
        browser.manage().window().setSize(parseInt(width), 1000).then(function () {
            callback();
        });
    });

    this.Given(/^Explanation frame appears next to the table float left and width 50$/, function () {
        return element(by.css('div.col-lg-6:nth-child(2)')).getCssValue('float').then(function (value) {
            expect(value).to.equal('left');
        });
    });

    this.When(/^I resize window width to (\d+)$/, function (width, callback) {
        browser.manage().window().setSize(parseInt(width), 1000).then(function () {
            callback();
        });
    });

    this.Then(/^Explanation frame appears below the table$/, function () {
        return element(by.css('div.col-lg-6:nth-child(2)')).getCssValue('float').then(function (value) {
            expect(value).to.equal('none');
        });
    });

    this.Given(/^I go to Performance\/WebWorkers$/, function () {
        browser.ignoreSynchronization = true;
        return browser.getCurrentUrl().then(function (url) {
            browser.ignoreSynchronization = false;
            if (url !== browser.baseUrl + '/#/webworkers') {
                browser.get('#/webworkers');
            }
        });
    });

    this.When(/^shows blue result$/, function () {
        return element.all(by.css('div.progress-bar')).then(function (items) {
            expect(items).to.have.length(1);
            return items[0].getCssValue('background-color');
        }).then(function (value) {
            expect(value).to.equal('rgba(33, 62, 127, 1)');
        });
    });

    this.When(/^I click on Run button$/, function () {
        element(by.buttonText('Run')).click();
    });

    this.Then(/^shows result in green after execution$/, function () {
        return browser.wait(element.all(by.css('div.progress-bar-success')), 20000);
    });
};
