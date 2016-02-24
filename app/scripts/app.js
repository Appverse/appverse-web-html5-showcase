/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf.
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */


/*globals AppInit:false */
(function() {
    'use strict';
    angular.module('App.Controllers', []);
    angular.module('App.Filters', []);
    angular.module('showcaseApp', [
        'ngAnimate',
        'ui.bootstrap',
        'angularRipple',
        'ui.select',
        'ngSanitize',
        'rzModule',
        'rt.resize',
        'chart.js',
        'App.Controllers',
        'App.Filters',
        'appverse.cache',
        'appverse.detection',
        'appverse.ionic',
        'appverse.logging',
        'appverse.performance',
        'appverse.rest',
        'appverse.router',
        'appverse.serverPush',
        'appverse.translate',
        'appverse',
        'hljs',
        'ngGrid',
        'agGrid',
        'ja.qr',
        'xeditable',
        'ngWebworker'
    ]).run(function($log, $rootScope, $window) {

        $log.debug('App run', $window.location.search);

        $rootScope.$on('$locationChangeStart',
            function(angularEvent, newUrl, oldUrl) {

                $log.debug('$locationChangeStart', newUrl);
                $log.debug('$locationChangeStart', oldUrl);

                var code = $window.location.search.split('code=')[1];

                if (code) {
                    $log.debug('$locationChangeStart code', code);

                    angularEvent.preventDefault();
                    localStorage.setItem('code', code);
                    $window.location.href = $window.location.href.replace($window.location.search, '');
                }

                if ($rootScope.preventNextLocation) {
                    angularEvent.preventDefault();
                    $rootScope.preventNextLocation = false;
                }

            });

        $rootScope.hideMenu = function() {
            $log.debug('hideMenu');
            $('#main-navbar-collapse').collapse('hide');
        };
    });

    AppInit.setConfig({
        environment: {
            REST_CONFIG: {
                BaseUrl: 'api/v1',
                RequestSuffix: '.json'
            },
            I18N_CONFIG: {
                LocaleFilePattern: 'resources/i18n/angular/angular-locale_{{locale}}.js'
            }
        },
        appverseMobile: {},
        mobileBrowser: {}
    });
}());