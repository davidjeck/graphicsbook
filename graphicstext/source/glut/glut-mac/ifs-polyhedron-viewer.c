/**
 *  A viewer for the polyhedral models defined in Polyhedron.java.
 *  The user can select the model and can control some aspects of the
 *  display.  If a model does not already have colors for its faces,
 *  then random colors are assigned.  The user can drag the polyhedron
 *  to rotate the view.
 *
 *  This program must be linked to polyhedron.c and camera.c in addtion
 *  to the OpenGL, GLUT, and GLU libraries.
 *  For example, this command might work on MacOS using XCode developer tools:
 *
 *      clang -DGL_SILENCE_DEPRECATION -o polyview ifs-polyhedron-viewer.c polyhedron.c camera.c -framework OpenGL -framework GLUT
 */

#include <OpenGL/gl.h>
#include <GLUT/glut.h>
#include "pixel-scale.h"
#include <stdlib.h>
#include <time.h>

#include "polyhedron.h"
#include "camera.h"

// ------------- drawing functions for this program -------------------------

Polyhedron currentModel;

int orthographic = 0;
int drawFaces = 1;
int drawEdges = 1;
int colored = 1;


double* randomColorArray(int length) {
    double* colors = malloc(3*length*sizeof(double));
    int i;
    for (i = 0; i < length*3; i++) {
        colors[i] = (double)rand()/RAND_MAX;
    }
    return colors;
}


// ----------------------------------------------------------------------


void display() {
       // called when the display needs to be drawn
       
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    if (!currentModel.faceColors) {
        currentModel.faceColors = randomColorArray(currentModel.faceCount);
    }

    cameraSetOrthographic(orthographic);
    cameraApply();
    
    glPushMatrix();
    double scale = 1/currentModel.maxVertexLength;
    glScaled(scale,scale,scale);
    int i,j;
    if (drawFaces) { 
        if (drawEdges) {
            glEnable(GL_POLYGON_OFFSET_FILL);
        }
        glColor3f(1,1,1); // in case colored is false
        j = 0;
        for (i = 0; i < currentModel.faceCount; i++) {
            if (colored) {
                glColor3dv( &currentModel.faceColors[3*i] );
            }
            glBegin(GL_TRIANGLE_FAN);
            while (currentModel.faces[j] != -1) {
                int vertexNum = currentModel.faces[j];
                glVertex3dv( &currentModel.vertices[vertexNum*3] );
                j++;
            }
            j++;
            glEnd();
        }
        glDisable(GL_POLYGON_OFFSET_FILL);
    }
    if (drawEdges) { 
        if (drawFaces) {
            glColor3f(0,0,0);
        }
        else {
            glColor3f(1,1,1);
        }
        j = 0;
        for (i = 0; i < currentModel.faceCount; i++) {
            glBegin(GL_LINE_STRIP);
            while (currentModel.faces[j] != -1) {
                int vertexNum = currentModel.faces[j];
                glVertex3dv( &currentModel.vertices[vertexNum*3] );
                j++;
            }
            j++;
            glEnd();
        }
    }
    glPopMatrix();

    glutSwapBuffers();
}


void reshape(int width, int height) {  // Called when the windows opens or is resized
        // PIXEL_SCALE, from pixel-scale.h, is for adapting the program to
        // high resolution (high dpi) screens, which are not supported in Glut.
    glViewport( 0, 0, width*PIXEL_SCALE, height*PIXEL_SCALE );
}


void initGL() {
        // called by main() to do initialization for this program.
    glEnable(GL_DEPTH_TEST);
    glClearColor(0, 0, 0, 1);
    glLineWidth(2);
    glPolygonOffset(1,2);
    cameraLookAt(2,2,6, 0,0,0, 0,1,0);
    cameraSetScale(1.2);
    createPolyhedra();
    currentModel = stellatedDodecahedron;
    srand(time(0));
}

// ------------------------- Menu handling --------------------------

void doProjectionMenu(int id) {
   orthographic = id;
   glutPostRedisplay();
}

void doRenderMenu(int id) {
   if (id == 0 || id == 2) {
       drawFaces = 1;
   }
   else {
       drawFaces = 0;
   }
   if (id == 1 || id == 2) {
       drawEdges = 1;
   }
   else {
       drawEdges = 0;
   }
   glutPostRedisplay();
}

void doColoredMenu(int id) {
   colored = id;
   glutPostRedisplay();
}

void doModelMenu(int id) {
    switch (id) {
       case 0: currentModel = house; break;
       case 1: currentModel = cube; break;
       case 2: currentModel = dodecahedron; break;
       case 3: currentModel = icosahedron; break;
       case 4: currentModel = octahedron; break;
       case 5: currentModel = rhombicDodecahedron; break;
       case 6: currentModel = socerBall; break;
       case 7: currentModel = stellatedDodecahedron; break;
       case 8: currentModel = stellatedIcosahedron; break;
       case 9: currentModel = stellatedOctahedron; break;
       case 10: currentModel = tetrahedron; break;
       case 11: currentModel = truncatedIcosahedron; break;
       case 12: currentModel = truncatedRhombicDodecahedron; break;
    }
    glutPostRedisplay();
}

void createMenus() {
    int proj = glutCreateMenu(doProjectionMenu);
    glutAddMenuEntry("Perspective",0);
    glutAddMenuEntry("Orthographic",1);
    int rend = glutCreateMenu(doRenderMenu);
    glutAddMenuEntry("Show Faces",0);
    glutAddMenuEntry("Show Edges",1);
    glutAddMenuEntry("Show Both",2);
    int colr = glutCreateMenu(doColoredMenu);
    glutAddMenuEntry("Colored Faces",1);
    glutAddMenuEntry("White Faces",0);
    int menu = glutCreateMenu(doModelMenu);
    glutAddMenuEntry("House", 0);
    glutAddMenuEntry("Cube", 1);
    glutAddMenuEntry("Dodecahedron", 2);
    glutAddMenuEntry("Icosahedron", 3);
    glutAddMenuEntry("Octahedron", 4);
    glutAddMenuEntry("Rhombic Dodecahedron", 5);
    glutAddMenuEntry("Socer Ball", 6);
    glutAddMenuEntry("Stellated Dodecahedron", 7);
    glutAddMenuEntry("Stellated Icosahedron", 8);
    glutAddMenuEntry("Stellated Octahedron", 9);
    glutAddMenuEntry("Tetrahedron", 10);
    glutAddMenuEntry("Truncated Icosahedron", 11);
    glutAddMenuEntry("Truncated Rhombic Dodecahedron", 12);    
    glutAddSubMenu("Rendering", rend);
    glutAddSubMenu("Face Color", colr);
    glutAddSubMenu("Projection", proj);
    glutAttachMenu(GLUT_RIGHT_BUTTON);
}


// ------------------------------------------------------------------

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(500,500);
    glutInitWindowPosition(100,100);
    glutCreateWindow("Rotate = LEFT MOUSE; Menu = RIGHT MOUSE");
    initGL();
    createMenus();
    glutMouseFunc(trackballMouseFunction);
    glutMotionFunc(trackballMotionFunction);
    glutDisplayFunc(display);
    glutReshapeFunc(reshape);
    glutMainLoop();
    return 0;
}
