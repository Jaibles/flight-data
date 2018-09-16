var request = require('superagent');
var xml2jsParser = require('superagent-xml2jsparser');
var _ = require('lodash');
var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.get('/:stopid/:direction/:time', function (req, res) {
  getTrainTime(req.params.stopid, req.params.direction, req.params.time, function(err, result){
    if(err){
      res.status(500).send({ error: 'Something went wrong!' });
    } else {
      res.status(200).send(result);
    }
 });
});

var getTrainTime = function(stopid, direction, time, callback) {
  request.post("https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid=7602&format=xml")
    // .send('stopid=' + station)
    // .send('NumMins=' + time)
    .accept('xml')
    .parse(xml2jsParser) // add the parser function
    .end(function(err, res){
      if (err || !res.ok) {
        callback(err);
      } else {
        var res = _.chain(res.body.ArrayOfObjStationData.objStationData)
                .filter({'direction' : [direction]})
                .transform(function(result, value, key){
                  result[key]= value.destination + '' + value.duetime + 'm'
                }).value();
        var resStr = getCurrentTime();
        if(res.length > 0){
          res.forEach(function(value) {
            resStr += ' ' + value;
          });
        } else {
          resStr += '\n' + 'No data available'
        }
        console.log(resStr)
        callback(null, resStr);
      }
    });
}

function getCurrentTime() {
  var date = new Date();
  return time = ('');
  // return time = ('0' + (date.getHours() + 1)).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
}

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
