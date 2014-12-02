exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/init.js', 'test/e2e/**/*.js'],
    allScriptsTimeout: 60000,
    baseUrl: 'http://localhost:9090',
    capabilities: {
        browserName: 'phantomjs',
        'phantomjs.binary.path': 'node_modules/.bin/phantomjs' + (process.platform === 'win32' ? '.cmd' : ''),
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false']
    },
    onPrepare: function () {
        require('jasmine-reporters');
        var capsPromise = browser.getCapabilities();
        capsPromise.then(function (caps) {
            var browserName = caps.caps_.browserName.toUpperCase();
            var browserVersion = caps.caps_.version;
            var prePendStr = browserName + "-" + browserVersion + "-";
            jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter("test/reports", true, true, prePendStr));
        });
    },
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
