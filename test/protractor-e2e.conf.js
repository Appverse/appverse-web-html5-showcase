exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/init.js', 'test/e2e/**/*.js'],
    baseUrl: 'http://localhost:9090',
    capabilities: {
        browserName: 'phantomjs',
        'phantomjs.binary.path': 'node_modules/.bin/phantomjs' + (process.platform === 'win32' ? '.cmd' : ''),
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false']
    }
};
