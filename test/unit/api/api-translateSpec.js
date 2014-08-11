/*jshint -W030 */

"use strict";

describe('Unit: Testing AppTranslate module', function () {

    beforeEach(module('AppTranslate'));

    it('should contain a $translate service',
        inject(function ($translate) {

            expect($translate).to.be.an.object;
        })
    );
});
