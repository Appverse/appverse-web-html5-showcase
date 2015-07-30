/*jshint node:true */
/*globals browser:false */
"use strict";

var waitPlugin = require('./waitPlugin');
var istanbul = require('istanbul');
var collector = new istanbul.Collector();

exports.config = {
    seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
    seleniumArgs: [
        '-Dwebdriver.ie.driver=node_modules/protractor/selenium/IEDriverServer.exe'
    ],
    specs: ['e2e/init.js', 'e2e/**/*.js'],
    allScriptsTimeout: 60000,
    baseUrl: 'http://localhost:9003',
    framework: 'jasmine2',
    multiCapabilities: [
        {
            browserName: 'chrome'
        }
//        , {
//            browserName: 'firefox'
//        }, {
//            browserName: 'internet explorer'
//        }
    ],
    plugins: [{
        path: './waitPlugin.js'
    }],
    onPrepare: function () {
        var jasmineReporters = require('jasmine-reporters');
        var capsPromise = browser.getCapabilities();

        var jasmineEnv = jasmine.getEnv();

        jasmineEnv.addReporter(new function () {
            this.specDone = function (spec) {
                if (spec.status !== 'failed') {
                    browser.driver.executeScript('return __coverage__;').then(function (coverageResults) {
                        collector.add(coverageResults);
                    });
                }
            };
        }());

        capsPromise.then(function (caps) {
            var browserName = caps.caps_.browserName.toUpperCase();
            var browserVersion = caps.caps_.version;
            var prePendStr = browserName + "-" + browserVersion + "-junit";
            jasmineEnv.addReporter(new jasmineReporters.JUnitXmlReporter({
                savePath: 'test/reports/e2e',
                filePrefix: prePendStr
            }));
        });
    },
    onComplete: function () {
        istanbul.Report.create('lcov', {
                dir: 'test/coverage/e2e',
                includeAllSources: true
            })
            .writeReport(collector, true);
        waitPlugin.resolve();
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
