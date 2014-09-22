exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/**/*.js'],
    capabilities: {
        'browserName': 'phantomjs',

        /*
         * Can be used to specify the phantomjs binary path.
         * This can generally be ommitted if you installed phantomjs globally.
         */
        //        'phantomjs.binary.path': 'C:/Users/aecz/AppData/Roaming/npm/node_modules/phantomjs/lib/phantom/phantomjs.exe',
        //        'phantomjs.binary.path': './node_modules/phantomjs/lib/phantom/phantomjs.exe',
        'phantomjs.binary.path': './node_modules/.bin/phantomjs.cmd',

        /*
         * Command line arugments to pass to phantomjs.
         * Can be ommitted if no arguments need to be passed.
         * Acceptable cli arugments: https://github.com/ariya/phantomjs/wiki/API-Reference#wiki-command-line-options
         */
        //        'phantomjs.cli.args': ['--debug=false', '--remote-debugger-port=9009']
    }
};
