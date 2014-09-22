'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var fs = require('fs');

var delayApiCalls = function (request, response, next) {
    if (request.url.indexOf('/api') !== -1) {
        setTimeout(function () {
            next();
        }, 1000);
    } else {
        next();
    }
};

var httpMethods = function (request, response, next) {

    console.log("request method: " + JSON.stringify(request.method));
    var rawpath = request.url.split('?')[0];
    console.log("request url: " + JSON.stringify(request.url));
    var path = require('path').resolve(__dirname, 'app/' + rawpath);

    console.log("request path : " + JSON.stringify(path));

    console.log("request current dir : " + JSON.stringify(__dirname));

    if ((request.method === 'PUT' || request.method === 'POST')) {

        console.log('inside put/post');

        request.content = '';

        request.addListener("data", function (chunk) {
            request.content += chunk;
        });

        request.addListener("end", function () {
            console.log("request content: " + JSON.stringify(request.content));

            if (fs.existsSync(path)) {

                fs.writeFile(path, request.content, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('file saved');
                    response.end('file was saved');
                });
                return;
            }

            if (request.url === '/log') {

                var filePath = 'server/log/server.log';

                var logData = JSON.parse(request.content);

                fs.appendFile(filePath, logData.logUrl + '\n' + logData.logMessage + '\n', function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('log saved');
                    response.end('log was saved');
                });
                return;
            }
        });
        return;
    }
    next();
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        doc: 'doc',
        test: 'test',
        coverage: 'test/coverage',
        instrumented: 'test/coverage/instrumented'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer:tmp']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/**/*.css'],
                tasks: ['autoprefixer:styles']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/**/*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '{.tmp,<%= yeoman.app %>}/configuration/**/*.json',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
            //            ,
            //            doc: {
            //                files: ['{.tmp,<%= yeoman.app %>}/scripts/**/*.js'],
            //                tasks: ['docular']
            //            }
        },
        autoprefixer: {
            options: ['last 1 version'],
            tmp: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
                }]
            },
            styles: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/',
                    src: '**/*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        connect: {
            options: {
                protocol: 'http',
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            delayApiCalls,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app),
                            httpMethods
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9090,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.instrumented + '/app'),
                            mountFolder(connect, yeomanConfig.app),
                            mountFolder(connect, '<%= yeoman.test %>'),
                            httpMethods
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            delayApiCalls,
                            mountFolder(connect, yeomanConfig.dist),
                            httpMethods
                        ];
                    }
                }
            },
            doc: {
                options: {
                    port: 3000,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.doc)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.options.port %>'
            },
            test: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.test.options.port %>'
            },
            doc: {
                url: '<%= connect.options.protocol %>://<%= connect.options.hostname %>:<%= connect.doc.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            coverage: 'test/coverage'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/bower_components',
                httpImagesPath: '/images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {
                options: {
                    debugInfo: false
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/api/angular-jqm.js': ['<%= yeoman.app %>/scripts/api/angular-jqm.js'],
                    '<%= yeoman.dist %>/bower_components/angular-animate/angular-animate.js': ['<%= yeoman.app %>/bower_components/angular-animate/angular-animate.js'],
                    '<%= yeoman.dist %>/bower_components/angular-route/angular-route.js': ['<%= yeoman.app %>/bower_components/angular-route/angular-route.js'],
                    '<%= yeoman.dist %>/bower_components/angular-touch/angular-touch.js': ['<%= yeoman.app %>/bower_components/angular-touch/angular-touch.js']
                }
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/*.js',
                        '<%= yeoman.dist %>/styles/*.css',
                        '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '!<%= yeoman.dist %>/images/glyphicons-*',
                        '<%= yeoman.dist %>/styles/images/*.{gif,png}'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/*.html', '<%= yeoman.dist %>/views/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>/**']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        'styles/images/*.{jpg,jpeg,svg,gif}',
                        'images/*.{jpg,jpeg,svg,gif}'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        tinypng: {
            options: {
                apiKey: "l_QIDgceoKGF8PBNRr3cmYy_Nhfa9F1p",
                checkSigs: true,
                sigFile: '<%= yeoman.app %>/images/tinypng_sigs.json',
                summarize: true,
                showProgress: true,
                stopOnImageError: true
            },
            dist: {
                expand: true,
                cwd: '<%= yeoman.app %>',
                src: 'images/**/*.png',
                dest: '<%= yeoman.app %>'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeCDATASectionsFromCDATA: true,
                    collapseWhitespace: true,
                    //                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    keepClosingSlash: true,
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: [
                        '*.html',
                        'views/**/*.html',
                        'template/**/*.html'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'api/**',
                        'images/{,*/}*.{gif,webp}',
                        'resources/**',
                        'styles/fonts/*',
                        'styles/images/*',
                        '*.html',
                        'views/**/*.html',
                        'template/**/*.html'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/angular-i18n',
                    dest: '<%= yeoman.dist %>/resources/i18n/angular',
                    src: [
                        '*en-us.js',
                        '*es-es.js',
                        '*ja-jp.js',
                        '*ar-eg.js'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles',
                src: '**/*.css'
            },
            i18n: {
                expand: true,
                cwd: '<%= yeoman.app %>/bower_components/angular-i18n',
                dest: '.tmp/resources/i18n/angular',
                src: [
                    '*en-us.js',
                    '*es-es.js',
                    '*ja-jp.js',
                    '*ar-eg.js'
                ]
            },
            fonts: {
                expand: true,
                cwd: '<%= yeoman.app %>/bower_components/bootstrap-sass/fonts',
                dest: '.tmp/fonts',
                src: '*'
            },
            png: {
                expand: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.dist %>',
                src: 'images/**/*.png'
            }
        },
        concurrent: {
            server: [
                'compass:server',
                'copy:i18n',
                'copy:fonts'
            ],
            dist: [
                'compass:dist',
                'imagemin'
            ]
        },
        karma: {
            unit: {
                configFile: '<%= yeoman.test %>/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: '<%= yeoman.test %>/karma-unit.conf.js'
            },
            midway: {
                configFile: '<%= yeoman.test %>/karma-midway.conf.js',
                autoWatch: false,
                singleRun: true
            },
            midway_auto: {
                configFile: '<%= yeoman.test %>/karma-midway.conf.js'
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        docular: {
            showDocularDocs: false,
            showAngularDocs: true,
            docular_webapp_target: "doc",
            groups: [
                {
                    groupTitle: 'Appverse HTML5',
                    groupId: 'appverse',
                    groupIcon: 'icon-beer',
                    sections: [
                        {
                            id: "commonapi",
                            title: "Common API",
                            showSource: true,
                            scripts: ["app/scripts/api/modules", "app/scripts/api/directives"
                            ],
                            docs: ["ngdocs/commonapi"],
                            rank: {}
                        }
                    ]
                }, {
                    groupTitle: 'Angular jQM',
                    groupId: 'angular-jqm',
                    groupIcon: 'icon-mobile-phone',
                    sections: [
                        {
                            id: "jqmapi",
                            title: "API",
                            showSource: true,
                            scripts: ["app/scripts/api/angular-jqm.js"
                            ],
                            docs: ["ngdocs/jqmapi"],
                            rank: {}
                        }
                    ]
                }
            ]
        },
        protractor_webdriver: {
            your_target: {
                options: {
                    command: 'webdriver-manager start --standalone',
                },
            }
        },
        instrument: {
            files: 'app/scripts/**/*.js',
            options: {
                lazy: true,
                basePath: "<%= yeoman.instrumented %>"
            }
        },
        protractor_coverage: {
            options: {
                configFile: '<%= yeoman.test %>/protractor-e2e.conf.js',
                keepAlive: true,
                noColor: false,
                coverageDir: '<%= yeoman.coverage %>',
                args: {}
            },
            local: {
                options: {
                    baseUrl: 'http://localhost:9090'
                }
            }
        },
        makeReport: {
            src: '<%= yeoman.coverage %>/*.json',
            options: {
                type: ['lcov', 'clover'],
                dir: '<%= yeoman.coverage %>/e2e',
                print: 'detail'
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('server', [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'connect:livereload',
        'open:server',
        'watch'
    ]);

    grunt.registerTask('testserver:pre', [
        'clean:server',
        'concurrent:server',
        'autoprefixer',
        'connect:test'
    ]);

    grunt.registerTask('testserver', [
        'testserver:pre',
        'open:test',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:coverage',
        'karma:unit',
        'testserver:pre',
        'karma:midway',
        'protractor_webdriver',
        'test:e2e:run'
    ]);

    grunt.registerTask('test:unit', [
        'clean:coverage',
        'karma:unit_auto'
    ]);

    grunt.registerTask('test:midway', [
        'testserver:pre',
        'clean:coverage',
        'karma:midway_auto'
    ]);

    grunt.registerTask('test:e2e', [
        'protractor_webdriver',
        'clean:coverage',
        'testserver:pre',
        'test:e2e:run'
    ]);

    grunt.registerTask('test:e2e:run', [
        'instrument',
        'protractor_coverage',
        'makeReport'
    ]);

    grunt.registerTask('doc', [
        'docular',
        'connect:doc',
        'open:doc',
        'watch:doc'
    ]);

    grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'tinypng',
        'copy:png',
        'autoprefixer',
        'concat',
        'copy:dist',
        'cdnify',
        'ngAnnotate',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin',
        'connect:dist',
 //        'docular',
 //        'connect:doc',
        'open:server',
 //        'open:doc',
        'watch'
    ]);

    grunt.registerTask('default', [
        'server'
    ]);
};
