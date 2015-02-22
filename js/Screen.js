
var animFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
/**
 * A game screen super-class
 * 
 * should perform most of the functionality for displaying things on screen
 */
var Screen = Backbone.Model.extend({
    defaults: {
        running: false,
        time: 0
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
        
        this.set("running", true);
        this.draw(ctx);
    },
    close: function(){
        this.trigger("close");
        this.set("running", false);
    }
});

