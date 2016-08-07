angular.module('foursquareSearch.SearchController', [])

.controller('SearchCtrl', function ($scope, $http) {

  $scope.obj = {
    searchStr: 'Coffee',
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

    $http.get("https://api.foursquare.com/v2/venues/explore/?near=" + $scope.obj.searchStr + "&venuePhotos=1&section=" + category.join(',') + "&client_id=" + config.clientID + "&client_secret=" + config.clientSecret + "&v=20160807")
      .then(function(res, status) {
        console.log(res.data.response.groups[0].items);

        var items = res.data.response.groups[0].items;
        var arr = [];

        for (var i in items) {
          var place = $scope.getVenue(items[i]);
          arr.push(place);
        }

        $scope.obj.state = 'loaded';
        $scope.venues = arr;
      }, function(data, status) {
        $scope.obj.state = 'noResult';
      });
  };


  $scope.getVenue = function(data) {
    var venue = data.venue;
    var price = '$';

    if (venue.price) {
      var value = venue.price.tier;
      while (value > 1) {
        price += '$';
        value--;
      }
    } else {
      price = '';
    }

    var rating = Math.round(venue.rating) / 2.0;
    var plus = [];
    var minus = [];

    for (var i in [0, 1, 2, 3, 4]) {
      if (rating > 0.5) {
        rating--;
        plus.push(i);
      } else {
        minus.push(i);
      }
    }

    return {
      title: venue.name,
      plus: plus,
      minus: minus,
      venueID: venue.id,
      picture_url: venue.photos.groups[0].items[0].prefix + '100x100' + venue.photos.groups[0].items[0].suffix,
      reviews: venue.ratingSignals + ' reviews',
      price: price,
      place: venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1],
      category: venue.categories[0].name
    };
  };

  //keep track of the search params and update view 
  $scope.$watch('obj.searchStr', function() {
    $scope.search();
  });

})



