/*jshint esversion: 6 */

const __DATASOURCE = 2;
const __FROMSTATION = "Oldenburg(Oldb)";
const __TRAINSTATION = "HOLD";

// const __FROMSTATION = "Bremen Hbf";
// const __TRAINSTATION = "HB";

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
      'destination': i.slice(21,63).split("  ",1)[0].split("(Oldenburg)",1)[0], 
      'track': i.slice(64,80).split("  ",3)[1] || null,
      'info': i.slice(70,120) || null,
    };
    x++;
  }
  return destinations;
};


let processJSON = (d)=>{
  d = d[0].departures;
  let tmp = 0;   
  let destinations ={};

  for(let index in d){
    if(d[index].destination != __FROMSTATION){
      realDepature = "";
      let depHr = d[index].scheduledDeparture.split(":",2)[0];
      depHr = parseInt(depHr);

      let depMin = d[index].scheduledDeparture.split(":",2)[1];
      depMin = parseInt(depMin);

      let delay = d[index].delayDeparture || 0;
      let overshoot = (depMin+delay)-60;
      if(overshoot > 0){      
        if(overshoot<10){
          if(depHr == 23){
            realDepature = "00:0"+(overshoot);
          }else{
            realDepature = (depHr+1)+":0"+(overshoot);
          }
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
      let info = "";
      destinations[tmp] = {
        'arrival': d[index].scheduledArrival,
        'departure': d[index].scheduledDeparture,
        'realdepature': realDepature,
        'delay': d[index].delayArrival,
        'vehicle': d[index].train,
        'destination': d[index].destination, 
        'track': d[index].platform,
        'info': info,
        'isCancelled': d[index].isCancelled,
        'via': d[index].via,
      };
    }
    tmp++;
  }
  //console.log(destinations);
  return destinations;
};

/* GET home page. */
router.get('/', function(req, res, next) {

  let schedule = require("../controllers/fahrplan");
  let destinationData = "";
  switch (__DATASOURCE) {
    case 1:
      destinationData = schedule.getJSON();
      break;
    case 2:
      destinationData = schedule.getJSONdeparture(__TRAINSTATION);
      break;  
    default:
      break;
  }

  Promise.all([destinationData]).then(d =>{
    switch (__DATASOURCE) {
      case 1:
        d = processPlaintext(d);
        break;
      case 2:
        d = processJSON(d);
        break;
      default:
        break;
    }
    res.render('index', { title: 'Driveby', data : d});
  });
});

module.exports = router;
