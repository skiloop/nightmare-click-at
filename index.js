const debug = require('debug')('nightmare:clickAt');
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
                let child = this.child;
                return this.evaluate_now(
                    function (selector) {
                        let bounds = document.querySelector(selector).getBoundingClientRect();
                        return {
                            left: bounds.left,
                            top: bounds.top,
                            width: bounds.width,
                            height: bounds.height
                        };
                    },
                    function (error, bounds) {
                        if (error) return done(error);
                        let x = Math.floor(bounds.left + px);
                        let y = Math.floor(bounds.top + py);
                        debug(`click at (${px},${py}) of ${selector}`);
                        child.call('clickAt', x, y, done);
                    }, selector);
            });

    }
};
