var millis = 0;
var __REFRESHINTERVAL = 60; // IN SEKUNDEN
var current;
setInterval(() => {
    current = Date.now();
    
    if(millis == 0){
        millis = Date.now();
    }
    delta = (current-millis);
    if(delta >= 60000){
        location.reload(true);
        millis = Date.now();
    }
    var pgBar = document.querySelectorAll('.progress-bar')[0];
    var percent = 100* (delta/(__REFRESHINTERVAL * 1000)).toPrecision(2);
    pgBar.style.width = percent+"%  ";
    pgBar.dataset.valuenow = percent;
}, 200);   