/*globals AppInit:false */
(function () {
    'use strict';
    angular.module('App.Controllers', []);
    angular.module('showcaseApp', [
        'appverse.serverPush',
        'appverse.cache',
        'appverse.rest',
        'ngAnimate',
        'ui.bootstrap',
        'angularRipple',
        'ui.select',
        'ngSanitize',
        'rzModule',
        'rt.resize',
        'chart.js',
        'appverse.router',
        'App.Controllers', 'appverse.detection',
        'appverse.logging',
        'appverse.performance',
        'appverse.translate',
        'appverse.security',
        'appverse',
        'hljs'
    ]).run(function ($log) {
        $log.debug('showcaseApp run');
    }).config(function (hljsServiceProvider) {
        hljsServiceProvider.setOptions({
            // replace tab with 4 spaces
            tabReplace: ''
        });
    });

    AppInit.setConfig({
        environment: {
            'REST_CONFIG': {
                'BaseUrl': '/api',
                'RequestSuffix': ''
            },
            'SERVERPUSH_CONFIG': {
                'BaseUrl': 'http://127.0.0.1:3000'
            },
            'I18N_CONFIG': {
                LocaleFilePattern: 'resources/i18n/angular/angular-locale_{{locale}}.js'
            }
        },
        appverseMobile: {},
        mobileBrowser: {}
    });
}());
