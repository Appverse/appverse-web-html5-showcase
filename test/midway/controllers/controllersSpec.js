'use strict';

describe("Midway: Testing Controllers", function () {

    var tester;
    beforeEach(function () {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('App', {
            template: '<div><div ui-view></div></div>'
        });
    });

    it('should load the /home route by default', function (done) {
        tester.visit('/', function () {
            expect(tester.path()).to.equal('/home');
            var current;
            tester.until(function () {
                current = tester.inject('$state').current;
                return current.templateUrl;
            }, function () {
                expect(current.templateUrl).to.equal('views/main_oauth.html');
                done();
            });
        });
    });

    it('should load the view translation.html when /translation route is accessed', function (done) {
        tester.visit('/translation', function () {
            expect(tester.path()).to.equal('/translation');
            var current;
            tester.until(function () {
                current = tester.inject('$state').current;
                return current.templateUrl;
            }, function () {
                expect(current.templateUrl).to.equal('views/translation/translation.html');
                done();
            });
        });
    });

});
