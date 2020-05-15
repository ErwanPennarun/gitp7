let restaurants = new Array();
let markers = new Array();
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


ajaxGet("listerestaurants.json", function (response) {
    restaurants = JSON.parse(response);
});

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


function updateModal(data, i) {

    $('.submitcomment').unbind('click').bind('click', function () {
        let note = JSON.parse($('#note-avis').val());
        let comment = $('#comment-avis').val();
        let newRating = {
            stars: note,
            comment: comment
        }
        data[i].ratings.splice(0, 0, newRating)
        console.log(restaurants)
        $('#modalComment').html(`${getComments(data[i].ratings)}<hr />`)
        $('.stars-front').css("width", transformStars(data, i));
        showRestaurants(data)

    })
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
            restaurantName: name,
            address: address,
            lat: lat,
            long: long,
            prices: "",
            ratings: []
        }
        console.log(newRestaurant)
        data.push(newRestaurant)
        showRestaurants(restaurants)

    })

    console.log(restaurants)

}


function showModal(data, i) {

    $('#modalTitle').html(`${data[i].restaurantName}`);
    $('.stars-front').css("width", transformStars(data, i));
    $('#modalComment').html(`${getComments(data[i].ratings)}<hr />`)
    $('#modalImage').html(`<img src="${getImage(data, i)}" class="img-resto-modal">`)
    updateModal(data, i)

}




function createMarkers(data) {

    for (let i = 0; i < data.length; i++) {
        let myLatLng = new google.maps.LatLng(data[i].lat, data[i].long);

        let marker = new google.maps.Marker({
            position: myLatLng,
            animation: google.maps.Animation.DROP,
            map: map,
            visible: true,
            title: data[i].restaurantName
        });

        marker.addListener('click', function () {
            showModal(data, i)
            $('#restoModal').modal('show')
        })
        markers.push(marker)

    }
}

function filterRestaurants(data) {

    function changeNote() {
        let min = $("#slider-range").slider("values", 0)
        let max = $("#slider-range").slider("values", 1)
        let v = 0;
        let restaurantsFilter = [];

        for (let i = 0; i < data.length; i++) {
            if (min <= getAverage(data[i].ratings) && getAverage(data[i].ratings) <= max) {
                restaurantsFilter[v] = data[i];
                v = v + 1
            }

        }
        showRestaurants(restaurantsFilter)
        deleteMarkers()
        createMarkers(restaurantsFilter)
    }

    $("#slider-range").slider({
        change: changeNote
    })

}

function getImage(data, i) {
    let visualArray = [];

    for (let i = 0; i < data.length; i++) {
        let lat = data[i].lat
        let long = data[i].long
        visualArray.push(`https://maps.googleapis.com/maps/api/streetview?size=450x300&location=${lat},${long}&fov=90&heading=235&pitch=10&key=AIzaSyAZdsmvqyBOyyj3GaJUPrec-k0hQVeuJk0`)

    }
    return [visualArray[i]]
}

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

    let ratings = getAverage(data[i].ratings);
    let percentage = (ratings / 5) * 100;
    let percentageRounded = `${(Math.round(percentage / 10) * 10)}%`;
    console.log(percentageRounded)
    return percentageRounded
}



function showRestaurants(data) {
    console.log(data)
    $("#zone-resto").html('')

    for (let i = 0; i < data.length; i++) {
        createMarkers(data)
        let average = getAverage(data[i].ratings)
        if (isNaN(average)) {
            average = "Non noté"
        }


        $('#zone-resto').append(`<a class="link-resto"><div id="${i}" class="resto-specs"></div></a>`)
        $(".resto-specs#" + i + "").html(`
        <div class="flex-column">
        <button class="btn-note avg-${Math.floor(average)}">${average}</button>
        <h3 class="title">${data[i].restaurantName}</h3>
        <p class="adress">${data[i].address}</p></div>
        <div class="flex-row"><img src="${getImage(data, i)}" class="img-resto"></div>`)

        $(`.resto-specs#${i}`).click(function () {
            showModal(data, i)
            $('#restoModal').modal('show')
        })

    }
}