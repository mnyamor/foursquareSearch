describe('SearchCtrl', function() {
    var scope, controller, httpBackend;
    var URL = "https://api.foursquare.com/v2/venues/explore/?near=london&query=coffee&v=20160807&m=foursquare&venuePhotos=1&client_id=OGGXK4QQU0V3C3JWHSNL2QA4NH1VLMG5YLLJ1YFVAUHIUXM2&client_secret=H4TBVRVNF0IQXQMFVMZFJBFGXW1OQJCSOQLDPCD3AGL5LM0X";

    // Initialization of the AngularJS application before each test case
    beforeEach(module('foursquareSearch'));

    // Injection of dependencies, $http will be mocked with $httpBackend
    beforeEach(inject(function($rootScope, $controller, $httpBackend) {
        scope = $rootScope;
        controller = $controller;
        httpBackend = $httpBackend;
    }));

    it('should query the api', function() {
        // Which HTTP requests do we expect to occur, and how do we response?
        httpBackend.expectGET(URL).respond('[{}]');

        // Starting the controller
        controller('SearchCtrl', {'$scope': scope });

        // Respond to all HTTP requests
        httpBackend.flush();

        // Triggering the AngularJS digest cycle in order to resolve all promises
        scope.$apply();

        // We expect the controller to put the right value onto the scope
        expect(scope.searchStr).toEqual('coffee');

    });

});