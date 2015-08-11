/*jshint node:true */
'use strict';

describe('E2E: Testing translation view', function () {

    beforeAll(function () {
        browser.setLocation('demos/translation');
    });

    it('should have a working /demos/translation route', function () {

        expect(browser.getLocationAbsUrl()).toBe('/demos/translation');
    });

    it('should have a translated text in English', function () {

        element.all(by.css('p[translate]')).then(function (items) {
            expect(items.length).toBe(3);
            expect(items[0].getText()).toBe('Welcome!');
        });
    });

    it('should translated text to Spanish', function () {

        element(by.buttonText('es-ES')).click();

        element.all(by.css('p[translate]')).then(function (items) {
            expect(items.length).toBe(3);
            expect(items[0].getText()).toBe('Bienvenido!');
        });
    });

});
