
/**
 * A container for whether a key is pressed
 */
var Key = Backbone.Model.extend({
    defaults: {
        "state": false
    }
});

var Keyboard = Backbone.Collection.extend({
    model: Key,
    initialize: function()
    {
        // Add the 256 keys to trigger
        for(var c = 0; c < 256; c++)
        {
            this.add(new Key());
        }
        this.down = this.trigger.bind(this, "keydown");
        this.up = this.trigger.bind(this, "keyup");
    },
    open: function()
    {
        this.trigger("open");
        window.addEventListener("keydown", 
            this.down, false);
        window.addEventListener("keyup", 
            this.up, false);
        this.on("keydown", this.setKey, this);
        this.on("keyup", this.unsetKey, this);
    },
    close: function()
    {
        this.trigger("close");
        window.removeEventListener("keydown", this.down, false);
        window.removeEventListener("keyup", this.up, false);
    },
    setKey: function(e){
        this.at(e).set("state", true);
    },
    unsetKey: function(e){
        this.at(e).set("state", false);
    },
});
