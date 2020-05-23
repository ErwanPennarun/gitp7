let restaurants = new Array();
let markers = new Array();
let arrReviews = new Array();
let min = $("#slider-range").slider("values", 0)
let max = $("#slider-range").slider("values", 1)
let note
let comment
let avisArray = [];
let avisTot = null
let avisTotaux = []
let newRestaurant = {};
let lat
let long
let restobje = new Array()

// ajaxGet("listerestaurants.json", function (response) {
//     restaurants = JSON.parse(response);
// });

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}




// function codeAddress(addressVal, callback) {
//     geocoder = new google.maps.Geocoder();
//     // let addressVal = $('#restaurant-address').val();
//     geocoder.geocode({
//         'address': addressVal
//     }, function (results, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             lat = results[0].geometry.location.lat();
//             console.log(lat)
//             long = results[0].geometry.location.lng();
//             callback(lat, long)
//         } else {
//             alert("Geocode was not successful for the following reason: " + status);
//         }

//     });
// }

function codeAddress(addressVal) {
    geocoder = new google.maps.Geocoder();
    // let addressVal = $('#restaurant-address').val();
    return new Promise(function (resolve, reject) {
        geocoder.geocode({
            'address': addressVal
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                resolve(lat = results[0].geometry.location.lat(),
                    long = results[0].geometry.location.lng());

            } else {
                reject(new Error("Geocode was not successful for the following reason: " + status))
            }
        })
    });
}

function addNewRestaurant(data) {
    let name = $('#restaurant-name').val();
    let address = $('#restaurant-address').val()
    codeAddress(address).then(function () {
        let newRestaurant = {
            name: name,
            vicinity: address,
            lat: lat,
            photo: `https://maps.googleapis.com/maps/api/streetview?size=450x300&location=${lat},${long}&fov=90&heading=235&pitch=10&key=AIzaSyAZdsmvqyBOyyj3GaJUPrec-k0hQVeuJk0`,
            long: long,
            prices: "",
            rating: "Non noté",
            reviews: []
        }
        console.log(newRestaurant)
        data.push(newRestaurant)
        showRestaurants(restaurants)

    })

    console.log(restaurants)

}

function updateModal(data, i) {

    $('.submitcomment').unbind('click').bind('click', function () {
        let note = JSON.parse($('#note-avis').val());
        let comment = $('#comment-avis').val();
        let newRating = {
            stars: note,
            comment: comment
        }
        restaurants[i].reviews.splice(0, 0, newRating)
        console.log(restaurants[i])
        $('#modalComment').html(`${getComments(data[i].reviews)}<hr />`)
        $('.stars-front').css("width", transformStars(data, i));
        showRestaurants(data)

    })
}

function showModal(data, i) {

    $('#modalTitle').html(`${data[i].name}`);
    if (data[i].rating != "Non noté") {
        $('.stars-front').css("width", transformStars(data, i));
    } else {
        $('.modal-moyenne').html(`Pas encore d'avis laissé`)
    }

    $('#modalComment').html(`${getComments(data[i].reviews)}<hr />`)
    $('#modalImage').html(`<img src="${data[i].photo}" class="img-resto-modal">`)
    updateModal(data, i)

}


// function createMarkers(data) {

//     for (let i = 0; i < data.length; i++) {
//         let myLatLng = new google.maps.LatLng(data[i].lat, data[i].long);

//         let marker = new google.maps.Marker({
//             position: myLatLng,
//             animation: google.maps.Animation.DROP,
//             map: map,
//             visible: true,
//             title: data[i].restaurantName
//         });

//         marker.addListener('click', function () {
//             showModal(data, i)
//             $('#restoModal').modal('show')
//         })
//         markers.push(marker)

//     }
// }


function createMarker(data) {

    for (let i = 0; i < data.length; i++) {
        var latLng = new google.maps.LatLng(data[i].lat, data[i].long)
        var marker = new google.maps.Marker({
            map: map,
            icon: {
                url: 'http://maps.gstatic.com/mapfiles/circle.png',
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(17, 31)
            },
            position: latLng,
            title: data[i].name
        });
        markers.push(marker)
        marker.addListener('click', function () {
            showModal(restaurants, i)
            $('#restoModal').modal('show')


        })
    }
}

function changeNote() {
    console.log('change note')

    var data = restaurants
    let min = $("#slider-range").slider("values", 0)
    let max = $("#slider-range").slider("values", 1)
    let v = 0;
    let restaurantsFilter = [];
    deleteMarkers()


    for (let i = 0; i < data.length; i++) {
        if (min <= data[i].rating && data[i].rating <= max) {
            restaurantsFilter[v] = data[i];
            v = v + 1
        }
    }

    console.log('restaurants filtrés', restaurantsFilter)
    showRestaurants(restaurantsFilter)
}




function filterRestaurants(data) {

    console.log('filter restaurant')
}

// function getImage(data) {

//     let visualArray = [];

//     for (let i = 0; i < data.length; i++) {
//         if (isNaN(lat) && isNaN(long)) {
//             let lat = data[i].geometry.location.lat()
//             let long = data[i].geometry.location.lng()
//             let photo = `https://maps.googleapis.com/maps/api/streetview?size=450x300&location=${lat},${long}&fov=90&heading=235&pitch=10&key=AIzaSyAZdsmvqyBOyyj3GaJUPrec-k0hQVeuJk0`
//             restaurants[i].picture.push(photo)

//         } else {

//             let lat = data[i].lat;
//             let long = data[i].long
//             let photo = `https://maps.googleapis.com/maps/api/streetview?size=450x300&location=${lat},${long}&fov=90&heading=235&pitch=10&key=AIzaSyAZdsmvqyBOyyj3GaJUPrec-k0hQVeuJk0`
//             restaurants[i].picture.push(photo)
//         }


//     }
//     return 
// }


function getComments(data) {
    let avisArray = []
    let avis = ""

    for (let i = 0; i < data.length; i++) {
        avisArray.push(`${data[i].stars} - ${data[i].comment}<br /><hr />`)
        avis = avisArray.join("")
    }

    return avis
}

function getAverage(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i].stars
    }

    avg = sum / data.length;
    return rounded = +(avg.toFixed(1))
}

function transformStars(data, i) {

    let ratings = data[i].rating;
    // let ratings = getAverage(data[i].ratings);
    let percentage = (ratings / 5) * 100;
    let percentageRounded = `${(Math.round(percentage / 10) * 10)}%`;
    console.log(percentageRounded)
    return percentageRounded
}



function showRestaurants(data) {
    $("#zone-resto").html('')
    createMarker(data)
    console.log(restaurants[1])

    for (let i = 0; i < data.length; i++) {

        let average = data[i].rating
        if (isNaN(average)) {
            average = "Non noté"
        }
        let image = data[i].photo
        $('#zone-resto').append(`<a class="link-resto"><div id="${i}" class="resto-specs"></div></a>`)
        $(".resto-specs#" + i + "").html(`
        <div class="flex-column">
        <button class="btn-note avg-${Math.floor(average)}">${average}</button>
        <h3 class="title">${data[i].name}</h3>
        <p class="adress">${data[i].vicinity}</p></div>
        <div class="flex-row"><img src="${image}" class="img-resto"></div>`)

        $(`.resto-specs#${i}`).click(function () {
            showModal(data, i);
            $('#restoModal').modal('show')
        })
    }
}

// function getReviews(place, status) {
//     arrReviews.length = 0
//     if (status === google.maps.places.PlacesServiceStatus.OK) {

//         reviews = place.reviews
//         image = place.photos[0].getUrl()

//         for (let [key, value] of Object.entries(place)) {
//             console.log(`${key}: ${value}`)
//         }

//         reviews.forEach(function (e) {
//             arrReviews.push(e)
//         })
//         // let restobj = Object.keys(place).map(key => place[key])

//         // console.log(restobj)
//         console.log(arrReviews)
//         showModal(place)
//         $('#restoModal').modal('show')
//     }



// }