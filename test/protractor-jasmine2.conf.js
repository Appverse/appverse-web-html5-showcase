/*jshint node:true */
"use strict";

var waitPlugin = require('./waitPlugin');
var istanbul = require('istanbul');
var collector = new istanbul.Collector();

exports.config = {
    seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
    seleniumArgs: [
        '-Dwebdriver.ie.driver=node_modules/protractor/selenium/IEDriverServer.exe',
        '-browserTimeout=120000'
    ],
    specs: ['e2e/init.js', 'e2e/**/*.js'],
    allScriptsTimeout: 120000,
    getPageTimeout: 120000,
    baseUrl: 'http://localhost:9003',
    framework: 'jasmine2',
    multiCapabilities: [
        //        {
        //            browserName: 'phantomjs',
        //            'phantomjs.binary.path': require('phantomjs').path,
        //            'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false', '--local-to-remote-url-access=true'],
        //        }
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
    onPrepare: function() {
        var jasmineReporters = require('jasmine-reporters');
        var capsPromise = browser.getCapabilities();

        var jasmineEnv = jasmine.getEnv();

        capsPromise.then(function(caps) {
            var browserName = caps.caps_.browserName.toUpperCase();
            var browserVersion = caps.caps_.version;
            var prePendStr = browserName + "-" + browserVersion + "-junit";
            jasmineEnv.addReporter(new jasmineReporters.JUnitXmlReporter({
                savePath: 'reports/e2e',
                filePrefix: prePendStr
            }));
        });

        return capsPromise;
    },
    onComplete: function() {

        browser.driver.executeScript('return __coverage__;').then(function(coverageResults) {
            collector.add(coverageResults);

            istanbul.Report
                .create('lcov', {
                    dir: 'reports/e2e/coverage',
                    includeAllSources: true
                })
                .writeReport(collector, true);

            istanbul.Report
                .create('clover', {
                    dir: 'reports/e2e/coverage',
                    includeAllSources: true
                })
                .writeReport(collector, true);


            waitPlugin.resolve();
        });
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 120000
    }
};
