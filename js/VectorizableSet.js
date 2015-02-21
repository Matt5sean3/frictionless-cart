/**
 * Base class for collections maintaining persistence of vectorizable data
 */

var VectorizableSet = Backbone.Collection.extend({
    toVectors: function() {
        return this.each(function(obj){
            return obj.toVector();
        });
    }
});
