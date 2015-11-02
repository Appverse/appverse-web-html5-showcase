/*jshint node:true */
'use strict';

module.exports = function(grunt) {

    grunt.registerTask('testserver', [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'instrument',
        'connect:test'
    ]);

    grunt.registerTask('testserver:watch', [
        'testserver',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:reportsUnit',
        'karma:unit',
        'test:e2e'
    ]);

    grunt.registerTask('test:unit', [
        'clean:reportsUnit',
        'karma:unit_auto'
    ]);

    grunt.registerTask('test:e2e', [
        'clean:reportsE2e',
        'testserver',
        'shell:jasmine2'
    ]);

    grunt.registerTask('test:cucumber', [
        'clean:reportsE2e',
        'testserver',
        'shell:cucumber'
    ]);

};
