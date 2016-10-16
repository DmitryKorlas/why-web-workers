var example = (function() {
    return {
        run() {
            this._toggle = this._toggle.bind(this);

            this._toggle();
            new HeavyTaskExample();
            new GistsExample();
        },

        _toggle() {
            var nodes = Array.from(document.querySelectorAll('.animated'));
            nodes.forEach((node) => {
                if (node.classList.contains('slide-out') || node.classList.contains('slide-in')) {
                    node.classList.toggle('slide-out');
                    node.classList.toggle('slide-in');
                } else {
                    node.classList.add('slide-out');
                }
            });

            setTimeout(this._toggle, 3000);
        }
    }
})();

example.run();
