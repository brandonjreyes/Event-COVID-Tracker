//ticketmaster api variables


//testtestewlajfdkl;jasklfds
//covid data api
const covidAPIKey = `06c6412217b747449f8ef9626323e7a4`;

//elements on page
const searchBarEl = $("#searchBar");
const sml = window.matchMedia("(max-width: 500px)");
const sizeTag = '&size=';
const countyNameEl = $('<span>');
const covidDataHeader = $('#covidDataLabel');
const countyStatsEl = $('#countyStats');
const modalEl = $('#covidModal');
const rangeSliderEl = $('#range');
const cityInputEl = $('#citySearch');
const keywordInput = $('#eventSearch');
const submitButtonEl = $('#submitButton');
const evenDataEl = $('#eventData');
const footerCloseModal = $('#footerCloseModal');
const headerCloseModal = $('#headerCloseModal');
const eventCardsContainer = $(`#eventCards`);
const hiddenBtn = $('#hiddenBtn');
hiddenBtn.attr('data-mdb-toggle', 'modal').attr('data-mdb-target', '#covidModal');

//global variables
let keyword = "";
let radius = "";
let city = "";
let latlon = "";
let page = 0;
let totalPages;
let queryInput = "";
let queryData = [];
let savedFavorites = {};

// makes adjustments for smaller screens
function smlScrn(sml) {
    if (sml.matches) {
        $(searchBarEl).removeClass("w-25");
        $(searchBarEl).addClass("w-100");

    } else {
        $(searchBarEl).addClass("w-25");
        $(searchBarEl).removeClass("w-100");
    }
}

const options = {
    method: 'GET'
};

// function for slider
function rangValfunc(val) {
    document.querySelector("#rangeVal").innerHTML = val + " miles";
    radius = val;
};

function nextPage() {   //increment page, requery
    page++;
    if (page === totalPages) {
        page--;
    }
    ticketmasterCall();
}

function previousPage() {   //decrement page, requery
    page--;
    if (page < 0) {
        page = 0;
    }
    ticketmasterCall();
}

// ticketmaster API call
function ticketmasterCall() {
    fetch(ticketMasterURL + ticketMasterAPIKey + pageTag + page + queryInput + sizeTag + 15, options)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            totalPages = data.page.totalPages;
            queryData = data._embedded; //returns an array of events, if null then there are no events that fit parameters
            console.log(queryData);
            renderResults(queryData);
        });
}

function getCounty(zipCode) {   //gets fipsCode from inputted zipcode
    let fipsCode = '';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'us-zip-code-lookup.p.rapidapi.com',
            'X-RapidAPI-Key': 'dff04c7643mshdf131b4c950b3bcp1de78bjsnebeba2fbf878'
        }
    };

    fetch(`https://us-zip-code-lookup.p.rapidapi.com/getZip?zip=${zipCode}`, options)
        .then(response => response.json())
        .then(function (data) {
            fipsCode = data.Data[0].StateFIPS + data.Data[0].CountyFIPS;    //makes fips code
            covidAPICall(fipsCode);
        });
}

function covidAPICall(fipsCode) {   //takes fipsCode and gets data
    fetch(`https://api.covidactnow.org/v2/county/${fipsCode}.json?apiKey=${covidAPIKey}`)
        .then(response => response.json())
        .then(function (data) {
            renderCovidModal(data);
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
    queryInput = "";
    radius = rangeSliderEl.val(); //grab radius from slider
    keyword = keywordInput.val();   //grabs keyword input
    city = cityInputEl.val();
    if (city === "" && radius !== '0') {
        //search by radius
        getLocation();
        return;
    }
    else if (radius === '0' && city !== "") {
        queryInput = keywordTag + keyword + cityTag + city;
        ticketmasterCall();
    }
    else if (keyword !== '') {
        queryInput = keywordTag + keyword;
        ticketmasterCall();
    }
    else if (keyword === '' && radius === '0' && city === "") {
        //literally nothing, give error to have user enter input
        displayModalEmptyResults();
    }
}

function arrayToDate(dateArr) {
    let output = '';
    let month;
    switch (dateArr[1]) {
        case '01':
            month = 'January';
            break;
        case '02':
            month = 'February';
            break;
        case '03':
            month = 'March';
            break;
        case '04':
            month = 'April';
            break;
        case '05':
            month = 'May';
            break;
        case '06':
            month = 'June';
            break;
        case '07':
            month = 'July';
            break;
        case '08':
            month = 'August';
            break;
        case '09':
            month = 'September';
            break;
        case '10':
            month = 'October';
            break;
        case '11':
            month = 'November';
            break;
        case '12':
            month = 'December';
            break;
    }
    output = `${month} ${dateArr[2]}, ${dateArr[0]}`;
    return output;
}

//render the results to screen using results which is an array of objects
function renderResults(results) {
    // emptys cards container on start of funciton
    eventCardsContainer.empty();
    tableCount = page * 15 + 1;

    //adds pagination
    let paginationNav = $(`<nav>`).attr('aria-label', 'Page navigation example').attr('id', 'pagination').addClass("rounded-6");
    let paginationUL = $(`<ul>`).addClass('pagination').addClass('p-2 justify-content-between').attr('id', 'paginationUL');
    paginationUL.append($("<div type = 'button'><i class='fa-solid fa-arrow-left'></i> Prev &nbsp;</div>").attr("id", "prevBtn").on("click", previousPage));
    paginationUL.append($("<div type = 'button'> &nbsp; Next <i class='fa-solid fa-arrow-right'></i></div>").attr("id", "nextBtn").on("click", nextPage));
    paginationNav.append(paginationUL);
    eventCardsContainer.append(paginationNav);

    if (results !== undefined) {
        //creates a new row, and fills it with information from event array
        for (let i = 0; i < results.events.length; i++) {
            //populate cards
            //data for cards
            let zipcode = results.events[i]._embedded.venues[0].postalCode;
            let dateArr = results.events[i].dates.start.localDate.split("-");
            let date = arrayToDate(dateArr);

            //card elements
            let card = $(`<div>`).addClass(`card m-3`);
            let cardBody = $(`<div>`).addClass(`card-body d-flex container-fluid`);
            let cardTitle = $(`<h5>`);
            let cardTitleA = $(`<a>`).text(results.events[i].name).attr("href", results.events[i].url).attr("target", "_blank");
            cardTitle.append(cardTitleA);
            let pDate = $(`<p>`).text(date);

            let cardBtnContainer = $(`<div>`).css({ 'display': 'flex' });
            cardTitle.addClass("col-md-5 align-items-center")
            pDate.addClass("col-md-5 align-items-center")
            cardBtnContainer.addClass("col-md-2 ms-auto justify-content-end align-items-center")


            let covidBtn = $("<button></button>");
            covidBtn.addClass("btn btn-sm m-0 btn-warning covid-btn")
                .attr('type', "button")
                .attr('data-mdb-toggle', "modal")
                .attr('data-mdb-target', "#covidModal")
                .data('zipcode', zipcode)
                .text("COVID INFO");
            let favoriteStar = $("<th><button type='button' class='btn btn-floating justify-content-between'><i class='fa-regular fa-star'></i></button></th>");
            favoriteStar.attr('id', 'favorites')
                .data('eventName', results.events[i].name)
                .data('eventCity', results.events[i]._embedded.venues[0].city.name)
                .data('eventDate', results.events[i].dates.start.localDate)
                .data('eventURL', results.events[i].url)
                .data('eventID', results.events[i].id);
            cardBtnContainer.append(covidBtn, favoriteStar);
            cardBody.append(cardTitle, pDate, cardBtnContainer);
            card.append(cardBody);
            eventCardsContainer.append(card);
        }
        // sets cards to be displayed
        eventCardsContainer.removeClass("d-none");
    }
    else {
        displayModalEmptyResults();
    }
}
// Displays modal for if user provided no inputs
function displayModalEmptyResults() {
    hiddenBtn.click();
    covidDataHeader.text("UH OH");
    countyStatsEl.text("Sorry your search resulted in 0 events please expand your search");
    footerCloseModal.on('click', emptyModal);
    headerCloseModal.on('click', emptyModal);
}

function renderCovidModal(data) {
    if (data) {
        let countyName = data.county;
        countyNameEl.text("Covid Data For: " + countyName);
        covidDataHeader.append(countyNameEl);
        countyStatsUl = $("<ul>")
        let casesMetric = data.metrics.weeklyNewCasesPer100k;   //The number of new cases per 100k population over the last week.
        let casesMetricDesc = 'New cases per 100k population over the last week: ';
        $(countyStatsUl).append("<li>" + casesMetricDesc + casesMetric + "</li>");
        let covidAdmissions = data.metrics.weeklyCovidAdmissionsPer100k; //Number of COVID patients per 100k population admitted in the last week.
        let covidAdmissionsDesc = 'COVID patients per 100k pop admitted in the last week: ';
        $(countyStatsUl).append("<li>" + covidAdmissionsDesc + covidAdmissions + "</li>");
        let population = data.population;   //population of county
        let populationDesc = 'Population of County: ';
        $(countyStatsUl).append("<li>" + populationDesc + population + "</li>");
        let vaxRatio = data.metrics.vaccinationsCompletedRatio; //Ratio of population that has completed vaccination.
        let vaxCompleted = vaxRatio * 100;   //Percentage of people that have completed vaccination.
        let vaxCompletedDesc = 'Percentage of people vaccinated fully: ';
        $(countyStatsUl).append("<li>" + vaxCompletedDesc + vaxCompleted.toFixed(2) + "%" + "</li>");
        countyStatsEl.append(countyStatsUl);
    }
    footerCloseModal.on('click', emptyModal);
    headerCloseModal.on('click', emptyModal);
}

function emptyModal() {
    covidDataHeader.empty();
    countyStatsEl.empty();
}

smlScrn(sml);
sml.addListener(smlScrn);
submitButtonEl.on('click', search);

function goNewPage(event) {
    event.preventDefault();
    console.log("button clicked");
    location.href = "concertSelect.html";
}

$(document).on('click', '.covid-btn', function () {
    let zipcode = $(this).data('zipcode');
    getCounty(zipcode);
});

$(document).on('click', '#favorites', saveFaveFun);
$(document).on('click', '#favorites', renderFavorites);

function saveFaveFun() {
    let name = $(this).data('eventName');
    let city = $(this).data('eventCity');
    let date = $(this).data('eventDate');
    let id = $(this).data('eventID');
    let url = $(this).data('eventURL');
    lastInput[id] = [name, city, date, url];
    localStorage.setItem('storedFavorites', JSON.stringify(lastInput));
}

let lastInput = JSON.parse(localStorage.getItem("storedFavorites"));
let faveEl = $("#savedFavorites");

if (lastInput != null) {
    renderFavorites();
} else {
    lastInput = {};
    faveEl.text("Add your favorites!");
}

function renderFavorites() {
    faveEl.empty(faveEl);
    for (let x in lastInput) {
        let listEl = $("<li></li>");
        let listURL = $("<a href=''></a>").text(lastInput[x][0]).attr("href", lastInput[x][3]).attr("target", "_blank");
        listEl.append(listURL);
        faveEl.append(listEl);
    }
}

$("#clearBtn").on("click", clearFavorites);

function clearFavorites() {
    faveEl.empty(faveEl);
    lastInput = {};
    faveEl.text("Add your favorites!");
    localStorage.setItem('storedFavorites', JSON.stringify(lastInput));
}

