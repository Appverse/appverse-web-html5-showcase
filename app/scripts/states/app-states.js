/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (“APL v2.0”). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf.
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS' AND
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
angular.module('showcaseApp')

.config(
    function($stateProvider, $urlRouterProvider, $httpProvider, WebworkerProvider) {

        'use strict';

        WebworkerProvider.setHelperPath("bower_components/ng-webworker/src/worker_wrapper.min.js");
        WebworkerProvider.setUseHelper(true);

        $httpProvider.useApplyAsync();

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'views/home.html'
        })

        .state('ui', {
            abstract: true,
            templateUrl: 'views/ui.html'
        })

        .state('theme', {
            parent: 'ui',
            url: '/theme',
            templateUrl: 'views/theme.html'
        })

        .state('ui-bootstrap', {
            parent: 'ui',
            url: '/ui-bootstrap',
            templateUrl: 'views/ui-bootstrap/ui-bootstrap.html',
            controller: 'UIBootstrapController'
        })

        .state('ui-select', {
            parent: 'ui',
            url: '/ui-select',
            templateUrl: 'views/ui-select/ui-select.html',
            controller: 'UISelectController'
        })

        .state('charts', {
            parent: 'ui',
            url: '/charts',
            templateUrl: 'views/charts.html',
            controller: 'ChartsController'
        })

        .state('ui-components', {
            parent: 'ui',
            url: '/ui-components',
            templateUrl: 'views/ui-components/ui-components.html',
            controller: 'UIComponentsController'
        })

        .state('content', {
            abstract: true,
            templateUrl: 'views/content.html'
        })

        .state('rest', {
            parent: 'content',
            url: '/rest',
            templateUrl: 'views/rest/rest.html'
        })

        .state('rest-ng-repeat', {
            parent: 'content',
            url: '/rest-ng-repeat',
            templateUrl: 'views/rest/rest-ng-repeat.html'
        })

        .state('rest-ag-grid', {
            parent: 'content',
            url: '/rest-ag-grid',
            templateUrl: 'views/rest/rest-ag-grid.html'
        })

        .state('translation', {
            parent: 'content',
            url: '/translation',
            templateUrl: 'views/translation/translation.html',
            controller: 'TranslationController'
        })

        .state("detection", {
            parent: 'content',
            url: "/detection",
            templateUrl: 'views/detection/detection.html',
            controller: 'DetectionController'
        })

        .state('performance', {
            abstract: true,
            templateUrl: 'views/performance.html'
        })

        .state('webworkers', {
            parent: 'performance',
            url: '/webworkers',
            templateUrl: 'views/webworkers/webworkers.html'
        })

        .state('dataloading', {
            parent: 'performance',
            url: '/dataloading',
            templateUrl: 'views/dataloading/dataloading.html'
        })

        .state('cache', {
            parent: 'performance',
            url: '/cache',
            templateUrl: 'views/cache/cache-simpleidb.html'
        })

        .state('websocket', {
            parent: 'performance',
            url: '/websocket',
            templateUrl: 'views/websocket/websocket.html',
            controller: 'WebsocketController'
        })

        .state('security', {
            url: '/security',
            templateUrl: 'views/security/security.html',
            controller: 'SecurityController'
        })

        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html',
        });

    });