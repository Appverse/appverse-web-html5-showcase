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
    function ($stateProvider, $urlRouterProvider) {

        'use strict';

        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'views/home.html'

        })

        .state('theme', {
            url: '/theme',
            templateUrl: 'views/theme.html'

        })

        .state('components', {
            url: '/components',
            templateUrl: 'views/components.html',
            controller: 'ComponentsController'
        })

        .state('charts', {
            url: '/charts',
            templateUrl: 'views/charts.html',
            controller: 'ChartsController'
        })

        .state('demos', {
            abstract: true,
            url: '/demos',
            templateUrl: 'views/demos.html'
        })

        .state('demos.rest', {
            url: '/rest',
            templateUrl: 'views/rest/rest.html',
            controller: 'UsersController'
        })

        .state('demos.translation', {
            url: '/translation',
            templateUrl: 'views/translation.html',
            controller: 'TranslationController'
        })

        .state('demos.webworkers', {
            url: '/webworkers',
            templateUrl: 'views/demo/performance/performance.webworkers.html'
        })

        .state("detection", {
            // Use a url of "/" to set a states as the "index".
            url: "/detection",
            templateUrl: 'views/detection.html',
            controller: 'DetectionController'
        })

        .state('demos.dataloading', {
            url: '/dataloading',
            templateUrl: 'views/demo/performance/performance.hpcontrols.html',
            controller: 'PerformanceController'
        })


        .state('about', {
            url: '/about',
            templateUrl: 'views/about.html',
        });

    });
