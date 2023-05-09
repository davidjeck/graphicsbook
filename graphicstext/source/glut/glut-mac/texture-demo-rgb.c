
#include <OpenGL/gl.h>
#include <GLUT/glut.h>
#include <stdio.h>
#include "camera.h"
#include "textured-shapes.h"
#include "textures-rgb/readrgb.h"
#include "pixel-scale.h"

// This program can display any of 8 objects, textured using any of
// 6 texture images.  The texture images MUST be availalbe in a directory
// named "textures" in the same directory as the executable.  (Or, you can
// edit the names in the textureFileNames array.)
//   The user can change the object by pressing the left and right arrow
// keys and can change the texture with the up and down arrow keys.  The
// view can be rotated by dragging the mouse on the window.  The default
// view can be restored using the HOME key.
//
//  This is a version of texture-demo.c that uses .rgb textures instead of 
//  using the FreeImage library.  The textures are read using readrgb.c, from
//  the folder textures-rgb.  The texture images in that folder are .rgb versions
//  of the image files from the textures folder.  
//    This program depends on camera.c, textured-shapes.c, and readrgb.c, as well 
// as on the GL, GLU, GLUT, and math libraries.  Example of compiling
// it on MacOS using XCode development tools:
//      clang -DGL_SILENCE_DEPRECATION -o texdemo texture-demo-rgb.c camera.c textured-shapes.c textures-rgb/readrgb.c -lm -framework OpenGL -framework GLUT

const int           // code numbers for the 8 objects that can be displayed
     SPHERE = 0,
     CYLINDER = 1,
     CONE = 2,
     CUBE = 3,
     TORUS = 4,
     TEAPOT = 5,
     SQUARE = 6,
     CIRCLE = 7,
     RING = 8;
         
int currentTexture = 0;  // code number (0 to 7) for the object that is currently displayed

int currentObject = 0;   // code number (0 to 5) for the texture used on the object

char* textureFileNames[6] = {   // file names for the files from which texture images are loaded
            "textures-rgb/Earth-1024x512.rgb",
            "textures-rgb/NightEarth-512x256.rgb",
            "textures-rgb/brick001.rgb",
            "textures-rgb/marble.rgb",
            "textures-rgb/metal003.rgb",
            "textures-rgb/mandelbrot.rgb"
       };
void* imgData[6];  // Pointer to raw RGB data for textures.
int imgWidth[6];   // Widths of texture images.
int imgHeight[6];  // Heights of texture imgages.

void loadTextures() {
        // loads the 6 textures using the FreeImage library, and
        // stores the required info in the imgData, imgWidth, imgHeight arrays.
    int i;
    printf("LOADING TEXTURES...\n");
    for (i = 0; i < 6; i++) {
        int components; // Number of color components in the file (not used).
        
        imgData[i] = read_texture(textureFileNames[i], &imgWidth[i], &imgHeight[i], &components);
        
        if (imgData[i]) {
            printf("Texture image loaded from file %s, size %dx%d\n", 
                             textureFileNames[i], imgWidth[i], imgHeight[i]);
        }
        else {
            printf("Failed to get texture data from %s\n", textureFileNames[i]);
        }
    }
    printf("DONE\n\n");
}


void initGL() {
        // Initialization function, called by main() after creating the window.
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    glEnable(GL_NORMALIZE);
    glLightModeli(GL_LIGHT_MODEL_TWO_SIDE, 1);
    float diffuse[4] = {1,1,1,1};
    float spec[4] = {0.3f, 0.3f, 0.3f, 1};
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, diffuse);
    glMaterialfv(GL_FRONT_AND_BACK, GL_SPECULAR, spec);
    glMateriali(GL_FRONT_AND_BACK, GL_SHININESS, 100);
    glLightModeli(GL_LIGHT_MODEL_COLOR_CONTROL, GL_SEPARATE_SPECULAR_COLOR);
     // I am cheating by using separate specular color, which requires OpenGL 1.2, but
     // it gives nicer specular highlights on textured surfaces.
    glClearColor(0.0, 0.0, 0.0, 1.0);
    glColor3f(1,1,1);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);  // (Actually, this one is the default)
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glEnable(GL_TEXTURE_2D);
    cameraSetScale(1);
    loadTextures();
}


void renderFunction() {
       // draw the current object using the current texture.
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    cameraApply();

    if (imgData[currentTexture]) {
        glEnable(GL_TEXTURE_2D);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, imgWidth[currentTexture], imgHeight[currentTexture], 
                       0, GL_RGBA, GL_UNSIGNED_BYTE, imgData[currentTexture]);
    }
    else {
        printf("Missing texture number %d\n", currentTexture);
        glDisable(GL_TEXTURE_2D);
    }

    if (currentObject <= CONE)
        glRotated(90,-1,0,0);  // rotate axis of object from z-axis to y-axis
    if (currentObject == CONE || currentObject == CYLINDER)
        glTranslated(0,0,-0.5);  // moves center of object to the origin

    if (currentObject == SPHERE)
        uvSphere1();
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
    else if (currentObject == SQUARE)
        square1();
    else if (currentObject == CIRCLE)
        circle1();
    else if (currentObject == RING)
        ring1();

    glutSwapBuffers();
}


void reshape(int width, int height) {  // Called when the windows opens or is resized
        // PIXEL_SCALE, from pixel-scale.h, is for adapting the program to
        // high resolution (high dpi) screens, which are not supported in Glut.
    glViewport( 0, 0, width*PIXEL_SCALE, height*PIXEL_SCALE );
}

void specialKeyFunction(int key, int x, int y) {
         // responds when the user presses a special key.
         
    if ( key == GLUT_KEY_UP ) {
        currentTexture++;
        if (currentTexture > 5)
            currentTexture = 0;
    }
    else if ( key == GLUT_KEY_DOWN ) {
        currentTexture--;
        if (currentTexture < 0 )
            currentTexture = 5;
    }
    else if ( key == GLUT_KEY_LEFT ) {
        currentObject--;
        if (currentObject < 0)
            currentObject = 8;
    }
    else if ( key == GLUT_KEY_RIGHT ) {
        currentObject++;
        if (currentObject > 8)
            currentObject = 0;
    }
    else if ( key == GLUT_KEY_HOME ) {
        cameraLookAt(0,0,30, 0,0,0, 0,1,0);
    }
    glutPostRedisplay();
}

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(600,600);
    glutInitWindowPosition(100,100);
    glutCreateWindow("USE ARROW KEYS TO CHANGE TEXTURES AND OBJECTS");
    initGL();
    glutDisplayFunc(renderFunction);
    glutReshapeFunc(reshape);
    glutSpecialFunc(specialKeyFunction);
    glutMouseFunc(trackballMouseFunction);    // install trackball, step 1
    glutMotionFunc(trackballMotionFunction);  // install trackball, step 2 
    printf("The left and right arrow keys will change the object.\n");
    printf("The up and down arrow keys will change the texture.\n");
    printf("The HOME key restores the original point of view.\n");
    printf("The mouse can be used to rotate the view.\n");
    glutMainLoop();
    return 0;
}
