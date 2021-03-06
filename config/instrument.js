/*jshint node:true */
'use strict';

// Empties folders to start fresh
module.exports = {

    files: [
        'app/scripts/**/*.js',
        'app/bower_components/appverse-web-html5-core/dist/appverse*/*.js',
        'app/bower_components/appverse-web-html5-security/dist/appverse-html5-security.js',
        '!app/bower_components/appverse*/**/*.min.js'
    ],
    options: {
        lazy: true,
        basePath: 'reports/e2e/coverage/instrument'
    }
};
