/**
 * Designed primarily to allow persistence
 */
var Mat4 = Backbone.Model.extend({
    defaults: {
        "m00": 1, "m01": 0, "m02": 0, "m03": 0,
        "m10": 0, "m11": 1, "m12": 0, "m13": 0,
        "m20": 0, "m21": 0, "m22": 1, "m23": 0,
        "m30": 0, "m31": 0, "m32": 0, "m33": 1
    },
    toVector: function(){
        return [
            this.get("m00"), this.get("m10"), this.get("m20"), this.get("m30"),
            this.get("m01"), this.get("m11"), this.get("m21"), this.get("m31"),
            this.get("m02"), this.get("m12"), this.get("m22"), this.get("m32"),
            this.get("m03"), this.get("m13"), this.get("m23"), this.get("m33")
        ];
    },
    fromVector: function(v){
        this.set({
            "m00": v[0], "m01": v[4], "m02": v[8], "m03": v[12],
            "m10": v[1], "m11": v[5], "m12": v[9], "m13": v[13],
            "m20": v[2], "m21": v[6], "m22": v[10], "m23": v[14],
            "m30": v[3], "m31": v[7], "m32": v[11], "m33": v[15]
        });
    }
});

var Mat4Set = VectorizableSet.extend({
    model: Mat4
});
