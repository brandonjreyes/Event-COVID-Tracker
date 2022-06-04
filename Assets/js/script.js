const options = {
method: 'GET'
};

const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
const apiKey = `?apikey=cs6ybE2gX1EZMGEsKgTr6gBTb75xbSQf`
const keywordTag = '&keyword=';
const radiusTag = '&radius=';
const unitTag = '&unit=miles';
const postalCodeTag = '&postalCode=';
const cityTag = '&city=';
const latlongTag= '&latlong=';
const rangeVal = document.getElementById("rangeVal")
// const 
let city = 'Modesto';
let postalCode = 94102;
let radius = 1000;
let keyword = 'said the sky';
let latlon = `37.6762348,-120.9362981`;
let zipCode = 0;
// rangeVal.textContent = rangeVal.value

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('browser does not support geolocation');
    }
}

function showPosition(position) {
    let p = position.coords.latitude + "," + position.coords.longitude;
    console.log(p);
}

function getEvent() {
    fetch(url + apiKey + latlongTag + latlon + radiusTag + radius + '&page=1', options)
    .then(function (response) {
        console.log(response)
        return response.json()
    })
    .then(function(data) {
        console.log(data)
    });
}
getLocation();
getEvent();
