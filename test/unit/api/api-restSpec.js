/*jshint -W030 */

"use strict";

describe('Unit: Testing AppREST module', function () {

    beforeEach(module('AppREST'));

    it('should contain a RESTFactory factory',
        inject(function (RESTFactory) {

            expect(RESTFactory).to.be.an.object;
        })
    );

    it('should contain a MulticastRESTFactory factory',
        inject(function (MulticastRESTFactory) {

            expect(MulticastRESTFactory).to.be.an.object;
        })
    );
});
