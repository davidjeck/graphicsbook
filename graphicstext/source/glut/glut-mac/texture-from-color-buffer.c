/*
 * Draws a 2D scene, reads it from the color buffer into a texture,
 * then uses a texture on a 3D object.  The scene can be animated.
 */
 
// On MacOS with XCode developer tools, compile using, for example:
//
//    clang -DGL_SILENCE_DEPRECATION -o colorbuffertex texture-from-color-buffer.c textured-shapes.c camera.c -framework OpenGL -framework GLUT

#include "OpenGL/gl.h"
#include "GLUT/glut.h"
#include "camera.h"
#include "textured-shapes.h"
#include "stdio.h"
#include "stdlib.h"
#include "math.h"
#include "pixel-scale.h"

const double PI = 3.141593654;

const int           // code numbers for the 8 objects that can be displayed
     SPHERE = 0,
     CYLINDER = 1,
     CONE = 2,
     CUBE = 3,
     TORUS = 4,
     TEAPOT = 5;
     
int frameNumber = 0;

int currentObject = 0;   // code number (0 to 5) for the texture used on the object

void draw2DFrame();

void renderFunction() {

    glDisable(GL_LIGHTING);    // settings for drawing 2D scene
    glDisable(GL_DEPTH_TEST);
    glDisable(GL_TEXTURE_2D);

    int viewPort[4];  // The current viewport; x and y will be 0.
    glGetIntegerv(GL_VIEWPORT, viewPort);
    int textureWidth, textureHeight;
    
    /* First, draw the 2D scene into the color buffer. */

    // Use a power-of-two texture image. Reset the viewport
    // for drawing the image to a power-of-two-size,
    // and use that size for the texture.
    textureWidth = 1024;
    while (textureWidth > viewPort[2])
        textureWidth /= 2;
    textureHeight = 512;
    while (textureWidth > viewPort[3])
        textureHeight /= 2;
    glViewport(0,0,textureWidth,textureHeight);
    draw2DFrame();
    glViewport(0, 0, viewPort[2], viewPort[3]);  // Restore the full viewpoint.

    if (currentObject == 6) {
        // Show the 2D image as it has been drawn into
        // the color buffer.
        glutSwapBuffers();
        return;
    }

    /* Grab the image from the color buffer for use as a 2D texture. */

    glCopyTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 
            0, 0, textureWidth, textureHeight, 0);

    /* Set up 3D viewing, enable 2D texture, and draw the object selected by the user. */

    glEnable(GL_DEPTH_TEST);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_TEXTURE_2D);
    float dimwhite[4] = { 0.4f, 0.4f, 0.4f };
    glLightfv(GL_LIGHT0, GL_SPECULAR, dimwhite);
    glLightModeli(GL_LIGHT_MODEL_COLOR_CONTROL, GL_SEPARATE_SPECULAR_COLOR); // Note: This is OpenGL 1.2

    /* Since we don't have mipmaps, we MUST set the MIN filter to a non-mipmaped
     * version; leaving the value at its default will produce no texturing at all! */
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);


    float white[4] = { 1, 1, 1, 1 };
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, white);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, white);
    glMateriali(GL_FRONT_AND_BACK, GL_SHININESS, 128);

    glClearColor(0,0,0,1);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    cameraApply();

    if (currentObject <= CONE)
        glRotated(90,-1,0,0);  // rotate axis of object from z-axis to y-axis
    if (currentObject == CONE || currentObject == CYLINDER)
        glTranslated(0,0,-0.5);  // moves center of object to the origin

    if (currentObject == SPHERE)
        uvSphere(0.5,64,32,1);  // higher res than uvSphere1() for better specular highlight
    else if (currentObject == CYLINDER)
        uvCylinder1();
    else if (currentObject == CONE)
        uvCone1();
    else if (currentObject == CUBE)
        cube1();
    else if (currentObject == TORUS)
        uvTorus1();
    else if (currentObject == TEAPOT) {
        glFrontFace(GL_CW);  // Teapot has non-standard front faces
                             // that don't work right with two-sided lighting.
                             // This reverses the usual test for front face.
        glutSolidTeapot(0.5);
        glFrontFace(GL_CCW);
    }

    glutSwapBuffers();
}


// --------------- support for animation ------------------------------------------

int animating = 0;      // 0 or 1 to indicate whether an animation is in progress;
                        // do not change directly; call startAnimation() and pauseAnimation()

void updateFrame() {
      // this is called before each frame of the animation.
   // TODO: INSERT CODE TO UPDATE DATA USED IN DRAWING A FRAME
   frameNumber++;
}

void timerFunction(int timerID) {
      // used for animation; do not call this directly
    if (animating) {
        updateFrame();
        glutTimerFunc(30, timerFunction, 0);
        glutPostRedisplay();
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

//---------------------- Keyboard handling -------------------------------------

void special(int key, int x, int y) {
         // responds when the user presses a special key.
         
    if ( key == GLUT_KEY_LEFT || key == GLUT_KEY_DOWN ) {
        currentObject--;
        if (currentObject < 0)
            currentObject = 6;
    }
    else if ( key == GLUT_KEY_RIGHT || key == GLUT_KEY_UP ) {
        currentObject++;
        if (currentObject > 6)
            currentObject = 0;
    }
    else if ( key == GLUT_KEY_HOME ) {
        currentObject = 0;
        cameraLookAt(0,0,30, 0,0,0, 0,1,0);
        frameNumber = 0;
    }
    glutPostRedisplay();
}

void key(unsigned char key, int x, int y) {
    if ( key == ' ' ) {
      if (animating)
          pauseAnimation();
      else
          startAnimation();
    }
}

// ----------------- A Menu ---------------------------------------------------

void doMenu(int value) {
   if (value == 10) {
      if (animating)
          pauseAnimation();
      else
          startAnimation();
   }
   else if (value == 11) {
       exit(0);
   }
   else {
      currentObject = value;
      glutPostRedisplay();
   }
}

void createMenu() {
    int menu = glutCreateMenu(doMenu);
    glutAddMenuEntry("Toggle Animation (A key)", 10);
    glutAddMenuEntry("Show Sphere", SPHERE);
    glutAddMenuEntry("Show Cylinder", CYLINDER);
    glutAddMenuEntry("Show Cone", CONE);
    glutAddMenuEntry("Show Cube", CUBE);
    glutAddMenuEntry("Show Toruns", TORUS);
    glutAddMenuEntry("Show Teapot", TEAPOT);
    glutAddMenuEntry("SHOW 2D SCENE", 6);
    glutAddMenuEntry("EXIT", 11);
    glutAttachMenu(GLUT_RIGHT_BUTTON);
}


// ------------------ Draw the 2D scene that will be used as a texture ---------

/**
 * Draw a 32-sided regular polygon as an approximation for a circular disk.
 * (This is necessary since OpenGL has no commands for drawing ovals, circles,
 * or curves.)  The disk is centered at (0,0) with a radius given by the 
 * parameter.
 */
void drawDisk(double radius) {
    int d;
    glBegin(GL_POLYGON);
    for (d = 0; d < 32; d++) {
        double angle = 2*PI/32 * d;
        glVertex2d( radius*cos(angle), radius*sin(angle));
    }
    glEnd();
}

/**
 * Draw a sun with radius 0.5 centered at (0,0).  There are also 13 rays which
 * extend outside from the sun for another 0.25 units.
 */
void drawSun() {
    int i;
    glColor3f(1,1,0);
    for (i = 0; i < 13; i++) { // Draw 13 rays, with different rotations.
        glRotatef( 360.0 / 13, 0, 0, 1 ); // Note that the rotations accumulate!
        glBegin(GL_LINES);
        glVertex2f(0, 0);
        glVertex2f(0.75f, 0);
        glEnd();
    }
    drawDisk( 0.5);
    glColor3f(0,0,0);
}

/**
 * Draw a windmill, consisting of a pole and three vanes.  The pole extends from the
 * point (0,0) to (0,3).  The vanes radiate out from (0,3).  A rotation that depends
 * on the frame number is applied to the whole set of vanes, which causes the windmill
 * to rotate as the animation proceeds.  Note that this method changes the current
 * transform in the GL context gl!  The caller of this subroutine should take care
 * to save and restore the original transform, if necessary.
 */
void drawWindmill() {
    int i;
    glColor3f(0.8f, 0.8f, 0.9f);
    glBegin(GL_POLYGON);
    glVertex2f(-0.05f, 0);
    glVertex2f(0.05f, 0);
    glVertex2f(0.05f, 3);
    glVertex2f(-0.05f, 3);
    glEnd();
    glTranslatef(0, 3, 0);
    glRotated(frameNumber * (180.0/46), 0, 0, 1);
    glColor3f(0.4f, 0.4f, 0.8f);
    for (i = 0; i < 3; i++) {
        glRotated(120, 0, 0, 1);  // Note: These rotations accumulate.
        glBegin(GL_POLYGON);
        glVertex2f(0,0);
        glVertex2f(0.5f, 0.1f);
        glVertex2f(1.5f,0);
        glVertex2f(0.5f, -0.1f);
        glEnd();
    }
}

/**
 * Draw a wheel, centered at (0,0) and with radius 1. The wheel has 15 spokes
 * that rotate in a clockwise direction as the animation proceeds.
 */
void drawWheel() {
    int i;
    glColor3f(0,0,0);
    drawDisk(1);
    glColor3f(0.75f, 0.75f, 0.75f);
    drawDisk(0.8);
    glColor3f(0,0,0);
    drawDisk(0.2);
    glRotatef(frameNumber*20,0,0,1);
    glBegin(GL_LINES);
    for (i = 0; i < 15; i++) {
        glVertex2f(0,0);
        glVertex2d(cos(i*2*PI/15), sin(i*2*PI/15));
    }
    glEnd();
}

/**
 * Draw a cart consisting of a rectangular body and two wheels.  The wheels
 * are drawn by the drawWheel() method; a different translation is applied to each
 * wheel to move them into position under the body.  The body of the cart
 * is a red rectangle with corner at (0,-2.5), width 5, and height 2.  The
 * center of the bottom of the rectangle is at (0,0).
 */
void drawCart() {
    glPushMatrix();
    glTranslatef(-1.5f, -0.1f, 0);
    glScalef(0.8f,0.8f,1);
    drawWheel();
    glPopMatrix();
    glPushMatrix();
    glTranslatef(1.5f, -0.1f, 0);
    glScalef(0.8f,0.8f,1);
    drawWheel();
    glPopMatrix();
    glColor3f(1,0,0);
    glBegin(GL_POLYGON);
    glVertex2f(-2.5f,0);
    glVertex2f(2.5f,0);
    glVertex2f(2.5f,2);
    glVertex2f(-2.5f,2);
    glEnd();
}

/**
 * This method is called by display() to draw the 2D scene that
 * will be used as a texture.  The scene is the same one that
 * was used in the program JoglHierarchicalModeling2D.
 */
void draw2DFrame() {
    glClearColor(0.5f, 0.5f, 1, 1);
    glClear(GL_COLOR_BUFFER_BIT); // Fills the scene with blue.
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(0, 7, -1, 4, -1, 1);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    /* Draw three green triangles to form a ridge of hills in the background */

    glColor3f(0, 0.6f, 0.2f);
    glBegin(GL_POLYGON);
    glVertex2f(-3,-1);
    glVertex2f(1.5f,1.65f);
    glVertex2f(5,-1);
    glEnd();
    glBegin(GL_POLYGON);
    glVertex2f(-3,-1);
    glVertex2f(3,2.1f);
    glVertex2f(7,-1);
    glEnd();
    glBegin(GL_POLYGON);
    glVertex2f(0,-1);
    glVertex2f(6,1.2f);
    glVertex2f(20,-1);
    glEnd();

    /* Draw a bluish-gray rectangle to represent the road. */

    glColor3f(0.4f, 0.4f, 0.5f);
    glBegin(GL_POLYGON);
    glVertex2f(0,-0.4f);
    glVertex2f(7,-0.4f);
    glVertex2f(7,0.4f);
    glVertex2f(0,0.4f);
    glEnd();

    /* Draw a dashed white line to represent the stripe down the middle
     * of the road.  Dotted/dashed lines use line "stippling" -- look it up
     * if you want to know how to do it. */

    glLineWidth(6);  // Set the line width to be 6 pixels.
    glColor3f(1,1,1);
    glBegin(GL_LINES);
    glVertex2f(0,0);
    glVertex2f(7,0);
    glEnd();
    glLineWidth(1);  // Reset the line width to be 1 pixel.

    /* Draw the sun.  The drawSun method draws the sun centered at (0,0).  A 2D translation
     * is applied to move the center of the sun to (5,3.3). */

    glPushMatrix();
    glRotated(-frameNumber*0.7,0,0,1);
    glTranslated(5,3.3,0);
    drawSun();
    glPopMatrix();

    /* Draw three windmills.  The drawWindmill method draws the windmill with its base 
     * at (0,0), and the top of the pole at (0,3).  Each windmill is first scaled to change
     * its size and then translated to move its base to a different paint.  In the animation,
     * the vanes of the windmill rotate.  That rotation is done with a transform inside the
     * drawWindmill method. */

    glPushMatrix();
    glTranslated(0.75,1,0);
    glScaled(0.6,0.6,1);
    drawWindmill();
    glPopMatrix();

    glPushMatrix();
    glTranslated(2.2,1.6,0);
    glScaled(0.4,0.4,1);
    drawWindmill();
    glPopMatrix();

    glPushMatrix();
    glTranslated(3.7,0.8,0);
    glScaled(0.7,0.7,1);
    drawWindmill();
    glPopMatrix();

    /* Draw the cart.  The drawCart method draws the cart with the center of its base at
     * (0,0).  The body of the cart is 5 units long and 2 units high.  A scale is first
     * applied to the cart to make its size more reasonable for the picture.  Then a
     * translation is applied to move the cart horizontally.  The amount of the translation
     * depends on the frame number, which makes the cart move from left to right across
     * the screen as the animation progresses.  The cart animation repeats every 300 
     * frames.  At the beginning of the animation, the cart is off the left edge of the
     * screen. */

    glPushMatrix();
    glTranslated(-3 + 13*(frameNumber % 300) / 300.0, 0, 0);
    glScaled(0.3,0.3,1);
    drawCart();
    glPopMatrix();

}

void reshape(int width, int height) {  // Called when the windows opens or is resized
        // PIXEL_SCALE, from pixel-scale.h, is for adapting the program to
        // high resolution (high dpi) screens, which are not supported in Glut.
    glViewport( 0, 0, width*PIXEL_SCALE, height*PIXEL_SCALE );
}


//------------------------- end of 2D Scene -----------------------------

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(600,600);
    glutInitWindowPosition(100,100);
    glutCreateWindow("LEFT MOUSE FOR ROTATION; RIGHT MOUSE FOR MENU");
    glutDisplayFunc(renderFunction);
    glutReshapeFunc(reshape);
    glutSpecialFunc(special);
    glutKeyboardFunc(key);
    glutMouseFunc(trackballMouseFunction);    // install trackball, step 1
    glutMotionFunc(trackballMotionFunction);  // install trackball, step 2 
    cameraSetScale(1);
    printf("\nHit the space bar to start and stop the animation.\n");
    printf("The arrow keys will change the object.\n");
    printf("    The final shape is just th 2D texture image.\n");
    printf("The HOME key restores the original object and point of view.\n");
    printf("The mouse can be used to rotate the view.\n\n");
    createMenu();
    glutMainLoop();
    return 0;
}
