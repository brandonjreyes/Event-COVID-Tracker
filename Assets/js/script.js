// const options = {
// method: 'GET'
// };

// const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
// const apiKey = `?apikey=cs6ybE2gX1EZMGEsKgTr6gBTb75xbSQf`
// const keywordTag = '&keyword=';
// const radiusTag = '&radius=';
// const unitTag = '&unit=miles';
// const postalCodeTag = '&postalCode=';
// const cityTag = '&city=';
// const latlongTag= '&latlong=';
// let city = 'Modesto';
// let postalCode = 94102;
// let radius = 1000;
// let keyword = 'said the sky';
// let latlon = `37.6762348,-120.9362981`;

// let zipCode = 0;

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         alert('browser does not support geolocation');
//     }
// }

// function showPosition(position) {
//     let p = position.coords.latitude + "," + position.coords.longitude;
//     console.log(p);
// }

// function getEvent() {
//     fetch(url + apiKey + latlongTag + latlon + radiusTag + radius + '&page=1', options)
//     .then(function (response) {
//         console.log(response)
//         return response.json()
//     })
//     .then(function(data) {
//         console.log(data)
//     });
// }
// getLocation();
// getEvent();

/*
First take the search input from user
    Keyword
        Either radius from current location
    or  Input city

Query from api using input, pull data and render to screen (20 at a time)
    will need some element to toggle pages (basically do the same query but with a different page tag)

User clicks on a certain event
    Take the venue data from clicked event and grab the zip code
    Use zip code api to find county
    Take that county and then get COVID data using COVID api
        with all this data, render to screen
            Event name
            Venue
            Time starts
            County event is in
            Current cases
            Vaccination rates
*/

function rangValfunc(val) {
    document.querySelector("#rangeVal").innerHTML = val + " miles" ;
  };

function submitButton(event) {
    document.querySelector("button")
}

const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
const apiKey = `?apikey=cs6ybE2gX1EZMGEsKgTr6gBTb75xbSQf`
const keywordTag = '&keyword=';
const radiusTag = '&radius=';
const unitTag = '&unit=miles';
const postalCodeTag = '&postalCode=';
const cityTag = '&city=';
const latlongTag= '&latlong=';
const pageTag = '&page=';

let keyword = "";
let radius = "";
let city = "";
let latlon = "";
let page = 1;
let queryInput = "";

function ticketmasterCall() {
    fetch(url + apiKey + + pageTag + page + queryInput, options)
    .then(function (response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data)
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(stringifyLocation);
    }
}

function stringifyLocation(position) {
    latlon = position.coords.latitude + "," + position.coords.longitude;
    console.log(latlon);
    queryInput = latlongTag + latlon + radiusTag + radius;
    ticketmasterCall();
}

function search() {
    //search using input from search bar and decide whether city input or radius input is used
    radius = ""; //grab radius
    city = ""; //grab city
    if(city === "" && radius !== "") {
        //search using radius
        //get location of user
        getLocation();
    }
    else if(radius === "" && city !== "") {
        //search using city
        queryInput = cityTag + city;
        ticketmasterCall();
    }
    else {
        //search using only keyword
    }
}

function renderResults(results) {
    //render the results to screen using results which is an array of objects
}

getLocation();