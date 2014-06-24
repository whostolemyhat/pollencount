var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
// var bodyParser = require('body-parser');

var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/scrape', function(req, res) {
    var url = 'http://www.bbc.co.uk/weather/2654675';
    // return
    var json = { count: '' };

    request(url, function(error, response, html) {
        if(!error) {
            // alias dorrar to returned html - allows equiv jquery
            var $ = cheerio.load(html);
            var pollenCount;
            pollenCount = $('.pollen-index .value').text();
            json.count = pollenCount;
            json.date = new Date();

            console.log(pollenCount);

            fs.writeFile('pollen.json', JSON.stringify(json, null, 4), function(err) {
                if(err) {
                    console.log('Error writing json file');
                } else {
                    console.log('Wrote json file');
                }
            });

            res.send('Pollen count updated');
        }
    });
});

app.get('/api/count', function(req, res) {
    var json = require('./pollen.json');
    res.json(json);
});

app.get('/', function(req, res) {
    res.render('index');
});

app.listen('8081');

console.log('Listening on port 8081');

exports = module.exports = app;