/*jshint node:true */
'use strict';

module.exports = function (grunt) {

    grunt.registerTask('testserver', [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'connect:test'
    ]);

    grunt.registerTask('test', [
        'clean:reports',
        'karma:unit',
        'instrument',
        'testserver',
        'shell:protractor'
    ]);

    grunt.registerTask('test:unit', [
        'karma:unit_auto'
    ]);

    grunt.registerTask('test:e2e', [
        'clean:reports',
        'instrument',
        'testserver',
        'shell:protractor'
    ]);

};
