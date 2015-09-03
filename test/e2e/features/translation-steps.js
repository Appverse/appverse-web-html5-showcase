/*jshint node:true */
/*globals expect:true */

var chai = require("chai");

var expect = chai.expect;

module.exports = function () {

    'use strict';

    this.Given(/^I go to Content\/Translation/, function (callback) {
        browser.get('#/translation');
        browser.waitForAngular();
        callback();
    });

    this.When(/^I click on the (.*) button$/, function (locale, callback) {
        element(by.buttonText(locale)).click();
        browser.waitForAngular().then(function () {
            callback();
        });
    });


    this.Then(/^the currency should be translated to (.*)/, getCurrencyTranslated);
    function getCurrencyTranslated(locale, callback) {
        getTextViaBinding('currency', locale, callback);
    }

    this.Then(/^the number should be translated to (.*)/, getNumberTranslated);
    function getNumberTranslated(locale, callback) {
        getTextViaBinding('number', locale, callback);
    }


    this.Then(/^the welcome1 should be translated to (.*)/, getWelcome1Translated);
    function getWelcome1Translated(locale, callback) {
        getTextViaCss('p[translate="WELCOME"]', locale, callback);
    }

    this.Then(/^the welcome2 should be translated to (.*)/, getWelcome2Translated);
    function getWelcome2Translated(locale, callback) {
        getTextViaCss('p[translate="WELCOME_NAME"]', locale, callback);
    }

    this.Then(/^the welcome3 should be translated to (.*)/, getWelcome3Translated);
    function getWelcome3Translated(locale, callback) {
        getTextViaCss('p[translate="WELCOME_NAME_AGE"]', locale, callback);
    }


    function getTextViaBinding(name, locale, callback) {
        element.all(by.binding(name)).then(function (item) {
            item[0].getInnerHtml().then(function (text) {
                expect(text).to.equal(locale);
                callback();
            });
        });
    }

    function getTextViaCss(name, locale, callback) {
        element.all(by.css(name)).then(function (item) {
            item[0].getInnerHtml().then(function (text) {
                expect(text).to.equal(locale);
                callback();
            });
        });
    }

};
