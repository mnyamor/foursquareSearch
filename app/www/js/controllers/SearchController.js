angular.module('foursquareSearch.SearchController', [])

.controller('SearchCtrl', function ($scope, $http, $ionicLoading, $interval, SearchFactory, geolocation, $rootScope, GeoLocationFactory) {
  
  $scope.config = {
    clientID: 'OGGXK4QQU0V3C3JWHSNL2QA4NH1VLMG5YLLJ1YFVAUHIUXM2',
    clientSecret: 'H4TBVRVNF0IQXQMFVMZFJBFGXW1OQJCSOQLDPCD3AGL5LM0X',
    searchStr: '',
    location: '', 
    state: 'isLoading',
    connection:'isConnected'
  };
  //get user location
  $scope.userLocation = function() {
    GeoLocationFactory.getLocation().then(function(data) {   
        if(data) console.log(data);
    });
  };

  //$scope.userLocation();
   
  $scope.doRefresh = function () {
    /*if no data found */
    if ($scope.config.location === '' &&  $scope.config.searchStr === '') {
       $interval(function () {
        $scope.config.state = 'noSearchTerm';
      }, 5000);  
    } 
    
    $interval(function () {
      geolocation.getLocation().then(function (data) {
        $scope.config.coords = { lat: data.coords.latitude, long: data.coords.longitude };
        $scope.coordinates = $scope.config.coords.lat + ',' + $scope.config.coords.long;

          var coords = ($scope.config.location === '' ) ? $scope.coordinates : $scope.config.location;
          if ($scope.config.location === ''  || $scope.config.searchStr  === '' ) return;

          $scope.getVenue = function (locationStr, searchStr, clientID, clientSecret) {
          
          //var URL = "https://api.foursquare.com/v2/venues/explore/?near="+coords+"&query="+$scope.config.searchStr+"&v=20160807&m=foursquare&venuePhotos=1&client_id="+$scope.config.clientID+"&client_secret="+$scope.config.clientSecret;
            SearchFactory.getVenues(coords, $scope.config.searchStr,$scope.config.clientID, $scope.config.clientSecret)
              // then() returns a new promise. We return that new promise.
             // that new promise is resolved via venueData.arr, i.e. the venues
              .then(function (venueData) {
                $scope.config.state = 'loaded';

                if (venueData )
                $scope.venues = venueData.arr;
                
                $scope.config.state = 'loaded';  
                 $ionicLoading.hide(); //hide the loading
                 $scope.$broadcast('scroll.refreshComplete');

                 if ($scope.config.location === '' &&  $scope.config.searchStr === '' || 
                    ($scope.config.location === '' ||  $scope.config.searchStr === '') || $scope.config.location.length <= 3 ) {
                      return $scope.config.state = 'noResult';  
                  }
                }, function(response) {
                  if (response.status === 404 ) {
                   $scope.config.state = 'notFound';
                  }
                  return;
              });
          };
          $scope.getVenue();
          
           
        });
        
      }, 7000);
  };
  
  $scope.search = function () {
      $scope.config.state = 'loaded';
      $scope.doRefresh();
      $ionicLoading.show();
      $scope.doRefresh();  
  };
  // $scope.$watch('config.searchStr', function () {
  //    $scope.search();
  // });
});
