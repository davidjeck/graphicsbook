"use strict";

/*
   glsim.js is written by David J. Eck (http://math.hws.edu/eck/index.html) for use
   with his free, on-line computer graphics textbook, http://math.hws.edu/graphicsbook
   It implements a subset of OpenGL 1.1 on top of WebGL.  It uses some code from
   gl-matrix.js (see below), and it can be freely used and distributed in any way
   that is compatible with the glmatrix license.
   
   glsim.js is not well-tested and is not meant in any way as a serious implementation
   of OpenGL 1.1.
   
   In October 2021, several modifications were made to glsim.js to fix errors and
   make it more compatible with OpenGL 1.1.  It was used in a number of OpenGL
   assignments in a course based on the textbook.  Labs from that course can be
   found at http://math.hws.edu/eck/cs424/index_f21.html with labs 4, 5, 5, and 7
   using glsim.
*/

/*-----------------------------------------------------------------------------
 *   This section copied from gl-matrix.js (http://glmatrix.net).  Just the
 * parts of mat4 that are needed by GLSim are included here.  This section
 * is subject to the original license, reproduced below.  The software has
 * been modified by deleting unneeded parts and by moving and renaming one
 * function from mat3 into mat4 (mat4.normalTransformMatrix).  Also,
 * vec4.transformMat4 has been moved to mat4 and renamed to mat4.applyToVec4
 */


var GLMAT_ARRAY_TYPE = Float32Array;  // For use in mat4
var GLMAT_EPSILON = 0.000001;


/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};


/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};


/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};


/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* This function is copied from mat3.normalFromMat4 in gl-matrix.js and
* is renamed and added here to the mat4 API.  Modification made by D.Eck
*
* @param {Array} out an array of length 9 to receive operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {Array} out
*/
mat4.normalTransformMatrix = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

mat4.applyToVec4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/*------------ END OF SECTION COPIED FROM gl-matrix.js ---------------------------------------*/



function GLSim(canvas, webglOptions) {
    if (!canvas) {
        GLSim.error("GLSim constructor requires a parameter to specify the canvas"); return;
    }
    var thecanvas = null;
    if (typeof canvas == "string") {
        thecanvas = document.getElementById(canvas);
        if (!thecanvas || ! thecanvas.getContext) {
            GLSim.error("GLSim parameter must be a canvas element or an ID for a canvas element"); return;
        }
    }
    else if (typeof canvas == 'object' && canvas.getContext) {
        thecanvas = canvas; 
    }
    else {
        GLSim.error("GLSim parameter must be a canvas element or an ID for a canvas element"); return;
    }
    var options = (webglOptions === undefined)? { preserveDrawingBuffer: true } : webglOptions;
    this.gl = thecanvas.getContext("webgl", options) || thecanvas.getContext("experimental-webgl", options);
    if (!this.gl) {
        GLSim.error("Cannot create WebGL context for canvas."); return;
    }
    var gl = this.gl;
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,GLSim.vertexShaderSource());
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
       GLSim.error("Error in vertex shader:  " + gl.getShaderInfoLog(vsh)); return;
    }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, GLSim.fragmentShaderSource());
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       GLSim.error("Error in fragment shader:  " + gl.getShaderInfoLog(fsh)); return;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.bindAttribLocation(prog,0,"coords");
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       GLSim.error("Link error in program:  " + gl.getProgramInfoLog(prog)); return;
    }
    gl.useProgram(prog);
    this.glprogram = prog;
    this.location = {
        coords: gl.getAttribLocation(prog,"coords"),
        color: gl.getAttribLocation(prog, "color"),
        normal: gl.getAttribLocation(prog, "normal"),
        texCoords: gl.getAttribLocation(prog, "texCoords"),
        front_ambient: gl.getAttribLocation(prog, "front_ambient"), 
        front_diffuse: gl.getAttribLocation(prog, "front_diffuse"), 
        front_specular: gl.getAttribLocation(prog, "front_specular"),
        front_emission: gl.getAttribLocation(prog, "front_emission"),
        front_shininess: gl.getAttribLocation(prog, "front_shininess"),
        back_ambient: gl.getAttribLocation(prog, "back_ambient"), 
        back_diffuse: gl.getAttribLocation(prog, "back_diffuse"), 
        back_specular: gl.getAttribLocation(prog, "back_specular"),
        back_emission: gl.getAttribLocation(prog, "back_emission"),
        back_shininess: gl.getAttribLocation(prog, "back_shininess"),
        modelview: gl.getUniformLocation(prog, "modelview"),
        projection: gl.getUniformLocation(prog, "projection"),
        normalMatrix: gl.getUniformLocation(prog, "normalMatrix"),
        textureMatrix: gl.getUniformLocation(prog, "textureMatrix"),
        unitNormals: gl.getUniformLocation(prog, "unitNormals"),
        pointSize: gl.getUniformLocation(prog, "pointSize"),
        lit: gl.getUniformLocation(prog, "lit"),
        textured: gl.getUniformLocation(prog, "textured"),
        texture: gl.getUniformLocation(prog, "texture"),
        twoSided: gl.getUniformLocation(prog, "twoSided"),
        pointMode: gl.getUniformLocation(prog, "pointMode"),
        localViewer: gl.getUniformLocation(prog, "localViewer"),
        globalAmbient: gl.getUniformLocation(prog, "globalAmbient"),
        light: new Array(GLSim.lightCount)
    };
    for (var i = 0; i < GLSim.lightCount; i++) {
        this.location.light[i] = {
            position: gl.getUniformLocation(prog, "light[" + i + "]." + "position"),
            ambient: gl.getUniformLocation(prog,  "light[" + i + "]." + "ambient"),
            specular: gl.getUniformLocation(prog,  "light[" + i + "]." + "specular"),
            diffuse: gl.getUniformLocation(prog,  "light[" + i + "]." + "diffuse"),
            enabled: gl.getUniformLocation(prog,  "light[" + i + "]." + "enabled")
        };
    }
    this.buffer = {
        coords: gl.createBuffer(),
        color: gl.createBuffer(),
        normal: gl.createBuffer(),
        index: gl.createBuffer(),
        texCoords: gl.createBuffer(),
        front_shininess: gl.createBuffer(),
        front_ambient: gl.createBuffer(),
        front_diffuse: gl.createBuffer(),
        front_specular: gl.createBuffer(),
        front_emission: gl.createBuffer(),
        back_shininess: gl.createBuffer(),
        back_ambient: gl.createBuffer(),
        back_diffuse: gl.createBuffer(),
        back_specular: gl.createBuffer(),
        back_emission: gl.createBuffer()
    };
    gl.uniform1i(this.location.texture, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    this.defaultTextureID = gl.createTexture();
    //  this.currentTextureID = null;  // Removed in October 2021 since now a texture is always bound, in compliance with OpenGL 1.1.
    this.canvas = thecanvas;
    thecanvas._glsimContext = this;
    GLSim.currentContext = this;
    this.color = [0,0,0,1];
    this.colorMaterialFace = GL_FRONT_AND_BACK;
    this.colorMaterialMode = GL_AMBIENT_AND_DIFFUSE;
    this.normal = [0,0,1];
    this.texCoords = [0,0];
    this.lineWidth = 1;
    this.pointSize = 1;
    this.frontMaterial = {
        shininess: 0,
        ambient: [0.2,0.2,0.2],
        diffuse: [0.8,0.8,0.8,1],
        specular: [0,0,0],
        emission: [0,0,0]
    };
    this.backMaterial = {
        shininess: 0,
        ambient: [0.2,0.2,0.2],
        diffuse: [0.8,0.8,0.8,1],
        specular: [0,0,0],
        emission: [0,0,0]
    };
    this.primitiveData = null;
    this.enabled = new Array(_GL_ENABLE_MAX);
    this.enabledClientState = new Array(_GL_ENABLE_CLIENT_STATE_MAX);
    this.arraysForDrawArrays = {
        vertexArray: null,
        normalArray: null,
        colorArray: null,
        texCoordArray: null
    };
    if (!GL_SRC_ALPHA) {  // grab standard constants from WebGL context
        GL_SRC_ALPHA = gl.SRC_ALPHA;
        GL_ONE_MINUS_SRC_ALPHA = gl.ONE_MINUS_SRC_ALPHA;
        GL_CCW = gl.CCW;
        GL_CW = gl.CW;
        GL_FLOAT = gl.FLOAT;
        GL_UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
        GL_DOUBLE = gl.DOUBLE;
        GL_UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
        GL_UNSIGNED_INT = gl.UNSIGNED_INT;
        GL_SHORT = gl.SHORT;
        GL_INT = gl.INT;
        GL_TEXTURE_WRAP_T = gl.TEXTURE_WRAP_T;
        GL_TEXTURE_WRAP_S = gl.TEXTURE_WRAP_S;
        GL_CLAMP = gl.CLAMP;
        GL_REPEAT = gl.REPEAT;
        GL_TEXTURE_MIN_FILTER = gl.TEXTURE_MIN_FILTER;
        GL_TEXTURE_MAG_FILTER = gl.TEXTURE_MAG_FILTER;
        GL_NEAREST = gl.NEAREST;
        GL_LINEAR = gl.LINEAR;
        GL_NEAREST_MIPMAP_NEAREST = gl.NEAREST_MIPMAP_NEAREST;
        GL_NEAREST_MIPMAP_LINEAR = gl.NEAREST_MIPMAP_LINEAR;
        GL_LINEAR_MIPMAP_NEAREST = gl.LINEAR_MIPMAP_NEAREST;
        GL_LINEAR_MIPMAP_LINEAR = gl.LINEAR_MIPMAP_LINEAR;
        GL_RGBA = gl.RGBA;
    }
    this.lightModelAmbient = [0,0,0];
    this.lightModelTwoSide = 0;
    this.lightModelLocalViewer = 0;
    this.light = [];
    for (var i = 0; i < GLSim.lightCount; i++) {
        var d = {
            ambient: [0,0,0],
            diffuse: [0,0,0],
            specular: [0,0,0],
            position: [0,0,1,0]
        };
        this.light.push(d);
    }
    this.light[0].diffuse = [1,1,1];
    this.attributeStack = [];
    this.projectionMatrix = mat4.create();
    this.modelviewMatrix = mat4.create();
    this.textureMatrix = mat4.create();
    this.projectionStack = [];
    this.modelviewStack = [];
    this.textureStack = [];  //*** Added in October 2021 for glPushMatrix, glPopMatrix for texture transform, which was not previously implemented.
    this.matrixMode = GL_MODELVIEW;
    this.currentMatrix = function() {
        switch (this.matrixMode) {
        case GL_MODELVIEW: return this.modelviewMatrix;
        case GL_PROJECTION: return this.projectionMatrix;
        case GL_TEXTURE: return this.textureMatrix;
        }
        return null;
    };
    //*** The next three lines were added in October 2021, when texture IDs were changed to integer type and there is always a bound texture.
    this.textureObjects = [];  // For implementing glBindTexure, glGenTextures using integer ID as in OpenGL
    this.textureObjects.push(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, this.textureObjects[0]); // Texture object 0 is the default.
}
GLSim.prototype._applyContextToShaderProgram = function(primitiveType) {
    var gl = this.gl;
    if (this.enabled[GL_DEPTH_TEST]) {
        gl.enable(gl.DEPTH_TEST);
    }
    else {
        gl.disable(gl.DEPTH_TEST);
    }
    if (this.enabled[GL_POLYGON_OFFSET_FILL]) {
        gl.enable(gl.POLYGON_OFFSET_FILL);
    }
    else {
        gl.disable(gl.POLYGON_OFFSET_FILL);
    }
    if (this.enabled[GL_BLEND]) {
        gl.enable(gl.BLEND);
    }
    else {
        gl.disable(gl.BLEND);
    }
    gl.uniformMatrix4fv(this.location.modelview, 0, this.modelviewMatrix);
    gl.uniformMatrix4fv(this.location.projection, 0, this.projectionMatrix);
    gl.uniformMatrix4fv(this.location.textureMatrix, 0, this.textureMatrix);
    var nm = new Float32Array(9);
    mat4.normalTransformMatrix(nm, this.modelviewMatrix);
    gl.uniformMatrix3fv(this.location.normalMatrix, 0, nm);
    gl.uniform1i(this.location.lit, this.enabled[GL_LIGHTING]? 1 : 0);
    gl.uniform1i(this.location.textured, this.enabled[GL_TEXTURE_2D]? 1 : 0);
    gl.uniform1i(this.location.unitNormals, this.enabled[GL_NORMALIZE]? 1 : 0);
    gl.vertexAttrib3fv(this.location.front_ambient , this.frontMaterial.ambient);
    gl.vertexAttrib4fv(this.location.front_diffuse , this.frontMaterial.diffuse);
    gl.vertexAttrib3fv(this.location.front_specular , this.frontMaterial.specular);
    gl.vertexAttrib3fv(this.location.front_emission , this.frontMaterial.emission);
    gl.vertexAttrib1f(this.location.front_shininess , this.frontMaterial.shininess);
    gl.vertexAttrib3fv(this.location.back_ambient , this.backMaterial.ambient);
    gl.vertexAttrib4fv(this.location.back_diffuse , this.backMaterial.diffuse);
    gl.vertexAttrib3fv(this.location.back_specular , this.backMaterial.specular);
    gl.vertexAttrib3fv(this.location.back_emission , this.backMaterial.emission);
    gl.vertexAttrib1f(this.location.back_shininess , this.backMaterial.shininess);
    gl.uniform3fv(this.location.globalAmbient, this.lightModelAmbient);
    gl.uniform1i(this.location.twoSided, this.lightModelTwoSide);
    if (primitiveType != GL_POINTS) {
        gl.uniform1i(this.location.pointMode, 0);  // not drawing points
    }
    else if ( ! this.enabled[GL_POINT_SMOOTH]) {
        gl.uniform1i(this.location.pointMode, 1);  // drawing unaliased points
    }
    else {
        gl.uniform1i(this.location.pointMode, 2);  // drawing aliased points
    }
    gl.uniform1i(this.location.localViewer, this.lightModelLocalViewer);
    for (var i = 0; i < this.light.length; i++) {
        var light = this.light[i];
        var loc = this.location.light[i];
        gl.uniform1i(loc.enabled, this.enabled[GL_LIGHT0 + i]? 1 : 0);
        gl.uniform3fv(loc.ambient, light.ambient);
        gl.uniform3fv(loc.diffuse, light.diffuse);
        gl.uniform3fv(loc.specular, light.specular);
        gl.uniform4fv(loc.position, light.position);
    }
    gl.lineWidth(this.lineWidth);
    gl.uniform1f(this.location.pointSize, this.pointSize);
};
GLSim.prototype._applyColorMaterialToShaderProgram = function(colorArray) {
    var context = this;
    var gl = this.gl;
    gl.disableVertexAttribArray(context.location.front_ambient);
    gl.disableVertexAttribArray(context.location.front_shininess);
    gl.disableVertexAttribArray(context.location.front_diffuse);
    gl.disableVertexAttribArray(context.location.front_specular);
    gl.disableVertexAttribArray(context.location.front_emission);
    gl.disableVertexAttribArray(context.location.back_ambient);
    gl.disableVertexAttribArray(context.location.back_shininess);
    gl.disableVertexAttribArray(context.location.back_diffuse);
    gl.disableVertexAttribArray(context.location.back_specular);
    gl.disableVertexAttribArray(context.location.back_emission);
    if (context.enabled[GL_LIGHTING] && context.enabled[GL_COLOR_MATERIAL] &&
                                            context.enabledClientState[GL_COLOR_ARRAY] && colorArray) {
        var array3;
        if (context.colorMaterialMode != GL_DIFFUSE) {
            array3 = new Float32Array( colorArray.length/4 * 3 );
            var j = 0;
            for (var i = 0; i < colorArray.length; i += 4) {
                array3[j++] = colorArray[i];
                array3[j++] = colorArray[i+1];
                array3[j++] = colorArray[i+2];
            }
        }
        if (context.colorMaterialFace == GL_FRONT || context.colorMaterialFace == GL_FRONT_AND_BACK) {
            if (context.colorMaterialMode == GL_AMBIENT || context.colorMaterialMode == GL_AMBIENT_AND_DIFFUSE) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_ambient);
                gl.bufferData(gl.ARRAY_BUFFER, array3, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.front_ambient, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.front_ambient);
            }
            if (context.colorMaterialMode == GL_DIFFUSE || context.colorMaterialMode == GL_AMBIENT_AND_DIFFUSE) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_diffuse);
                gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.front_diffuse, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.front_diffuse);
            }
            if (context.colorMaterialMode == GL_SPECULAR) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_specular);
                gl.bufferData(gl.ARRAY_BUFFER, array3, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.front_specular, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.front_specular);
            }
            if (context.colorMaterialMode == GL_EMISSION) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_emission);
                gl.bufferData(gl.ARRAY_BUFFER, array3, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.front_emission, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.front_emission);
            }
        }
        if (context.colorMaterialFace == GL_BACK || context.colorMaterialFace == GL_FRONT_AND_BACK) {
            if (context.colorMaterialMode == GL_AMBIENT || context.colorMaterialMode == GL_AMBIENT_AND_DIFFUSE) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_ambient);
                gl.bufferData(gl.ARRAY_BUFFER, array3, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.back_ambient, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.back_ambient);
            }
            if (context.colorMaterialMode == GL_DIFFUSE || context.colorMaterialMode == GL_AMBIENT_AND_DIFFUSE) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_diffuse);
                gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.back_diffuse, 4, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.back_diffuse);
            }
            if (context.colorMaterialMode == GL_SPECULAR) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_specular);
                gl.bufferData(gl.ARRAY_BUFFER, array3, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.back_specular, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.back_specular);
            }
            if (context.colorMaterialMode == GL_EMISSION) {
                gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_emission);
                gl.bufferData(gl.ARRAY_BUFFER, array3, gl.STREAM_DRAW);
                gl.vertexAttribPointer(context.location.back_emission, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(context.location.back_emission);
            }
        }
    }
};
GLSim.prototype._convertPrimitiveType = function(myPrimitive) {
    var kind;
    var gl = this.gl;
    switch (myPrimitive) {
        case GL_POINTS:
            kind = gl.POINTS;
            break;
        case GL_LINES:
            kind = gl.LINES;
            break;
        case GL_LINE_LOOP:
            kind = gl.LINE_LOOP;
            break;
        case GL_LINE_STRIP:
            kind = gl.LINE_STRIP;
            break;
        case GL_TRIANGLES:
            kind = gl.TRIANGLES;
            break;
        case GL_TRIANGLE_STRIP:
            kind = gl.TRIANGLE_STRIP;
            break;
        case GL_TRIANGLE_FAN:
            kind = gl.TRIANGLE_FAN;
            break;
        case GL_QUAD_STRIP:
            kind = gl.TRIANGLE_STRIP;
            break;
        case GL_POLYGON:
            kind = gl.TRIANGLE_FAN;
            break;
        case GL_QUADS:
            kind = gl.TRIANGLES;
            break;
        default:
            kind = -1;
    }
    return kind;
};
GLSim.prototype._fixArrayForGL_QUADS = function(array, itemSize) {
    var quadCount = Math.floor(array.length/(itemSize*4));
    var vertexCount = quadCount*6;
    var newarray = new Float32Array(vertexCount*itemSize);
    for (var i = 0; i < quadCount; i++) {
        var quad = i*itemSize*4;
        var tri = i*itemSize*6;
        for (var j = 0; j < itemSize; j++) {
            newarray[tri+j] = array[quad+j];
            newarray[itemSize+tri+j] = array[itemSize+quad+j];
            newarray[2*itemSize+tri+j] = array[2*itemSize+quad+j];
            newarray[3*itemSize+tri+j] = array[quad+j];
            newarray[4*itemSize+tri+j] = array[2*itemSize+quad+j];
            newarray[5*itemSize+tri+j] = array[3*itemSize+quad+j];
        }
    }
    return newarray;
};
GLSim.lightCount = 4; // Can be changed BEFORE creating a GLSim object.
GLSim.currentContext = null;
GLSim.error = function(message) {
    if (window.console && console.log ) {
        console.log("GLSim error: " + message);
        if (console.trace) {
            console.trace();
        }
        console.log("");
    }
    throw message;
};
GLSim.vertexShaderSource = function() {  // This is a function so it can incorporate the number of lights.
          // NOTE:  I originally used type bool for shader variables that are logically boolean,
          // but the resulting code didn't work in some WebGL implementations.  So, I am using type int
          // for boolean values, which seems to increase the number of implementations on which it works. 
    return "struct materialProperties {\n" +
        "     vec3 ambient;\n" +
        "     vec4 diffuse;\n" +
        "     vec3 specular;\n" +
        "     vec3 emission;\n" +
        "     float shininess;\n" +
        "};\n" +
        "struct lightProperties {\n" +
        "   vec4 position;\n" +
        "   vec3 diffuse;\n" +
        "   vec3 specular;\n" +
        "   vec3 ambient;\n" +
        "   int enabled;\n" +
        "};\n" +
        "attribute vec3 coords;\n" +
        "attribute vec2 texCoords;\n" +
        "attribute vec3 normal;\n" +
        "attribute vec4 color;\n" +
        "attribute vec3 front_ambient; \n" +
        "attribute vec4 front_diffuse; \n" +
        "attribute vec3 front_specular;\n" +
        "attribute vec3 front_emission;\n" +
        "attribute float front_shininess;\n" +
        "attribute vec3 back_ambient; \n" +
        "attribute vec4 back_diffuse; \n" +
        "attribute vec3 back_specular;\n" +
        "attribute vec3 back_emission;\n" +
        "attribute float back_shininess;\n" +
        "uniform mat3 normalMatrix;\n" +
        "uniform int unitNormals;\n" +
        "uniform mediump int lit;\n" +       // mediump is here to match precision in the fragment shader
        "uniform mediump int twoSided;\n" +
        "uniform int localViewer;\n" +
        "uniform vec3 globalAmbient;\n" +
        "uniform lightProperties light[" + GLSim.lightCount + "];\n" +
        "uniform mat4 modelview;\n" +
        "uniform mat4 projection;\n" +
        "uniform mat4 textureMatrix;\n" +
        "uniform mediump float pointSize;\n" +
        "varying vec4 frontColor;\n" +
        "varying vec4 backColor;\n" +
        "varying vec2 vTexCoords;\n" +
        "materialProperties material;\n" +
        "vec4 eyeCoords;\n" +
        "vec3 tnormal;\n" +
        "vec3 pointsToViewer;\n" +
        "vec4 lighting(vec3 vertex, vec3 V, vec3 N) {\n" +
        "       // A function to compute the color of this fragment using the lighting equation.\n" +
        "       // vertex contains the coords of the points; V is a unit vector pointing to viewer;\n" +
        "       // N is the normal vector.  This function also uses the values in the global variables\n" +
        "       // material, globalAmbient, and light[0]..light[7].\n" +
        "   vec3 color = material.emission + material.ambient * globalAmbient;\n" +
        "   for (int i = 0; i < " + GLSim.lightCount + "; i++) {\n" +
        "       if (light[i].enabled != 0) {\n" +
        "           color += material.ambient * light[i].ambient;\n" +
        "           vec3 L;\n" +
        "           if (light[i].position.w == 0.0) {\n" +
        "              L = normalize( light[i].position.xyz );\n" +
        "           }\n" +
        "           else {\n" +
        "              L = normalize( light[i].position.xyz/light[i].position.w - vertex );\n" +
        "           }\n" +
        "           if ( dot(L,N) > 0.0) {\n" +
        "              vec3 R;\n" +
        "              R = (2.0*dot(N,L))*N - L;\n" +
        "              color += dot(N,L)*(light[i].diffuse*material.diffuse.rgb);\n" +
        "              if ( dot(V,R) > 0.0)\n" +
        "                 color += pow(dot(V,R),material.shininess) * (light[i].specular * material.specular);\n" +
        "           }\n" +
        "       }\n" +
        "   }\n" +
        "   return vec4(color, material.diffuse.a);\n" +
        "}\n" +
        "void main() {\n" +
        "     eyeCoords = modelview * vec4(coords,1.0);\n" +
        "     gl_Position = projection*eyeCoords;\n" +
        "     gl_PointSize = pointSize;\n" +
        "     vec4 transformedTexCoords = textureMatrix*vec4(texCoords,0,1);\n" +
        "     vTexCoords = transformedTexCoords.xy;\n" +
        "     if (lit == 0) {\n" +
        "          frontColor = color;\n" +
        "          return;\n" +
        "     }\n" +
        "     tnormal = normalMatrix*normal;\n" +
        "     if (unitNormals != 0) {\n" +
        "          tnormal = normalize(tnormal);\n" +
        "     }\n" +
        "     if (localViewer != 0) {\n" +
        "          pointsToViewer = normalize(-eyeCoords.xyz/eyeCoords.w);\n" +
        "     }\n" +
        "     else {\n" +
        "          pointsToViewer = vec3(0.0,0.0,1.0);\n" + 
        "     }\n" +
        "     if (twoSided != 0) {\n" +
        "          material = materialProperties(back_ambient, back_diffuse, back_specular, back_emission, back_shininess);\n" +
        "          backColor = lighting(eyeCoords.xyz/eyeCoords.w, pointsToViewer, -tnormal);\n" +
        "     }\n" +
        "     else {\n" +
        "          backColor = vec4(1.0);  // will not be used\n" +
        "     }\n" +
        "     material = materialProperties(front_ambient, front_diffuse, front_specular, front_emission, front_shininess);\n" +
        "     frontColor = lighting(eyeCoords.xyz/eyeCoords.w, pointsToViewer, tnormal);\n" +
        "}\n";
    };
GLSim.fragmentShaderSource = function() {
  return "precision mediump float;\n" +
        "uniform int lit;\n" +
        "uniform int twoSided;\n" +
        "uniform int textured;\n" +
        "uniform sampler2D texture;\n" +
        "uniform float pointSize;\n" +
        "uniform int pointMode;\n" +
        "varying vec4 frontColor;\n" +
        "varying vec4 backColor;\n" +
        "varying vec2 vTexCoords;\n" +
        "vec4 clr;\n" +
        "void main() {\n" +
        "     if (pointMode == 2 && pointSize > 1.5 && distance(gl_PointCoord,vec2(0.5)) > 0.5) {\n" +
        "          discard;\n" +
        "     }\n" +
        "     if (gl_FrontFacing) {\n" +
        "          clr = frontColor;\n" +
        "     }\n" +
        "     else if (lit == 0 || twoSided == 0) {\n" +
        "          clr = frontColor;\n" +
        "     }\n" +
        "     else {\n" +
        "          clr = backColor;\n" +
        "     }\n" +
        "     if (textured != 0) {\n" +
        "         vec4 texclr = texture2D(texture,vTexCoords);\n" +
        "         clr = clr*texclr;\n" +
        "     }\n" +
        "     gl_FragColor = clr;\n" +
        "}\n";
    };

var  // enable/disable constants (used as indices into an array)
    GL_DEPTH_TEST = 0,
    GL_COLOR_MATERIAL = 1,
    GL_BLEND = 2,
    GL_LIGHT0 = 3,
    GL_LIGHT1 = 4,
    GL_LIGHT2 = 5,
    GL_LIGHT3 = 6,
    GL_LIGHT4 = 7,
    GL_LIGHT5 = 8,
    GL_LIGHT6 = 9,
    GL_LIGHT7 = 10,
    GL_LIGHTING = 11,
    GL_NORMALIZE = 12,
    GL_POINT_SMOOTH = 13,
    GL_POLYGON_OFFSET_FILL = 14,
    GL_TEXTURE_2D = 15,
    _GL_ENABLE_MAX = 15;
    
var // enable/disable constants for glEnableClientState/glDisableClientState
    GL_VERTEX_ARRAY = 0,
    GL_NORMAL_ARRAY = 1,
    GL_COLOR_ARRAY = 2,
    GL_TEXTURE_COORD_ARRAY = 3,
    _GL_ENABLE_CLIENT_STATE_MAX = 3;

var  // other constants
    GL_COLOR_BUFFER_BIT = 1,
    GL_DEPTH_BUFFER_BIT = 2,
    GL_TRUE = 0,
    GL_FALSE = 1,
    GL_POINTS = 0,
    GL_LINES = 1,
    GL_LINE_LOOP = 2,
    GL_LINE_STRIP = 3,
    GL_TRIANGLES = 4,
    GL_TRIANGLE_STRIP = 5,
    GL_TRIANGLE_FAN = 6,
    GL_QUADS = 7,
    GL_QUAD_STRIP = 8,
    GL_POLYGON = 9,
    GL_FRONT = 10,
    GL_BACK = 11,
    GL_FRONT_AND_BACK = 12,
    GL_SHININESS = 13,
    GL_AMBIENT = 14,
    GL_DIFFUSE = 15,
    GL_AMBIENT_AND_DIFFUSE = 16,
    GL_SPECULAR = 17,
    GL_EMISSION = 18,
    GL_POSITION = 19,
    GL_LIGHT_MODEL_AMBIENT = 20,
    GL_LIGHT_MODEL_TWO_SIDE = 21,
    GL_MODELVIEW = 22,
    GL_PROJECTION = 23,
    GL_TEXTURE = 24,
    GL_LIGHT_MODEL_LOCAL_VIEWER = 25,
    GL_CURRENT_BIT = 64,
    GL_TEXTURE_BIT = 128,
    GL_VIEWPORT_BIT = 256,
    GL_ENABLE_BIT = 512,
    GL_LIGHTING_BIT = 1024,
    GL_VIEWPORT = 26,
    GL_CURRENT_COLOR = 27,
    GL_CURRENT_NORMAL = 28,
    GL_CURRENT_TEXTURE_COORDS = 29,
    GL_MODELVIEW_MATRIX = 30,
    GL_PROJECTION_MATRIX = 31,
    GL_TEXTURE_MATRIX = 32,
    GL_POINT_SIZE = 33,
    GL_LINE_WIDTH = 34;
    
    
var // constants to be extracted from a WebGL context when the first one is created
    GL_SRC_ALPHA = null, GL_ONE_MINUS_SRC_ALPHA, GL_CW, GL_CCW, GL_FLOAT, GL_UNSIGNED_BYTE,
                     GL_DOUBLE, GL_UNSIGNED_SHORT, GL_UNSIGNED_INT, GL_SHORT, GL_INT,
                     GL_TEXTURE_WRAP_T, GL_TEXTURE_WRAP_S, GL_CLAMP, GL_REPEAT,
                     GL_TEXTURE_MIN_FILTER, GL_TEXTURE_MAG_FILTER, GL_NEAREST, GL_LINEAR,
                     GL_NEAREST_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR, GL_LINEAR_MIPMAP_NEAREST,
                     GL_LINEAR_MIPMAP_LINEAR, GL_RGBA;
    
function glViewport(x,y,width,height) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    x = Number(x);
    y = Number(y);
    width = Number(width);
    height = Number(height);
    if (isNaN(x+y+width+height)) {
        GLSim.error("glViewport requires four numeric parameters"); return;
    }
    if (width <= 0 || height <= 0) {
        GLSim.error("width and height for glViewport must be positive"); return;
    }
    GLSim.currentContext.gl.viewport(x,y,width,height);
}
    
function glEnable(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.primitiveData) { GLSim.error("glEnable cannot be called between glBegin and glEnd"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glEnable"); return;
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_MAX) {
        GLSim.error("Unknow property passed as argument to glEnable"); return;
    }
    else {
        GLSim.currentContext.enabled[what] = true;
    }
}

function glDisable(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.primitiveData) { GLSim.error("glDisable cannot be called between glBegin and glEnd"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glEnable"); return;
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_MAX) {
        GLSim.error("Unknow property passed as argument to glEnable"); return;
    }
    else {
        GLSim.currentContext.enabled[what] = false;
    }
}

function glDepthMask(enableWriteToDepthBuffer) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (enableWriteToDepthBuffer) {
        GLSim.currentContext.gl.depthMask(1);
    }
    else {
        GLSim.currentContext.gl.depthMask(0);
    }
}

function glEnableClientState(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glEnableClientState"); return;
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_CLIENT_STATE_MAX) {
        GLSim.error("Unknow property passed as argument to glEnableClientState"); return;
    }
    else {
        GLSim.currentContext.enabledClientState[what] = true;
    }
}

function glDisableClientState(what) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    what = Number(what);
    if (isNaN(what)) {
        GLSim.error("Illegal non-numeric argument for glDisableClientState"); return;
    }
    what = Math.round(what);
    if (what < 0 || what > _GL_ENABLE_CLIENT_STATE_MAX) {
        GLSim.error("Unknow property passed as argument to glDisableClientState"); return;
    }
    else {
        GLSim.currentContext.enabledClientState[what] = false;
    }
}

function glPushAttrib(bits) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    bits = Number(bits);
    if (isNaN(bits)) { GLSim.currentContext.error("glPushAttrib requires a numeric parameter"); return; }
    if ( !(bits & GL_CURRENT_BIT) && !(bits & GL_LIGHTING_BIT) && !(bits & GL_ENABLE_BIT) && !(bits & GL_VIEWPORT_BIT) ){
        GLSim.error("glPushAttrib must push GL_CURRENT_BIT, GL_LIGHTING_BIT, GL_TEXTURE_BIT, and/or GL_VIEWPORT_BIT");
        return;
    }
    var i;
    var vals = {};
    vals.bits = bits;
    var context = GLSim.currentContext;
    if (bits & GL_CURRENT_BIT) {
        vals.color = context.color;
        vals.normal = context.normal;
        vals.texCoords = context.texCoords;
    }
    if (bits & GL_ENABLE_BIT) {
        vals.enabled = new Array(_GL_ENABLE_MAX);
        for (i = 0; i < context.enabled.length; i++) {
            vals.enabled[i] = context.enabled[i];
        }
    }
    if (bits & GL_VIEWPORT_BIT) {
        vals.viewport = context.gl.getParameter(context.gl.VIEWPORT);
    }
    if (bits & GL_LIGHTING_BIT) {
        vals.colorMaterialEnabled = context.enabled[GL_COLOR_MATERIAL];
        vals.lightingEnabled = context.enabled[GL_LIGHTING];
        vals.colorMaterialFace = context.colorMaterialFace;
        vals.colorMaterialMode = context.colorMaterialMode;
        vals.lightModelAmbient = context.lightModelAmbient;
        vals.lightModelTwoSide = context.lightModelTwoSide;
        vals.lightModelLocalViewer = context.lightModelLocalViewer;
        vals.frontMaterial = {
            shininess: context.frontMaterial.shininess,
            ambient: context.frontMaterial.ambient,
            diffuse: context.frontMaterial.diffuse,
            specular: context.frontMaterial.specular,
            emission: context.frontMaterial.emission
        };
        vals.backMaterial = {
            shininess: context.backMaterial.shininess,
            ambient: context.backMaterial.ambient,
            diffuse: context.backMaterial.diffuse,
            specular: context.backMaterial.specular,
            emission: context.backMaterial.emission
        };
        vals.lightEnabled = new Array(context.light.length);
        vals.light = [];
        for (i = 0; i < context.light.length; i++) {
            var d = {
                ambient: context.light[i].ambient,
                diffuse: context.light[i].diffuse,
                specular: context.light[i].specular,
                position: context.light[i].position
            };
            vals.light.push(d);
            vals.lightEnabled[i] = context.enabled[GL_LIGHT0 + i];
        }
    }
    context.attributeStack.push(vals);
}

function glPopAttrib() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.attributeStack.length == 0) {
        GLSim.error("Attempt to pop from an empty attribute stack"); return;
    }
    var context = GLSim.currentContext;
    var i;
    var vals = context.attributeStack.pop();
    if (vals.bits & GL_CURRENT_BIT) {
        context.color = vals.color;
        context.normal = vals.normal;
        context.texCoords = vals.texCoords;
    }
    if (vals.bits & GL_ENABLE_BIT) {
        context.enabled = vals.enabled;
    }
    if (vals.bits & GL_VIEWPORT_BIT) {
        var v = vals.viewport;
        glViewport(v[0],v[1],v[2],v[3]);
    }
    if (vals.bits & GL_LIGHTING_BIT) {
        context.enabled[GL_COLOR_MATERIAL] =  vals.colorMaterialEnabled;
        context.enabled[GL_LIGHTING] = vals.lightingEnabled;
        context.colorMaterialFace = vals.colorMaterialFace;
        context.colorMaterialMode = vals.colorMaterialMode;
        context.lightModelAmbient = vals.lightModelAmbient;
        context.lightModelTwoSide = vals.lightModelTwoSide;
        context.lightModelLocalViewer = vals.lightModelLocalViewer;
        context.frontMaterial = vals.frontMaterial;
        context.backMaterial = vals.backMaterial;
        context.light = vals.light;
        for (i = 0; i < context.light.length; i++) {
            context.enabled[GL_LIGHT0 + i] = vals.lightEnabled[i];
        }
    }
}

function glGetIntegerv(item,array) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (!array || !array.length) {
        GLSim.error("The second parameter to glGetIntegerv must be an array."); return;
    }
    if (item == GL_VIEWPORT) {
        if (array.length < 4) { GLSim.error("Array length must be at least 4 for GL_VIEWPORT."); return; }
        var v = GLSim.currentContext.gl.getParameter(GLSim.currentContext.gl.VIEWPORT);
        for (var i = 0; i < 4; i++) {
            array[i] = v[i];
        }
    }
    else if (item == GL_LIGHT_MODEL_LOCAL_VIEWER) {
        if (array.length < 1) { GLSim.error("Array length must be at least 1 for GL_LIGHT_MODEL_LOCAL_VIEWER."); return; }
        array[0] = GLSim.currentContext.lightModelLocalViewer;
    }
    else if (item == GL_LIGHT_MODEL_TWO_SIDE) {
        if (array.length < 1) { GLSim.error("Array length must be at least 1 for GL_LIGHT_MODEL_TWO_SIDE."); return; }
        array[0] = GLSim.currentContext.lightModelTwoSide;
    }
    else {
        GLSim.error("First parameter to glGetIntegerv must be GL_VIEWPORT, GL_LIGHT_MODEL_LOCAL_VIEWER, or GL_LIGHT_MODEL_TWO_SIDE");
    }
}

function glGetFloatv(item,array) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (!array || !array.length) {
        GLSim.error("The second parameter to glGetFloatv must be an array."); return;
    }
    var context = GLSim.currentContext;
    if (item == GL_POINT_SIZE || item == GL_LINE_WIDTH) {
        if (array.length < 1) { GLSim.error("Array length must be at least 1 for GL_POINT_SIZE or GL_LINE_WIDTH."); return; }
        array[0] = item == GL_POINT_SIZE ? context.pointSize : context.lineWidth;
    }
    else if (context == GL_CURRENT_NORMAL) {
        if (array.length < 3) { GLSim.error("Array length must be at least 3 for GL_POINT_SIZE or GL_LINE_WIDTH."); return; }
        array[0] = context.normal[0];
        array[1] = context.normal[1];
        array[2] = context.normal[2];
    }
    else if (item == GL_LIGHT_MODEL_AMBIENT || item == GL_CURRENT_COLOR || item == GL_CURRENT_TEXTURE_COORDS) {
        if (array.length < 4) { GLSim.error("Array length must be at least 4 for GL_LIGHT_MODEL_AMBIENT, GL_CURRENT_COLOR, or CL_CURRENT_TEXTURE_COORDS."); return; }
        var v = item == GL_CURRENT_COLOR? context.color : item == GL_CURRENT_TEXTURE_COORDS ? context.texCoords : context.lightModelAmbient;
        array[0] = v[0];
        array[1] = v[1];
        array[2] = v.length > 2? v[2] : 0;
        array[3] = v.length > 3? v[3] : 1;
    }
    else if (item == GL_MODELVIEW_MATRIX || item == GL_PROJECTION_MATRIX || item == GL_TEXTURE_MATRIX) {
        if (array.length < 16) { GLSim.error("Array length must be at least 16 for a matrix."); return; }
        var m = item == GL_PROJECTION_MATRIX ? context.projectionMatrix : item == GL_TEXTURE_MATRIX ? context.textureMatrix : context.modelviewMatrix;
        for (var i = 0; i < 16; i++) {
            array[i] = m[i];
        }
    }
    else {
        GLSim.error("Unsupported item passed as first parameter to glGetFloatv.");
    }
}
var glGetDoublev = glGetFloatv;

function glIsEnabled(item) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return 0; }
    item = Math.round(Number(item));
    if (isNaN(item) || item < 0 || item > _GL_ENABLE_MAX) {
        GLSim.error("Unknown state variable in glIsEnabled."); return 0;
    }
    return GLSim.currentContext.enabled[item] ? 1 : 0;
}

function glGetMaterialfv(face, property, array) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (face != GL_FRONT && face != GL_BACK) {
        GLSim.error("First parameter to glGetMaterialfv must be GL_FRONT or GL_BACK."); return;
    }
    if (property != GL_SHININESS && property != GL_AMBIENT && property != GL_DIFFUSE
                       && property != GL_SPECULAR && property != GL_EMISSION) {
        GLSim.error("Second parameter to glGetMaterialfv must be a material property such as GL_DIFFUSE"); return;
    }
    if (!array || !array.length) {
        GLSim.error("The third parameter to glGetMaterialfv must be an array."); return;
    }
    var mat = face == GL_FRONT ? GLSim.currentContext.frontMaterial : GLSim.currentContext.backMaterial;
    if (property == GL_SHININESS) {
        if (array.length < 1) { GLSim.error("Array length must be at least 1 for GL_SHININESS."); return; }
        array[0] = mat.shininess;
    }
    else {
        if (array.length < 4) { GLSim.error("Array length must be at least 4 for a color property."); return; }
        var v;
        switch (property) {
        case GL_AMBIENT: v = mat.ambient; break;
        case GL_DIFFUSE: v = mat.diffuse; break;
        case GL_SPECULAR: v = mat.specular; break;
        default: v = mat.emission; break;
        }
        for (var i = 0; i < 3; i++) {
            array[i] = v[i];
        }
        array[3] = v.length > 3 ? v[3] : 1;
    }
}

function glGetLightfv(light, property, array) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (light < GL_LIGHT0 || light >= GL_LIGHT0 + GLSim.currentContext.light.length) {
        GLSim.error("Unknown light number in glGetLightfv."); return;
    }
    if (property != GL_POSITION && property != GL_AMBIENT && property != GL_DIFFUSE && property != GL_SPECULAR) {
        GLSim.error("Second parameter to glGetLightfv must be a light property such as GL_POSITION"); return;
    }
    if (!array || !array.length) {
        GLSim.error("The third parameter to glGetLightfv must be an array."); return;
    }
    var lt = GLSim.currentContext.light[light - GL_LIGHT0];
    if (array.length < 4) { GLSim.error("Array length must be at least 4 for a light property."); return; }
    var v;
    switch (property) {
    case GL_AMBIENT: v = lt.ambient; break;
    case GL_DIFFUSE: v = lt.diffuse; break;
    case GL_SPECULAR: v = lt.specular; break;
    default: v = lt.position; break;
    }
    for (var i = 0; i < 3; i++) {
        array[i] = v[i];
    }
    array[3] = v.length > 3 ? v[3] : 1;
}

function glFlush() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    GLSim.currentContext.gl.flush();  // (probably never needed!)
}

function glBlendFunc(a,b) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    GLSim.currentContext.gl.blendFunc(a,b);
}
function glFrontFace(face) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (face != GL_CW && face != GL_CCW) {
        GLSim.error("Argument to glFrontFace must be GL_CW or GL_CCW"); return;
    }
    GLSim.currentContext.gl.frontFace(face);
}
function glPolygonOffset(factor, units) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    factor = Number(factor);
    units = Number(units);
    if (isNaN(factor+units)) {
        GLSim.error("glPolygonOffset requires two numeric arguments"); return;
    }
    GLSim.currentContext.gl.polygonOffset(factor,units);
}

function glClearColor(r,g,b,a) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN(Number(r)+Number(g)+Number(b)+Number(a))) {
        GLSim.error("glClearColor requires four numeric parameters"); return;
    }
    GLSim.currentContext.gl.clearColor(r,g,b,a);
}

function glClear(mask) {  
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN( Number(mask) )) {
        GLSim.error("parmeter to glClear must be numeric"); return;
    }
    var arg = 0;
    if (mask & GL_DEPTH_BUFFER_BIT) {
        arg = GLSim.currentContext.gl.DEPTH_BUFFER_BIT;
    }
    if (mask & GL_COLOR_BUFFER_BIT) {
        arg = arg | GLSim.currentContext.gl.COLOR_BUFFER_BIT;
    }
    GLSim.currentContext.gl.clear(arg);
}

function glLineWidth(width) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN(Number(width))) {
        GLSim.error("Argument to glLineWidth must be numeric"); return;
    }
    GLSim.currentContext.lineWidth = Number(width);
}

function glPointSize(size) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (isNaN(Number(size))) {
        GLSim.error("Argument to glLineWidth must be numeric"); return;
    }
    GLSim.currentContext.pointSize = Number(size);
}

function glColor3f(r,g,b) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 3) {
        GLSim.error("Exactly three color components are required by glColor3*"); return;
    }
    glColor4f(r,g,b,1.0);
}
var glColor3d = glColor3f;
function glColor4f(r,g,b,a) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 4) {
        GLSim.error("Exactly four color components are required by glColor4*"); return;
    }
    if (isNaN(Number(r)+Number(g)+Number(b)+Number(a))) {
        GLSim.error("parameters to glColor* must be numeric"); return;
    }
    r = Math.min(1,Math.max(Number(r),0));
    g = Math.min(1,Math.max(Number(g),0));
    b = Math.min(1,Math.max(Number(b),0));
    a = Math.min(1,Math.max(Number(a),0));
    GLSim.currentContext.color = [r,g,b,a];
    if ( GLSim.currentContext.enabled[GL_COLOR_MATERIAL] ) {
        glMaterialfv(GLSim.currentContext.colorMaterialFace,
             GLSim.currentContext.colorMaterialMode, GLSim.currentContext.color);
    }
}
var glColor4d = glColor4f;
function glColor3ub(r,g,b) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 3) {
        GLSim.error("Exactly three color components are required by glColor3*"); return;
    }
    glColor4f(r/255,g/255,b/255, 1);    
}
function glColor4ub(r,g,b,a) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 4) {
        GLSim.error("Exactly four color components are required by glColor4*"); return;
    }
    glColor4f(r/255,g/255,b/255, a/255);    
}
function glColor3fv(colorArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || ! colorArray.length || colorArray.length < 3) {
        GLSim.error("glcolor3*v takes one arguement that is an array of length at least 3."); return;
    }
    glColor4f(colorArray[0],colorArray[1],colorArray[2],1);
}
var glColor3dv = glColor3fv;
function glColor3ubv(colorArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || ! colorArray.length || colorArray.length < 3) {
        GLSim.error("glcolor3*v takes one arguement that is an array of length at least 3."); return;
    }
    glColor4f(colorArray[0]/255,colorArray[1]/255,colorArray[2]/255,1);
}
function glColor4fv(colorArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || ! colorArray.length || colorArray.length < 4) {
        GLSim.error("glcolor4*v takes one arguement that is an array of length at least 4."); return;
    }
    glColor4f(colorArray[0],colorArray[1],colorArray[2],colorArray[3]);
}
var glColor4dv = glColor4fv;
function glColor4ubv(colorArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || ! colorArray.length || colorArray.length < 4) {
        GLSim.error("glcolor4*v takes one arguement that is an array of length at least 4."); return;
    }
    glColor4f(colorArray[0]/255,colorArray[1]/255,colorArray[2]/255,colorArray[3]/255);
}

function glNormal3f(x,y,z) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 3) {
        GLSim.error("Exactly three vertex coordinates are required by glNormal3*"); return;
    }
    if (isNaN(Number(x)+Number(y)+Number(z))) {
        GLSim.error("parameters to glNormal* must be numeric"); return;
    }
    GLSim.currentContext.normal = [Number(x),Number(y),Number(z)];
}
var glNormal3d = glNormal3f;
function glNormal3fv(vArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || !vArray.length || vArray.length < 3) {
        GLSim.error("glNormal3*v requres one argument that is an array of length at least 3"); return;
    }
    glNormal3f(vArray[0],vArray[2],vArray[2]);
}
var glNormal3dv = glNormal3fv;

function glTexCoord2f(s,t) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 2) {
        GLSim.error("Exactly two vertex coordinates are required by glTexCoord2*"); return;
    }
    if (isNaN(Number(s)+Number(t))) {
        GLSim.error("parameters to glTexCoord* must be numeric"); return;
    }
    GLSim.currentContext.texCoords = [Number(s),Number(t)];
}
var glTexCoord2d = glTexCoord2f;
var glTexCoord2i = glTexCoord2f;
function glTexCoord2fv(array) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || !array.length || array.length < 2) {
        GLSim.error("glTexcoord*v requres one argument that is an array of length at least 2"); return;
    }
    glTexCoord2d(array[0],array[2]);
}
var glTexCoord2dv = glTexCoord2fv;
var glTexCoord2iv = glTexCoord2fv;

function glVertex3f(x,y,z) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (!GLSim.currentContext.primitiveData) {
        GLSim.error("glVertex* can only be called between glBegin and glEnd"); return;
    }
    if (arguments.length != 3) {
        GLSim.error("Exactly three vertex coordinates are required by glVertex3*"); return;
    }
    if (isNaN(Number(x)+Number(y)+Number(z))) {
        GLSim.error("parameters to glVertex* must be numeric"); return;
    }
    var context = GLSim.currentContext;
    context.primitiveData.vertices.push(Number(x),Number(y),Number(z));
    context.primitiveData.vertexColors.push(context.color[0],context.color[1],context.color[2],context.color[3]);
    context.primitiveData.vertexNormals.push(context.normal[0],context.normal[1],context.normal[2]);
    context.primitiveData.texCoords.push(context.texCoords[0],context.texCoords[1]);
    if (context.enabled[GL_LIGHTING]) {
        var m = context.frontMaterial;
        var d = context.primitiveData.frontMaterial;
        d.shininess.push(m.shininess);
        d.ambient.push(m.ambient[0],m.ambient[1],m.ambient[2]);
        d.diffuse.push(m.diffuse[0],m.diffuse[1],m.diffuse[2],m.diffuse[3]);
        d.specular.push(m.specular[0],m.specular[1],m.specular[2]);
        d.emission.push(m.emission[0],m.emission[1],m.emission[2]);
        if (context.lightModelTwoSide) {
            m = context.backMaterial;
            d = context.primitiveData.backMaterial;
            d.shininess.push(m.shininess);
            d.ambient.push(m.ambient[0],m.ambient[1],m.ambient[2]);
            d.diffuse.push(m.diffuse[0],m.diffuse[1],m.diffuse[2],m.diffuse[3]);
            d.specular.push(m.specular[0],m.specular[1],m.specular[2]);
            d.emission.push(m.emission[0],m.emission[1],m.emission[2]);
        }
    }
}
var glVertex3d = glVertex3f;
var glVertex3i = glVertex3f;
function glVertex3fv(vArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || !vArray.length || vArray.length < 3) {
        GLSim.error("glVertex3*v requres one argument that is an array of length at least 3"); return;
    }
    glVertex3f(vArray[0],vArray[1],vArray[2]);
}
var glVertex3dv = glVertex3fv;
var glVertex3iv = glVertex3iv;
function glVertex2f(x,y) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 2) {
        GLSim.error("Exactly two vertex coordinates are required by glVertex2*"); return;
    }
    glVertex3f(x,y,0);
}
var glVertex2d = glVertex2f;
var glVertex2i = glVertex2f;
function glVertex2fv(vArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (arguments.length != 1 || !vArray.length || vArray.length < 2) {
        GLSim.error("glVertex2*v requres one argument that is an array of length at least 2"); return;
    }
    glVertex3f(vArray[0],vArray[2],0);
}
var glVertex2dv = glVertex2fv;
var glVertex2iv = glVertex2iv;

function glRectf(x1,y1,x2,y2) {
    if (isNaN(Number(x1)+Number(x2)+Number(y1)+Number(y2))) {
        GLSim.error("glRect* requires 4 numeric arguments"); return;
    }
    glBegin(GL_TRIANGLE_FAN);
    glVertex2f(x1,y1);
    glVertex2f(x2,y1);
    glVertex2f(x2,y2);
    glVertex2f(x1,y2);
    glEnd();
}
var glRectd = glRectf;
var glRecti = glRectf;

function glMaterialfv(side,property,value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (side != GL_FRONT && side != GL_BACK && side != GL_FRONT_AND_BACK) {
        GLSim.error("Unknown value for first argument to glMaterialfv"); return;
    }
    if (property == GL_SHININESS) {
        GLSim.error("Can't set GL_SHININESS with glMaterialfv"); return;
    }
    if (property != GL_AMBIENT && property != GL_DIFFUSE &&
        property != GL_SPECULAR && property != GL_EMISSION && property != GL_AMBIENT_AND_DIFFUSE) {
        GLSim.error("Unknown value for second parameter to glMaterialfv"); return;
    }
    if (value.length && value.length == 3) {
        value = [value[0], value[1], value[2], 1];
    }
    if (!value.length || value.length != 4 ||
        isNaN(Number(value[0])+Number(value[1])+Number(value[2])+Number(value[3]))) {
        GLSim.error("Third argument to glMaterialfv must be an array of three or four numbers"); return;
    }
    var v = [Number(value[0]), Number(value[1]), Number(value[2])];
    var v4;
    if (property == GL_DIFFUSE || property == GL_AMBIENT_AND_DIFFUSE) {
        v4 = [Number(value[0]), Number(value[1]), Number(value[2]), Number(value[3])];
    }
    var m = GLSim.currentContext.frontMaterial;
    if (side == GL_FRONT || side == GL_FRONT_AND_BACK) {
        switch (property) {
            case GL_AMBIENT: m.ambient = v; break;
            case GL_DIFFUSE: m.diffuse = v4; break;
            case GL_AMBIENT_AND_DIFFUSE: m.ambient = v; m.diffuse = v4; break;
            case GL_SPECULAR: m.specular = v; break;
            case GL_EMISSION: m.emission = v; break;
        }
    }
    m = GLSim.currentContext.backMaterial;
    if (side == GL_BACK || side == GL_FRONT_AND_BACK) {
        switch (property) {
            case GL_AMBIENT: m.ambient = v; break;
            case GL_DIFFUSE: m.diffuse = v4; break;
            case GL_AMBIENT_AND_DIFFUSE: m.ambient = v; m.diffuse = v4; break;
            case GL_SPECULAR: m.specular = v; break;
            case GL_EMISSION: m.emission = v; break;
        }
    }
    if (GLSim.currentContext.primitiveData) {
        GLSim.currentContext.primitiveData.materialChanged = true;
    }
}
function glMateriali(side,property,value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (side != GL_FRONT && side != GL_BACK && side != GL_FRONT_AND_BACK) {
        GLSim.error("Unknown value for first argument to glMateriali"); return;
    }
    if (property != GL_SHININESS) {
        GLSim.error("Second argument to glMateriali must be GL_SHININESS"); return;
    }
    var v = Number(value);
    if (isNaN(v)) {
        GLSim.error("Third parameter to glMateriali must be numeric"); return;
    }
    if (side == GL_FRONT || side == GL_FRONT_AND_BACK) {
        GLSim.currentContext.frontMaterial.shininess = v;
    }
    if (side == GL_BACK || side == GL_FRONT_AND_BACK) {
        GLSim.currentContext.backMaterial.shininess = v;
    }
    if (GLSim.currentContext.primitiveData) {
        GLSim.currentContext.primitiveData.materialChanged = true;
    }
}
var glMaterialf = glMateriali;

function glColorMaterial(face, property) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.primitiveData) { GLSim.error("glColorMaterial cannot be called between glBegin and glEnd"); return; }
    if (face != GL_FRONT && face != GL_BACK && face != GL_FRONT_AND_BACK) {
        GLSim.error("Unknown value for first argument to glColorMaterial"); return;
    }
    if (property == GL_SHININESS) {
        GLSim.error("Can't set GL_SHININESS with glColorMaterial"); return;
    }
    if (property != GL_AMBIENT && property != GL_DIFFUSE &&
        property != GL_SPECULAR && property != GL_EMISSION && property != GL_AMBIENT_AND_DIFFUSE) {
        GLSim.error("Unknown value for second parameter to glColorMaterial"); return;
    }
    GLSim.currentContext.colorMaterialFace = face;
    GLSim.currentContext.colorMaterialMode = property;
}

function glLightfv(light,property,value) { 
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    light = Math.round(Number(light));
    if (isNaN(light) || light < GL_LIGHT0 || light >= GL_LIGHT0 + GLSim.currentContext.light.length) {
        GLSim.error("Unknown light number for first argument to glLightfv"); return;
    }
    if (property != GL_AMBIENT && property != GL_DIFFUSE &&
        property != GL_SPECULAR && property != GL_POSITION) {
        GLSim.error("Unknown property for second parameter to glLightfv"); return;
    }
    var v = [Number(value[0]), Number(value[1]), Number(value[2])];
    if ( isNaN(v[0]+v[1]+v[2]) || (value.length == 4 && isNaN(Number(value[3]))) ){
        GLSim.error("Third argument to glLightfv must be an array of three or four numbers"); return;
    }
    var li = GLSim.currentContext.light[light - GL_LIGHT0];
    switch (property) {
        case GL_POSITION: li.position = v; break;
        case GL_AMBIENT: li.ambient = v; break;
        case GL_DIFFUSE: li.diffuse = v; break;
        case GL_SPECULAR: li.specular = v; break;
    }
    if (property == GL_POSITION) {
        v.push( value.length == 4? Number(value[3]) : 0);
        mat4.applyToVec4(v,v,GLSim.currentContext.modelviewMatrix);
    }
}

function glLightModelfv(property, value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (property != GL_LIGHT_MODEL_AMBIENT) {
        GLSim.error("Only GL_LIGHT_MODEL_AMBIENT is supported as the first argument of glLightModelfv"); return;
    }
    var v = [Number(value[0]), Number(value[1]), Number(value[2])];
    if (isNaN(value[0]+value[1]+value[2])) {
        GLSim.error("Values for glLightModelfv must be numeric"); return;
    }
    GLSim.currentContext.lightModelAmbient = v;
}
function glLightModeli(property, value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (property != GL_LIGHT_MODEL_TWO_SIDE && property != GL_LIGHT_MODEL_LOCAL_VIEWER) {
        GLSim.error("First argument of glLightModeli must be GL_LIGHT_MODEL_TWO_SIDE or GL_LIGHT_MODEL_LOCAL_VIEWER"); return;
    }
    if (arguments.length != 2) {
        GLSim.error("glLightModeli requires two arguments"); return;
    }
    if (property == GL_LIGHT_MODEL_LOCAL_VIEWER) {
        GLSim.currentContext.lightModelLocalViewer = value ? 1 : 0;
    }
    else {
        GLSim.currentContext.lightModelTwoSide = value ? 1 : 0;
    }
}
var glLightModelf = glLightModeli;

function glGenTextures(count, array) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    count = Math.round(Number(count));
    if (isNaN(count) || count <= 0) {
        GLSim.error("The first parameter of glGenTextures must be a positive integer."); return;
    }
    if (!array || typeof array !== "object" || array.length == undefined) { //*** modified in Oct 2021 to handle zero-length arrays
        GLSim.error("The second parameter of glGenTextures must be an array."); return;
    }
    for (var i = 0; i < count; i++) {
           //*** Modified in October 2021 to make glGenTextures, glBindTexture work with integer parameters.
           //*** Previously, texture IDs were WebGL textures rather than integers as in proper OpenGL
        array[i] = GLSim.currentContext.textureObjects.length;
        GLSim.currentContext.textureObjects.push(GLSim.currentContext.gl.createTexture());
    }
}
function glCreateTexture() {  // not part of OpenGL!
        //***** Modified to return an integer texture ID instead of a WebGL texture.
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return null; }
    var A = [];
    glGenTexures(1,A);
    return A[0];
}
function glBindTexture(mode, texID) {
           //*** Modified in October 2021 to make glGenTextures, glBindTexture work with integer parameters.
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (mode != GL_TEXTURE_2D) {
        GLSim.error("The first parameter of glBindTexture must be GL_TEXTURE_2D"); return;
    }
    if (!texID) {
        texID = 0;
    }
    texID = Math.round(Number(texID));
    if (texID === NaN || texID < 0) {
        GLSim.error("The second parameter of glBindTexture should be a non-negative integer."); return;
    }
    var texObjs = GLSim.currentContext.textureObjects;
    if (texID < texObjs.length) { // out of range values are ignored
        GLSim.currentContext.gl.bindTexture(GLSim.currentContext.gl.TEXTURE_2D, texObjs[texID]);
        //  GLSim.currentContext.currentTextureID = texID;  // Removed since now a texture is always bound
    }
}
function glTexParameteri(mode, name, value) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (mode != GL_TEXTURE_2D) {
        GLSim.error("The first parameter of glTexParameteri must be GL_TEXTURE_2D"); return;
    }
    if (name != GL_TEXTURE_WRAP_S && name != GL_TEXTURE_WRAP_T && name != GL_TEXTURE_MAG_FILTER && name != GL_TEXTURE_MIN_FILTER) {
        GLSim.error("Unknow texture parameter."); return;
    }
    if (name == GL_TEXTURE_WRAP_S || name == GL_TEXTURE_WRAP_T) {
        if (value != GL_CLAMP && value != GL_REPEAT) {
            GLSim.error("Only GL_CLAMP and GL_REPEAT are supported as texture wrap modes."); return;
        }
    }
    else if (name == GL_TEXTURE_MAG_FILTER) {
        if (value != GL_NEAREST && value != GL_LINEAR) {
            GLSim.error("Unknown texture mag filter"); return;
        }
    }
    else {
        if (value != GL_NEAREST && value != GL_LINEAR && value != GL_NEAREST_MIPMAP_LINEAR &&
            value != GL_NEAREST_MIPMAP_NEAREST && value != GL_LINEAR_MIPMAP_LINEAR &&
            value != GL_LINEAR_MIPMAP_NEAREST) {
            GLSim.error("Unknown texture min filter"); return;
        }
    }
    GLSim.currentContext.gl.texParameteri(GLSim.currentContext.gl.TEXTURE_2D,name,value);
}
var glTexParameterf = glTexParameteri;
function glTexImage2D(mode, level, internalFormat, width, height, border, format, type, image) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (mode != GL_TEXTURE_2D) {
        GLSim.error("The first parameter of glTexImage2D must be GL_TEXTURE_2D"); return;
    }
    level = Math.round(Number(level));
    if (isNaN(level) || level < 0) {
        GLSim.error("The second parameter (level) of glTexImage2D must be a non-negative integer"); return;
    }
    if (internalFormat != GL_RGBA || format != GL_RGBA) {
        GLSim.error("Only GL_RGBA is supported as a format in glTexImage2D"); return;
    }
    if (type != GL_UNSIGNED_BYTE) {
        GLSim.error("Only GL_UNSIGNED_BYTE is supported as a datatype in glTexImage2D"); return;
    }
    if (! (image instanceof Image) && ! (image instanceof HTMLImageElement)
             && !(image instanceof HTMLCanvasElement) ) {
                 //*** The option to use a canvas for the image source was added in October 2021
        GLSim.error("The last parameter to glTexImage2D must be an Image or Canvas"); return;
    }
//    if (!GLSim.currentContext.currentTextureID){  // Removed in October 2021 since now a texture is always bound
//        glBindTexture(GL_TEXTURE_2D, GLSim.currentContext.defaultTextureID);
//    }
    var gl = GLSim.currentContext.gl;
    gl.texImage2D(gl.TEXTURE_2D, level, GL_RGBA, GL_RGBA, GL_UNSIGNED_BYTE, image);
}
function glCopyTexImage2D(mode, level, internalFormat, x, y, width, height, border) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (mode != GL_TEXTURE_2D) {
        GLSim.error("The first parameter of glCopyTexImage2D must be GL_TEXTURE_2D"); return;
    }
    level = Math.round(Number(level));
    if (isNaN(level) || level < 0) {
        GLSim.error("The second parameter (level) of glCopyTexImage2D must be a non-negative integer"); return;
    }
    if (internalFormat != GL_RGBA ) {
        GLSim.error("Only GL_RGBA is supported as a format in glCopyTexImage2D"); return;
    }
    x = Math.round(Number(x));
    y = Math.round(Number(y));
    width = Math.round(Number(width));
    height = Math.round(Number(height));
    if (isNaN(x+y+width+height)) {
        GLSim.error("x,y,width, and height must be integers for glCopyTexImage2D"); return;
    }
    if (border && border != 0) {
        GLSim.error("border must be 0 for glCopyTexImage2D"); return;
    }
//    if (!GLSim.currentContext.currentTextureID){ //Removed in October 2021 since now a texture is always bound
//        glBindTexture(GL_TEXTURE_2D,GLSim.currentContext.defaultTextureID);
//    }
    var gl = GLSim.currentContext.gl;
    gl.copyTexImage2D(gl.TEXTURE_2D,level,GL_RGBA,x,y,width,height,0);
}

function glPushMatrix() {
       //*** Modified in October 2021 to add support for texture transforms
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.matrixMode == GL_MODELVIEW) {
        GLSim.currentContext.modelviewStack.push( mat4.clone(GLSim.currentContext.modelviewMatrix) );
    }
    else if (GLSim.currentContext.matrixMode == GL_TEXTURE) {
        GLSim.currentContext.textureStack.push( mat4.clone(GLSim.currentContext.textureMatrix) );
    }
    else {
        GLSim.currentContext.projectionStack.push( mat4.clone(GLSim.currentContext.projectionMatrix) );
    }
}
function glPopMatrix() {
       //*** Modified in October 2021 to add support for texture transforms
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.matrixMode == GL_MODELVIEW) {
        if (GLSim.currentContext.modelviewStack.length > 0) {
           GLSim.currentContext.modelviewMatrix = GLSim.currentContext.modelviewStack.pop();
        }
        else {
            GLSim.error("Attempt to pop from an empty modelview matrix stack"); return;
        }
    }
    else if (GLSim.currentContext.matrixMode == GL_TEXTURE) {
        if (GLSim.currentContext.textureStack.length > 0) {
           GLSim.currentContext.textureMatrix = GLSim.currentContext.textureStack.pop();
        }
        else {
            GLSim.error("Attempt to pop from an empty modelview matrix stack"); return;
        }
    }
    else {
        if (GLSim.currentContext.projectionStack.length > 0) {
           GLSim.currentContext.projectionMatrix = GLSim.currentContext.projectionStack.pop();
        }
        else {
            GLSim.error("Attempt to pop from an empty projection matrix stack"); return;
        }
    }
}
function glMatrixMode(mode) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (mode != GL_PROJECTION && mode != GL_MODELVIEW && mode != GL_TEXTURE) {
        GLSim.error("Unknown matrix mode in glMatrixMode"); return;
    }
    GLSim.currentContext.matrixMode = mode;
}

function glLoadIdentity() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    mat4.identity(GLSim.currentContext.currentMatrix());
}
function glRotatef(degrees, axis_x, axis_y, axis_z) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    degrees = Number(degrees);
    axis_x = Number(axis_x);
    axis_y = Number(axis_y);
    axis_z = Number(axis_z);
    if (isNaN(degrees+axis_x+axis_y+axis_z)) {
        GLSim.error("glRotate* requires four numeric arguments."); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.rotate(mat,mat,degrees/180*Math.PI,[axis_x,axis_y,axis_z]);
}
var glRotated =glRotatef;
function glTranslatef(dx,dy,dz) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    dx = Number(dx);
    dy = Number(dy);
    dz = Number(dz);
    if (isNaN(dx+dy+dz)) {
        GLSim.error("glTranslate* requires three numeric arguments."); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.translate(mat,mat,[dx,dy,dz]);
}
var glTranslated = glTranslatef;
function glScalef(sx,sy,sz) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    sx = Number(sx);
    sy = Number(sy);
    sz = Number(sz);
    if (isNaN(sx+sy+sz)) {
        GLSim.error("glScale* requires three numeric arguments."); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.scale(mat,mat,[sx,sy,sz]);
}
var glScaled = glScalef;
function glMulMatrix(matrix) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    matrix = new Float32Array(matrix);
    if (matrix.length < 16) {
        GLSim.error("glMulMatrix requires an array of 16 numbers"); return;
    }
    for (var i = 0; i < 16; i++) {
        if (isNaN(matrix[i])) {
            GLSim.error("glMulMatrix requires an array of 16 numbers"); return;
        }
    }
    var mat = GLSim.currentContext.currentMatrix();
    mat4.multiply(mat,mat,matrix);
}

function gluOrtho2D(xmin,xmax,ymin,ymax) {
    glOrtho(xmin,xmax,ymin,ymax,-1,1);
}
function glOrtho(xmin,xmax,ymin,ymax,near,far) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    xmin = Number(xmin);
    xmax = Number(xmax);
    ymin = Number(ymin);
    ymax = Number(ymax);
    near = Number(near);
    far = Number(far);
    if (isNaN(xmin+xmax+ymin+ymax+near+far)) {
        GLSim.error("glOrtho requires six numeric paramters"); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.ortho(proj,xmin,xmax,ymin,ymax,near,far);
    mat4.multiply(mat,mat,proj);
}
function glFrustum(xmin,xmax,ymin,ymax,near,far) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    xmin = Number(xmin);
    xmax = Number(xmax);
    ymin = Number(ymin);
    ymax = Number(ymax);
    near = Number(near);
    far = Number(far);
    if (isNaN(xmin+xmax+ymin+ymax+near+far)) {
        GLSim.error("glFrustum requires six numeric paramters"); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.frustum(proj,xmin,xmax,ymin,ymax,near,far);
    mat4.multiply(mat,mat,proj);
}
function gluPerspective(fovy, aspect, near, far) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    fovy = Number(fovy);
    aspect = Number(aspect);
    near = Number(near);
    far = Number(far);
    if (isNaN(fovy+aspect+near+far)) {
        GLSim.error("gluPerspective requires nine numeric parameters"); return;
    }
    fovy = fovy/180*Math.PI;
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.perspective(proj,fovy, aspect, near, far);
    mat4.multiply(mat,mat,proj);
}
function gluLookAt( eyeX,eyeY,eyeZ, refX,refY,refZ, upX,upY,upZ ) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    eyeX = Number(eyeX);
    eyeY = Number(eyeY);
    eyeZ = Number(eyeZ);
    refX = Number(refX);
    refY = Number(refY);
    refZ = Number(refZ);
    upX = Number(upX);
    upY = Number(upY);
    upZ = Number(upZ);
    if (isNaN(eyeX+eyeY+eyeZ+refX+refY+refZ+upX+upY+upZ)) {
        GLSim.error("gluLookAt requires nine numeric parameters"); return;
    }
    var mat = GLSim.currentContext.currentMatrix();
    var proj = mat4.create();
    mat4.lookAt(proj,[eyeX,eyeY,eyeZ],[refX,refY,refZ],[upX,upY,upZ]);
    mat4.multiply(mat,mat,proj);
}

function glBegin(kind) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    var context = GLSim.currentContext;
    if (context.primitiveData) {
        GLSim.error("Calls to begin cannot be nested"); return;
    }
    if (kind != GL_POINTS && kind != GL_LINES && kind != GL_LINE_LOOP && kind != GL_LINE_STRIP &&
        kind != GL_TRIANGLES && kind != GL_TRIANGLE_STRIP && kind != GL_TRIANGLE_FAN &&
        kind != GL_QUADS && kind != GL_QUAD_STRIP && kind != GL_POLYGON) {
        GLSim.error("Unsupported primitive type in glBegin"); return;
    }
    context.primitiveData = {
        kind: kind,
        vertices: [],
        vertexNormals: [],
        vertexColors: [],
        texCoords: [],
        vertexMaterials: []
    };
    if (context.enabled[GL_LIGHTING]) {
        context.primitiveData.materialChanged = false;
        context.primitiveData.frontMaterial = {
            shininess: [],
            ambient: [],
            diffuse: [],
            specular: [],
            emission: []
        };
        if (context.lightModelTwoSide) {
            context.primitiveData.backMaterial = {
                shininess: [],
                ambient: [],
                diffuse: [],
                specular: [],
                emission: []
            };
        }
    }
}

function glEnd() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    var context = GLSim.currentContext;
    if (!context.primitiveData) {
        GLSim.error("glEnd with no matching glBegin"); return;
    }
    var data = context.primitiveData;
    context.primitiveData = null;
    var gl = GLSim.currentContext.gl;
    var kind = context._convertPrimitiveType(data.kind);
    var coords, normals, colors, texCoords = null;
    if (data.kind == GL_QUADS) {
        coords = context._fixArrayForGL_QUADS(data.vertices, 3);
        if (context.enabled[GL_LIGHTING]) {
            normals = context._fixArrayForGL_QUADS(data.vertexNormals, 3);
        }
        else {
            colors = context._fixArrayForGL_QUADS(data.vertexColors, 4);
        }
        if (context.enabled[GL_TEXTURE_2D]) {
            texCoords = context._fixArrayForGL_QUADS(data.texCoords, 2);
        }
    }
    else {
        coords = new Float32Array(data.vertices);
        if (context.enabled[GL_LIGHTING]) {
            normals = new Float32Array(data.vertexNormals);
        }
        else {
            colors = new Float32Array(data.vertexColors);
        }
        if (context.enabled[GL_TEXTURE_2D]) {
            texCoords = new Float32Array(data.texCoords);
        }
    }
    context._applyContextToShaderProgram(kind);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.coords);
    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.location.coords);
    if (context.enabled[GL_LIGHTING]) {
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.normal);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.normal);
        gl.disableVertexAttribArray(context.location.color);
        gl.vertexAttrib4fv(context.location.color, context.color);
    }
    else {
        gl.disableVertexAttribArray(context.location.normal);
        gl.vertexAttrib3fv(context.location.normal, context.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.color);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.color, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.color);
    }
    if (context.enabled[GL_TEXTURE_2D]) {
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.texCoords);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.texCoords, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.texCoords);
    }
    else {
        gl.disableVertexAttribArray(context.location.texCoords);
        gl.vertexAttrib2fv(context.location.texCoords, context.texCoords);
    }
    if (context.enabled[GL_LIGHTING] && data.materialChanged) {
        var d = data.frontMaterial;
        var arrays = data.kind == GL_QUADS? {
            shininess: context._fixArrayForGL_QUADS(d.shininess,1),
            ambient: context._fixArrayForGL_QUADS(d.ambient,1),
            diffuse: context._fixArrayForGL_QUADS(d.diffuse,1),
            specular: context._fixArrayForGL_QUADS(d.specular,1),
            emission: context._fixArrayForGL_QUADS(d.emission,1)
        } : {
            shininess: new Float32Array(d.shininess),
            ambient: new Float32Array(d.ambient),
            diffuse: new Float32Array(d.diffuse),
            specular: new Float32Array(d.specular),
            emission: new Float32Array(d.emission)
        };
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_shininess);
        gl.bufferData(gl.ARRAY_BUFFER, arrays.shininess, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.front_shininess, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.front_shininess);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_ambient);
        gl.bufferData(gl.ARRAY_BUFFER, arrays.ambient, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.front_ambient, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.front_ambient);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_diffuse);
        gl.bufferData(gl.ARRAY_BUFFER, arrays.diffuse, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.front_diffuse, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.front_diffuse);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_specular);
        gl.bufferData(gl.ARRAY_BUFFER, arrays.specular, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.front_specular, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.front_specular);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.front_emission);
        gl.bufferData(gl.ARRAY_BUFFER, arrays.emission, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.front_emission, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(context.location.front_emission);
        if (context.lightModelTwoSide) {
            d = data.backMaterial;
            arrays = data.kind == GL_QUADS? {
                shininess: context._fixArrayForGL_QUADS(d.shininess,1),
                ambient: context._fixArrayForGL_QUADS(d.ambient,1),
                diffuse: context._fixArrayForGL_QUADS(d.diffuse,1),
                specular: context._fixArrayForGL_QUADS(d.specular,1),
                emission: context._fixArrayForGL_QUADS(d.emission,1)
            } : {
                shininess: new Float32Array(d.shininess),
                ambient: new Float32Array(d.ambient),
                diffuse: new Float32Array(d.diffuse),
                specular: new Float32Array(d.specular),
                emission: new Float32Array(d.emission)
            };
            gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_shininess);
            gl.bufferData(gl.ARRAY_BUFFER, arrays.shininess, gl.STREAM_DRAW);
            gl.vertexAttribPointer(context.location.back_shininess, 1, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(context.location.back_shininess);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_ambient);
            gl.bufferData(gl.ARRAY_BUFFER, arrays.ambient, gl.STREAM_DRAW);
            gl.vertexAttribPointer(context.location.back_ambient, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(context.location.back_ambient);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_diffuse);
            gl.bufferData(gl.ARRAY_BUFFER, arrays.diffuse, gl.STREAM_DRAW);
            gl.vertexAttribPointer(context.location.back_diffuse, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(context.location.back_diffuse);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_specular);
            gl.bufferData(gl.ARRAY_BUFFER, arrays.specular, gl.STREAM_DRAW);
            gl.vertexAttribPointer(context.location.back_specular, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(context.location.back_specular);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.back_emission);
            gl.bufferData(gl.ARRAY_BUFFER, arrays.emission, gl.STREAM_DRAW);
            gl.vertexAttribPointer(context.location.back_emission, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(context.location.back_emission);
        }
        else { 
            gl.disableVertexAttribArray(context.location.back_ambient);
            gl.disableVertexAttribArray(context.location.back_shininess);
            gl.disableVertexAttribArray(context.location.back_diffuse);
            gl.disableVertexAttribArray(context.location.back_specular);
            gl.disableVertexAttribArray(context.location.back_emission);
        }
    }
    else {
        gl.disableVertexAttribArray(context.location.front_ambient);
        gl.disableVertexAttribArray(context.location.front_shininess);
        gl.disableVertexAttribArray(context.location.front_diffuse);
        gl.disableVertexAttribArray(context.location.front_specular);
        gl.disableVertexAttribArray(context.location.front_emission);
        gl.disableVertexAttribArray(context.location.back_ambient);
        gl.disableVertexAttribArray(context.location.back_shininess);
        gl.disableVertexAttribArray(context.location.back_diffuse);
        gl.disableVertexAttribArray(context.location.back_specular);
        gl.disableVertexAttribArray(context.location.back_emission);
    }
    gl.drawArrays(kind, 0, coords.length/3);
}

function glVertexPointer(coordsPerVertex, dataType, stride, vertexArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (coordsPerVertex != 3 && coordsPerVertex != 2) {
        GLSim.error("The first parameter (coordsPerVertex) to glVertexPointer must be 2 or 3"); return;
    }
    if (dataType != GL_FLOAT && dataType != GL_INT && dataType != GL_DOUBLE) {
        GLSim.error("The second parameter (dataType) to glVertexPointer must be GL_FLOAT, GL_INT, or GL_DOUBLE"); return;
    }
    if (stride != 0) {
        GLSim.error("The third parameter (stride) to glVertexPointer must be 0"); return;
    }
    if (!vertexArray || !vertexArray.length) {
        GLSim.error("The fourth argument to glVertexPointer must be an array of numbers or a typed array"); return;
    }
    if (coordsPerVertex == 2) {  // add 0 as z-coord to each two-component vertex
        var newarray = new Float32Array( Math.floor((vertexArray.length/2) * 3) );
        var j = 0;
        for (var i = 0; i < vertexArray.length; i += 2) {
            newarray[j] = vertexArray[i];
            newarray[j+1] = vertexArray[i+1];
            newarray[j+2] = 0;
            j += 3;
        }
        vertexArray = newarray;
    }
    else if ( !(vertexArray instanceof Float32Array) ) {
        vertexArray = new Float32Array(vertexArray);
    }
    GLSim.currentContext.arraysForDrawArrays.vertexArray = vertexArray;
}

function glColorPointer(componentsPerColor, dataType, stride, colorArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (componentsPerColor != 3 && componentsPerColor != 4) {
        GLSim.error("The first parameter (componentsPerColor) to glColorPointer must be 3 or 4"); return;
    }
    if (dataType != GL_FLOAT && dataType != GL_DOUBLE && dataType != GL_UNSIGNED_BYTE) {
        GLSim.error("The third parameter (dataType) to glColorPointer must be GL_FLOAT, GL_DOUBLE, or GL_UNSIGNED_BYTE"); return;
    }
    if (stride != 0) {
        GLSim.error("The second parameter (stride) to glColorPointer must be 0"); return;
    }
    if (!colorArray || !colorArray.length) {
        GLSim.error("The fourth argument to glColorPointer must be an array of numbers or a typed array"); return;
    }
    if (dataType == GL_UNSIGNED_BYTE) {  // scale 0 to 255 to the range 0.0 to 1.0
        var newColors = new Float32Array(colorArray.length);
        for (var k = 0; k < colorArray.length; k++) {
            newColors[k] = colorArray[k]/255;
        }
        colorArray = newColors;
    }
    if (componentsPerColor == 3) {  // add 1 as alpha component to each three-component color
        var newarray = new Float32Array( Math.floor((colorArray.length/3) * 4) );
        var j = 0;
        for (var i = 0; i < colorArray.length; i += 3) {
            newarray[j] = colorArray[i];
            newarray[j+1] = colorArray[i+1];
            newarray[j+2] = colorArray[i+2];
            newarray[j+3] = 1;
            j += 4;
        }
        colorArray = newarray;
    }
    else if ( !(colorArray instanceof Float32Array) ) {
        colorArray = new Float32Array(colorArray);
    }
    GLSim.currentContext.arraysForDrawArrays.colorArray = colorArray;
}

function glNormalPointer(dataType, stride, normalArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (dataType != GL_FLOAT && dataType != GL_INT && dataType != GL_DOUBLE) {
        GLSim.error("The first parameter (dataType) to glNormalPointer must be GL_FLOAT, GL_INT, or GL_DOUBLE"); return;
    }
    if (stride != 0) {
        GLSim.error("The second parameter (stride) to glNormalPointer must be 0"); return;
    }
    if (!normalArray || !normalArray.length) {
        GLSim.error("The third argument to glNormalPointer must be an array of numbers or a typed array"); return;
    }
    else if (normalArray instanceof Float32Array) {
        GLSim.currentContext.arraysForDrawArrays.normalArray = normalArray;
    }
    else {
        GLSim.currentContext.arraysForDrawArrays.normalArray = new Float32Array(normalArray);
    }
}

function glTexCoordPointer(size,dataType, stride, tcArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (size != 2) {
        GLSim.error("Only 2 is supported as a value for the first parameter of glTexCoordPointer."); return;
    }
    if (dataType != GL_FLOAT && dataType != GL_INT && dataType != GL_DOUBLE) {
        GLSim.error("The second parameter (dataType) to glTexCoordPointer must be GL_FLOAT, GL_INT, or GL_DOUBLE"); return;
    }
    if (stride != 0) {
        GLSim.error("The third parameter (stride) to glTexCoordPointer must be 0"); return;
    }
    if (!tcArray || !tcArray.length) {
        GLSim.error("The fourth argument to glTexCoordPointer must be an array of numbers or a typed array"); return;
    }
    else if (tcArray instanceof Float32Array) {
        GLSim.currentContext.arraysForDrawArrays.texCoordArray = tcArray;
    }
    else {
        GLSim.currentContext.arraysForDrawArrays.texCoordArray = new Float32Array(tcArray);
    }
}

function glDrawArrays(primitive, start, count) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.primitiveData) { GLSim.error("glDrawArrays cannot be called between glBegin and glEnd"); return; }
    start = Math.round(Number(start));
    count = Math.round(Number(count));
    if (isNaN(start+count)){
        GLSim.error("start and count for glDrawArrays must be integers"); return;
    }
    var context = GLSim.currentContext;
    var gl = context.gl;
    var coordArray = context.arraysForDrawArrays.vertexArray;
    if (coordArray == null || !context.enabledClientState[GL_VERTEX_ARRAY]) {// can't actually draw without coordinates!
        return;
    }
    var colorArray = context.arraysForDrawArrays.colorArray;
    var normalArray = context.arraysForDrawArrays.normalArray;
    var texCoordArray = context.arraysForDrawArrays.texCoordArray;
    var kind = context._convertPrimitiveType(primitive);
    if (kind < 0) {
        GLSim.error("unknown primiitve type in glDrawArrays"); return;
    }
    if (primitive == GL_QUADS) {
        if (coordArray) {
            coordArray = context._fixArrayForGL_QUADS(coordArray, 3);
        }
        if (colorArray && context.enabledClientState[GL_COLOR_ARRAY] && !context.enabled[GL_LIGHTING]) {
            colorArray = context._fixArrayForGL_QUADS(colorArray, 4);
        }
        if (normalArray && context.enabledClientState[GL_NORMAL_ARRAY] && context.enabled[GL_LIGHTING]) {
            normalArray = context._fixArrayForGL_QUADS(normalArray, 3);
        }
        if (texCoordArray && context.enabledClientState[GL_TEXTURE_COORD_ARRAY] && context.enabled[GL_TEXTURE_2D]) {
            texCoordArray = context._fixArrayForGL_QUADS(texCoordArray, 2);
        }
        start = start/4 * count;
        count = count/4 * 6;
    }
    context._applyContextToShaderProgram(kind);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.coords);
    gl.bufferData(gl.ARRAY_BUFFER, coordArray, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.location.coords);
    if (context.enabled[GL_LIGHTING] && context.enabledClientState[GL_NORMAL_ARRAY] && normalArray) {
        gl.enableVertexAttribArray(context.location.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.normal);
        gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.normal, 3, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.normal);
        gl.vertexAttrib3fv(context.location.normal, context.normal);
    }
    if (!context.enabled[GL_LIGHTING] && context.enabledClientState[GL_COLOR_ARRAY] && colorArray) {
        gl.enableVertexAttribArray(context.location.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.color);
        gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.color, 4, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.color);
        gl.vertexAttrib3fv(context.location.color, context.color);
    }
    if (context.enabledClientState[GL_TEXTURE_COORD_ARRAY] && context.enabled[GL_TEXTURE_2D] && texCoordArray) {
        gl.enableVertexAttribArray(context.location.texCoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.texCoords);
        gl.bufferData(gl.ARRAY_BUFFER, texCoordArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.texCoords, 2, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.texCoords);
        gl.vertexAttrib2fv(context.location.texCoords, context.texCoords);
    }
    context._applyColorMaterialToShaderProgram(colorArray);
    gl.drawArrays(kind, start, count);
}

function glDrawElements(primitive, vertexCount, indexType, indexArray) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    if (GLSim.currentContext.primitiveData) { GLSim.error("glDrawElements cannot be called between glBegin and glEnd"); return; }
    vertexCount = Math.round(Number(vertexCount));
    if (isNaN(vertexCount)){
        GLSim.error("the count for glDrawElements must be an integer"); return;
    }
    if (!indexArray || !indexArray.length) {
        GLSim.error("the fourth parameter to glDrawElements must be an array"); return;
    }
    if (indexType != GL_UNSIGNED_BYTE && indexType != GL_UNSIGNED_INT && indexType != GL_UNSIGNED_SHORT) {
        GLSim.error("the type must be GL_UNSIGNED_BYTE, GL_UNSIGNED_SHORT, or GL_UNSIGNED_INT"); return;
    }
    var context = GLSim.currentContext;
    var gl = context.gl;
    var coordArray = context.arraysForDrawArrays.vertexArray;
    if (coordArray == null || !context.enabledClientState[GL_VERTEX_ARRAY]) {// can't actually draw without coordinates!
        return;
    }
    var colorArray = context.arraysForDrawArrays.colorArray;
    var normalArray = context.arraysForDrawArrays.normalArray;
    var texCoordArray = context.arraysForDrawArrays.texCoordArray;
    var kind = context._convertPrimitiveType(primitive);
    if (kind < 0) {
        GLSim.error("unknown primiitve type in glDrawElements"); return;
    }
    if (primitive == GL_QUADS) {
        indexArray = context._fixArrayForGL_QUADS(indexArray,1);
        vertexCount = vertexCount/4 * 6;
    }
    if (! (indexArray instanceof Uint16Array)) {
        indexArray = new Uint16Array(indexArray);
    }
    context._applyContextToShaderProgram(kind);
    gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.coords);
    gl.bufferData(gl.ARRAY_BUFFER, coordArray, gl.STREAM_DRAW);
    gl.vertexAttribPointer(context.location.coords, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(context.location.coords);
    if (context.enabled[GL_LIGHTING] && context.enabledClientState[GL_NORMAL_ARRAY] && normalArray) {
        gl.enableVertexAttribArray(context.location.normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.normal);
        gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.normal, 3, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.normal);
        gl.vertexAttrib3fv(context.location.normal, context.normal);
    }
    if (!context.enabled[GL_LIGHTING] && context.enabledClientState[GL_COLOR_ARRAY] && colorArray) {
        gl.enableVertexAttribArray(context.location.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.color);
        gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.color, 4, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.color);
        gl.vertexAttrib3fv(context.location.color, context.color);
    }
    if (context.enabledClientState[GL_TEXTURE_COORD_ARRAY] && context.enabled[GL_TEXTURE_2D] && texCoordArray) {
        gl.enableVertexAttribArray(context.location.texCoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffer.texCoords);
        gl.bufferData(gl.ARRAY_BUFFER, texCoordArray, gl.STREAM_DRAW);
        gl.vertexAttribPointer(context.location.texCoords, 2, gl.FLOAT, false, 0, 0);
    }
    else {
        gl.disableVertexAttribArray(context.location.texCoords);
        gl.vertexAttrib2fv(context.location.texCoords, context.texCoords);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, context.buffer.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArray, gl.STREAM_DRAW);
    context._applyColorMaterialToShaderProgram(colorArray);
    gl.drawElements(kind, vertexCount, gl.UNSIGNED_SHORT, 0);
}

/*---------------------- glsim utility functions ------------------------------*/

function glsimUse(canvas, webglOptions) { // webglOptions is used only if a new context is created
    if (!canvas) {
        GLSim.error("glsimUse requires a parameter to specify the canvas"); return;
    }
    var thecanvas = null;
    if (typeof canvas == "string") {
        thecanvas = document.getElementById(canvas);
        if (!thecanvas || ! thecanvas.getContext) {
            GLSim.error("glsimUse requires a canvas element or an ID for a canvas element"); return;
        }
    }
    else if (typeof canvas == 'object' && canvas.getContext) {
        thecanvas = canvas; 
    }
    else {
        GLSim.error("glsimUse parameter must be a canvas element or an ID for a canvas element"); return;
    }
    if (thecanvas._glsimContext) {
        GLSim.currentContext = thecanvas._glsimContext;  // use already existing context
    }
    else {
        var options = (webglOptions === undefined)? { alpha: false } : webglOptions;
        new GLSim(thecanvas,options);
    }
}


function glsimTexImage(image) {
    glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,0,0,0,GL_RGBA,GL_UNSIGNED_BYTE,image);
}


function glsimCopyTexImage(x,y,width,height) {
    glCopyTexImage2D(GL_TEXTURE_2D,0,GL_RGBA,x,y,width,height,0);
}


function glsimLoadImage(imageURL, callback) {
    if (!imageURL || ! (typeof imageURL == "string")) {
        GLSim.error("The first parameter of glsimLoadImage must be a string"); return;
    }
    var image = new Image();
    image.onerror = function() {
        if (window.console) {
            console.log("*** glsimLoadImage failed to load image from URL imageURL");
        }
    };
    if (callback) {
        if (! (typeof callback == "function") ){
            GLSim.error("The second parameter of glsimLoadImage, if present, must be a function"); return;
        }
        image.onload = function() {
            callback(image, imageURL);
        };
    }
    image.src = imageURL;
}


function glsimDrawModel(ifsModel) {  // ifsModel must have structure of objects from basic-objects-IFS.js
    var saveV = GLSim.currentContext.enabledClientState[GL_VERTEX_ARRAY];
    var saveN = GLSim.currentContext.enabledClientState[GL_NORMAL_ARRAY];
    glEnableClientState(GL_VERTEX_ARRAY);
    glVertexPointer(3,GL_FLOAT,0,ifsModel.vertexPositions);
    glEnableClientState(GL_NORMAL_ARRAY);
    glNormalPointer(GL_FLOAT, 0, ifsModel.vertexNormals);
    glDrawElements(GL_TRIANGLES, ifsModel.indices.length, GL_UNSIGNED_SHORT, ifsModel.indices); 
       // October 2021: the type GL_UNSIGNED_SHORT in the previous line replaced an incorrect GL_UNSIGNED_BYTE
    GLSim.currentContext.enabledClientState[GL_VERTEX_ARRAY] = saveV;
    GLSim.currentContext.enabledClientState[GL_NORMAL_ARRAY] = saveN;
}

function glsimProject(worldCoords) {  // Returns array of 3 clip coords
    if (worldCoords.length == 2) {
        worldCoords = [worldCoords[0], worldCoords[1], 0, 1];
    }
    else if (worldCoords.length == 3) {
        worldCoords = [worldCoords[0], worldCoords[1], worldCoords[2], 1];
    }
    else {
        worldCoords = [worldCoords[0], worldCoords[1], worldCoords[2], worldCoords[3] ];
    }
    var mv = GLSim.currentContext.modelviewMatrix;
    var pr = GLSim.currentContext.projectionMatrix;
    var mat = new Array(16);
    mat4.multiply(mat,pr,mv);
    var clip = new Array(4);
    mat4.applyToVec4(clip,mat,worldCoords);
    return [ worldCoords[0]/worldCoords[3], worldCoords[1]/worldCoords[3], worldCoords[2]/worldCoords[3] ];
}

function glsimUnproject(clipCoords) {
    if (clipCoords.length == 2) {
        clipCoords = [clipCoords[0], clipCoords[1], 0, 1];
    }
    else if (clipCoords.length == 3) {
        clipCoords = [clipCoords[0], clipCoords[1], clipCoords[2], 1];
    }
    else {
        clipCoords = [clipCoords[0], clipCoords[1], clipCoords[2], clipCoords[3]];
    }
    var mv = GLSim.currentContext.modelviewMatrix;
    var pr = GLSim.currentContext.projectionMatrix;
    var mat = new Array(16);
    mat4.invert(mat,mat);
    mat4.multiply(mat,pr,mv);
    var clip = new Array(4);
    mat4.applyToVec4(clip,mat,clipCoords);
    return [ clipCoords[0]/clipCoords[3], clipCoords[1]/clipCoords[3], clipCoords[2]/clipCoords[3] ];
}

function glsimProjectToPixelCoords(worldCoords) {
    var clipCoords = glsimProject(worldCoords);
    var viewport = GLSim.currentContext.gl.getParameter(GLSim.currentContext.gl.VIEWPORT);
    var x = viewport[0] + (1+clipCoords[0])/2*viewport[2];
    var y = viewport[1] + (1+clipCoords[1])/2*viewport[3];
    var canvas = GLSim.currentContext.canvas;
    y = canvas.height - y;
    return [ x, y, clipCoords[2]];
}

function glsimUnprojectFromPixelCoords(pixelCoords) {
    if (pixelCoords.length == 2) {
        pixelCoords = [ pixelCoords[0], pixelCoords[1], 0 ];
    }
    else {
        pixelCoords = [ pixelCoords[0], pixelCoords[1], pixelCoords[2] ];
    }
    var viewport = GLSim.currentContext.gl.getParameter(GLSim.currentContext.gl.VIEWPORT);
    var canvas =  GLSim.currentContext.canvas;
    pixelCoords[1] = canvas.height - pixelCoords[1];
    pixelCoords[0] = -1 + 2*(pixelCoords[0] - viewport[0])/viewport[2];
    pixelCoords[1] = -1 + 2*(pixelCoords[1] - viewport[1])/viewport[3];
    return glsimUnproject(pixelCoords);
}



//------------------ The Camera API -------------------------------



/**
 * A Camera object encapsulates the information needed to define a
 * viewing transform and a projection for an OpenGL context.  The
 * apply method can be called to applied this information to
 * a context.  The default view is from the point (0,0,30),
 * looking at (0,0,0), with (0,1,0) pointing upwards on the screen.
 * The default projection is a perspective projection.  The
 * x and y limits on the screen include at least -5 to 5.  Limits
 * in either the x or y direction will be expanded if necessary
 * to match the aspect ratio of the screen.  And the view volume
 * extends from -10 to 10 along the z-axis.  Only the default
 * constructor exists.  Non-default properties must be set by
 * calling methods.
 *     The camera comes along with a simulated trackball that
 * lets the user rotate the view by dragging on the drawing
 * surface.  See the installTrackball() method.
 */
 
function Camera() {
   
   this.eyex = 0;
   this.eyey = 0; 
   this.eyez = 30;
   
   this.refx = 0;
   this.refy = 0;
   this.refz = 0;
   
   this.upx = 0;
   this.upy = 1;
   this.upz = 0;
      
   this.xminRequested = -5;
   this.xmaxRequested = 5;
   this.yminRequested = -5;
   this.ymaxRequested = 5;
   this.zmin = -10;
   this.zmax = 10;
   this.xminActual = -5;
   this.xmaxActual = 5;
   this.yminActual = -5;
   this.ymaxActual = 5;
   
   this.orthographic = false;
   this.preserveAspect = true;

}

/**
 * Set whether the projection is orthographic or perspective.
 * Pass true for orthographic, false for perspective. The default
 * is orthographic.
 */
Camera.prototype.setOrthographic = function(ortho) {
    this.orthographic = ortho;
}
Camera.prototype.getOrthographic = function() {
    return this.orthographic;
}

/**
 * Set whether the projection preserves the aspect ratio of the
 * viewport.  Value is true or false; the default is true.
 */
Camera.prototype.setPreserveAspect = function(preserveAspect) {
    this.preserveAspect = preserveAspect;
}
Camera.prototype.getPreserveAspect = function() {
    return this.preserveAspect;
}

/**
* Set the limits of the view volume.  The limits are set with respect to the
* viewing coordinates.  That is, the view center is assumed to be at the point
* (0,0) in the plane of the screen.  The view up vector (more precisely, its projection
* onto the screen) points upwards on the screen.  The z-axis is perpendicular to the
* screen, with the positive direction of the z-axis pointing out of the screen.
* In this coordinate system, xmin and xmax give the horizontal limits on the screen,
* ymin and ymax give the vertical limits on the screen, and zmin and zmax give
* the limits of the view volume along the z-axis.  (Note that this is NOT exactly
* the same as the parameters in either glOrtho or glFrustum!  Most important to 
* note is that zmin and zmax are given with reference to the view center, not the
* eye.)  Note that xmin/xmax or ymin/ymax might be adjusted to match the aspect
* ratio of the display area.
*/
Camera.prototype.setLimits = function (xmin, xmax, ymin, ymax, zmin, zmax) {
   if (arguments.length != 6) {
       GLSim.error("seLimits requires six parameters"); return;
   }
   this.xminRequested = this.xminActual = xmin;
   this.xmaxRequested = this.xmaxActual = xmax;
   this.yminRequested = this.yminActual = ymin;
   this.ymaxRequested = this.ymaxActual = ymax;
   this.zmin = zmin;
   this.zmax = zmax;
}
   
/**
* A convenience method for calling setLimits(-limit,limit,-limit,limit,-2*limit,2*limit)
*/
Camera.prototype.setScale = function (limit) {
    if (arguments.length != 1 || !(typeof limit == "number") || limit == 0) {
        GLSim.error("setScale requires one non-zero numeric parameter"); return;
    }
    this.setLimits(-limit,limit,-limit,limit,-2*limit,2*limit);
}
   
/**
* Returns the view limits.  The return value is an array that contains the same data as
* the parameters to setLimits().  Note that the returned values included the
* originally requested xmin/xmax and ymin/ymax, and NOT values that have been
* adjusted to reflect the aspect ratio of the display area.
*/
Camera.prototype.getLimits = function() {
   return [ this.xminRequested, this.xmaxRequested, this.yminRequested, 
                                 this.ymaxRequested, this.zmin, this.zmax ];
}

/**
* Returns the actual xmin, xmax, ymin, ymax limits that were used when the apply
* method was most recently called.  These are the limits after they were, possibly,
* adjusted to match the aspect ratio of the display.  If apply has not been called
* since the limits were set, then the return value contains the unadjusted, requested
* limits.
*/
Camera.prototype.getActualXYLimits = function() {
   return [ this.xminActual, this.xmaxActual, this.yminActual, this.ymaxActual ];
}

/**
* Set the information for the viewing transformation.  The view will be set
* in the apply method with a call to
* gluLookAt(eyeX,eyeY,eyeZ,viewCenterX,viewCenterY,viewCenterZ,viewUpX,viewUpY,viewUpZ)
* If the viewUp paramters are omitted, they are set to (0,1,0).
* if the viewCenter parameters are omitted, they are set to (0,0,0).
* The eye parameters are not optional.
*/
Camera.prototype.lookAt = function (eyeX, eyeY, eyeZ,
                    viewCenterX, viewCenterY, viewCenterZ,
                    viewUpX, viewUpY, viewUpZ) {
    this.eyex = eyeX;
    this.eyey = eyeY;
    this.eyez = eyeZ;
    if (arguments.length < 6) {
        this.refx = 0;
        this.refy = 0;
        this.refz = 0;
    }
    else {
        this.refx = viewCenterX;
        this.refy = viewCenterY;
        this.refz = viewCenterZ;
    }
    if (arguments.length < 9) {
        this.upx = 0;
        this.upy = 1;
        this.upz = 0;
    }
    else {
        this.upx = viewUpX;
        this.upy = viewUpY;
        this.upz = viewUpZ;
    }
}

/**
* Returns the view information -- the 9 parameters of lookAt(), in an array.
*/
Camera.prototype.getViewParameters = function() {
    return [ this.eyex, this.eyey, this.eyez, this.refx, this.refy, this.refz,
                                                        this.upx, this.upy, this.upz ];
}

/**
* Apply the camera to the current GLSim context.  This method completely replaces the
* projection and the modelview transformation in the context.  It sets these
* transformations to the identity and then applies the view and projection
* represented by the camera.  This method is meant to be called at the begining
* of the display method and should replace any other means of setting the
* projection and view.
*/
Camera.prototype.apply = function apply() {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    this.xminActual = this.xminRequested;
    this.xmaxActual = this.xmaxRequested;
    this.yminActual = this.yminRequested;
    this.ymaxActual = this.ymaxRequested;
    if (this.preserveAspect) {
       var viewport = GLSim.currentContext.gl.getParameter(GLSim.currentContext.gl.VIEWPORT);
       var viewWidth = viewport[2];
       var viewHeight = viewport[3];
       var windowWidth = this.xmaxActual - this.xminActual;
       var windowHeight = this.ymaxActual - this.yminActual;
       var aspect = viewHeight / viewWidth;
       var desired = windowHeight / windowWidth;
       if (desired > aspect) { //expand width
           var extra = (desired / aspect - 1.0) * (this.xmaxActual - this.xminActual) / 2.0;
           this.xminActual -= extra;
           this.xmaxActual += extra;
       } else if (aspect > desired) { // expand height
           var extra = (aspect / desired - 1.0) * (this.ymaxActual - this.yminActual) / 2.0;
           this.yminActual -= extra; 
           this.ymaxActual += extra;
       }
    }
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    var viewDistance = Math.sqrt( (this.refx-this.eyex)*(this.refx-this.eyex) +
                     (this.refy-this.eyey)*(this.refy-this.eyey) +
                     (this.refz-this.eyez)*(this.refz-this.eyez) );
    if (this.orthographic) {
        glOrtho(this.xminActual, this.xmaxActual, this.yminActual, this.ymaxActual, 
                                          viewDistance-this.zmax, viewDistance-this.zmin);
    }
    else {
        var near = viewDistance-this.zmax;
        if (near < 0.1)
           near = 0.1;
        var centerx = (this.xminActual + this.xmaxActual) / 2;
        var centery = (this.yminActual + this.ymaxActual) / 2;
        var newwidth = (near / viewDistance) * (this.xmaxActual - this.xminActual);
        var newheight = (near / viewDistance) * (this.ymaxActual - this.yminActual);
        var x1 = centerx - newwidth / 2;
        var x2 = centerx + newwidth / 2;
        var y1 = centery - newheight / 2;
        var y2 = centery + newheight / 2;
        glFrustum(x1, x2, y1, y2, near, viewDistance-this.zmin);
    }
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    gluLookAt(this.eyex, this.eyey, this.eyez, this.refx, this.refy, this.refz,
                                                        this.upx, this.upy, this.upz);
}

/**
 * Installs a trackball rotator for the camera in the current GLSim context.
 * The user can drag the mouse on the canvas to rotate the view.  The eye and
 * viewup vectors specified in Camera.lookAt are modified to implement the rotation.
 * The displayCallback should be a function that is to be called each time the
 * view has been changed.  Ordinarily, it is a display routine that calls
 * Camera.apply and then draws the scene.
 */
Camera.prototype.installTrackball = function(displayCallback) {
    if (!GLSim.currentContext) { GLSim.error("No OpenGL context"); return; }
    var gl = GLSim.currentContext.gl;
    var canvas = GLSim.currentContext.canvas;
    var me = this;
    canvas.addEventListener("mousedown",doMouseDown,false);
    canvas.addEventListener("touchstart",doTouchStart,false);
    function norm(v0, v1, v2) {
        var x = v0*v0 + v1*v1 + v2*v2;
        return Math.sqrt(x);
    }
    function normalize(v) {
        var n = norm(v[0],v[1],v[2]);
        v[0] /= n;
        v[1] /= n;
        v[2] /= n;
    }
    function reflectInAxis(axis, source, destination) {
        var s = 2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
        destination[0] = s * axis[0] - source[0];
        destination[1] = s * axis[1] - source[1];
        destination[2] = s * axis[2] - source[2];
    }
    function transformToViewCoords(v, x, y, z, out) {
       out[0] = v[0]*x[0] + v[1]*y[0] + v[2]*z[0];
       out[1] = v[0]*x[1] + v[1]*y[1] + v[2]*z[1];
       out[2] = v[0]*x[2] + v[1]*y[2] + v[2]*z[2];
    }
    function applyTransvection(from, to) {
        // rotate vector e1 onto e2; must be 3D *UNIT* vectors.
        var zDirection = [me.eyex - me.refx, me.eyey - me.refy, me.eyez - me.refz];
        var viewDistance = norm(zDirection[0],zDirection[1],zDirection[2]);
        normalize(zDirection);
        var yDirection = [me.upx, me.upy, me.upz];
        var upLength = norm(yDirection[0],yDirection[1],yDirection[2]);
        var proj = yDirection[0]*zDirection[0] + yDirection[1]*zDirection[1] + yDirection[2]*zDirection[2];
        yDirection[0] = yDirection[0] - proj*zDirection[0];
        yDirection[1] = yDirection[1] - proj*zDirection[1];
        yDirection[2] = yDirection[2] - proj*zDirection[2];
        normalize(yDirection);
        var xDirection = [yDirection[1]*zDirection[2] - yDirection[2]*zDirection[1],
                yDirection[2]*zDirection[0] - yDirection[0]*zDirection[2],
                yDirection[0]*zDirection[1] - yDirection[1]*zDirection[0] ];
        var temp = new Array(3), e1 = new Array(3), e2 = new Array(3);
        transformToViewCoords(from, xDirection, yDirection, zDirection, e1);
        transformToViewCoords(to, xDirection, yDirection, zDirection, e2);
        var e = [e1[0] + e2[0], e1[1] + e2[1], e1[2] + e2[2]];
        normalize(e);
        reflectInAxis(e, zDirection, temp);
        reflectInAxis(e1, temp, zDirection);
        reflectInAxis(e, xDirection, temp);
        reflectInAxis(e1, temp, xDirection);
        reflectInAxis(e, yDirection, temp);
        reflectInAxis(e1, temp, yDirection);
        me.eyex = me.refx + viewDistance * zDirection[0];
        me.eyey = me.refy + viewDistance * zDirection[1];
        me.eyez = me.refz + viewDistance * zDirection[2];
        me.upx = upLength * yDirection[0];
        me.upy = upLength * yDirection[1];
        me.upz = upLength * yDirection[2];
    }
    var dragging = false;
    var prevRay = new Array(3);
    var viewport;
    var touchStarted = false;
    function mousePointToRay(x, y, out) {
       var dx, dy, dz, len;
       var centerX = viewport[2]/2;
       var centerY = viewport[3]/2;
       var scale = 0.8*( centerX < centerY ? centerX : centerY );
       dx = (x - centerX);
       dy = (centerY - y);
       len = Math.sqrt(dx*dx + dy*dy);
       if (len >= scale)
          dz = 0;
       else
          dz = Math.sqrt( scale*scale - dx*dx - dy*dy );
       var length = Math.sqrt(dx*dx + dy*dy + dz*dz);
       out[0] = dx/length;
       out[1] = dy/length;
       out[2] = dz/length;
    }
    function doMouseDown(evt) {
       if (dragging)
          return;
       dragging = true;
       viewport = gl.getParameter(gl.VIEWPORT);
       var box = canvas.getBoundingClientRect();
       var x = evt.clientX - box.left;
       var y = evt.clientY - box.top;
       mousePointToRay(x,y,prevRay);
       document.addEventListener("mousemove", doMouseDrag, false);
       document.addEventListener("mouseup", doMouseUp, false);
    }
    function doMouseUp(evt) {
        if (!dragging)
           return;
        dragging = false;
        document.removeEventListener("mousemove", doMouseDrag, false);
        document.removeEventListener("mouseup", doMouseUp, false);
    }
   function doMouseDrag(evt) {
       if ( ! dragging)
          return;
       var box = canvas.getBoundingClientRect();
       var x = evt.clientX - box.left;
       var y = evt.clientY - box.top;
       var thisRay = new Array(3);
       mousePointToRay(x, y, thisRay);
       applyTransvection(prevRay, thisRay);
       prevRay[0] = thisRay[0];
       prevRay[1] = thisRay[1];
       prevRay[2] = thisRay[2];
       if (displayCallback) {
           displayCallback();
       }
    }
    function doTouchStart(evt) {
        if (evt.touches.length != 1) {
           doTouchCancel();
           return;
        }
        evt.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = evt.touches[0].clientX - r.left;
        var y = evt.touches[0].clientY - r.top;
        viewport = gl.getParameter(gl.VIEWPORT);
        mousePointToRay(x,y,prevRay);
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
        var thisRay = new Array(3);
        mousePointToRay(x, y, thisRay);
        applyTransvection(prevRay, thisRay);
        prevRay[0] = thisRay[0];
        prevRay[1] = thisRay[1];
        prevRay[2] = thisRay[2];
        if (displayCallback) {
            displayCallback();
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
