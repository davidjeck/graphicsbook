
/* A framework for writing simple 3D applications with GLUT, with
 * support for animation, for mouse and keyboard events, and for a
 * menu.  Note that you need to uncomment some lines in main() and
 * initGL() to enable various features.  Drawing code must be
 * added to display().  See lines marked with "TODO".  See the
 * GLUT documentation at 
 *    www.opengl.org/resources/libraries/glut/spec3/node1.html
 * or the FreeGLUT documentation at
 *    freeglut.sourceforge.net/docs/api.php
 *
 *    This program must be linked to the GL and glut libraries.  
 * For example, in Linux with the gcc compiler:
 *
 *        gcc -o executableProg glut-starter.c -lGL -lglut
 */

#include <GL/gl.h>
#include <GL/glut.h>   // Consider using freeglut.h instead, if available.
#include <stdio.h>     // (Used only for some information messages to standard out.)
#include <stdlib.h>    // (Used only for exit() function.)

// --------------------------------- global variables --------------------------------

int width, height;   // Size of the drawing area, to be set in reshape().

int frameNumber = 0;     // For use in animation.


// ------------------------ OpenGL initialization and rendering -----------------------

/* initGL() is called just once, by main(), to do initialization of OpenGL state
 * and other global state.
 */
void initGL() {
      
    glClearColor(0.0, 0.0, 0.0, 1.0); // background color

    glEnable(GL_DEPTH_TEST);  // Required for 3D drawing, not usually for 2D.
    
    // TODO: Uncomment the following 4 lines to do some typical initialization for 
    // lighting and materials.

    // glEnable(GL_LIGHTING);        // Enable lighting.
    // glEnable(GL_LIGHT0);          // Turn on a light.  By default, shines from direction of viewer.
    // glEnable(GL_NORMALIZE);       // OpenGL will make all normal vectors into unit normals
    // glEnable(GL_COLOR_MATERIAL);  // Material ambient and diffuse colors can be set by glColor*

}  // end initGL()


/* display() is set up in main() as the function that is called when the window is
 * first opened, when glutPostRedisplay() is called, and possibly at other times when
 * the window needs to be redrawn.  Usually it will redraw the entire contents of
 * the window.  (Drawing can also be done in other functions, but usually only when
 * single buffer mode is used.  The projection is often set up in intiGL() or reshape()
 * instead of in display().)
 */
void display() {
        // called whenever the display needs to be redrawn

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);  // For 2D, usually leave out the depth buffer.
    
    glMatrixMode(GL_PROJECTION);   // Set up a simple orthographic projection, ignoring aspect ratio.
    glLoadIdentity();              //    TODO:  should almost certainly use a different projection!
    glOrtho(-1, 1, -1, 1, -2, 2);
    glMatrixMode(GL_MODELVIEW);
    
    glLoadIdentity();             // Start with no modeling transform. 
        
    // TODO: INSERT DRAWING CODE HERE
    
    glutSwapBuffers();  // (Required for double-buffered drawing.)
                        // (For GLUT_SINGLE display mode, use glFlush() instead.)
}


/* reshape() is set up in main() as the functin that is called when the window changes size.
 * It is also called when the window is first opened.  The parameters give the size of
 * the drawing area.  If no reshape function is provided, the default is to set the
 * viewport to match the size of the drawing area.
 */
void reshape(int w, int h) {
    width = w;   // Save width and height for possible use elsewhere.
    height = h;
    glViewport(0,0,width,height);  // If you have a reshape function, you MUST call glViewport!
    // TODO: INSERT ANY OTHER CODE TO ACCOUNT FOR WINDOW SIZE (maybe set projection here).
    printf("Reshaped to width %d, height %d\n", width, height);
}


// --------------- support for animation ------------------------------------------

/* You can call startAnimation() to run an animation.  A frame will be drawn every
 * 30 milliseconds (can be changed in the call to glutTimerFunc.  The global frameNumber
 * variable will be incremented for each frame.  Call pauseAnimation() to stop animating.
 */

int animating = 0;      // 0 or 1 to indicate whether an animation is in progress;
                        // do not change directly; call startAnimation() and pauseAnimation()

void updateFrame() {
      // this is called before each frame of the animation.
   // TODO: INSERT CODE TO UPDATE DATA USED IN DRAWING A FRAME
   frameNumber++;
   printf("frame number %d\n", frameNumber);
}

void timerFunction(int timerID) {
      // used for animation; do not call this directly
    if (animating) {
        updateFrame();
        glutTimerFunc(30, timerFunction, 0);  // Next frame in 30 milliseconds.
        glutPostRedisplay(); // Causes display() to be called.
    }
}

void startAnimation() {
      // call this to start or restart the animation
   if ( ! animating ) {
       animating = 1;
       glutTimerFunc(30, timerFunction, 0);
   }
}

void pauseAnimation() {
       // call this to pause the animation
    animating = 0;
}


// --------------- keyboard event functions ---------------------------------------

/* charTyped() is set up in main() to be called when the user types a character.
 * The ch parameter is an actual character such as 'A', '7', or '@'.  The parameters
 * x and y give the mouse position, in pixel coordinates, when the character was typed,
 * with (0,0) at the UPPER LEFT.
 */
void charTyped(unsigned char ch, int x, int y) {
    // TODO: INSERT CHARACTER-HANDLING CODE
    glutPostRedisplay();  // Causes display() to be called.
    printf("User typed %c with ASCII code %d, mouse at (%d,%d)\n", ch, ch, x, y);
}


/* specialKeyPressed() is set up in main() to be called when the user presses certaub keys
 * that do NOT type an actual character, such as an arrow or function key.  The
 * key parameter is a GLUT constant such as GLUT_KEY_LEFT, GLUT_KEY_RIGHT,
 * GLUT_KEY_UP and GLUT_KEY_DOWN for the arrow keys; GLUT_KEY_HOME for the home key,
 * and GLUT_KEY_F1 for a funtion key.  Note that escape, backspace, and delete are
 * considered to be characters and result in a call to charTyped.  The x and y
 * parameters give the mouse position when the key was pressed.
 */
void specialKeyPressed(int key, int x, int y) {
    // TODO: INSERT KEY-HANDLING CODE
    glutPostRedisplay();  // Causes display() to be called.
    printf("User pressed special key with code %d; mouse at (%d,%d)\n", key, x, y);
}


// --------------- mouse event functions with some typical support code for dragging -----------------

int dragging;        // 0 or 1 to indicate whether a drag operation is in progress
int dragButton;      // which button started the drag operation
int startX, startY;  // mouse position at start of drag
int prevX, prevY;    // previous mouse position during drag

/*  mouseUpDown() is set up in main() to be called when the user presses or releases
 *  a mutton ont he mouse.  The button paramter is one of the contants GLUT_LEFT_BUTTON,
 *  GLUT_MIDDLE_BUTTON, or GLUT_RIGHT_BUTTON.  The buttonState is GLUT_UP or GLUT_DOWN and
 *  tells whether this is a mouse press or a mouse release event.  x and y give the
 *  mouse position in pixel coordinates, with (0,0) at the UPPER LEFT.
 */
void mouseUpOrDown(int button, int buttonState, int x, int y) {
       // called to respond to mouse press and mouse release events
   if (buttonState == GLUT_DOWN) {  // a mouse button was pressed
       if (dragging)
          return;  // Ignore a second button press during a draw operation.
       // TODO:  INSERT CODE TO RESPOND TO MOUSE PRESS
       dragging = 1;  // Might not want to do this in all cases
       dragButton = button;
       startX = prevX = x;
       startY = prevY = y;
       printf("Mouse button %d down at (%d,%d)\n", button, x, y);
   }
   else {  // a mouse button was released
       if ( ! dragging || button != dragButton )
           return; // this mouse release does not end a drag operation.
       dragging = 0;
       // TODO:  INSERT CODE TO CLEAN UP AFTER THE DRAG (generally not needed)
       printf("Mouse button %d up at (%d,%d)\n", button, x, y);
   }
}

/*  mouseDragged() is set up in main() to be called when the user moves the mouse,
 *  but only when one or more mouse buttons are pressed.  x and y give the position
 *  of the mouse in pixel coordinates.
 */
void mouseDragged(int x, int y) {
        // called to respond when the mouse moves during a drag
    if ( ! dragging )
        return;  // This is not part of a drag that we want to respond to.
    // TODO:  INSERT CODE TO RESPOND TO NEW MOUSE POSITION
    prevX = x;
    prevY = y;
    printf("Mouse dragged to (%d,%d)\n", x, y);
}


// ------------------------------- Menu support ----------------------------------

/* A function to be called when the user selects a command from the menu.  The itemCode
 * is the value that was associated with the command in the call to glutAddMenuEntry()
 * that added the command to the menu.
 */
void doMenu( int itemCode ) {
   if (itemCode == 1) {
       exit(0);
   }
   // TODO: Add support for other commands.
}

/* createMenu() is called in main to add a pop-up menu to the window.  The menu
 * pops up when the user right-clicks the display.
 */
void createMenu() {
   glutCreateMenu(doMenu); // doMenu() will be called when the user selects a command from the menu.
   
   glutAddMenuEntry("Quit", 1);  // Add a command named "Quit" to the menu with item code = 1.
                                 // The code will be passed as a parameter to doMenu() when
                                 // the user selects this command from the menu.
                                 
   // TODO: Add additional menu items.  (It is also possible to have submenus.)
                                
   glutAttachMenu(GLUT_RIGHT_BUTTON);  // Menu will appear when user RIGHT-clicks the display.
}

// ----------------- main routine -------------------------------------------------

int main(int argc, char** argv) {
    glutInit(&argc, argv); // Allows processing of certain GLUT command line options
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);  // Usually, omit GLUT_DEPTH for 2D drawing!
    glutInitWindowSize(500,500);        // size of display area, in pixels
    glutInitWindowPosition(100,100);    // location in window coordinates
    glutCreateWindow("OpenGL Program"); // parameter is window title  
    glutDisplayFunc(display);           // call display() when the window needs to be redrawn
    glutReshapeFunc(reshape);           // call reshape() when the size of the window changes

    /* TODO: Uncomment one or both of the next two lines for keyboard event handling. */
    //glutKeyboardFunc(charTyped);        // call charTyped() when user types a character
    //glutSpecialFunc(specialKeyPressed); // call specialKeyPressed() when user presses a special key

    /* TODO: Uncomment the next line to handle mouse presses; the next two for mouse dragging. */
    //glutMouseFunc(mouseUpOrDown);       // call mouseUpOrDown() for mousedown and mouseup events
    //glutMotionFunc(mouseDragged);       // call mouseDragged() when mouse moves, only during a drag gesture
    
    /* TODO: Uncomment the next line to add a popup menu */
    //createMenu();

    /* TODO: Uncomment the next line to start a timer-controlled animation. */
    //startAnimation();
    
    glutMainLoop(); // Run the event loop!  This function does not return.
    return 0;
}
