var request = require('superagent');
var _ = require('lodash');
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.get('/:stopid/:direction', function (req, res) {
  getBusTime(req.params.stopid, req.params.direction, function (err, result) {
    if(err){
      res.status(500).send({ error: 'Something went wrong!' });
    } else {
      res.status(200).send(result);
    }
 });
});

var getBusTime = function (stopid, direction, callback) {
  request.get("https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation")
    .query('stopid=' + stopid)
    .end(function(err, res){
      if (err || !res.ok) {
        callback(err);
      } else {
        var res = _.chain(res.body.results)
                .transform(function(result, value, key){
                    if (value.duetime === 'Due') {
                        result[key] = value.route + ':' + value.duetime;
                    } else {
                        result[key] = value.route + ':' + value.duetime + 'm';
                    }
                }).value();
        var resStr = getCurrentTime();

        if(res.length > 0){
          res.forEach(function(value) {
            // resStr += '  ' + value;
            resStr = res + ',' + value; 
          });
        } else {
          resStr += ' ' + 'No data available'
        }
        console.log(resStr)
        callback(null, resStr);
      }
    });
}

function getCurrentTime() {
  var date = new Date();
  return time = ('');
}

app.listen(port, function () {
  console.log('Listening on port ' + port);
});