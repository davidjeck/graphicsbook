/**
 * An object of type TrackballRotator can be used to implement a trackball-like mouse rotation
 * of a WebGL scene about the origin.  Only the first parameter to the constructor is required.
 * When an object is created, mouse event handlers are set up on the canvas to respond to rotation.
 * It will also work with a touchscreen.
 * 
 * The class defines the following methods for an object rotator of type SimpleRotator:
 *
 *    rotator.getViewMatrix() returns the view transformation matrix as a regular JavaScript
 *         array of 16 elements, in column-major orde, suitable for use with gl.uniformMatrix4fv
 *         or for further transformation with the glMatrix library mat4 class.
 *    rotator.setView(viewDistance, viewpointDirection, viewUp) set up the view, where the
 *         parameters are optional and are used in the same way as the corresponding parameters
 *         in the constructor.
 *    rotator.setViewDistance(viewDistance) sets the distance of the viewer from the origin without
 *         changing the direction of view. The parameter must be a positive number.
 *    rotator.getViewDistance() returns the current value.
 *    rotator.setRotationCenter( vector ) -- Sets the center of rotation.
 *       The parameter must be an array of (at least) three numbers.  The
 *       view is rotated about this point.  Usually, you want the rotation
 *       center to be the point that appears at the middle of the canvas,
 *       but that is not a requirement.  The initial value is effectively
 *       equal to [0,0,0].
 *    rotator.getRotationCenter() -- returns the current value.
 *
 * @param canvas the HTML canvas element used for WebGL drawing.  The user will rotate the
 *    scene by dragging the mouse on this canvas.  This parameter is required.
 * @param callback if present must be a function, which is called whenever the rotation changes.
 *    It is typically the function that draws the scene
 * @param viewDistance if present must be a positive number.  Gives the distance of the viewer
 *    from the origin.  If not present, the length is zero, which can be OK for orthographic projection,
 *    but never for perspective projection.
 * @param viewpointDirection if present must be an array of three numbers, not all zero.  The
 *    view is from the direction of this vector towards the origin (0,0,0).  If not present,
 *    the value [0,0,10] is used.  This is just the initial value for viewpointDirection; it will
 *    be modified by rotation.
 * @param viewUp if present must be an array of three numbers. Gives a vector that will
 *    be seen as pointing upwards in the view.  If not present, the value is [0,1,0].
 *    Cannot be a multiple of viewpointDirection.  This is just the initial value for
 *    viewUp; it will be modified by rotation.
 */
function TrackballRotator(canvas, callback, viewDistance, viewpointDirection, viewUp) {
    var unitx = new Array(3);
    var unity = new Array(3);
    var unitz = new Array(3);
    var viewZ;  // view distance; z-coord in eye coordinates;
    var center; // center of view; rotation is about this point; default is [0,0,0] 
    this.setView = function( viewDistance, viewpointDirection, viewUp ) {
        unitz = (viewpointDirection === undefined)? [0,0,10] : viewpointDirection;
        viewUp = (viewUp === undefined)? [0,1,0] : viewUp;
        viewZ = viewDistance;
        normalize(unitz, unitz);
        copy(unity,unitz);
        scale(unity, unity, dot(unitz,viewUp));
        subtract(unity,viewUp,unity);
        normalize(unity,unity);
        cross(unitx,unity,unitz);
    };
    this.getViewMatrix = function() {
        var mat = [ unitx[0], unity[0], unitz[0], 0,
                unitx[1], unity[1], unitz[1], 0, 
                unitx[2], unity[2], unitz[2], 0,
                0, 0, 0, 1 ];
        if (center !== undefined) {  // multiply on left by translation by rotationCenter, on right by translation by -rotationCenter
            var t0 = center[0] - mat[0]*center[0] - mat[4]*center[1] - mat[8]*center[2];
            var t1 = center[1] - mat[1]*center[0] - mat[5]*center[1] - mat[9]*center[2];
            var t2 = center[2] - mat[2]*center[0] - mat[6]*center[1] - mat[10]*center[2];
            mat[12] = t0;
            mat[13] = t1;
            mat[14] = t2;
        }
        if (viewZ !== undefined) {
            mat[14] -= viewZ;
        }
        return mat;
    };
    this.getViewDistance = function() {
        return viewZ;
    };
    this.setViewDistance = function(viewDistance) {
        viewZ = viewDistance;
    };
    this.getRotationCenter = function() {
        return (center === undefined) ? [0,0,0] : center;
    };
    this.setRotationCenter = function(rotationCenter) {
        center = rotationCenter;
    };
    this.setView(viewDistance, viewpointDirection, viewUp);
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("touchstart", doTouchStart, false);
    function applyTransvection(e1, e2) {  // rotate vector e1 onto e2
        function reflectInAxis(axis, source, destination) {
            var s = 2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
            destination[0] = s*axis[0] - source[0];
            destination[1] = s*axis[1] - source[1];
            destination[2] = s*axis[2] - source[2];
        }
        normalize(e1,e1);
        normalize(e2,e2);
        var e = [0,0,0];
        add(e,e1,e2);
        normalize(e,e);
        var temp = [0,0,0];
        reflectInAxis(e,unitz,temp);
        reflectInAxis(e1,temp,unitz);
        reflectInAxis(e,unitx,temp);
        reflectInAxis(e1,temp,unitx);
        reflectInAxis(e,unity,temp);
        reflectInAxis(e1,temp,unity);
    }
    var centerX, centerY, radius2;
    var prevx,prevy;
    var dragging = false;
    function doMouseDown(evt) {
        if (dragging)
           return;
        dragging = true;
        centerX = canvas.width/2;
        centerY = canvas.height/2;
        var radius = Math.min(centerX,centerY);
        radius2 = radius*radius;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var box = canvas.getBoundingClientRect();
        prevx = evt.clientX - box.left;
        prevy = evt.clientY - box.top;
    }
    function doMouseDrag(evt) {
        if (!dragging)
           return;
        var box = canvas.getBoundingClientRect();
        var x = evt.clientX - box.left;
        var y = evt.clientY - box.top;
        var ray1 = toRay(prevx,prevy);
        var ray2 = toRay(x,y);
        applyTransvection(ray1,ray2);
        prevx = x;
        prevy = y;
        if (callback) {
            callback();
        }
    }
    function doMouseUp(evt) {
        if (dragging) {
            document.removeEventListener("mousemove", doMouseDrag, false);
            document.removeEventListener("mouseup", doMouseUp, false);
            dragging = false;
        }
    }
    function doTouchStart(evt) {
        if (evt.touches.length != 1) {
           doTouchCancel();
           return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        prevx = evt.touches[0].clientX - r.left;
        prevy = evt.touches[0].clientY - r.top;
        canvas.addEventListener("touchmove", doTouchMove, false);
        canvas.addEventListener("touchend", doTouchEnd, false);
        canvas.addEventListener("touchcancel", doTouchCancel, false);
        touchStarted = true;
        centerX = canvas.width/2;
        centerY = canvas.height/2;
        var radius = Math.min(centerX,centerY);
        radius2 = radius*radius;
    }
    function doTouchMove(evt) {
        if (evt.touches.length != 1 || !touchStarted) {
           doTouchCancel();
           return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = evt.touches[0].clientX - r.left;
        var y = evt.touches[0].clientY - r.top;
        var ray1 = toRay(prevx,prevy);
        var ray2 = toRay(x,y);
        applyTransvection(ray1,ray2);
        prevx = x;
        prevy = y;
        if (callback) {
            callback();
        }
    }
    function doTouchEnd(evt) {
        doTouchCancel();
    }
    function doTouchCancel() {
        if (touchStarted) {
           touchStarted = false;
           canvas.removeEventListener("touchmove", doTouchMove, false);
           canvas.removeEventListener("touchend", doTouchEnd, false);
           canvas.removeEventListener("touchcancel", doTouchCancel, false);
        }
    }
    function toRay(x,y) {  // converts a point (x,y) in pixel coords to a 3D ray by mapping interior of
                           // a circle in the plane to a hemisphere with that circle as equator.
       var dx = x - centerX;
       var dy = centerY - y;
       var vx = dx * unitx[0] + dy * unity[0];  // The mouse point as a vector in the image plane.
       var vy = dx * unitx[1] + dy * unity[1];
       var vz = dx * unitx[2] + dy * unity[2];
       var dist2 = vx*vx + vy*vy + vz*vz;
       if (dist2 > radius2) {  // Map a point ouside the circle to itself
          return [vx,vy,vz];
       }
       else {
          var z = Math.sqrt(radius2 - dist2);
          return  [vx+z*unitz[0], vy+z*unitz[1], vz+z*unitz[2]];
        }
    }
    function dot(v,w) {
        return v[0]*w[0] + v[1]*w[1] + v[2]*w[2];
    }
    function length(v) {
        return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    }
    function normalize(v,w) {
        var d = length(w);
        v[0] = w[0]/d;
        v[1] = w[1]/d;
        v[2] = w[2]/d;
    }
    function copy(v,w) {
        v[0] = w[0];
        v[1] = w[1];
        v[2] = w[2];
    }
    function add(sum,v,w) {
        sum[0] = v[0] + w[0];
        sum[1] = v[1] + w[1];
        sum[2] = v[2] + w[2];
    }
    function subtract(dif,v,w) {
        dif[0] = v[0] - w[0];
        dif[1] = v[1] - w[1];
        dif[2] = v[2] - w[2];
    }
    function scale(ans,v,num) {
        ans[0] = v[0] * num;
        ans[1] = v[1] * num;
        ans[2] = v[2] * num;
    }
    function cross(c,v,w) {
        var x = v[1]*w[2] - v[2]*w[1];
        var y = v[2]*w[0] - v[0]*w[2];
        var z = v[0]*w[1] - v[1]*w[0];
        c[0] = x;
        c[1] = y;
        c[2] = z;
    }
}


