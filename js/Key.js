
/**
 * A container for whether a key is pressed
 */
var Key = Backbone.Model.extend({
    defaults: {
        "state": false
    }
});

var Keyboard = Backbone.Collection.extend({
    model: Key
});
