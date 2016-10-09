onmessage = function(e) {
    var workerResult = heavyTask();
    postMessage(JSON.stringify(e.data)+ ' '+ workerResult);
};

function heavyTask() {
    var duration = 1000;
    var start = Date.now();
    var x=0;
    while (Date.now() - start < duration) {
        x++;
    }
    return x;
}
