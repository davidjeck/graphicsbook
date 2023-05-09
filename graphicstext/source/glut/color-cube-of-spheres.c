/**
 * An OpenGL application that an 11-by-11-by-11 cube of
 * spheres in different colors.  Five rendering methods are 
 * available, selected using a pop-up menu.  The rendering time
 * to draw the scene is shown at the bottom of the window.  
 * Use the mouse to rotate the scene. This program requires 
 * OpenGL 1.5 or higher for support of vertex buffer objects.
 * This program depends on camera.c.  It must be linked to 
 * that file and the the GL, glut, GLU, and math libraries.
 * For example, on Linux using gcc,
 *
 *     gcc -o cubes color-cube-of-spheres.c camera.c -lGL -lglut -lGLU -lm
 */


#include <GL/gl.h>
#include <GL/glut.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <sys/time.h>
#include "camera.h"

/*---------------------------------------------------------------------------------
   The following three function prototypes are for functions taht are used in
   this program but that are not part of OpenGL 1.1.  (They were added in 
   OpenGL 1.5.)  Declarations for this functions are not -- or might not -- be
   included in the header file GL/gl.h, so I am giving their declarations here.
*/

void glGenBuffers( GLsizei n, GLuint *buffers );
void glBindBuffer(GLenum target,  GLuint buffer);
void glBufferData( 	GLenum target, GLsizeiptr size, const GLvoid * data, GLenum usage);
   
/*--------------------------------------------------------------------------------*/


const double PI = 3.141592654;

int width, height;  // Size of display area, set in reshape().
char message[200];  // For outputting the message at the bottom of the window.


int sphereDisplayList;  // A display list for drawing one sphere.

float *sphereVertexArray; // Pointer to the vertex coords, for use with glDrawArrays
float *sphereNormalArray; // Pointer to the normal vectors, for use with glDrawArrays

int vertexVboId;   // identifier for the Vertex Buffer Object to hold the vertex coords
int normalVboId;   // identifier for the Vertex Buffer Object to hold the normla vectors

int renderMode = 2;  // 0 for direct draw, 1 for direct with precomputed data,
                     // 2 for display list, 3 for drawArrays, 4 for VBOs
                     
int renderCount = 0;  // Number of times image has been rendered (since last change of mode).
double renderTimeSum = 0;  // Sum of image render times (since last change of mode).

char *modeNames[] = {
      "Direct Draw, Recomputing Vertex Data",
      "Direct Draw, Precomputed Data",
      "Display List",
      "DrawArrays with Arrays",
      "DrawArrays with VBOs"
};

//------------------- draws one sphere directly -----------------------

void uvSphere(double radius, int slices, int stacks) {
    int i,j;
    for (j = 0; j < stacks; j++) {
        double latitude1 = (PI/stacks) * j - PI/2;
        double latitude2 = (PI/stacks) * (j+1) - PI/2;
        double sinLat1 = sin(latitude1);
        double cosLat1 = cos(latitude1);
        double sinLat2 = sin(latitude2);
        double cosLat2 = cos(latitude2);
        glBegin(GL_QUAD_STRIP);
        for (i = 0; i <= slices; i++) {
            double longitude = (2*PI/slices) * i;
            double sinLong = sin(longitude);
            double cosLong = cos(longitude);
            double x1 = cosLong * cosLat1;
            double y1 = sinLong * cosLat1;
            double z1 = sinLat1;
            double x2 = cosLong * cosLat2;
            double y2 = sinLong * cosLat2;
            double z2 = sinLat2;
            glNormal3d(x2,y2,z2);
            glVertex3d(radius*x2,radius*y2,radius*z2);
            glNormal3d(x1,y1,z1);
            glVertex3d(radius*x1,radius*y1,radius*z1);
        }
        glEnd();
    }
} // end uvSphere

//-------------------- Create arrays and VBOs for glDrawArrays --------

/* Creates the vertex coordinate and normal vectors for a sphere.
 * The data is stored in the float arrays sphereVertexArray and
 * sphereNormalArray.  In addition, VBOs are created to hold
 * the data and the data is copied from the FloatBuffers into
 * the VBOs.  (Note: The VBOs are used for render renderMode 4; the
 * FloatBuffers are used for render renderMode 3.)
 */
void createSphereArraysAndVBOs() {
    int i,j;
    double radius = 0.4;
    int stacks = 16;
    int slices = 32;
    int size = stacks * (slices+1) * 2 * 3;
    sphereVertexArray = malloc(size*sizeof(float));
    sphereNormalArray = malloc(size*sizeof(float));
    int k = 0;
    for (j = 0; j < stacks; j++) {
        double latitude1 = (PI/stacks) * j - PI/2;
        double latitude2 = (PI/stacks) * (j+1) - PI/2;
        double sinLat1 = sin(latitude1);
        double cosLat1 = cos(latitude1);
        double sinLat2 = sin(latitude2);
        double cosLat2 = cos(latitude2);
        for (i = 0; i <= slices; i++) {
            double longitude = (2*PI/slices) * i;
            double sinLong = sin(longitude);
            double cosLong = cos(longitude);
            double x1 = cosLong * cosLat1;
            double y1 = sinLong * cosLat1;
            double z1 = sinLat1;
            double x2 = cosLong * cosLat2;
            double y2 = sinLong * cosLat2;
            double z2 = sinLat2;
            sphereNormalArray[k] =  (float)x2;
            sphereNormalArray[k+1] =  (float)y2;
            sphereNormalArray[k+2] =  (float)z2;
            sphereVertexArray[k] =  (float)(radius*x2);
            sphereVertexArray[k+1] =  (float)(radius*y2);
            sphereVertexArray[k+2] =  (float)(radius*z2);
            k += 3;
            sphereNormalArray[k] =  (float)x1;
            sphereNormalArray[k+1] =  (float)y1;
            sphereNormalArray[k+2] =  (float)z1;
            sphereVertexArray[k] =  (float)(radius*x1);
            sphereVertexArray[k+1] =  (float)(radius*y1);
            sphereVertexArray[k+2] =  (float)(radius*z1);
            k += 3;
        }
    }
    int bufferIDs[2];
    glGenBuffers(2, bufferIDs);
    vertexVboId = bufferIDs[0];
    normalVboId = bufferIDs[1];
    glBindBuffer(GL_ARRAY_BUFFER, vertexVboId);
    glBufferData(GL_ARRAY_BUFFER, size*sizeof(float), sphereVertexArray, GL_STATIC_DRAW);
    glBindBuffer(GL_ARRAY_BUFFER, normalVboId);
    glBufferData(GL_ARRAY_BUFFER, size*sizeof(float), sphereNormalArray, GL_STATIC_DRAW);
    glBindBuffer(GL_ARRAY_BUFFER, 0);
}

/**
 * Draw one sphere.  The VertexPointer and NormalPointer must already
 * be set to point to the data for the sphere, and they must be enabled.
 */
void drawSphereWithDrawArrays() {
    int i;
    int slices = 32;
    int stacks = 16;
    int vertices = (slices+1)*2;
    for (i = 0; i < stacks; i++) {
        int pos = i*(slices+1)*2;
        glDrawArrays(GL_QUAD_STRIP, pos, vertices);
    }
}

void drawSphereDirectWithDataFromArrays() {
    int i,j;
    int slices = 32;
    int stacks = 16;
    int vertices = (slices+1)*2;
    for (i = 0; i < stacks; i++) {
        int pos = i*(slices+1)*2*3;
        glBegin(GL_QUAD_STRIP);
        for (j = 0; j < vertices; j++) {
            glNormal3fv(&sphereNormalArray[pos+3*j]);
            glVertex3fv(&sphereVertexArray[pos+3*j]);
        }
        glEnd();
    }
}

//----------------------------------------------------------------------

void initGL() {
    glClearColor(0.5, 0.5, 0.5, 1.0);
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_COLOR_MATERIAL);

    /* Create a display list that contains all the OpenGL
     * commands that are generated when the sphere is drawn.
     */
    sphereDisplayList = glGenLists(1);
    glNewList(sphereDisplayList, GL_COMPILE);
    uvSphere(0.4, 32, 16);
    glEndList();

    /* Create the data for glDrawArrays, for render modes 2 and 3
     */
    createSphereArraysAndVBOs();
}

void display() { // draws the contents of the window.
        // Renders the color cube of spheres in the upper part of the window;
        // Draws a message about the render time in the bottom 60 pixels.
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glViewport(0,60,width,height-60);  // viewport for the cube of spheres
    cameraApply();
    struct timeval now;  // start timing, to get the render time.
    gettimeofday(&now,0);
    int start = now.tv_sec*1000 + now.tv_usec/1000;  // Starting time for rendering.
    if (renderMode == 4 || renderMode == 3) {
            // We need to enable the vertex and normal arrays, and set
            // the vertex and normal points for these modes.
        glEnableClientState(GL_VERTEX_ARRAY);
        glEnableClientState(GL_NORMAL_ARRAY);
        if (renderMode == 4) {
                 // When using VBOs, the vertex and normal pointers
                 // refer to data in the VBOs.
            glBindBuffer(GL_ARRAY_BUFFER, vertexVboId);
            glVertexPointer(3,GL_FLOAT,0,0); 
            glBindBuffer(GL_ARRAY_BUFFER, normalVboId);
            glNormalPointer(GL_FLOAT,0,0); 
            glBindBuffer(GL_ARRAY_BUFFER, 0);
        }
        else {
                 // When not using VBOs, the points point to the arrays.
            glVertexPointer(3,GL_FLOAT,0,sphereVertexArray);
            glNormalPointer(GL_FLOAT,0,sphereNormalArray);
        }
    }
    int i,j,k;
    for (i = 0; i <= 10; i++) {
        float r = i/10.0f;
        for (j = 0; j <= 10; j++) {
            float g = j/10.0f;
            for (k = 0; k <= 10; k++) {
                float b = k/10.0f;
                glColor3f(r,g,b);
                glPushMatrix();
                glTranslatef(i-5,j-5,k-5);
                if (renderMode == 0)
                    uvSphere(0.4, 32, 16);  // Draw sphere directly.
                else if (renderMode == 1)
                    drawSphereDirectWithDataFromArrays();  // Draw with data from arrays
                else if (renderMode == 2)
                    glCallList(sphereDisplayList);  // Draw by calling a display list.
                else
                    drawSphereWithDrawArrays();  // Draw using DrawArrays
                glPopMatrix();
            }
        }
    }
    if (renderMode == 4 || renderMode == 3) {
        glDisableClientState(GL_VERTEX_ARRAY);
        glDisableClientState(GL_NORMAL_ARRAY);
    }
    glFlush();  // Make sure all commands are sent to graphics card.
    glFinish(); // Wait for all commands to complete, before checking time.
    gettimeofday(&now,0);
    int end = now.tv_sec*1000 + now.tv_usec/1000;  // end time for rendering.
    int time = end - start;  // render time
    renderCount++;
    renderTimeSum += time;
    
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
    snprintf(message,200,"%s Average Render Time:  %1.2f\n", modeNames[renderMode], renderTimeSum/renderCount);
    while (*m) {
        glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, *m);
        m++;
    }
    glEnable(GL_LIGHTING);
    glEnable(GL_DEPTH_TEST);
    
    glutSwapBuffers();    
} // end display


void reshape(int w, int h) {  // just record the new size.
    width = w;
    height = h;
}


void doMenu(int itemNum) {  // menu handler -- change render mode.
    renderMode = itemNum;
    renderCount = 0;
    renderTimeSum = 0;
    glutPostRedisplay();
}

void createMenus() {  // make a menu containing the five render modes.
    int menu = glutCreateMenu(doMenu);
    int i;
    for (i = 0; i < 5; i++) {
        glutAddMenuEntry(modeNames[i], i); // value is code number for the render mode
    }
    glutAttachMenu(GLUT_RIGHT_BUTTON);
}


int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(600,660);
    glutInitWindowPosition(100,100);
    glutCreateWindow("Left Mouse = ROTATE; Right Mouse = MENU");
    initGL();
    createMenus();
    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    cameraSetScale(10);
    glutMouseFunc(trackballMouseFunction);
    glutMotionFunc(trackballMotionFunction);
    glutMainLoop();
    return 0;
}
