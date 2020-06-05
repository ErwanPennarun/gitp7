let restaurants = new Array();
let userrestaurant = new Array();
let markers = new Array();
let min = $("#slider-range").slider("values", 0)
let max = $("#slider-range").slider("values", 1)
// let note
// let comment
let avisArray = [];
let newRestaurant = {};
// let lat
// let long

ajaxGet("listerestaurants.json", function (response) {
    userrestaurant = JSON.parse(response);
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

function codeAddress(addressVal) {
    geocoder = new google.maps.Geocoder();
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
    let phone = $('#restaurant-phone').val()
    codeAddress(address).then(function () {
        let newRestaurant = {
            name: name,
            vicinity: address,
            phone: phone,
            full_address: address,
            lat: lat,
            long: long,
            origin: "User",
            photo: `https://maps.googleapis.com/maps/api/streetview?size=450x300&location=${lat},${long}&fov=90&heading=235&pitch=10&key=AIzaSyAZdsmvqyBOyyj3GaJUPrec-k0hQVeuJk0`,
            rating: "Non noté",
            reviews: []
        }

        data.push(newRestaurant)
        showRestaurants(restaurants)

    })
}



function addComment(data, i) {

    $('.submitcomment').unbind('click').bind('click', function () {
        let note = parseInt($('input[name=note]:checked', '#notation').val())
        let comment = $('#comment-avis').val();
        let author = $('#comment-author').val()
        let d = Date.now();
        let t = Math.floor(d / 1000)
        let newRating = {
            author: author,
            stars: note,
            comment: comment,
            time: t
        }
        data[i].reviews.splice(0, 0, newRating)
        $('#modalComment').html(`${getComments(data[i].reviews)}<hr />`)
        $('.stars-front').css("width", transformBalls(getAverage(data[i].reviews)));
        showRestaurants(data)

    })
}

function showModal(data, i) {
    let rating = getAverage(data[i].reviews)
    $('#modalTitle').html(`${data[i].name}`);
    $('.addresse-modal').html(`${data[i].full_address}`)
    $('.phone-modal').html(`${data[i].phone}`)
    if (isNaN(rating)) {
        $('.stars-front').css("width", 0);
    }
    $('.stars-front').css("width", transformBalls(rating));
    $('#modalComment').html(`${getComments(data[i].reviews)}`)
    $('#modalImage').html(`<img src="${data[i].photo}" class="img-resto-modal">`)
    addComment(data, i)

}

function createMarker(data) {

    for (let i = 0; i < data.length; i++) {

        if (data[i].origin === "User") {
            url = 'img/seo-and-web.png'
        } else {
            url = 'img/pin.png'
        }
        var latLng = new google.maps.LatLng(data[i].lat, data[i].long)
        var marker = new google.maps.Marker({
            map: map,
            icon: {
                url: url,
                anchor: new google.maps.Point(10, 10),
                scaledSize: new google.maps.Size(40, 40)
            },
            position: latLng,
            animation: google.maps.Animation.DROP,
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

    let data = restaurants
    let min = $("#slider-range").slider("values", 0)
    let max = $("#slider-range").slider("values", 1)
    deleteMarkers()
    let filteredRestaurants = filterRestaurants(data, min, max)
    console.log(filteredRestaurants)
    showRestaurants(filteredRestaurants)
}




function filterRestaurants(data, min, max) {

    let restaurantsFilter = [];
    let v = 0;

    for (let i = 0; i < data.length; i++) {
        if (min <= getAverage(data[i].reviews) && getAverage(data[i].reviews) <= max) {
            restaurantsFilter[v] = data[i];
            v = v + 1
        }
    }

    return restaurantsFilter

}

function findDay(time) {
    let d = new Date(time * 1000)
    let day = d.getDate()
    let month = d.getMonth() + 1
    let year = d.getFullYear()
    let date = `${day}/${month}/${year}`

    return date
}

function getComments(reviews) {
    let avisArray = []
    let avis = ""

    for (let i = 0; i < reviews.length; i++) {

        let note = `<div class="balls-back"><div class="balls-front" style="width:${transformBalls(reviews[i].stars)}"></div></div>`
        let date = findDay(reviews[i].time)
        avisArray.push(`${note} - Avis de <b>${reviews[i].author}</b> le ${date}<br />${truncate(reviews[i].comment)}<hr />`)
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

function transformBalls(rating) {
    let percentage = `${Math.round((rating / 5) * 100)}%`

    return percentage
}


function showRestaurants(data) {
    $("#zone-resto").html('')
    if (checkPosition()) {

        for (let y = 0; y < userrestaurant.length; y++) {
            var index = restaurants.findIndex(x => x.name == userrestaurant[y].name)
            if (index === -1) {
                restaurants = restaurants.concat(userrestaurant[y])
            }
        }
    }
    createMarker(data)


    for (let i = 0; i < data.length; i++) {

        let average = getAverage(data[i].reviews)
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

function truncate(input) {

    if (input.length > 200) {
        let truncated = `${input.substring(0, 200)}...`
        let text = input
        var html = `
        <div class="truncate-text" style="display:block">${truncated}
            <a href="#" class="moreless more">Lire la suite</a>
        </div>
        <div class="full-text" style="display:none">${text}
            <a href="#" class="moreless less">Lire moins</a>
        </div>`

        return html
    } else {
        return input;
    }
};