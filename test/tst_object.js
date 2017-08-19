require('../lib/object.js');

module.exports = {
    test_setPrototypeOf: function(test) {
        var proto = {
            getX: function() {
                return this.x;
            }
        };

        var p = {
            x: 10
        };

        Object.setPrototypeOf(p, proto);

        test.compare(p.x, p.getX());
    }
};
