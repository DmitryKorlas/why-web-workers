onmessage = function(e) {
    importScripts('vendor/highlight.min.js');

    var id = e.data[0].id;
    var content = e.data[0].content;

    postMessage({id: id, content: hljs.highlightAuto(content).value});
};
