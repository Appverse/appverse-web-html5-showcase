/*jshint node:true */
/*globals $$:false */

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.should();
chai.use(chaiAsPromised);
var fs = require('fs');

module.exports = function() {

    'use strict';

    this.After(function(callback) {
        if (browser.getProcessedConfig().value_.capabilities.browserName !== 'internet explorer') {

            browser.driver.executeScript('return __coverage__;').then(function(coverageResults) {
                browser.collector.add(coverageResults);
                callback();
            });
        } else {
            callback();
        }
    });

    this.After(function(scenario, callback) {
        browser.takeScreenshot().then(function(png) {
            var stream = fs.createWriteStream('test/reports/e2e/' + browser.getProcessedConfig().value_.capabilities.browserName + ' - ' + scenario.getName().replace(/\//g, '-') + '.png');
            stream.write(new Buffer(png, 'base64'));
            stream.end();
            callback();
        }, function(err) {
            callback(err);
        });
    });

    this.Given(/^I go to Content\/RestEntity$/, function() {
        browser.ignoreSynchronization = true;
        return browser.getCurrentUrl().then(function(url) {
            browser.ignoreSynchronization = false;
            if (url !== browser.baseUrl + '/#/rest') {
                browser.get('#/rest');
            }
        });
    });

    this.Given(/^data is shown in the table$/, function() {
        element(by.binding('maxRows()')).evaluate('maxRows()').should.eventually.equal(24);
        element(by.model('gridOptions.filterOptions.filterText')).clear();
    });

    this.When(/^I set a filter text: (.*)$/, function(name) {
        element(by.model('gridOptions.filterOptions.filterText')).clear().sendKeys(name);
    });

    this.Then(/^one row is shows in the table with name: (.*)$/, function(name) {
        var rows = $$('div.ngRow');
        rows.should.eventually.have.length(1);
        rows.first().getInnerHtml().should.eventually.include(name);
    });

    this.When(/^I click on AddUser button$/, function() {
        element(by.buttonText('Add User')).click();
    });

    this.Given(/^enter name: (.*)$/, function(name) {
        element(by.model('user.name')).clear().sendKeys(name);
    });

    this.Given(/^enter name: (.*), gender: (.*), company: (.*), age: (.*)$/, function(name, gender, company, age) {
        element(by.model('user.name')).sendKeys(name);
        element(by.cssContainingText('option', gender)).click();
        element(by.model('user.company')).sendKeys(company);
        element(by.model('user.age')).sendKeys(age);
    });

    this.Given(/^click Add Button$/, function() {
        element(by.buttonText('Add')).click();
    });

    this.Then(/^the add button is disabled$/, function() {
        element(by.buttonText('Add')).getAttribute('disabled').should.eventually.equal('true');
        element(by.buttonText('Cancel')).click();
    });

    this.Then(/^total items is (\d+)$/, function(number) {
        element(by.binding('maxRows()')).evaluate('maxRows()').should.eventually.equal(parseInt(number));
    });

    this.When(/^I click at bin button for name: (.*)$/, function(name) {
        element(by.cssContainingText('.ngRow', name)).$('.glyphicon-trash').click();
    });

    this.Given(/^click OK on confirmation window$/, function() {
        // browser.switchTo().activeElement().click();
        browser.sleep(500);
        browser.switchTo().alert().accept();
    });

    this.Then(/^an alert is shown indicating failed operation$/, function() {
        var alerts = $$('button.close');
        alerts.should.eventually.have.length.above(0);
        alerts.first().click();
    });

    this.Given(/^click Cancel on confirmation window$/, function() {
        browser.sleep(500);
        browser.switchTo().alert().dismiss();
    });

    this.When(/^I click at (.*) tab$/, function(tabname) {
        element(by.cssContainingText('a.ng-binding', tabname)).click();
    });

    this.Then(/^tab content changed starting by: (.*)$/, function(content) {
        $('div.tab-pane.active>pre>pre>code').getText().then(function(text) {
            text.replace(/\n/g, '').substr(0, content.length).should.equal(content);
        });
    });

    this.Given(/^I resize window width to (\d+)$/, function(width) {
        browser.manage().window().setSize(parseInt(width), 1000);
    });

    this.Given(/^Explanation frame appears next to the table float left and width 50$/, function() {
        element(by.css('div.col-lg-6:nth-child(2)')).getCssValue('float').should.eventually.equal('left');
    });

    this.When(/^I resize window width to (\d+)$/, function(width) {
        browser.manage().window().setSize(parseInt(width), 1000);
    });

    this.Then(/^Explanation frame appears below the table$/, function() {
        $('div.col-lg-6:nth-child(2)').getCssValue('float').should.eventually.equal('none');
    });

    this.Given(/^I go to Performance\/WebWorkers$/, function() {
        browser.ignoreSynchronization = true;
        return browser.getCurrentUrl().then(function(url) {
            browser.ignoreSynchronization = false;
            if (url !== browser.baseUrl + '/#/webworkers') {
                browser.get('#/webworkers');
            }
        });
    });

    this.When(/^shows blue result$/, function() {
        $('div.progress-bar').getCssValue('background-color').should.eventually.equal('rgba(33, 62, 127, 1)');
    });

    this.When(/^I click on Run button$/, function() {
        element(by.buttonText('Run')).click();
    });

    this.Then(/^shows result in green after execution$/, function() {
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.and(EC.visibilityOf($('div.progress-bar-success')),EC.not(EC.visibilityOf($('div.progress-bar-striped')))), 20000);
    });
};
