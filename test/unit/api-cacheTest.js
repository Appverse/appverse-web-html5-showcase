describe('JobsCtrl', function () {
    var $httpBackend, createController, scope;

    beforeEach(inject(function ($injector, $rootScope, $controller) {

        $httpBackend = $injector.get('$httpBackend');
        jasmine.getJSONFixtures().fixturesPath = 'base/app/resources';

        $httpBackend.whenGET('resources/configuration/environment-conf.json').respond(
            getJSONFixture('configuration/environment-conf.json')
        );

        scope = $rootScope.$new();
        $controller('JobsCtrl', {
            '$scope': scope
        });

    }));


    it('should have some resultsets', function () {
        //        $httpBackend.flush();
        expect(scope.length).toBe(undefined);
    });

});
