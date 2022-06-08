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

const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
const apiKey = `?apikey=cs6ybE2gX1EZMGEsKgTr6gBTb75xbSQf`
const keywordTag = '&keyword=';
const radiusTag = '&radius=';
const unitTag = '&unit=miles';
const postalCodeTag = '&postalCode=';
const cityTag = '&city=';
const latlongTag = '&latlong=';
const pageTag = '&page=';

let keyword = "";
let radius = "";
let city = "";
let latlon = "";
let page = 1;
let queryInput = "";
let queryData = [];

let rangeSliderEl = $('#range');
let cityInputEl = $('#citySearch');
let keywordInput = $('#eventSearch');
let submitButtonRadiusEl = $('#submitButtonRadius');
let subitButtonCityEl = $('#submitButtonCity');
let evenDataEl = $('#eventData');
let tableRowEl = $('.table-row');

const options = {
    method: 'GET'
};

function rangValfunc(val) {
    document.querySelector("#rangeVal").innerHTML = val + " miles";
    radius = val;
};

function nextPage() {   //increment page, requery
    page++;
    ticketmasterCall();
}

function previousPage() {   //decrement page, requery
    page--;
    if (page < 1) {
        page = 1;
    }
    ticketmasterCall();
}

function ticketmasterCall() {
    console.log(queryInput);
    fetch(url + apiKey + pageTag + page + queryInput, options)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            queryData = data._embedded; //returns an array of events, if null then there are no events that fit parameters
            console.log(queryData);
            renderResults(queryData);
        });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(stringifyLocation);
    }
}

function stringifyLocation(position) {
    latlon = position.coords.latitude + "," + position.coords.longitude;
    queryInput = keywordTag + keyword + latlongTag + latlon + radiusTag + radius;
    ticketmasterCall();
}

function search() {
    //search using input from search bar and decide whether city input or radius input is used
    radius = rangeSliderEl.val(); //grab radius from slider
    keyword = keywordInput.val();   //grabs keyword input
    city = cityInputEl.val();
    evenDataEl.removeClass('d-none')
    if (city === "" && radius !== 0) {
        //search by radius
        getLocation();
        return;
    }
    else if (radius === 0 && city !== "") {
        queryInput = keywordTag + keyword + cityTag + city;
    }
    else {
        queryInput = keywordTag + keyword;
    }
    ticketmasterCall();
}

//render the results to screen using results which is an array of objects
function renderResults(results) {
    console.log();

    let eventTableBody = $('#event-table-body'); // target the event table body so that we can add in new elements.
    
    eventTableBody.empty(eventTableBody); // clears previous searches
    
    //creates a new row, and fills it with information from event array
    for (let i = 0; i < results.events.length; i++) {
        let tableRow = $("<tr></tr>")
        let rowHeader = $("<th></th>").attr('scope', 'row').text(i + 1);
        let eventName = $("<td></td>").text(results.events[i].name);
        let eventDate = $("<td></td>").text(results.events[i].dates.start.localDate);
        eventName.addClass('table-row');
        tableRow.append(rowHeader);
        tableRow.append(eventName);
        tableRow.append(eventDate);
        eventTableBody.append(tableRow);
    }

}

submitButtonRadiusEl.on('click', search);