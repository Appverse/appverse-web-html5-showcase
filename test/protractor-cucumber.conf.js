/*jshint node:true */
"use strict";

var istanbul = require('istanbul');
var fs = require('fs');

exports.config = {
    seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
    seleniumArgs: [
        '-Dwebdriver.ie.driver=node_modules/protractor/selenium/IEDriverServer.exe',
        '-browserTimeout=60'
    ],
    specs: ['e2e/**/*.feature'],
    allScriptsTimeout: 60000,
    getPageTimeout: 20000,
    baseUrl: 'http://localhost:9003',
    framework: 'cucumber',
    resultJsonOutputFile: 'test/reports/e2e/cucumber-results.json',
    multiCapabilities: [
        // {
        //     browserName: 'phantomjs',
        //     'phantomjs.binary.path': require('phantomjs').path,
        //     'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false'],
        // },
        {
            browserName: 'chrome'
        },
        // {
        //     browserName: 'firefox'
        // },
        // { Not working on Mac OSX (at least) due to problem installing SafariDriver
        //     browserName: 'safari'
        // },
        // {
        //     browserName: 'internet explorer'
        // }
    ],
    onPrepare: function() {
        browser.collector = new istanbul.Collector();
        if (!fs.existsSync('test/reports')) {
            fs.mkdirSync('test/reports');
        }
        if (!fs.existsSync('test/reports/e2e')) {
            fs.mkdirSync('test/reports/e2e');
        }
    },
    onComplete: function() {

        var browserName = browser.getProcessedConfig().value_.capabilities.browserName;
        if (browserName === 'internet explorer') {
            return;
        }

        istanbul.Report
            .create('lcov', {
                dir: 'test/coverage/e2e/' + browserName
            })
            .writeReport(browser.collector, true);
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
