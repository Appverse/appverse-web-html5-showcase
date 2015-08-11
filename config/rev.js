/*jshint node:true */
'use strict';

// Renames files for browser caching purposes
module.exports = {
    dist: {
        files: {
            src: [
                '<%=paths.dist%>/scripts/**/*.js',
                '!<%=paths.dist%>/scripts/**/*-code.js',
                '<%=paths.dist%>/styles/**/*.css',
                '<%=paths.dist%>/styles/images/**/*',
                '<%=paths.dist%>/fonts/**/*'
            ]
        }
    }
};
