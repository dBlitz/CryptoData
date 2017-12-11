const got = require('got');
var http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');
'use strict'
const status = require('http-status')

var request = require("request")

var weatherInfo;

var app = express()
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

app.get("/coindifficulty", function (req, res) {
      	(async () => {
		try {
			const response = await got('https://www.coinwarz.com/v1/api/profitability/?apikey=585c543b04da4ac984e0b466c52626e4&algo=all');
			console.log(response.body);
			res.send(response.body)
			//=> '<!doctype html> ...'
		} catch (error) {
			console.log(error.response.body);
			//=> 'Internal server error ...'
		}
	})();
            // repo.getWeatherJSON();

            // repo.getWeatherJSON(function (responseData) {
            //     // res.headers = {Connection: 'close'};
            //     // console.log(responseData);
            //     res.send(responseData);

            // });


            // res.send("hello World");
      });




// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});