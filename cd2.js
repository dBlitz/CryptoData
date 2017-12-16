var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');

var path = require('path'),
    methods = require('methods'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');
'use strict'
const status = require('http-status')


var request = require("request")
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

app.get("/coindifficulty", function (req, res) {

    var theUrl = 'https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all'
    request(theUrl, function (error, response, cryptocurrencies) {
      
          console.log('body:', cryptocurrencies); 
          res.send(cryptocurrencies)
          var cryptocurrencies = JSON.parse(cryptocurrencies);
            var bitcoin = cryptocurrencies.Data[1]
            var hashRate = 13500000000000
            var difficulty = bitcoin.Difficulty
            var days = 30.0;
            var secondsADay = 86400.0
            var block = 12.5    
            var profitAMonth = (days * hashRate * block * secondsADay) / (difficulty * 2**32) * 0.1
            var profitADay = profitAMonth / days
            var profitAYear = profitADay * 365.0
            var profitAWeek = profitAYear / 52.0
            var ROI = 2500.0 / (bitcoinPrice * profitADay)
            var monthsROI = Math.floor(Math.ceil(ROI) / days)
            var daysROI = Math.ceil(ROI) % days
            var amountOfBitcoinBreakEven = ROI * profitADay
            var monthAndDays = monthsROI + " months and " + daysROI + " days"
            console.log("Profit a Day: " + profitADay + " Profit a Week: " + profitAWeek + " Profit a Month: " + profitAMonth + " Profit a Year:" + profitAYear)
            // console.log("ROI: " + ROI + " days until return of investment of $2,500 Antminer s9 @ 13.5 TH/s")

            console.log(monthAndDays)
    });


});

/**
  TESTING GETTING (1) Bitcoin Antminer S9
**/

app.post("/profitcalculator", function (req, res) {

   var theUrl = "https://api.coinmarketcap.com/v1/ticker/"
    request(theUrl, function (error, response, cryptocurrencies) {

            var miner = req.body.miner;
            var quantity = req.body.quantity;
            var coinPrice;
            var coinName;
            var litecoinPrice
            var litecoinName;
            var ethereumPrice;
            var cryptocurrencies = JSON.parse(cryptocurrencies);

            if(miner == "AntminerS9") {
                for(index = 0; index < 30; index++) {
                  if(cryptocurrencies[index].name == "Bitcoin") {
                      coinPrice = cryptocurrencies[index].price_usd;
                      coinName = cryptocurrencies[index].name                       
                      console.log(coinName + " price: " + coinPrice)
                  } 
                }
            }

            if(miner == "AntminerL3") {
                for(index = 0; index < 30; index++) {
                  if(cryptocurrencies[index].name == "Litecoin") {
                      coinPrice = cryptocurrencies[index].price_usd;
                      coinName = cryptocurrencies[index].name                       
                      console.log(coinName + " price: " + coinPrice)
                  } 
                }
            }


            res.send(coinPrice)
            profitCalculator(coinName, coinPrice, 1)

    });

    

});

function profitCalculator(coinName, coinPrice, howManyMiners) {

  var theUrl = 'https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all'
            request(theUrl, function (error, response, cryptocurrencies) {

            var cryptocurrencies = JSON.parse(cryptocurrencies);
            var coinInfo;
            for(index = 0; index < 30; index++) {
                if(cryptocurrencies.Data[index].CoinName == "Bitcoin") {
                      coinInfo = cryptocurrencies.Data[index];
                }

            }
      
          difficultyRate(coinInfo, coinPrice, howManyMiners)
          // console.log('body:', cryptocurrencies); 

    });
   
}

function difficultyRate(coinInfo, coinPrice, howManyMiners) {
              // res.send(cryptocurrencies)
            var hashRate;
            var block;
            if(coinInfo.CoinName == "Bitcoin") {
                 hashRate = 13500000000000 * howManyMiners
                 block = 12.5    
            }
            else if(coinInfo.CoinName == "Litecoin") {
                 hashRate = 50400000 * howManyMiners
                 block = 25   
            }
            var difficulty = coinInfo.Difficulty
            var days = 30.0;
            var secondsADay = 86400.0
            var mineAMonth = (days * hashRate * block * secondsADay) / (difficulty * 2**32) 
            var mineADay = mineAMonth / days
            var mineAYear = mineADay * 365.0
            var mineAWeek = mineAYear / 52.0
            console.log(coinPrice)
            var revenueADay = coinPrice * mineADay
            var revenueAWeek = coinPrice * mineAWeek
            var revenueAMonth = coinPrice * mineAMonth
            var revenueAYear = coinPrice * mineAYear
            console.log("Revenue a year " + revenueAYear)



            // var monthsROI = Math.floor(Math.ceil(ROI) / days)
            // var daysROI = Math.ceil(ROI) % days
            // var amountOfBitcoinBreakEven = ROI * profitADay
            // var monthAndDays = monthsROI + " months and " + daysROI + " days"
            // console.log("Profit a Day: " + profitADay + " Profit a Week: " + profitAWeek + " Profit a Month: " + profitAMonth + " Profit a Year:" + profitAYear)
            // console.log("ROI: " + ROI + " days until return of investment of $2,500 Antminer s9 @ 13.5 TH/s")
            // console.log(monthAndDays)
}







app.listen(3000, () => console.log('Example app listening on port 3000!'))

//openssl x509 -req -days 365 -in germanlocalhost.csr -signkey germanlocalhost.key -out germanlocalhost.crt