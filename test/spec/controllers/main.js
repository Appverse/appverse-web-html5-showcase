'use strict';

describe('Controller: MainShowIntro', function () {

  // load the controller's module
  beforeEach(module('appverseClientIncubatorApp'));
  
   // Add the Bootstrap UI module to our tests by loading the BootstrapUI module
  beforeEach(module('ui.bootstrap'));

  var MainShowIntro,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainShowIntro = $controller('MainShowIntro', {
      $scope: scope
    });
  }));

  it('should attach a list of issues to the scope', function () {
    expect(scope.issuesList.length).toBe(9);
  });
});
