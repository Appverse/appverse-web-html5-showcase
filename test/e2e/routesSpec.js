'use strict';

describe("E2E: Testing Routes", function () {

    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Appverse Web HTML5 Incubator');
    });

    it('should jump to the /home path when / is accessed', function () {
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/home");
    });

    it('should have a working /topics route', function () {
        browser.setLocation('/topics');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/topics");
    });

    it('should have a working /ui route', function () {
        browser.setLocation('/ui');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/ui");
    });

    it('should have a working /cache route', function () {
        browser.setLocation('/cache/state1');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/cache/state1");
    });

    it('should have a working /detection route', function () {
        browser.setLocation('/detection');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/detection");
    });

    it('should have a working /mobile route', function () {
        browser.setLocation('/mobile');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/mobile");
    });

    it('should have a working /websockets route', function () {
        browser.setLocation('/websockets');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/websockets");
    });

    it('should have a working /translation route', function () {
        browser.setLocation('/translation');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/translation");
    });

    it('should have a working /performance/webworkers route', function () {
        browser.setLocation('/performance/webworkers');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/performance/webworkers");
    });

    it('should have a working /about route', function () {
        browser.setLocation('/about');
        expect(browser.getLocationAbsUrl()).toBe(browser.baseUrl + "/#/about");
    });
});
