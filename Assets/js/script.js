const options = {
method: 'GET'
};

const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
const apiKey = `&apikey=cs6ybE2gX1EZMGEsKgTr6gBTb75xbSQf`
const keywordTag = '?keyword=';
const radiusTag = '?radius=';
const unitTag = '?unit=miles';
const postalCodeTag = '?postalCode=';
const cityTag = '?city=';
let city = 'Modesto';
let postalCode = 94102;
let radius = 1000;
let keyword = 'said the sky';

let zipCode = 0;

function getEvent() {
    fetch(url + cityTag + city + apiKey, options)
    .then(function (response) {
        console.log(response)
        return response.json()
    })
    .then(function(data) {
        console.log(data)
    });
}

getEvent();

function passwordlengthfunc(val) {
    document.querySelector("#rangeVal").innerHTML = val + " miles";
  };