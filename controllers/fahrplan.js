/*jshint esversion: 6 */
/*jshint esversion: 6 */
const axios = require('axios');

module.exports.getJSON = ()=>{
    return new Promise((resolve, reject) => {
        //axios.get("https://departure.oepnvmap.de/HOLD.json?version=3&limit=100")
        axios.get("https://api.oepnvmap.de/olbus.dat")
        .then(res =>{resolve(res.data);})
        .catch(err=>reject(err));
    });   
};
module.exports.getJSONdeparture = (station)=>{
    return new Promise((resolve, reject) => {
        //axios.get("https://departure.oepnvmap.de/HOLD.json?version=3&limit=100")
        axios.get("https://departure.oepnvmap.de/"+station+".json?version=3")
        .then(res =>{resolve(res.data);})
        .catch(err=>reject(err));
    });   
};