angular.module('foursquareSearch.GeoLocationFactory', [])

.factory('GeoLocationFactory', ['$q', '$http', function myCoordinates($q, $http) {
  return {
    getLocation: function() {
      var deferred = $q.defer();

      //Unable to use this currently due to security restrictions
      $http.get('http://ip-api.com/json').success(function (ipAPI) {
        
        var myCoordinates = {};

        myCoordinates.lat = ipAPI.lat;
        myCoordinates.lng = ipAPI.lon;
        myCoordinates.city = ipAPI.city + ', ' + ipAPI.region;
        deferred.resolve(myCoordinates);
      }).error(function(error){
        console.log( 'data not loaded');
      });
      return deferred.promise;
    }
  }  
}])
