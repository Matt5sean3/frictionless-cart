
var animFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
/**
 * A game screen super-class
 * 
 * should perform most of the functionality for displaying things on screen
 */
var Screen = Backbone.Model.extend({
    defaults: function()
    {
        var ret = {
            controller: new Keyboard(),
            running: false,
            time: 0
        };
        return ret;
    },
    initialize: function()
    {
        this.down = this.trigger.bind(this, "keydown");
        this.up = this.trigger.bind(this, "keyup");
    },
    draw: function(ctx)
    {
        var t = performance.now();
        var dt = t - this.get("time");
        this.set("time", t);
        this.trigger("draw", ctx, t, dt);
        if(this.get("running"))
            animFrame(this.draw.bind(this, ctx));
    },
    open: function(ctx){
        this.trigger("open", ctx);
        
        ctx.canvas.addEventListener("keydown", 
            this.down, false);
        
        ctx.canvas.addEventListener("keyup", 
            this.up, false);
        
        this.on("keydown", this.setKey, this);
        this.on("keyup", this.unsetKey, this);
        this.set("running", true);
        this.draw();
    },
    close: function(){
        this.trigger("close");
        this.set("running", false);
        ctx.canvas.removeEventListener("keydown", this.down, false);
        ctx.canvas.removeEventListener("keyup", this.up, false);
    },
    setKey: function(e){
        var keyState = this.get("key");
        keyState[e.keyCode] = true;
        this.set(keyState);
    },
    unsetKey: function(e){
        var keyState = this.get("key");
        keySate[e.keyCode] = false;
        this.set(keyState);
    }
});

