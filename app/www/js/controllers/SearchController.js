angular.module('foursquareSearch.SearchController', [])

.controller('SearchCtrl', function ($scope, $http, $ionicLoading, $timeout) {
  $scope.obj = {
    searchStr: '',
    state: 'isLoading',
    location: ''
  };

  $scope.search = function () {
    $scope.obj.state = 'isLoading';

    var config = {
      clientID: 'OGGXK4QQU0V3C3JWHSNL2QA4NH1VLMG5YLLJ1YFVAUHIUXM2',
      clientSecret: 'H4TBVRVNF0IQXQMFVMZFJBFGXW1OQJCSOQLDPCD3AGL5LM0X',
      authUrl: 'https://foursquare.com/',
      apiUrl: 'https://api.foursquare.com/',
      oauth_token: '',
      latitude: '',
      longitude: '',
      location: ''
    };

    $.getJSON('http://ip-api.com/json', function (ipAPI) {
      config.latitude = ipAPI.lat;
      config.longitude = ipAPI.lon;
      config.location = ipAPI.city + ', ' + ipAPI.region;
    });

    // load filter options from localStorage 
    var searchTerm = JSON.parse(localStorage.getItem('searchTerm'));
    if (searchTerm === null) {
      searchTerm = {
        food: false,
        shops: false,
        nightlife: false,
        trending: true,
        nearest: false,
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

    /*
      &near - place we are searching for
      &section - includes filter options
      &client_id - id generated from foursquare developers
      &client_secret - secret generated from foursquare developers
      &v - version of api we are using - in my case, i use the current date
    */
    $scope.recommendations = function () {
      $http.get("https://api.foursquare.com/v2/venues/explore?ll="+ config.latitude + "," + config.longitude + "&m=foursquare&venuePhotos=1&v=20160807&client_id=" + config.clientID + "&client_secret=" + config.clientSecret)
        .then(function (res, status) {
          console.log(res);
          var recommendations = [];
          if (res.data.response.groups) {
            console.log('test');
            recommendations = res.data.response.groups[0].items;
            var arr = [];
            for (var a in recommendations) {
              var place = $scope.getVenueData(recommendations[a]);
              arr.push(place);
              
            }
            $scope.obj.state = 'loaded';
            $scope.venues = arr;
            console.log($scope.venues);
          }

        })
    };

    $scope.doRefresh = function () {
      $timeout(function () {
        if ($scope.obj.searchStr !== '' && $scope.obj.location === '') {
          $scope.obj.location = config.location;
          return;
        } else { $scope.obj.location = ''; } // if api fails

        if ($scope.obj.searchStr === '' && $scope.obj.location !== '') {
            $scope.obj.searchStr ='Recommended places';
            return;
        } else { $scope.obj.searchStr = ''; } // if api fails
        if ($scope.obj.searchStr !== '') {
          $http.get("https://api.foursquare.com/v2/venues/explore/?near=" + $scope.obj.location + "&query=" + $scope.obj.searchStr + "&v=20160807&m=foursquare&venuePhotos=1&section=" + category.join(',') + "&client_id=" + config.clientID + "&client_secret=" + config.clientSecret )
            .then(function (res, status) {
              var items = [];
              if (res !== null)
                items = res.data.response.groups[0].items;

              var arr = [];
              for (var i in items) {
                var place = $scope.getVenueData(items[i]);
                arr.push(place);
              }
              $scope.obj.state = 'loaded';
              $scope.venues = arr;

              if ($scope.venues.length < 1) {
                 $scope.obj.state = 'noResult';
              }

            }, function (data, status) {
                console.log(data);
              $scope.obj.state = 'noResult';
            }).catch(function (e) {
              $scope.obj.state = 'noResult';
              console.log('Error: ', e);
              throw e;
            }).finally(function () {
              //console.log('This finally block');
            });
        } else { 
            if ($scope.obj.location === '' && $scope.obj.searchStr === '') {
              $scope.obj.location = config.location;
              $scope.obj.searchStr = 'Recommendations';
            } else { $scope.obj.location = 'London, UK';}
          $scope.recommendations(); 
        }
        $ionicLoading.hide(); //hide the loading
        $scope.$broadcast('scroll.refreshComplete');
      }, 5000);
    };
    $ionicLoading.show();
    $scope.doRefresh();
  }

  $scope.getVenueData = function (data) {

    var venue = data.venue;
    if (venue.hours !== undefined) { $scope.openingHours = venue.hours.status; }
    if (venue.location.address !== undefined && venue.location.country !== undefined) {
      $scope.address = venue.location.address + ', ' + venue.location.city + ' ' + venue.location.country;
    }
    if (venue.ratingColor !== undefined) { $scope.ratingColor = venue.ratingColor; }
    if (venue.ratingSignals !== undefined) {$scope.reviews = venue.ratingSignals;}
    var rating = data.venue.rating;

    if (data.tips) {
      var tips = data.tips[0].text;
    }
    console.log(venue.author);
    var photos = '';

    if (data !== null) {
      if (venue.photos.groups[0])
        if (venue.photos.groups[0].items[0] !== '')
          photos = venue.photos.groups[0].items[0].prefix + '100x100' + venue.photos.groups[0].items[0].suffix;
      //console.log(photos);
    } else {
      console.log('no data');

    }
    return {
      title: venue.name,
      rating: venue.rating,
      venueID: venue.id,
      picture_url: photos,
      ratingColor: '#' + venue.ratingColor,
      reviews: $scope.reviews + ' reviews',
      tips: tips,
      place: venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1],
      category: venue.categories[0].name,
      openingHours: $scope.openingHours,
      address: $scope.address,
      author: venue.author
    };
  };

  //keep track of the search params and update view 
  $scope.$watch('obj.searchStr', function () {
    $scope.search();
  });

})
