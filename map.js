var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 38.38648,
      lng: -4.4931
    },
    zoom: 14
  });
  geocoder = new google.maps.Geocoder;
  infoWindow = new google.maps.InfoWindow;



  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // var marker = new google.maps.Marker({
      //   position: pos,
      //   map: map,
      //   });
      // infoWindow.setPosition(marker);
      // infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
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
            codeAddress()

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

    // lat = event.latLng.lat();
    // long = event.latLng.lng();

  })

}

function codeAddress() {
  geocoder = new google.maps.Geocoder();
  let addressVal = $('#restaurant-address').val();
  geocoder.geocode({
    'address': addressVal
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      console.log(lat)
      long = results[0].geometry.location.lng();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }

  });
}





// function clickOnMapEvent() {
//   google.maps.event.addListener(map, "click", (e) => {
//       var latitude = e.latLng.lat();
//       var longitude = e.latLng.lng();
//       console.log( latitude + ', ' + longitude ); // NOTE console.log LAT LON FROM CLICK
//       var latHiddenInput = document.getElementById("item-form-lat");
//       latHiddenInput.value = latitude;
//       var longHiddenInput = document.getElementById("item-form-long");
//       longHiddenInput.value = longitude;

//       var geocoder = new google.maps.Geocoder;
//       this.geocodeLatLng(latitude, longitude, geocoder, this.map);
//   });
// }