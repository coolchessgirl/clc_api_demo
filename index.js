#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
var request = require('request');


// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');
app.set('trust proxy', 1) // trust first proxy 


// -------------- serve static folders -------------- //
app.use('/js', express.static(path.join(__dirname, 'js')))
app.use('/css', express.static(path.join(__dirname, 'css')))

var visitCounter = 0;

// -------------- express 'get' handlers -------------- //
//user root page i.e. https://user.tjhsst.edu/pckosek/
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/asyncDemo', function(req, res){

    visitCounter++;

    ion_api_request_url = 'https://ion.tjhsst.edu/api/schedule?format=json';

     // Perform the asyncrounous request ...
    request.get( {url:ion_api_request_url}, 
        // callback for when we get a response
        function (e, r, body) {
            

            // THE RESULT FROM ION API IS STRINGIFIED JSON
            var res_object = JSON.parse(body);

            console.log(res_object['results'][0]);
            console.log(res_object['results'][0]['day_type']);
            console.log(res_object['results'][0]['day_type']['blocks']);
            console.log(res_object['results'][0]['day_type']['blocks'][0]);
            console.log(res_object['results'][0]['day_type']['blocks'][0]['name']);
            console.log(res_object['results'][0]['day_type']['name']);
            console.log(res_object['results'][0]['date']);
            console.log(res_object['results'][0]['day_type']['special']);

            //body will contain the data
            first_block =  res_object['results'][0]['day_type']['blocks'][0]['name'];
            second_block = res_object['results'][0]['date'];
            third_block = res_object['results'][0]['day_type']['name'];
            fourth_block = res_object['results'][0]['day_type']['special'];

            // view rendered feed dictionary
            render_dictionary = { 
                firstBlock : first_block,
                secondBlock : second_block,
                thirdBlock: third_block,
                fourthBlock: fourth_block,
                visits     : visitCounter
            };

            res.render('async', render_dictionary );
        }
    )
});


// -------------- listener -------------- //
// The listener is what keeps node 'alive.' 

var listener = app.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});