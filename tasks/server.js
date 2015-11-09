/*jshint node:true */
'use strict';

module.exports = function(grunt) {

    grunt.registerTask('server:only', [
        'clean:server',
        'configureProxies:livereload',
        'concurrent:server',
        'autoprefixer',
        'connect:livereload'
    ]);

    grunt.registerTask('server', [
        'server:only',
        'watch'
    ]);

    grunt.registerTask('server:open', [
        'server:only',
        'open:server',
        'watch'
    ]);

    grunt.registerTask('server:dist', [
        'connect:dist',
        'open:dist',
        'watch'
    ]);

    grunt.registerTask('server:doc', [
        'connect:doc',
        'open:doc',
        'watch:doc'
    ]);

};
