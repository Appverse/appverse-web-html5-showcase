/*jshint -W030 */

"use strict";

describe('Unit: Testing AppCache module', function () {

    beforeEach(module("AppCache"));

    it('should contain a CacheFactory factory',
        inject(function (CacheFactory) {

            expect(CacheFactory).to.be.an.object;
        })
    );

    it('should contain a IDBService service',
        inject(function (IDBService) {

            expect(IDBService).to.be.an.object;

            expect(IDBService.isSupported()).to.be.false;
        })
    );
});
