/*jshint node:true */
'use strict';

// Watches files for changes and runs tasks based on the changed files
module.exports = {
    sass: {
        files: ['<%=paths.app%>/styles/**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer:tmp']
    },
    styles: {
        files: ['<%=paths.app%>/styles/**/*.css'],
        tasks: ['autoprefixer:styles']
    },
    livereload: {
        options: {
            livereload: '<%= ports.livereload %>'
        },
        files: [
            '<%=paths.app%>/index.html',
            '<%=paths.app%>/views/**/*.html',
            '{.tmp, <%= paths.app %>}/styles/**/*.css',
            '<%= paths.app %>/scripts/**/*.js',
            '<%= paths.app %>/resources/**/*'
        ]
    }
};