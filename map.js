var map, infoWindow, service, bounds

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
      lat: 38.38648,
      lng: -4.4931
    },
    zoom: 14,
    styles: mapStyles
  });

  geocoder = new google.maps.Geocoder;
  infoWindow = new google.maps.InfoWindow;

  google.maps.event.addListener(map, 'idle', function () {
    console.log(map.getBounds());
    let service = new google.maps.places.PlacesService(map);
    let bounds = map.getBounds();

    var request = {
      bounds: bounds,
      type: ['restaurant']
    };

    service.nearbySearch(request, retour);
    clearMarkers()
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


// REPENSER LA FONCTION CREATEMARKERS 

function retour(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // createMarkers(results)

    for (let i = 0; i < results.length; i++) {
      console.log(results[2])
      let LatLng = new google.maps.LatLng(results[i].geometry.location.lat(), results[i].geometry.location.lng());
      let icone = {
        url: 'img/location-pin.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      };
      let markerss = new google.maps.Marker({
        position: LatLng,
        animation: google.maps.Animation.DROP,
        map: map,
        icon: icone,
        visible: true,
        title: results[i].name
      });
      markers.push(markerss)

    }
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