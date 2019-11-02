/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

let processPlaintext = (d)=>{
  let tmp = [];   
  let destinations ={};
  tmp.push(d[0].split("\n"));
  let x = 0;
  for(let i of tmp[0]){
    if(x===20){
      break;
    }
    let delay = i.slice(7,14).split("  ",1)[0];
    delay = parseInt(delay)||0;
    let departure = i.slice(0,5);
    let depHr = departure.split(":",2)[0];
    depHr = parseInt(depHr);
    let depMin = departure.split(":",2)[1];
    depMin = parseInt(depMin);
    let realDepature= "";
    if(depMin+delay >= 60){      
      let overshoot = (depMin+delay)-60;
      if(overshoot<10){
        realDepature = (depHr+1)+":0"+(overshoot);
      }else{
        realDepature = (depHr+1)+":"+(overshoot);
      }
    }else{
      if(depMin+delay<10){
        realDepature = depHr+":0"+(depMin+delay);
      }else{
        realDepature = depHr+":"+(depMin+delay);
      }
    }
    destinations[x] = {
      'departure': departure,
      'realdepature': realDepature,
      'delay': delay,
      'vehicle': i.slice(12,20),
      'station': i.slice(21,63).split("  ",1)[0].split("(Oldenburg)",1)[0], 
      'track': i.slice(64,80).split("  ",3)[1] || null,
      'info': i.slice(70,120) || null,
    };
    x++;
  }
  return destinations;
};

/* GET home page. */
router.get('/', function(req, res, next) {

  let schedule = require("../controllers/fahrplan");
  let destinationData = schedule.getJSON();

  Promise.all([destinationData]).then(d =>{
    d = processPlaintext(d);
    res.render('index', { title: 'Express', data : d});
  });
});

module.exports = router;
