/*
 *  As a first example of using OpenGL in C, this program draws the
 *  classic red/green/blue triangle.  It uses the default OpenGL
 *  coordinate system, in which x, y, and z are limited to the range
 *  -1 to 1, and the positive z-axis points into the screen.  Note
 *  that this coordinate system is hardly ever used in practice.
 *
 *  When compiling this program, you must link it to the OpenGL library
 *  and to the glut library.  For example, the following command might
 *  work on MacOS with XCode developer tools installed:
 *
 *     clang -DGL_SILENCE_DEPRECATION -o first-triangle first-triangle.c -framework OpenGL -framework GLUT
 */
 
#include <OpenGL/gl.h>     // On other platforms, this might be different, for example #include <GL/gl.h>
#include <GLUT/glut.h>     // On other platforms, this might be different, for example #include <GL/glut.h>
#include "pixel-scale.h"   // If the triangle only fills a small part of the window, modify this file.
 

void display() {  // Display function will draw the image.
 
    glClearColor( 0, 0, 0, 1 );  // (In fact, this is the default.)
    glClear( GL_COLOR_BUFFER_BIT );
    
    glBegin(GL_TRIANGLES);
    glColor3f( 1, 0, 0 ); // red
    glVertex2f( -0.8, -0.8 );
    glColor3f( 0, 1, 0 ); // green
    glVertex2f( 0.8, -0.8 );
    glColor3f( 0, 0, 1 ); // blue
    glVertex2f( 0, 0.9 );
    glEnd(); 
    
    glutSwapBuffers(); // Required to copy color buffer onto the screen.
 
}


void reshape(int width, int height) {
        // This will be called when the window opens and when the user
        // changes its size.  (PIXEL_SCALE is defined in pixel-scale.h
        // to try to account for high-resolutions displays in MacOS.)
     glViewport( 0, 0, width*PIXEL_SCALE, height*PIXEL_SCALE );
}


int main( int argc, char** argv ) {  // Initialize GLUT and 

    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE);    // Use single color buffer and no depth buffer.
    glutInitWindowSize(500,500);         // Size of display area, in pixels.
    glutInitWindowPosition(100,100);     // Location of window in screen coordinates.
    glutCreateWindow("GL RGB Triangle"); // Parameter is window title.
    glutDisplayFunc(display);            // Called when the window needs to be redrawn.
    glutReshapeFunc(reshape);
    
    glutMainLoop(); // Run the event loop!  This function does not return.
                    // Program ends when user closes the window.
    return 0;

}

