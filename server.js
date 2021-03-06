var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var AWS = require('aws-sdk');
var compress = require('compression')();

var port = process.env.PORT || 3000;

var app = express();
app.use(compress);
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
            if(pollenCount === '') {
                pollenCount = 'Low';
            }
            
            json.count = pollenCount;
            json.date = new Date();
            
            console.log(json);

            // s3 credentials set as environment vars process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY $env:AWS_ACCESS_KEY_ID="xyz"
            var s3 = new AWS.S3();
            var bucketName = 'pollencount';

            var keyName = 'pollen.json';
            var expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            expires.setHours(7, 0, 0, 0); // set to 7am tomorrow
            console.log(expires);

            var params = {
                Bucket: bucketName,
                Key: keyName,
                Body: JSON.stringify(json, null, 4),
                ACL: 'public-read',
                // CacheControl : 'max-age=86400' // 1day,
                Expires: expires
            };
            // console.log(params);

            s3.putObject(params, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Successfully uploaded data to ' + bucketName + '/' + keyName);
                }
            });
            // s3.createBucket({ Bucket: bucketName }, function() {
            // });

            res.send('Updated pollen count.');
        } else {
            res.send(error);
        }
    });
});


app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);

console.log('Listening on port ' + port);

exports = module.exports = app;
