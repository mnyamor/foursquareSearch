angular.module('foursquareSearch.SearchDetailCtrl', [])

.controller('SearchDetailCtrl', function($scope, $http) {
  $scope.mapClick = function() {
    window.location.href = "http://maps.google.com/maps?z=16&t=m&q=loc:" +
      $scope.lat + "+" + $scope.lng;
  };

  $scope.venueID = navi.getCurrentPage().options.venueID;
  $scope.obj = {
    state: 'loading',
  };

  var clientID = "OGGXK4QQU0V3C3JWHSNL2QA4NH1VLMG5YLLJ1YFVAUHIUXM2";
  var clientSecret = "H4TBVRVNF0IQXQMFVMZFJBFGXW1OQJCSOQLDPCD3AGL5LM0X";


  $http.get(
    "https://api.foursquare.com/v2/venues/" +
    $scope.venueID +
    "?client_id=" + clientID +
    "&client_secret=" + clientSecret +
    "&v=20160807"
  ).then(function(result, status) {

    $scope.obj.state = 'loaded';

    var venue = result.data.response.venue;
    $scope.title = venue.name;
    $scope.imgSrc = venue.bestPhoto.prefix + '300x300' + venue.bestPhoto.suffix;

    $scope.address = venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1];
    $scope.openInfo = $scope.getInfo(venue.popular);
    $scope.lat = venue.location.lat;
    $scope.lng = venue.location.lng;
  }, function(data, status) {
    $scope.obj.state = 'noResult';
  });

  $scope.getInfo = function(data) {
    var info = "";
    if (data && data.timeframes) {
      for (var i in data.timeframes[0].open) {
        if (i !== 0) {
          info += '\n';
        }
        info += data.timeframes[0].open[i].renderedTime;
      }
    }

    return info;
  };
});
