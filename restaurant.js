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
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}


function updateModal(json, i) {

    $('.submitcomment').unbind('click').bind('click', function () {
        let note = JSON.parse($('#note-avis').val());
        let comment = $('#comment-avis').val();
        let newRating = {
            stars: note,
            comment: comment
        }
        json[i].ratings.splice(0, 0, newRating)
        console.log(restaurants)
        $('#modalComment').html(`${getComments(json[i].ratings)}<hr />`)
        $('.stars-front').css("width", transformStars(json, i));
        showRestaurants(json)

    })
}

function addNewRestaurant(json) {
    let name = $('#restaurant-name').val();
    let address = $('#restaurant-address').val()
    getLatLng()
    codeAddress()
    setTimeout(function () {let newRestaurant = {
        restaurantName: name,
        address: address,
        lat: lat,
        long: long,
        prices: "",
        ratings: []
    }
    console.log(newRestaurant)
    json.push(newRestaurant)
    showRestaurants(restaurants)}, 500)
    console.log(restaurants)

}


function showModal(json, i) {

    $('#modalTitle').html(`${json[i].restaurantName}`);
    $('.stars-front').css("width", transformStars(json, i));
    $('#modalComment').html(`${getComments(json[i].ratings)}<hr />`)
    $('#modalImage').html(`<img src="${getImage(json, i)}" class="img-resto-modal">`)
    updateModal(json, i)

}




function createMarkers(json) {
    for (let i = 0; i < json.length; i++) {
        let myLatLng = new google.maps.LatLng(json[i].lat, json[i].long);

        let marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: json[i].restaurantName
        });

        marker.addListener('click', function () {
            showModal(json, i)
            $('#restoModal').modal('show')
        })
        markers.push(marker)

    }
}

function filterRestaurants(json) {

    function changeNote() {
        let min = $("#slider-range").slider("values", 0)
        let max = $("#slider-range").slider("values", 1)
        let v = 0;
        let restaurantsFilter = [];

        for (let i = 0; i < json.length; i++) {
            if (min <= getAverage(json[i].ratings) && getAverage(json[i].ratings) <= max) {
                restaurantsFilter[v] = json[i];
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

function transformStars(json, i) {

    let ratings = getAverage(json[i].ratings);
    let percentage = (ratings / 5) * 100;
    let percentageRounded = `${(Math.round(percentage / 10) * 10)}%`;
    console.log(percentageRounded)
    return percentageRounded
}



function showRestaurants(json) {
    console.log(json)
    $("#zone-resto").html('')

    for (let i = 0; i < json.length; i++) {
        createMarkers(json)
        let average = getAverage(json[i].ratings)
        if (isNaN(average)) { average = "Non noté"}


        $('#zone-resto').append(`<a class="link-resto"><div id="${i}" class="resto-specs"></div></a>`)
        $(".resto-specs#" + i + "").html(`
        <div class="flex-column">
        <button class="btn-note avg-${Math.floor(average)}">${average}</button>
        <h3 class="title">${json[i].restaurantName}</h3>
        <p class="adress">${json[i].address}</p></div>
        <div class="flex-row"><img src="${getImage(json, i)}" class="img-resto"></div>`)

        $(`.resto-specs#${i}`).click(function () {
            showModal(json, i)
            $('#restoModal').modal('show')
        })

    }
}

