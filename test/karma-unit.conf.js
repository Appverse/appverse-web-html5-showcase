"use strict";

var sharedConfig = require('./karma-shared.conf');

module.exports = function (config) {
    var conf = sharedConfig();

    conf.browsers = ['PhantomJS'];

    conf.coverageReporter.dir += 'unit';

    conf.files = conf.files.concat([

        //extra testing code
        'app/bower_components/angular-mocks/angular-mocks.js',
        'node_modules/mockjaxify/index.js',

        // mocks

        'test/mocks/**/*.js',

        //mocha stuff
        'test/mocha.conf.js',

        //test files
        'test/unit/**/*.js'
    ]);

    config.set(conf);
};
