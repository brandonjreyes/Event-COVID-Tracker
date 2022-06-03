const options = {
	method: 'GET'
};

const url = 'https://app.ticketmaster.com//discovery/v2/events.json';
const apiKey = `&apikey=cs6ybE2gX1EZMGEsKgTr6gBTb75xbSQf`
const keywordTag = '?keyword=';
let keyword = 'said the sky';

fetch(url + keywordTag + keyword + apiKey, options)
	.then(function (response) {
        return response.json()
    })
	.then(data => console.log(data._embedded.events));