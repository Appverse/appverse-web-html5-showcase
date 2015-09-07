/*jshint node:true */
"use strict";

var waitPlugin = require('./waitPlugin');
var istanbul = require('istanbul');
var collector = new istanbul.Collector();

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
    //    baseUrl: 'https://appverse.gftlabs.com/showcase-html5/new',
    framework: 'cucumber',
    resultJsonOutputFile: 'test/cucumber-results.json',
    multiCapabilities: [
        // {
        //     browserName: 'phantomjs',
        //     'phantomjs.binary.path': require('phantomjs').path,
        //     'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false'],
        // }
        //,{
        //     browserName: 'chrome'
        // }
        //,
        {
            browserName: 'firefox'
        }
        //,{ Not working on Mac OSX (at least) due to problem installing SafariDriver
        //     browserName: 'safari'
        // }
        // , {
        //     browserName: 'internet explorer'
        // }
    ],
    plugins: [{
        path: './waitPlugin.js'
    }],
    onPrepare: function () {
        browser.collector = collector;
    },
    onComplete: function () {

        istanbul.Report
            .create('lcov', {
                dir: 'test/coverage/e2e'
            })
            .writeReport(browser.collector, true);

        waitPlugin.resolve();
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
