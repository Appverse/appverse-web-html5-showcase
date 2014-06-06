// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {

    'use strict';

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'https://plus.google.com/js/client:plusone.js',
            'app/bower_components/jquery/jquery.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/modernizr/modernizr.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap.js',
            'app/bower_components/angular-ui-router/release/angular-ui-router.js',
            'app/bower_components/lodash/dist/lodash.underscore.js',
            'app/bower_components/restangular/src/restangular.js',
            'app/bower_components/angular-translate/angular-translate.js',
            'app/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'app/bower_components/angular-dynamic-locale/src/tmhDinamicLocale.js',
            'app/bower_components/angular-cache/dist/angular-cache.js',
            'app/bower_components/angular-resource/angular-resource.js', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js',
            'app/scripts/api/modules/*.js',
            'app/scripts/**/*.js',
            'test/*.js',
 //            'test/mock/**/*.js',
 //            'test/spec/**/*.js'
            'test/unit/**/*.js',

            // fixtures
            {
                pattern: 'app/resources/configuration/*.json',
                watched: true,
                served: true,
                included: false
            }
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        //        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_DEBUG,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        plugins: [
            'karma-coverage',
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/scripts/api/**/*.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        }

    });
};
