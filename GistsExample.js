class GistsExample {

    constructor() {
        this._renderGists = this._renderGists.bind(this);
        this._highlightGists = this._highlightGists.bind(this);

        this.initialId = 1;

        this._highlightWorker = new Worker('highlighterWorker.js');
        this._highlightWorker.onerror = function (e) {
            console.log('worker error', e);
        };

        this._highlightWorker.onmessage = function (e) {
            let {id, content} = e.data;
            document.querySelector('#'+id).innerHTML = content
        };

        document.querySelector('#exampleGists').addEventListener('submit', (event) => {
            event.preventDefault();
            let elements = event.target.elements;
            let filesAmount = Math.abs(Number(elements.filesAmount.value));
            let symbolsAmount = Math.abs(Number(elements.symbolsAmount.value));
            let useWebWorker = Boolean(elements.useWebWorker.checked);
            this._fetchGists()
                .then((listGists) => {
                    let files = this._takeRandomFiles(filesAmount, listGists);
                    return Promise.all(files.map(fileInfo => this._fetchFile(fileInfo)))
                })
                .then(this._renderGists.bind(this, symbolsAmount))
                .then(this._highlightGists.bind(this, useWebWorker));
        });
    }

    _fetchGists() {
        return fetch('https://api.github.com/gists/public').then(response => response.json())
    }

    _fetchFile({gist, fileName}) {
        let fileMeta = gist.files[fileName];
        return fetch(fileMeta.raw_url)
            .then(response => response.text())
            .then((fileContent) => {
                return {
                    gist, fileName, fileContent
                };
            });
    }

    _nextId() {
        return this.initialId++;
    }

    _takeRandomFiles(amount, listGists) {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        amount = Math.max(0, amount);
        let files = [];
        while (files.length < amount) {
            let randomIndex = getRandomInt(0, listGists.length - 1);
            let gist = listGists[randomIndex];
            let randomFileIndex = getRandomInt(0, Object.keys(gist.files).length - 1);
            let fileName = Object.keys(gist.files)[randomFileIndex];
            if (fileName !== undefined) {
                files.push({gist, fileName});
            }
        }

        return files;
    }

    _renderGists(symbolsAmount, list) {
        return new Promise((resolve) => {
            let id2content = {};
            let html = list.map(({gist, fileName, fileContent}) => {
                let content = fileContent.substr(0, symbolsAmount);
                let linesCount = content.split(/\r\n|\r|\n/).length;
                let initialContent = '<br/>'.repeat(linesCount);
                let id = 'item-'+ this._nextId();
                id2content[id] = content;
                let author = '';
                if (gist.owner) {
                    let authorName = _.escape(gist.owner.login);
                    author = `<span class="gist-author">by <a href="${gist.owner.html_url}">${authorName}</a></span>`;
                }
                return (
                    `<div class="card card-block">
                        <h4 class="card-title">${_.escape(fileName)}</h4>
                        <p class="card-text"><pre><code id="${id}">${initialContent}</code></pre></p>
                        <p class="card-text">
                            ${author}
                            <a href="${gist.html_url}" class="card-link text-right" target="_blank">open on Github</a>
                        </p>
                    </div>`
                );
            })
                .join('');

            html = `<div class="card-columns">${html}</div>`;
            document.querySelector('#gistsListDisplay').innerHTML = html;

            resolve(id2content);
        });
    }

    _highlightGists(useWebWorker, id2content) {
        Object.keys(id2content).forEach((domId) => {
            if (useWebWorker) {
                this._highlightWorker.postMessage([{id: domId, content: id2content[domId]}]);
            } else {
                this._highlight(id2content[domId]).then((result) => {
                    document.querySelector('#'+domId).innerHTML = result.value;
                })
            }
        });
    }

    _highlight(code) {
        return Promise.resolve(hljs.highlightAuto(code))
    }
}
