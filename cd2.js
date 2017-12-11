var request = require('request');
request('https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all', function (error, response, body) {
  console.log('body:', body); // Print the HTML for the Google homepage.
});