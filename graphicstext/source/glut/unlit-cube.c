/* Use OpenGL and GLUT to draw a simple cube
 * with each face being a different color.  Rotations
 * can be applied with the arrow keys, the page up
 * key, and the page down key.  The home key will set
 * all rotations to 0.  Initial rotations about the
 * x, y, and z axes are 15, -15, and 0.  
 *
 * Note that this program does not use lighting.
 * 
 * This program must be linked with the GL and GLUT libraries.
 * For example, on Linus with the gcc compiler,
 *
 *    gcc -o unlit-cube unlit-cube.c -lGL -lglut
 */
 
#include <GL/gl.h>
#include <GL/glut.h>

int rotateX = 15, rotateY = -15, rotateZ = 0;  // rotation amounts about axes, controlled by keyboard

// ------------- drawing functions for this program -------------------------

void square(float r, float g, float b) {
    glColor3f(r,g,b);
    glBegin(GL_TRIANGLE_FAN);
    glVertex3f(-0.5, -0.5, 0.5);
    glVertex3f(0.5, -0.5, 0.5);
    glVertex3f(0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glEnd();
}

void cube(float size) {  // draws a cube with side length = size

    glPushMatrix();
    glScalef(size,size,size); // scale unit cube to desired size
    
    square(1, 0, 0); // red front face
    
    glPushMatrix();
    glRotatef(90, 0, 1, 0);
    square(0, 1, 0); // green right face
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(-90, 1, 0, 0);
    square(0, 0, 1); // blue top face
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(180, 0, 1, 0);
    square(0, 1, 1); // cyan back face
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(-90, 0, 1, 0);
    square(1, 0, 1); // magenta left face
    glPopMatrix();
    
    glPushMatrix();
    glRotatef(90, 1, 0, 0);
    square(1, 1, 0); // yellow bottom face
    glPopMatrix();
    
    glPopMatrix(); // Restore matrix to its state before cube() was called.

}

// ----------------------------------------------------------------------


void display() {
       // called when the display needs to be drawn
       
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glLoadIdentity();             // Set up modelview transform. 
    glRotatef(rotateZ,0,0,1);
    glRotatef(rotateY,0,1,0);
    glRotatef(rotateX,1,0,0);
    
    cube(1);
    
    glutSwapBuffers();
}


void specialKeyFunction(int key, int x, int y) {
        // called when a special key is pressed 
    if ( key == GLUT_KEY_LEFT )
       rotateY -= 15;
    else if ( key == GLUT_KEY_RIGHT )
       rotateY += 15;
    else if ( key == GLUT_KEY_DOWN)
       rotateX += 15;
    else if ( key == GLUT_KEY_UP )
       rotateX -= 15;
    else if ( key == GLUT_KEY_PAGE_UP )
       rotateZ += 15;
    else if ( key == GLUT_KEY_PAGE_DOWN )
       rotateZ -= 15;
    else if ( key == GLUT_KEY_HOME )
       rotateX = rotateY = rotateZ = 0;
    glutPostRedisplay();
}

void initGL() {
        // called by main() to do initialization for this program.
    glMatrixMode(GL_PROJECTION);
    glOrtho(-1, 1, -1, 1, -1, 1);
    glMatrixMode(GL_MODELVIEW);
    glEnable(GL_DEPTH_TEST);
    glClearColor(0, 0, 0, 1);
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(500,500);
    glutInitWindowPosition(100,100);
    glutCreateWindow("OpenGL - Unlit Cube; ARROW KEYS ROTATE");
    initGL();
    glutDisplayFunc(display);
    glutSpecialFunc(specialKeyFunction);
    glutMainLoop();
    return 0;
}
