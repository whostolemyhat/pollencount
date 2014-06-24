var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var crypto = require('crypto');

var port = process.env.PORT || 3000;

var app = express();
app.use(express.static(__dirname + '/public'));

var AWS_ACCESS_KEY = process.env.aws_access_key_id;
var AWS_SECRET_KEY = process.env.aws_secret_access_key;
var AWS_BUCKET = process.env.aws_bucket;

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
                    // res.send('Error writing json');
                } else {
                    console.log('Wrote json file');
                    // res.send('Pollen count updated');

                    // upload to aws
                    var expires =  Math.ceil((new Date().getTime() + 10000)/1000); // 10 seconds from now
                    var amz_headers = "x-amz-acl:public-read";

                    var putRequest = "PUT\n\napplication/json\n" + expires + "\n" + amz_headers + "\n" + AWS_BUCKET + "/pollen.json";

                    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
                    signature = encodeURIComponent(signature.trim());
                    signature = signature.replace('%2B','+');
                    var url = 'https://'+AWS_BUCKET+'.s3.amazonaws.com/pollen.json';
                    var credentials = {
                        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
                        url: url
                    };
                    res.write(JSON.stringify(credentials));
                    res.end();
                }

            });

            res.send('finished');
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

app.listen(port);

console.log('Listening on port ' + port);

exports = module.exports = app;