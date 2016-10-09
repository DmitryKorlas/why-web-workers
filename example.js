var example = (function() {
    return {
        run: function () {
            this._handleWorkerMessage = this._handleWorkerMessage.bind(this);
            this._renderResult = this._renderResult.bind(this);
            this._toggle = this._toggle.bind(this);
            var self = this;

            document.querySelector('#run').addEventListener('click', function() {
                self._renderResult('Main thread:'+ self._heavyTask());
            });

            var myWorker = new Worker("heavyTaskWorker.js");
            myWorker.onmessage = this._handleWorkerMessage;

            document.querySelector('#runViaWorker').addEventListener('click', function() {
                myWorker.postMessage(['something']);
            });

            this._toggle();
        },

        _heavyTask: function() {
            var duration = 1000;
            var start = Date.now();
            var x=0;
            while (Date.now() - start < duration) {
                x++;
            }
            return x;
        },

        _toggle: function() {
            var node = document.querySelector('h1.animated');
            if (node.classList.contains('slide-out') || node.classList.contains('slide-in')) {
                node.classList.toggle('slide-out');
                node.classList.toggle('slide-in');
            } else {
                node.classList.add('slide-out');
            }

            setTimeout(this._toggle, 3000);
        },

        _handleWorkerMessage: function(e) {
            this._renderResult('Web worker thread:'+ e.data);
        },

        _renderResult: function(payload) {
            console.log('_renderResult', payload);
            document.querySelector('.result').innerHTML = JSON.stringify(payload);
        }
    }
})();

example.run();
