/*jshint -W030 */

"use strict";

describe('Unit: Testing AppPerformance module', function () {

    beforeEach(module('AppPerformance'));

    it('should contain a WebWorkerPoolFactory factory',
        inject(function (WebWorkerPoolFactory) {

            expect(WebWorkerPoolFactory).to.be.an.object;
        })
    );

});
