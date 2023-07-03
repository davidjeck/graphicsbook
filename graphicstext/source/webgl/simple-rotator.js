/**
 *  A SimpleRotator can be used to implement rotation by mouse
 *  (or touch) WebGL.  In this style of rotation, the y-axis
 *  is always vertical, with the positive direction pointing
 *  upwards in the view.  Dragging the mouse left and right
 *  rotates the view about the y-axis.  Dragging it up and down
 *  rotates the view about the x-axis, with the angle of rotation
 *  about the x-axis limited to the range -85 to 85.
 *
 *  NOTE: No error checking of parameters is done!
 *
 * Functions defined for an object, rotator, of type SimpleRotator:
 *
 *    rotator.getViewMatrix() -- returns an array of 16 numbers representing
 *       the view matrix corresponding to the current rotation.  The
 *       matrix is in column-matrix order (ready for use with glMatrix or
 *       gl.uniformMatrix4fv).  The view matrix takes into account the
 *       view distance and the center of view.
 *    rotator.setXLimit( d ) -- sets the range of possible rotations.
 *       about the x-axis.  The parameter must be a non-negative number,
 *       and the value is clamped to the range 0 to 85.  The allowed range
 *       of rotation angles is from -d to d degrees.  If the value is zero
 *       only rotation about the y-axis is allowed.  Initial value is 85.
 *    rotator.getXLimit() -- returns the current limit.
 *    rotator.setRotationCenter( vector ) -- Sets the center of rotation.
 *       The parameter must be an array of (at least) three numbers.  The
 *       view is rotated about this point.  Usually, you want the rotation
 *       center to be the point that appears at the middle of the canvas,
 *       but that is not a requirement.  The initial value is effectively
 *       equal to [0,0,0].
 *    rotator.getRotationCenter() -- returns the current value.
 *    rotator.setAngles( rotateY, rotateX ) -- sets the angles of rotation
 *       about the y- and x- axes.  The values must be numbers and are
 *       given in degrees.  The limit on the range of x rotations is enforced.
 *       If the callback function is defined, it is called.
 *    rotator.getAngles() -- returns the current x and y rotations angles,
 *       as an array of two numbers.
 *    rotator.setViewDistance(dist) -- Sets the view distance to dist, which
 *       must be a number.
 *    rotator.getViewDistance() -- returns the current value.
 *
 * @param canvas must be a DOM element for a canvas.  A mouse
 *     listener and a touch listener are installed on the canvas.
 *     This is a required parameter.
 * @param callback if present, must be a function.  The function,
 *     if given, is called when the view changes.  Typically, it
 *     it would be a function that renders the image in the canvas,
 *     or possibly a function that renders the image only if no
 *     animation is running.
 * @param viewDistance if present, must be a number.  Gives the
 *     distance of the viewer from the center of rotation, which
 *     is ordinarily the origin.  If not present, the distance is
 *     0, which can be appropriate for an orthogonal projection.
 * @param rotY if present, must be a number.  Gives the initial rotation
 *     about the y-axis, in degrees. If not present, the default is zero.
 * @param rotX if present, must be a number.  Gives the initial rotation
 *     about the x-axis, in degrees. If not present, the default is zero.
 */
function SimpleRotator(canvas, callback, viewDistance, rotY, rotX) {
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("touchstart", doTouchStart, false);
    var rotateX = (rotX === undefined)? 0 : rotX;
    var rotateY = (rotY === undefined)? 0 : rotY;
    var xLimit = 85;
    var center;
    var degreesPerPixelX = 90/canvas.height;
    var degreesPerPixelY = 180/canvas.width; 
    this.getXLimit = function() {
        return xLimit;
    };
    this.setXLimit = function(limitInDegrees) {
        xLimit = Math.min(85,Math.max(0,limitInDegrees));
    };
    this.getRotationCenter = function() {
        return (center === undefined) ? [0,0,0] : center;
    };
    this.setRotationCenter = function(rotationCenter) {
        center = rotationCenter;
    };
    this.setAngles = function( rotY, rotX ) {
        rotateX = Math.max(-xLimit, Math.min(xLimit,rotX));
        rotateY = rotY;
        if (callback) {
            callback();
        }
    };
    this.getAngles = function() {
        return [rotateX,rotateY];
    };
    this.setViewDistance = function( dist ) {
        viewDistance = dist;
    };
    this.getViewDistance = function() {
        return (viewDistance === undefined)? 0 : viewDistance;
    };
    this.getViewMatrix = function() {
        var cosX = Math.cos(rotateX/180*Math.PI);
        var sinX = Math.sin(rotateX/180*Math.PI);
        var cosY = Math.cos(rotateY/180*Math.PI);
        var sinY = Math.sin(rotateY/180*Math.PI);
        var mat = [  // The product of rotation by rotateX about x-axis and by rotateY about y-axis.
            cosY, sinX*sinY, -cosX*sinY, 0,
            0, cosX, sinX, 0,
            sinY, -sinX*cosY, cosX*cosY, 0,
            0, 0, 0, 1
        ];
        if (center !== undefined) {  // multiply on left by translation by rotationCenter, on right by translation by -rotationCenter
            var t0 = center[0] - mat[0]*center[0] - mat[4]*center[1] - mat[8]*center[2];
            var t1 = center[1] - mat[1]*center[0] - mat[5]*center[1] - mat[9]*center[2];
            var t2 = center[2] - mat[2]*center[0] - mat[6]*center[1] - mat[10]*center[2];
            mat[12] = t0;
            mat[13] = t1;
            mat[14] = t2;
        }
        if (viewDistance !== undefined) {  // multipy on left by translation by (0,0,-viewDistance)
            mat[14] -= viewDistance;
        }
        return mat;
    };
    var prevX, prevY;  // previous position, while dragging
    var dragging = false;
    var touchStarted = false;
    function doMouseDown(evt) {
        if (dragging) {
            return;
        }
        dragging = true;
        document.addEventListener("mousemove", doMouseDrag, false);
        document.addEventListener("mouseup", doMouseUp, false);
        var r = canvas.getBoundingClientRect();
        prevX = evt.clientX - r.left;
        prevY = evt.clientY - r.top;
    }
    function doMouseDrag(evt) {
        if (!dragging) {
            return; 
        }
        var r = canvas.getBoundingClientRect();
        var x = evt.clientX - r.left;
        var y = evt.clientY - r.top;
        var newRotX = rotateX + degreesPerPixelX * (y - prevY);
        var newRotY = rotateY + degreesPerPixelY * (x - prevX);
        newRotX = Math.max(-xLimit, Math.min(xLimit,newRotX));
        prevX = x;
        prevY = y;
        if (newRotX != rotateX || newRotY != rotateY) {
            rotateX = newRotX;
            rotateY = newRotY;
            if (callback) {
                callback();
            }
        }
    }
    function doMouseUp(evt) {
        if (!dragging) {
            return;
        }
        dragging = false;
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
    }
    function doTouchStart(evt) {
        if (evt.touches.length != 1) {
           doTouchCancel();
           return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        prevX = evt.touches[0].clientX - r.left;
        prevY = evt.touches[0].clientY - r.top;
        canvas.addEventListener("touchmove", doTouchMove, false);
        canvas.addEventListener("touchend", doTouchEnd, false);
        canvas.addEventListener("touchcancel", doTouchCancel, false);
        touchStarted = true;
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
        var newRotX = rotateX + degreesPerPixelX * (y - prevY);
        var newRotY = rotateY + degreesPerPixelY * (x - prevX);
        newRotX = Math.max(-xLimit, Math.min(xLimit,newRotX));
        prevX = x;
        prevY = y;
        if (newRotX != rotateX || newRotY != rotateY) {
            rotateX = newRotX;
            rotateY = newRotY;
            if (callback) {
                callback();
            }
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
}
