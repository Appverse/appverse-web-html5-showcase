/*jshint -W030 */

"use strict";

describe('Unit: Testing AppServerPush module', function () {

    beforeEach(module("AppServerPush"));

    it('should contain a SocketFactory factory',
        inject(function (SocketFactory) {

            expect(SocketFactory).to.be.an.object;
        })
    );
});
