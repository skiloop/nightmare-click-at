module.exports = function (Nightmare) {
    if (Nightmare) {
        Nightmare.action('clickAt', function (name, options, parent, win, renderer, done) {
                parent.respondTo('clickAt',
                    function (x, y, done) {
                        win.webContents.sendInputEvent({
                            type: 'mousedown',
                            x: x,
                            y: y,
                            clickCount: 1
                        });
                        win.webContents.sendInputEvent({
                            type: 'mouseup',
                            x: x,
                            y: y
                        });
                        setTimeout(done, 50);
                    });
                done();
            },
            function (selector, px, py, done) {
                var child = this.child;
                return this.evaluate_now(
                    function (selector) {
                        var bounds = document.querySelector(selector).getBoundingClientRect();
                        return {
                            left: bounds.left,
                            top: bounds.top,
                            width: bounds.width,
                            height: bounds.height
                        };
                    },
                    function (error, bounds) {
                        if (error) return done(error);
                        var x = bounds.left + px;
                        var y = bounds.top + py;
                        child.call('clickAt', x, y, done);
                    }, selector);
            });

    }
};
