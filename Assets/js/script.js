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
let page = 0;
let queryData = [];

let rangeSliderEl = $('#range');
let cityInputEl = $('#citySearch');
let keywordInput = $('#eventSearch');
let submitButtonRadiusEl = $('#submitButtonRadius');
let subitButtonCityEl = $('#submitButtonCity');
let evenDataEl = $('#eventData');

let covidInfoBtnEl = $('.covid-btn');

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

function ticketmasterCall(queryInput) {
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
    let queryInput;
    evenDataEl.removeClass('d-none')
    if(city === null && radius !== '0') {
        //search by radius
        getLocation();
        return;
    }
    else if(radius === '0' && city !== '') {
        queryInput = keywordTag + keyword + cityTag + city;
    }
    else {
        queryInput = keywordTag + keyword;
    }
    ticketmasterCall(queryInput);
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

        let eventURL= $("<a href=''><</a>").text(results.events[i].name).attr("href",results.events[i].url);
        let eventName = $("<td></td>").append(eventURL);
        let eventDate = $("<td></td>").text(results.events[i].dates.start.localDate);
        let covidCasesNum = $("<td></td>").text('Filler COVID #s');
        
        
        // add covid info button
        let covidInfoBtnCol = $("<td></td>")
        let covidInfoBtn = $("<button></button>")
        
        covidInfoBtn.addClass("btn btn-sm m-0 btn-warning covid-btn");
        covidInfoBtn.attr('type', "button");
        covidInfoBtn.text("More info");

        // for every specific button
        covidInfoBtn.on('click', goNextPage);

        covidInfoBtnCol.append(covidInfoBtn);


        eventName.addClass('table-row');
        tableRow.append(rowHeader);
        tableRow.append(eventName);
        tableRow.append(eventDate);
        tableRow.append(covidCasesNum);
        tableRow.append(covidInfoBtnCol);
        eventTableBody.append(tableRow);
        
        
    }

}

function goNextPage(event) {
    event.preventDefault();
    console.log("button clicked");
    location.href = "concertSelect.html";
}

submitButtonRadiusEl.on('click', search);


