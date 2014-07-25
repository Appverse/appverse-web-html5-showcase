'use strict';

var sharedConfig = require('./karma-shared.conf');

module.exports = function (config) {
    var conf = sharedConfig();

    conf.browsers = ['Chrome'];

    conf.coverageReporter.dir += 'e2e';

    conf.files = [
        'app/scripts/api/modules/*.js',
        'app/scripts/api/directives/*.js',
        'app/scripts/app.js',
        'app/scripts/controllers/*.js',
        'app/scripts/factories/*.js',
        'app/scripts/states/*.js',

        //Test-Specific Code
        'node_modules/chai/chai.js',
        'test/lib/chai-should.js',
        'test/lib/chai-expect.js',

        //test files
        'test/e2e/**/*.js'
    ];

    conf.proxies = {
        '/': 'http://localhost:9090/',
        '/scripts/': 'http://localhost:9876/base/app/scripts/'
    };

    conf.urlRoot = '/__karma__/';

    conf.frameworks = ['ng-scenario'];

    config.set(conf);
};
