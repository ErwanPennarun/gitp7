var map, infoWindow, service, bounds, service


function initMap() {
  let mapStyles = [{
      elementType: "geometry",
      stylers: [{
        color: "#ebe3cd"
      }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{
        color: "#523735"
      }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{
        color: "#f5f1e6"
      }]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#c9b2a6"
      }]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#dcd2be"
      }]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels",
      stylers: [{
        "visibility": "off"
      }]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#ae9e90"
      }]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [{
        color: "#dfd2ae"
      }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{
        color: "#dfd2ae"
      }]
    },
    {
      featureType: "poi",
      elementType: "labels.text",
      stylers: [{
        "visibility": "on"
      }]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#93817c"
      }]
    },
    {
      featureType: "poi.business",
      stylers: [{
        "visibility": "off"
      }]
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{
        color: "#a5b076"
      }]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#447530"
      }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{
        color: "#f5f1e6"
      }]
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{
        "visibility": "on"
      }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{
        color: "#fdfcf8"
      }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{
        color: "#f8c967"
      }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#e9bc62"
      }]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{
        color: "#e98d58"
      }]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#db8555"
      }]
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [{
        "visibility": "off"
      }]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#806b63"
      }]
    },
    {
      featureType: "transit",
      stylers: [{
        "visibility": "off"
      }]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{
        color: "#dfd2ae"
      }]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#8f7d77"
      }]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [{
        color: "#ebe3cd"
      }]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{
        color: "#dfd2ae"
      }]
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{
        color: "#b9d3c2"
      }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#92998d"
      }]
    }
  ]

  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 8.38648,
      lng: -4.4931
    },
    zoom: 14,
    styles: mapStyles
  });

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  geocoder = new google.maps.Geocoder;
  infoWindow = new google.maps.InfoWindow;
  service = new google.maps.places.PlacesService(map);


  google.maps.event.addListener(map, 'idle', function () {
    let bounds = map.getBounds();
    

    var request = {
      bounds: bounds,
      type: ['restaurant']
    };

    service.nearbySearch(request, restaurantToArray);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
      infoWindow.open(map);

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// Try HTML5 geolocation.


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


function checkPosition() {
  let adjacent = false;
  if (userrestaurant.length != 0) {

    let pos = map.getCenter();
    let centerLatLng = new google.maps.LatLng(pos.lat(), pos.lng())

    for (let i = 0; i < userrestaurant.length; i++) {
      let restaurantLatLng = new google.maps.LatLng(userrestaurant[i].lat, userrestaurant[i].long)
      if ((google.maps.geometry.spherical.computeDistanceBetween(centerLatLng, restaurantLatLng)) < 2000) {
        adjacent = true
      }
    }
    return adjacent
  }

}

function restaurantToArray(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    restaurants.length = 0
    console.log(results)

    deleteMarkers()
    for (let i = 0; i < results.length; i++) {
      let newRestaurant = {};
      newRestaurant.name = results[i].name;
      if (results[i].photos == undefined) {
        newRestaurant.photo = `https://maps.googleapis.com/maps/api/streetview?size=450x300&location=${results[i].geometry.location.lat()},${results[i].geometry.location.lng()}&fov=90&heading=235&pitch=10&key=AIzaSyAZdsmvqyBOyyj3GaJUPrec-k0hQVeuJk0`

      } else {
        newRestaurant.photo = results[i].photos[0].getUrl()
      }
      newRestaurant.rating = results[i].rating;
      newRestaurant.vicinity = results[i].vicinity;
      newRestaurant.lat = results[i].geometry.location.lat();
      newRestaurant.long = results[i].geometry.location.lng();
      newRestaurant.reviews = [];
      newRestaurant.origin = "Google"

      let request = {
        placeId: results[i].place_id,
        fields: ['reviews', 'formatted_phone_number', 'formatted_address']
      }

      service.getDetails(request, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          var reviews = place.reviews
          newRestaurant.phone = place.formatted_phone_number
          newRestaurant.full_address = place.formatted_address


          for (let i = 0; i < reviews.length; i++) {
            var review = {}
            review.author = reviews[i].author_name
            review.stars = reviews[i].rating
            review.comment = reviews[i].text
            review.time = reviews[i].time
            newRestaurant.reviews.push(review)
          }
          restaurants.push(newRestaurant)
          changeNote()
          // filterRestaurants(restaurants, min, max)
          showRestaurants(restaurants)


        }
      }
      )
    }

  }
}


function getLatLng() {

  google.maps.event.addListener(map, 'click', function (event) {

    let latlng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    geocoder.geocode({
      'location': latlng
    }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0])
          if (results[0].formatted_address.includes("France")) {
            let adressResult = `${results[0].address_components[0].long_name} ${results[0].address_components[1].long_name}, ${results[0].address_components[6].long_name} ${results[0].address_components[2].long_name}`
            $('#restaurant-address').val(adressResult);
            codeAddress(adressResult)

          } else {
            $('#restaurant-address').val(results[0].formatted_address)
          }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });



  })

}