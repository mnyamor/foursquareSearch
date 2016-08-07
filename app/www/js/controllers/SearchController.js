angular.module('foursquareSearch.SearchController', [])

.controller('SearchCtrl', function ($scope, $http, $ionicLoading, $timeout) {

  $scope.obj = {
    searchStr: '',
    state: 'isLoading',
  };
  
  $scope.search = function() {
    $scope.obj.state = 'isLoading';
    // load filter options from localStorage 
    var searchTerm = JSON.parse(localStorage.getItem('searchTerm'));
    
    if (searchTerm === null) {
      searchTerm = {
        food: false,
        shops: false,
        nightlife: false,
        trending: false,
        nearest: true,
        toppicks: false
      };

      localStorage.setItem('searchTerm', JSON.stringify(searchTerm));
    }

    // create the category object
    var category = [];

    if (searchTerm.food) category.push('food');
    if (searchTerm.shops) category.push('coffee');
    if (searchTerm.nightlife) category.push('nightlife');
    if (searchTerm.trending) category.push('trending');
    if (searchTerm.nearest) category.push('nearest');
    if (searchTerm.toppicks) category.push('toppicks');

    var config = {
      clientID: 'OGGXK4QQU0V3C3JWHSNL2QA4NH1VLMG5YLLJ1YFVAUHIUXM2',
      clientSecret: 'H4TBVRVNF0IQXQMFVMZFJBFGXW1OQJCSOQLDPCD3AGL5LM0X'
    };

    /*
      &near - place we are searching for
      &section - includes filter options
      &client_id - id generated from foursquare developers
      &client_secret - secret generated from foursquare developers
      &v - version of api we are using - in my case, i use the current date
    */
   
     
    $scope.doRefresh = function() {
      $timeout(function() {
       if ($scope.obj.searchStr !== '') {
        $http.get("https://api.foursquare.com/v2/venues/explore/?near=" + $scope.obj.searchStr + "&venuePhotos=1&section=" + category.join(',') + "&client_id=" + config.clientID + "&client_secret=" + config.clientSecret + "&v=20160807")
          .then(function(res, status) {
            var items = [];
            if (res !== null )
             items = res.data.response.groups[0].items;
            var arr = [];
            for (var i in items) {
              var place = $scope.getVenueData(items[i]);
              arr.push(place);
            }
            $scope.obj.state = 'loaded';
            $scope.venues = arr;
          }, function(data, status) {
            $scope.obj.state = 'noResult';
            console.log('no result');

          });
      };
      $ionicLoading.hide(); //hide the loading
        $scope.$broadcast('scroll.refreshComplete');
      }, 5000);
     };
    $ionicLoading.show();
    $scope.doRefresh();
  }

  $scope.getVenueData = function(data) {
   
    var venue = data.venue;
    var rating = data.venue.rating;

    $scope.getColor = function(){
      if (rating > 7) {
        return 'venueScore positive';
      } else {
        return 'venueScore negative';
      } 
    };

    if (data.tips) {
      var tips = data.tips[0].text;
    }
   var photos = '';
   
   if (data) {
      if (venue.photos.groups[0])
        if (venue.photos.groups[0].items[0])
      photos = venue.photos.groups[0].items[0].prefix + '100x100' + venue.photos.groups[0].items[0].suffix;
   } else {
    console.log('no data');
   }
   return {
      title: venue.name,
      rating: venue.rating,
      venueID: venue.id,
      picture_url: photos,
      reviews: venue.ratingSignals + ' reviews',
      tips: tips,
      place: venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1],
      category: venue.categories[0].name
    };
  };

  //keep track of the search params and update view 
  $scope.$watch('obj.searchStr', function() {
    $scope.search();
  });

})



