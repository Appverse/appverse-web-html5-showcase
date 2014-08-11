'use strict';

describe("E2E: Testing Routes", function () {

    beforeEach(function () {
        browser().navigateTo('/');
    });

    it('should jump to the /home path when / is accessed', function () {
        browser().navigateTo('#/');
        expect(browser().location().path()).toBe("/home");
    });

    it('should have a working /translation route', function () {
        browser().navigateTo('#/translation');
        expect(browser().location().path()).toBe("/translation");
    });
});
