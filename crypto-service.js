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

app.get("/coinInfoHome", function (req, res) {


  var coinMarketURL = "https://api.coinmarketcap.com/v1/ticker/"
  var warzURL = 'https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all'

    request(coinMarketURL, function (error, response, coins) {

            var bitcoinPrice;
            var litecoinPrice
            var cryptocurrencies = JSON.parse(coins);

                for(index = 0; index < 30; index++) {
                    // console.log("This is console: " + cryptocurrencies[].name)
                  if(cryptocurrencies[index].name == "Bitcoin") {
                      bitcoinPrice = cryptocurrencies[index].price_usd;
                      console.log("Bitcoin price: " + bitcoinPrice)
                  } 
                  else if(cryptocurrencies[index].name == "Litecoin") {
                      litecoinPrice = cryptocurrencies[index].price_usd;
                      console.log("Litecoin price: " + bitcoinPrice)
                  } 
                }

            request(warzURL, function (error, response, cryptocurrencies) {

                  var bitcoinInfo;
                  var litecoinInfo;
                  var bitcoinRevenueAMonth;
                  var bitcoinDifficulty;
                  var litecoinDifficulty;
                  var mineAMonth;
                  var days = 30.0;
                  var secondsADay = 86400.0;
                  var bitcoinBlockReward;
                  var litecoinBlockReward;
                  var bitcoinHashRate = 13500000000000;
                  var litecoinHashRate = 504000000;

                  var cryptocurrencies = JSON.parse(cryptocurrencies);

                  for(index = 0; index < 30; index++) {
                      if(cryptocurrencies.Data[index].CoinName == "Bitcoin") {
                            bitcoinDifficulty = cryptocurrencies.Data[index].Difficulty;
                            bitcoinBlockReward = cryptocurrencies.Data[index].BlockReward;
                      }
                      else if(cryptocurrencies.Data[index].CoinName == "Litecoin") {
                            litecoinDifficulty = cryptocurrencies.Data[index].Difficulty;
                            litecoinBlockReward = cryptocurrencies.Data[index].BlockReward;
                      }
                   }

                  var bitcoinMineAMonth = (days * bitcoinHashRate * bitcoinBlockReward * secondsADay) / (bitcoinDifficulty * 2**32);
                  var bitcoinRevenueAMonth = Math.ceil((bitcoinPrice * bitcoinMineAMonth) * 100) / 100;
                  var litecoinMineAMonth = Math.ceil(((days * litecoinHashRate * litecoinBlockReward * secondsADay) / (litecoinDifficulty * 2**32)) * 100) / 100;
                  var bitcoinRevenueAMonth = bitcoinRevenueAMonth.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

                  var coinHomePageInfo = '{ "bitcoinRevenueAMonth": "$' + bitcoinRevenueAMonth + '", "litecoinMineAMonth": "' + litecoinMineAMonth + '"}'
                  var coinHomeJSONResponse = JSON.parse(coinHomePageInfo);

                  res.send(coinHomeJSONResponse);
                  // res.send(bitcoinRevenueAMonth + "  " + litecoinMineAMonth)

            });
    }); 


});





app.post("/profitcalculator", function (req, res) {


  var coinMarketURL = "https://api.coinmarketcap.com/v1/ticker/"
  var warzURL = 'https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all'

    request(coinMarketURL, function (error, response, coins) {


            var miner = req.body.miner;
            var quantityOfMiners = req.body.quantity;
            var coinPrice;
            var coinName;
            var litecoinPrice
            var litecoinName;
            var ethereumPrice;
            var cryptocurrencies = JSON.parse(coins);

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

            request(warzURL, function (error, response, cryptocurrencies) {


            var cryptocurrencies = JSON.parse(cryptocurrencies);
            var coinInfo;
            for(index = 0; index < 30; index++) {
                if(cryptocurrencies.Data[index].CoinName == coinName) {
                      coinInfo = cryptocurrencies.Data[index];
                }

            }

            var hashRate;
            var block;
            if(coinInfo.CoinName == "Bitcoin") {
                 hashRate = 13500000000000 * quantityOfMiners
                 block = 12.5    
            }
            else if(coinInfo.CoinName == "Litecoin") {
                 hashRate = 504000000 * quantityOfMiners
                 block = 25    
            }
            var difficulty = coinInfo.Difficulty
            var days = 30.0;
            var secondsADay = 86400.0
            var mineAMonth = (days * hashRate * block * secondsADay) / (difficulty * 2**32) 
            console.log("Mine a month " + mineAMonth)
            var mineADay = mineAMonth / days
            console.log("Mine a Day " + mineADay)
            console.log("litecoin price " + coinPrice)
            console.log("Difficulty: " + difficulty)
///goo through mined and add four decimal places after however many zeroe .0
            var mineAYear = mineADay * 365.0
            var mineAWeek = mineAYear / 52.0
            console.log(coinPrice)
            var revenueADay = coinPrice * mineADay
            var revenueAWeek = coinPrice * mineAWeek
            var revenueAMonth = coinPrice * mineAMonth
            var revenueAYear = coinPrice * mineAYear

            var profitCalculatorPage = '{ "revenueADay": "$' + revenueADay 
                                      + '", "revenueAWeek": "' + revenueAWeek 
                                      + '", "revenueAMonth": "' + revenueAMonth 
                                      + '", "revenueAYear": "' + revenueAYear 
                                      + '", "mineADay": "' + mineADay 
                                      + '", "mineAWeek": "' + mineAWeek 
                                      + '", "mineAMonth": "' + mineAMonth 
                                      + '", "mineAYear": "' + mineAYear 
                                      + '"}'
            var profitCalculatorJSONResponse = JSON.parse(profitCalculatorPage);
            res.send(profitCalculatorJSONResponse)




            });
    }); 


});

















/**
  TESTING GETTING (1) Bitcoin Antminer S9
**/

app.post("/profitcalculator1", function (req, res) {

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

            // res.send(coinPrice)
            var profitJSONResponse = profitCalculator(coinName, coinPrice, quantity)
            console.log("This is how many " + profitJSONResponse)
            // res.send(profitJSONResponse)
    });

    

});

function profitCalculator(coinName, coinPrice, howManyMiners) {

  var theUrl = 'https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all'
            request(theUrl, function (error, response, cryptocurrencies) {

            var cryptocurrencies = JSON.parse(cryptocurrencies);
            var coinInfo;
            for(index = 0; index < 30; index++) {
                if(cryptocurrencies.Data[index].CoinName == coinName) {
                      coinInfo = cryptocurrencies.Data[index];
                }

            }
      
          var profitJSONResponse = difficultyRate(coinInfo, coinPrice, howManyMiners)  
          // console.log(profitJSONResponse)

          return profitJSONResponse;
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
                 hashRate = 504000000 * howManyMiners
                 block = 25    
            }
            var difficulty = coinInfo.Difficulty
            var days = 30.0;
            var secondsADay = 86400.0
            var mineAMonth = (days * hashRate * block * secondsADay) / (difficulty * 2**32) 
            console.log("Mine a month " + mineAMonth)
            var mineADay = mineAMonth / days
            console.log("Mine a Day " + mineADay)
            console.log("litecoin price " + coinPrice)
            console.log("Difficulty: " + difficulty)

            var mineAYear = mineADay * 365.0
            var mineAWeek = mineAYear / 52.0
            console.log(coinPrice)
            var revenueADay = coinPrice * mineADay
            var revenueAWeek = coinPrice * mineAWeek
            var revenueAMonth = coinPrice * mineAMonth
            var revenueAYear = coinPrice * mineAYear
            console.log("Revenue a year " + revenueAYear)


            var coinHomePageInfo = '{ "bitcoinRevenueAMonth": "$' + revenueAYear + '", "litecoinMineAMonth": "' + revenueAYear + '"}'
            var coinHomeJSONResponse = JSON.parse(coinHomePageInfo);
            return coinHomeJSONResponse;
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