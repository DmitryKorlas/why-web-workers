class HeavyTaskExample {
    constructor() {
        this._handleWorkerMessage = this._handleWorkerMessage.bind(this);
        this._renderResult = this._renderResult.bind(this);

        var myWorker = new Worker("heavyTaskWorker.js");
        myWorker.onmessage = this._handleWorkerMessage;


        document.querySelector('#exampleHeavyTask').addEventListener('submit', (event) => {
            event.preventDefault();
            let elements = event.target.elements;
            let useWebWorker = Boolean(elements.useWebWorker.checked);

            if (useWebWorker) {
                myWorker.postMessage(['something']);
            } else {
                this._renderResult('Main thread:'+ this._heavyTask());
            }
        });
    }

    _heavyTask() {
        var duration = 1000;
        var start = Date.now();
        var x=0;
        while (Date.now() - start < duration) {
            x++;
        }
        return x;
    }

    _handleWorkerMessage(event) {
        this._renderResult('Web worker thread:'+ event.data);
    }

    _renderResult(payload) {
        document.querySelector('.result').innerHTML = JSON.stringify(payload);
    }
}
