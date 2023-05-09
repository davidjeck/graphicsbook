/*
 *  Shows a scene (a teapot on a short cylindrical base) that is illuminated
 *  by up to four lights plus global ambient light.  The user can turn the
 *  lights on and off.  The global ambient light is a dim white.  There is 
 *  a white "viewpoint" light that points from the direction of the viewer
 *  into the scene.  There is a red light, a blue light, and a green light
 *  that rotate in circles above the teapot.  (The user can turn the animation
 *  on and off.)  The locations of the colored lights are marked by spheres,
 *  which are gray when the light is off and are colored by some emission color
 *  when the light is on.  The teapot is gray with weak specular highlights.
 *  The base is colored with a spectrum.  (The user can turn the display of
 *  the base on and off.)  The mouse can be used to rotate the scene.
 *  Either the menu or the keyboard can be used to turn options on and off.
 *
 *    This program dependes on camera.c.  It must also be linked to the GL, GLU, 
 * glut, and math libraries.  For example, in Linux with the gcc compiler:
 *
 *        gcc -o four-lights four-lights.c camera.c -lGL -lglut -lGLU -lm
 */

#include <GL/gl.h>
#include <GL/glut.h> 
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "camera.h"

const double PI = 3.141592654;

int animating = 0;       // Is the animation running?
int drawBase = 1;        // Should the base be drawn?
int ambientLight = 1;    // Should global ambient light be on?
int viewpointLight = 1;  // Should the viewpoint light be on?
int redLight = 1;        // Should the red light be on?
int greenLight = 1;      // Should the green light be on?
int blueLight = 1;       // Should the blue light be on?

int frameNumber = 0;  // Frame number for use in animation.

char message[200];  // Used for displaying a message at the bottom of the display.
int width, height;  // Size of the display, set in reshape().


//------------------- Drawing functions ----------------------------------------

/*  Sets the positions of the colored lights and turns them on and off, depending on
 *  the state of the redLight, greenLight, and blueLight options.  Draws a small
 *  sphere at the location of each light.
 */
void lights() {

    glColor3d(0.5,0.5,0.5);
    float zero[] = { 0, 0, 0, 1 };
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, zero);
    
    if (viewpointLight)
        glEnable(GL_LIGHT0);
    else
        glDisable(GL_LIGHT0);
    
    if (redLight) {
        float red[] = { 0.5, 0, 0, 1 };
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, red);  
        glEnable(GL_LIGHT1);
    }
    else {
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, zero);  
        glDisable(GL_LIGHT1);
    }
    glPushMatrix();
    glRotated(-frameNumber, 0, 1, 0);
    glTranslated(10, 7, 0);
    glLightfv(GL_LIGHT1, GL_POSITION, zero);
    glutSolidSphere(0.5, 16, 8);
    glPopMatrix();
    
    if (greenLight) {
        float green[] = {0, 0.5, 0, 1 };
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, green); 
        glEnable(GL_LIGHT2);
    }
    else {
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, zero); 
        glDisable(GL_LIGHT2);
    }
    glPushMatrix();
    glRotated((frameNumber+100)*0.8743, 0, 1, 0);
    glTranslated(9, 8, 0);
    glLightfv(GL_LIGHT2, GL_POSITION, zero);
    glutSolidSphere(0.5, 16, 8);
    glPopMatrix();
    
    if (blueLight) {
        float blue[] = { 0, 0, 0.5, 1 };
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, blue); 
        glEnable(GL_LIGHT3);
    }
    else {
        glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, zero);
        glDisable(GL_LIGHT3);
    }
    glPushMatrix();
    glRotated((frameNumber-100)*1.3057, 0, 1, 0);
    glTranslated(9.5, 7.5, 0);
    glLightfv(GL_LIGHT3, GL_POSITION, zero);
    glutSolidSphere(0.5, 16, 8);
    glPopMatrix();

    glMaterialfv(GL_FRONT_AND_BACK, GL_EMISSION, zero); // Turn off emission color!
} // end lights()


/*  Fills the array with RGBA color components corresponding the given HSV color 
 *  components, where h, s, and v are in the range 0.0 to 1.0.
 */
void colorArrayForHue(double array[4], double h, double s, double v) {
    double r,g,b;
    double c,x;
    h = h*359;
    c = v*s;
    x = (h < 120)? h/60 : (h < 240)? (h-120)/60 : (h-240)/60;
    x = c * (1-fabs(x-1));
    x += (v-c);
    switch ((int)(h/60)) {
        case 0: r = v; g = x; b = v-c; break;
        case 1: r = x; g = v; b = v-c; break;
        case 2: r = v-c; g = v; b = x; break;
        case 3: r = v-c; g = x; b = v; break;
        case 4: r = x; g = v-c; b = v; break;
        case 5: r = v; g = v-c; b = x; break;
    }
    array[0] = r;
    array[1] = g;
    array[2] = b;
    array[3] = 1;
}

/*  Draws a cylinder with height 2 and radius 1, centered at the origin, with its axis
 *  along the z-axis.  A spectrum of hues is applied to the vertices along the edges
 *  of the cylinder.  (Since GL_COLOR_MATERIAL is enabled in this program, the colors
 *  specified here are used as ambient and diffuse material colors for the cylinder.)
 */
void drawCylinder() {
    int i;
    glBegin(GL_TRIANGLE_STRIP);
    double rgba[4];
    for (i = 0; i <= 64; i++) {
        double angle = 2*PI/64 * i;
        double x = cos(angle);
        double y = sin(angle);
        colorArrayForHue(rgba, i/64.0, 1, 0.6);
        glColor3dv(rgba);
        glNormal3d( x, y, 0 );  // Normal for both vertices at this angle.
        glVertex3d( x, y, 1 );  // Vertex on the top edge.
        glVertex3d( x, y, -1 ); // Vertex on the bottom edge.
    }
    glEnd();
    glNormal3d( 0, 0, 1 );
    glBegin(GL_TRIANGLE_FAN);  // Draw the top, in the plane z = 1.
    glColor3d(1,1,1);  // ambient and diffuse for center
    glVertex3d( 0, 0, 1);
    for (i = 0; i <= 64; i++) {
        double angle = 2*PI/64 * i;
        double x = cos(angle);
        double y = sin(angle);
        colorArrayForHue(rgba, i/64.0, 1, 0.6);
        glColor3dv(rgba);
        glVertex3d( x, y, 1 );
    }
    glEnd();
    glNormal3f( 0, 0, -1 );  
    glBegin(GL_TRIANGLE_FAN);  // Draw the bottom, in the plane z = -1
    glColor3d(1,1,1);  // ambient and diffuse for center
    glVertex3d( 0, 0, -1);
    for (i = 64; i >= 0; i--) {
        double angle = 2*PI/64 * i;
        double x = cos(angle);
        double y = sin(angle);
        colorArrayForHue(rgba, i/64.0, 1, 0.6);
        glColor3dv(rgba);
        glVertex3d( x, y, -1 );
    }
    glEnd();    
}

/* Draws the scene, with a message in the bottom 60 pixels of the window.
 */
void display() {    

    glClearColor(0,0,0,0);
    glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT ); 

    glViewport(0,60,width,height-60);  // viewport for the drawing

    cameraApply();

    lights();

    float zero[] = { 0, 0, 0, 1 };
    float amb[] = { 0.15, 0.15, 0.15, 1 };
    float spec[] = { 0.2, 0.2, 0.2, 1 };

    if (ambientLight) {
        glLightModelfv(GL_LIGHT_MODEL_AMBIENT, amb );
    }
    else {
        glLightModelfv(GL_LIGHT_MODEL_AMBIENT, zero );
    }

    if (drawBase) {
        glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, zero );

        glPushMatrix();
        glTranslated(0, -5, 0);
        glRotated(-90, 1, 0, 0);
        glScaled(10,10,0.5);
        drawCylinder();
        glPopMatrix();
    }

    glColor3d(0.7,0.7,0.7);  // sets diffuse and ambient color for teapot

    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, spec);

    glPushMatrix();
    glutSolidTeapot(6);
    glPopMatrix();

    /* Draw a message at the bottom of the window. */

    glViewport(0,0,width,60); // viewport for the message
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho(0,width,0,60,-1,1);
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    glDisable(GL_LIGHTING);
    glDisable(GL_DEPTH_TEST);
    glColor3f(1,1,1);
    glRecti(0,0,width,60);
    glColor3f(0,0,0);
    glRasterPos2f(15,20);
    char *m = message;
    snprintf(message,200,"Enabled Lights:  %s%s%s%s%s",
            ambientLight? "Global Ambient  " : "",
            viewpointLight? "Viewpoint  " : "",
            redLight? "Red  " : "",
            greenLight? "Green  " : "",
            blueLight? "Blue" : ""
       );
    while (*m) {
        glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, *m);
        m++;
    }
    glEnable(GL_LIGHTING);
    glEnable(GL_DEPTH_TEST);
    
    glutSwapBuffers();    

}

/* Called when the window size changes; just record the new size for use in
 * setting the viewports in the display method.
 */
void reshape(int w, int h) { 
    width = w;
    height = h;
}

/* Initialization, including setting up a camera and configuring the four lights.
 */
void initGL() {
    glClearColor(0, 0, 0, 1);  
    glEnable(GL_DEPTH_TEST); 
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_NORMALIZE);
    glEnable(GL_COLOR_MATERIAL);
    glLightModeli(GL_LIGHT_MODEL_LOCAL_VIEWER, 1);
    glMateriali(GL_FRONT_AND_BACK, GL_SHININESS, 32);

    float dim[] = { 0.5F, 0.5F, 0.5F, 1 };
    glLightfv(GL_LIGHT0, GL_DIFFUSE, dim);
    glLightfv(GL_LIGHT0, GL_SPECULAR, dim);

    float red[] =  { 0.5F, 0, 0, 1};
    float reda[] = { 0.1F, 0, 0, 1};
    glLightfv(GL_LIGHT1, GL_AMBIENT, reda);
    glLightfv(GL_LIGHT1, GL_DIFFUSE, red);
    glLightfv(GL_LIGHT1, GL_SPECULAR, red);

    float gr[] = { 0, 0.5F, 0, 1 };
    float gra[] = { 0, 0.1F, 0, 1 };
    glLightfv(GL_LIGHT2, GL_AMBIENT, gra);
    glLightfv(GL_LIGHT2, GL_DIFFUSE, gr);
    glLightfv(GL_LIGHT2, GL_SPECULAR, gr);

    float bl[] = {0, 0, 0.5F, 1};
    float bla[] = {0, 0, 0.1F, 1};
    glLightfv(GL_LIGHT3, GL_AMBIENT, bla);
    glLightfv(GL_LIGHT3, GL_DIFFUSE, bl);
    glLightfv(GL_LIGHT3, GL_SPECULAR, bl);
}


// --------------- support for animation ------------------------------------------

void timerFunction(int timerID) {
    if (animating) {
        frameNumber++;
        glutTimerFunc(30, timerFunction, 0);  // Next frame in 30 milliseconds.
        glutPostRedisplay(); // Causes display() to be called.
    }
}

void toggleAnimation() {
   if ( ! animating ) {
       animating = 1;
       glutTimerFunc(30, timerFunction, 0);
   }
   else {
       animating = 0;
   }
}


// --------------------- Menu Keyboard handling --------------------------------

void charTyped(unsigned char ch, int x, int y) {
    switch (ch) {
    case 'a': case 'A': toggleAnimation(); break;
    case 'd': case 'D': drawBase = 1 - drawBase; break;
    case 'm': case 'M': ambientLight = 1 - ambientLight; break;
    case 'v': case 'V': viewpointLight = 1 - viewpointLight; break;
    case 'r': case 'R': redLight = 1 - redLight; break;
    case 'g': case 'G': greenLight = 1 - greenLight; break;
    case 'b': case 'B': blueLight = 1 - blueLight; break;
    case 27: exit(0);
    }
    glutPostRedisplay();
}


void doMenu(int itemNum) {  // menu handler -- change render mode.
    switch (itemNum) {
    case 1: toggleAnimation(); break;
    case 2: drawBase = 1 - drawBase; break;
    case 3: ambientLight = 1 - ambientLight; break;
    case 4: viewpointLight = 1 - viewpointLight; break;
    case 5: redLight = 1 - redLight; break;
    case 6: greenLight = 1 - greenLight; break;
    case 7: blueLight = 1 - blueLight; break;
    case 8: exit(0);
    }
    glutPostRedisplay();
}



void createMenus() {  // make a menu containing the five render modes.
    int menu = glutCreateMenu(doMenu);
    glutAddMenuEntry("Toggle Animation (A key)", 1);
    glutAddMenuEntry("Toggle Draw Base (D key)", 2);
    glutAddMenuEntry("Toggle Global Ambient Light (M key)", 3);
    glutAddMenuEntry("Toggle Viewpoint Light (V key)", 4);
    glutAddMenuEntry("Toggle Red Light (R key)", 5);
    glutAddMenuEntry("Toggle Green Light (G key)", 6);
    glutAddMenuEntry("Toggle Blue Light (B key)", 7);
    glutAddMenuEntry("Quit (ESC key)", 8);
    glutAttachMenu(GLUT_RIGHT_BUTTON);
}


//---------------------------------------------------------------------------


int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(600,660);
    glutInitWindowPosition(100,100);
    glutCreateWindow("Left Mouse = ROTATE; Right Mouse = MENU");
    initGL();
    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    cameraLookAt(5,10,30, 0,0,0, 0,1,0);
    cameraSetScale(15);
    glutMouseFunc(trackballMouseFunction);
    glutMotionFunc(trackballMotionFunction);
    glutKeyboardFunc(charTyped);
    createMenus();
    toggleAnimation();
    glutMainLoop();
    return 0;
}



