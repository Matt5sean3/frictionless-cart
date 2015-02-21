
/**
 * A 3D point used for drawing
 * 
 * Very inefficient for calculations
 * should be used only for persistence or large object tracking purposes
 */
var Point3 = Backbone.Model.extend({
    defaults: {
        "x": 0,
        "y": 0,
        "z": 0
    },
    toVector: function(){
        return [
            this.get("x"), 
            this.get("y"), 
            this.get("z")
            ];
    },
    fromVector: function(v){
        this.set({
            "x": v[0], 
            "y": v[1], 
            "z": v[2]
        });
    }
});

/**
 * An array of 3D points
 */
var Point3Set = VectorizableSet.extend({
    model: Point3
});
