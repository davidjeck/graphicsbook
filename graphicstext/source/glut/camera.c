
/* The documentation for camera is in the header file, camera.h. */

#include <GL/gl.h>
#include <GL/glu.h>
#include <GL/glut.h>
#include <math.h>

// NOTE: the "static" modifier means that the variable or function is private to this file.

   static double eyex = 0, eyey = 0, eyez = 30;
   static double refx = 0, refy = 0, refz = 0;
   static double upx = 0, upy = 1, upz = 0;
   
   static double xminRequested = -5, xmaxRequested = 5;
   static double yminRequested = -5, ymaxRequested = 5;
   static double zmin = -10, zmax = 10;
   static int orthographic = 0;
   static int preserveAspect = 1;
   
   static double xminActual, xmaxActual, yminActual, ymaxActual;
   
   void cameraSetOrthographic(int ortho) {
      orthographic = ortho;
   }

   void cameraSetPreserveAspect(int preserve) {
      preserveAspect = preserve;
   }

   void cameraSetLimits(double xmin, double xmax, double ymin, double ymax, double zmin1, double zmax1) {
      xminRequested = xminActual = xmin;
      xmaxRequested = xmaxActual = xmax;
      yminRequested = yminActual = ymin;
      ymaxRequested = ymaxActual = ymax;
      zmin = zmin1;
      zmax = zmax1;
   }
   
   void cameraSetScale(double limit) {
      cameraSetLimits(-limit,limit,-limit,limit,-2*limit,2*limit);
   }
   
   void cameraLookAt(double eyeX, double eyeY, double eyeZ,
                        double viewCenterX, double viewCenterY, double viewCenterZ,
                        double viewUpX, double viewUpY, double viewUpZ) {
      eyex = eyeX;
      eyey = eyeY;
      eyez = eyeZ;
      refx = viewCenterX;
      refy = viewCenterY;
      refz = viewCenterZ;
      upx = viewUpX;
      upy = viewUpY;
      upz = viewUpZ;
   }

    static double norm(double v0, double v1, double v2) {
        double norm2 = v0*v0 + v1*v1 + v2*v2;
        return sqrt(norm2);
    }

    static void normalize(double v[]) {
        double n = norm(v[0],v[1],v[2]);
        v[0] /= n;
        v[1] /= n;
        v[2] /= n;
    }

   void cameraApply() {
        int viewport[4];
        glGetIntegerv(GL_VIEWPORT, viewport);
        xminActual = xminRequested;
        xmaxActual = xmaxRequested;
        yminActual = yminRequested;
        ymaxActual = ymaxRequested;
        if (preserveAspect) {
           double viewWidth = viewport[2];
           double viewHeight = viewport[3];
           double windowWidth = xmaxActual - xminActual;
           double windowHeight = ymaxActual - yminActual;
           double aspect = viewHeight / viewWidth;
           double desired = windowHeight / windowWidth;
           if (desired > aspect) { //expand width
               double extra = (desired / aspect - 1.0) * (xmaxActual - xminActual) / 2.0;
               xminActual -= extra;
               xmaxActual += extra;
           } else if (aspect > desired) {
               double extra = (aspect / desired - 1.0) * (ymaxActual - yminActual) / 2.0;
               yminActual -= extra; 
               ymaxActual += extra;
           }
        }
        glMatrixMode(GL_PROJECTION);
        glLoadIdentity();
        double viewDistance = norm(refx-eyex, refy-eyey, refz-eyez);
        if (orthographic) {
            glOrtho(xminActual, xmaxActual, yminActual, ymaxActual, viewDistance-zmax, viewDistance-zmin);
        }
        else {
            double near = viewDistance-zmax;
            if (near < 0.1)
               near = 0.1;
            double centerx = (xminActual + xmaxActual) / 2;
            double centery = (yminActual + ymaxActual) / 2;
            double newwidth = (near / viewDistance) * (xmaxActual - xminActual);
            double newheight = (near / viewDistance) * (ymaxActual - yminActual);
            double x1 = centerx - newwidth / 2;
            double x2 = centerx + newwidth / 2;
            double y1 = centery - newheight / 2;
            double y2 = centery + newheight / 2;
            glFrustum(x1, x2, y1, y2, near, viewDistance-zmin);
        }
        glMatrixMode(GL_MODELVIEW);
        glLoadIdentity();
        gluLookAt(eyex, eyey, eyez, refx, refy, refz, upx, upy, upz);
   }

    static void reflectInAxis(double axis[], double source[], double destination[]) {
        double s = 2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
        destination[0] = s * axis[0] - source[0];
        destination[1] = s * axis[1] - source[1];
        destination[2] = s * axis[2] - source[2];
    }
    
    static void transformToViewCoords(double v[], double x[], double y[], double z[], double out[]) {
       out[0] = v[0]*x[0] + v[1]*y[0] + v[2]*z[0];
       out[1] = v[0]*x[1] + v[1]*y[1] + v[2]*z[1];
       out[2] = v[0]*x[2] + v[1]*y[2] + v[2]*z[2];
    }

   static void applyTransvection(double from[3], double to[3]) {
        // rotate vector e1 onto e2; must be 3D *UNIT* vectors.
        double zDirection[3] = {eyex - refx, eyey - refy, eyez - refz};
        double viewDistance = norm(zDirection[0],zDirection[1],zDirection[2]);
        normalize(zDirection);
        double yDirection[3] = {upx, upy, upz};
        double upLength = norm(yDirection[0],yDirection[1],yDirection[2]);
        double proj = yDirection[0]*zDirection[0] + yDirection[1]*zDirection[1] + yDirection[2]*zDirection[2];
        yDirection[0] = yDirection[0] - proj*zDirection[0];
        yDirection[1] = yDirection[1] - proj*zDirection[1];
        yDirection[2] = yDirection[2] - proj*zDirection[2];
        normalize(yDirection);
        double xDirection[3] = {yDirection[1]*zDirection[2] - yDirection[2]*zDirection[1],
                yDirection[2]*zDirection[0] - yDirection[0]*zDirection[2],
                yDirection[0]*zDirection[1] - yDirection[1]*zDirection[0] };
        double temp[3], e1[3], e2[3];
        transformToViewCoords(from, xDirection, yDirection, zDirection, e1);
        transformToViewCoords(to, xDirection, yDirection, zDirection, e2);
        double e[3] = {e1[0] + e2[0], e1[1] + e2[1], e1[2] + e2[2]};
        normalize(e);
        reflectInAxis(e, zDirection, temp);
        reflectInAxis(e1, temp, zDirection);
        reflectInAxis(e, xDirection, temp);
        reflectInAxis(e1, temp, xDirection);
        reflectInAxis(e, yDirection, temp);
        reflectInAxis(e1, temp, yDirection);
        eyex = refx + viewDistance * zDirection[0];
        eyey = refy + viewDistance * zDirection[1];
        eyez = refz + viewDistance * zDirection[2];
        upx = upLength * yDirection[0];
        upy = upLength * yDirection[1];
        upz = upLength * yDirection[2];
   }
   
   static int dragging = 0;
   static int dragButton;
   static double prevRay[3];

   static void mousePointToRay(int x, int y, double out[3]) {
      double dx, dy, dz, len;
      int centerX = glutGet(GLUT_WINDOW_WIDTH)/2;
      int centerY = glutGet(GLUT_WINDOW_HEIGHT)/2;
      double scale = 0.8*( centerX < centerY ? centerX : centerY );
      dx = (x - centerX);
      dy = (centerY - y);
      len = sqrt(dx*dx + dy*dy);
      if (len >= scale)
         dz = 0;
      else
         dz = sqrt( scale*scale - dx*dx - dy*dy );
      double length = sqrt(dx*dx + dy*dy + dz*dz);
      out[0] = dx/length;
      out[1] = dy/length;
      out[2] = dz/length;
   }

   void trackballMouseFunction(int button, int buttonState, int x, int y) {
       if (button != GLUT_LEFT_BUTTON) {
           return;
       }
       if (buttonState == GLUT_DOWN) {  // a mouse button was pressed
           if (dragging)
              return;  // ignore a second button press during a draw operation
           dragging = 1;  // Might not want to do this in all cases
           dragButton = button;
           mousePointToRay(x,y,prevRay);
       }
       else {  // a mouse button was released
           if ( ! dragging || button != dragButton )
               return; // this mouse release does not end a drag operation
           dragging = 0;
       }
   }
   
   void trackballMotionFunction(int x, int y) {
      if ( ! dragging)
         return;
      double thisRay[3];
      mousePointToRay(x, y, thisRay);
      applyTransvection(prevRay, thisRay);
      prevRay[0] = thisRay[0];
      prevRay[1] = thisRay[1];
      prevRay[2] = thisRay[2];
      glutPostRedisplay();
   }

