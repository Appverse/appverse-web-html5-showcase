/*jshint -W030 */

"use strict";

describe('Unit: Testing Controllers', function () {
    var scope, controller;

    beforeEach(module('App.Controllers'));

    beforeEach(inject(function ($rootScope, $controller) {

        scope = $rootScope.$new();
        controller = $controller;
    }));

    it('should have a properly working cacheController', function () {
        controller('simpleIDBController', {
            '$scope': scope,
            '$stateParams': {},
            '$modal': null,
            'IDBService': {
                isSupported: function () {}
            },
            'CACHE_CONFIG': null
        });
        expect(scope.notes).to.equal(undefined);
    });

    it('should have a properly working detectionController', function () {
        controller('detectionController', {
            '$scope': scope,
            'Detection': {
                testOnlineStatus: function () {},
                testBandwidth: function () {},
                hasAppverseMobile: false,
                isMobileBrowser: false
            }
        });
        expect(scope.detect).to.be.an.object;
        expect(scope.detect.hasAppverseMobile).to.be.a.boolean;
    });

    it('should have a properly working AlertDemoCtrl', function () {

        controller('AlertDemoCtrl', {
            '$scope': scope
        });
        expect(scope.alerts).to.be.an.array;
    });

    it('should have a properly working mobileController', function () {

        controller('mobileController', {
            '$scope': scope,
            'Detection': {
                testOnlineStatus: function () {},
                testBandwidth: function () {},
                hasAppverseMobile: false,
                isMobileBrowser: false
            }
        });
        expect(scope.isMobile).to.equal(false);
    });

    it('should have a properly working imageWebworkerController', function () {

        controller('imageWebworkerController', {
            '$scope': scope,
            'WebWorkerPoolFactory': null,
            'PERFORMANCE_CONFIG': null
        });
        expect(scope.threadsNumbers).to.be.an.array;
    });

    it('should have a properly working translationController', function () {

        controller('translationController', {
            '$scope': scope,
            '$translate': {
                uses: function () {}
            },
            'tmhDynamicLocale': {
                set: function () {}
            }
        });
        expect(scope.age).to.equal('25');
        scope.setLocale('es-ES');
    });
});
