
/**
 *  A minimal implementation of affine transformations in 2D, supporting rotation,
 *  scaling, and translation.  An affine transform is represented as an object
 *  of type AffineTransform2D.  No error checking of parameter values is done!
 */

 class AffineTransform2D {
 
    /**
     *  Create a 2D affine transform object representing the transform from (x,y)
     *  to ( a*x + c*y + e, b*x + d*y + e ).  If exactly one parameter is passed
     *  and it is of type AffineTransform2D, then a copy is made of the parameter.
     *  Otherwise, parameters should be numeric.  Undefined parameter values are
     *  taken from the identity transform.  If no parameters are passed, the
     *  result is the identity transform.
     */
    constructor(a, b, c, d, e, f) {
       if (arguments.length == 1 && (a instanceof AffineTransform2D)){
           this.a = a.a;
           this.b = a.b;
           this.c = a.c;
           this.d = a.d;
           this.e = a.e;
           this.f = a.f;
       }
       else {
           this.a = (a === undefined)? 1 : a;
           this.b = (b === undefined)? 0 : b;
           this.c = (c === undefined)? 0 : c;
           this.d = (d === undefined)? 1 : d;
           this.e = (e === undefined)? 0 : e;
           this.f = (f === undefined)? 0 : f;
       }
    }
    
   
   /**
    *  Returns an array of 9 numbers representing this transform as a 3-by-3 matrix,
    *  in column-major order.
    */
   getMat3() {
       return [
           this.a, this.b, 0,
           this.c, this.d, 0,
           this.e, this.f, 1
       ];
   }
   
   /**
    * Multiply this transform on the right by a rotation transform.  Angle is given in radians.
    * Replaces this transform with the modified transform, and returns the modified transform.
    */
   rotate(radians) {
       var sin = Math.sin(radians);
       var cos = Math.cos(radians);
       var temp = this.a*cos + this.c*sin;
       this.c = this.a*(-sin) + this.c*cos;
       this.a = temp;
       temp = this.b*cos + this.d*sin;
       this.d = this.b*(-sin) + this.d*cos;
       this.b = temp;
       return this;
   }
   
   /**
    * Multiply this transform on the right by a translation transform.
    * Replaces this transform with the modified transform, and returns the modified transform.
    */
   translate(dx, dy) {
       this.e += this.a*dx + this.c*dy;
       this.f += this.b*dx + this.d*dy;
       return this;
   }
   
   /**
    * Multiply this transform on the right by a scaling transform. If only one parameter is
    * passed, does a uniform scaling.
    * Replaces this transform with the modified transform, and returns the modified transform.
    */
   scale(sx, sy = sx) { // Default value for sy is the value passed for sx.
       this.a *= sx;
       this.b *= sx;
       this.c *= sy;
       this.d *= sy;
       return this;
   }

 }
