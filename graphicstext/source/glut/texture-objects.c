#include <GL/gl.h>
#include <GL/glut.h>
#include <stdio.h>
#include <FreeImage.h>

/*  Draws a simple scene to show how to use texture objects.  Three texture images
 *  are loaded into three texture objects.  The scene contains three copies of the
 *  GLUT teapot, using the three different textures.
 *     The program uses the FreeImage image processing library to read the texture
 *  images from files.  It must be linked against that library along with the GL
 *  and glut libraries.  For example, using gcc on Linux
 *
 *      gcc -o teapots texture-objects.c -lGL -lglut -lfreeimage
 */

// --------------------------------- global variables --------------------------------

int texID[3];  // Texture ID's for the three textures.

char* textureFileNames[3] = {   // file names for the files from which texture images are loaded
            "textures/Earth-1024x512.jpg",
            "textures/brick001.jpg",
            "textures/marble.jpg"
       };

float rotateX = 0;   // rotations for a simple viewing transform, applied to
float rotateY = 0;   //    each teapot, controlled by the arrow and HOME keys.


// ------------------------ OpenGL initialization and rendering -----------------------

void initGL() {
      // called by main() to initialize the OpenGL drawing context
      
    glClearColor(0.0, 0.0, 0.0, 1.0); // background color

    glEnable(GL_DEPTH_TEST);
    glEnable(GL_LIGHTING);
    glEnable(GL_LIGHT0);
    float white[4] = { 1, 1, 1, 1 };  // A white material, suitable for texturing.
    glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, white);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    glOrtho( -3.75,3.75, -1.5,1.5, -2,2 );
    glMatrixMode(GL_TEXTURE);  // Matrix mode for manipulating the texture transform matrix.
    glLoadIdentity();
    glScalef(1,-1,1);  // It turns out the texture coordinates for the GLUT teapot put an upside
                       // down texture on the sides of the teapot.  To fix that, I apply a texture
                       // transform that flips the texture vertically.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
}  // end initGL()


void display() {
       // Draws the scene, consisting of three teapots with different textures.

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    
    glEnable(GL_TEXTURE_2D);
    
    /* Draw a teapot with the first texture at (-2.3,0.3,0) */
    
    glBindTexture( GL_TEXTURE_2D, texID[0] );  // Bind texture #0 for use on the first teapot.

    glPushMatrix();
    glTranslatef(-2.3,0.3,0);
    glRotatef(rotateX, 1, 0, 0);
    glRotatef(rotateY, 0, 1, 0);
    glutSolidTeapot(0.8);
    glPopMatrix();
    
    /* Draw a teapot with the second texture at (0,-0.5,0) */
    
    glBindTexture( GL_TEXTURE_2D, texID[1] );  // Bind texture #1 for use on the second teapot.

    glPushMatrix();
    glTranslatef(0,-0.5,0);
    glRotatef(rotateX, 1, 0, 0);
    glRotatef(rotateY, 0, 1, 0);
    glutSolidTeapot(0.8);
    glPopMatrix();
    
    /* Draw a teapot with the third texture at (2.3,0.3,0) */
    
    glBindTexture( GL_TEXTURE_2D, texID[2] );  // Bind texture #2 for use on the third teapot.

    glPushMatrix();
    glTranslatef(2.3,0.3,0);
    glRotatef(rotateX, 1, 0, 0);
    glRotatef(rotateY, 0, 1, 0);
    glutSolidTeapot(0.8);
    glPopMatrix();
        
    glutSwapBuffers();  // (required for double-buffered drawing)
}


// --------------- keyboard event function ---------------------------------------


void specialKeyFunction(int key, int x, int y) {
        // Change rotation amounts in response to arrow and home keys.
    if ( key == GLUT_KEY_LEFT )
       rotateY -= 15;
    else if ( key == GLUT_KEY_RIGHT )
       rotateY += 15;
    else if ( key == GLUT_KEY_DOWN)
       rotateX += 15;
    else if ( key == GLUT_KEY_UP )
       rotateX -= 15;
    else if ( key == GLUT_KEY_HOME )
       rotateX = rotateY = 0;
    glutPostRedisplay();
}


// --------------------- texture loading -----------------------------------------

/*  This function loads three textures from texture files, which must be available
 *  to the program when it is run.  Paths to the files are stored in the global
 *  array textureFileNames.  The function generates three texture object identifiers
 *  and stores them in the global array  textID  so that they can be used when
 *  binding textures in display().  It then loads the three texture images into
 *  the texture objects.  It calles glTexParameteri for each texture to change
 *  the minification filter to GL_LINEAR (without this, the texture won't work
 *  because there are no mipmaps for the textures).
 */
void loadTextures() {
    int i;
    glGenTextures( 3, texID );  // Get the texture object IDs.
    for (i = 0; i < 3; i++) {
        void* imgData;  // Pointer to image color data read from the file.
        int imgWidth;   // The width of the image that was read.
        int imgHeight;  // The height.
        FREE_IMAGE_FORMAT format = FreeImage_GetFIFFromFilename(textureFileNames[i]);
        if (format == FIF_UNKNOWN) {
            printf("Unknown file type for texture image file %s\n", textureFileNames[i]);
            continue;
        }
        FIBITMAP* bitmap = FreeImage_Load(format, textureFileNames[i], 0);  // Read image from file.
        if (!bitmap) {
            printf("Failed to load image %s\n", textureFileNames[i]);
            continue;
        }
        FIBITMAP* bitmap2 = FreeImage_ConvertTo24Bits(bitmap);  // Convert to RGB or BGR format
        FreeImage_Unload(bitmap);
        imgData = FreeImage_GetBits(bitmap2);     // Grab the data we need from the bitmap.
        imgWidth = FreeImage_GetWidth(bitmap2);
        imgHeight = FreeImage_GetHeight(bitmap2);
        if (imgData) {
            printf("Texture image loaded from file %s, size %dx%d\n", 
                                     textureFileNames[i], imgWidth, imgHeight);
            int format; // The format of the color data in memory, depends on platform.
            if ( FI_RGBA_RED == 0 )
               format = GL_RGB;
            else
               format = GL_BGR;
            glBindTexture( GL_TEXTURE_2D, texID[i] );  // Will load image data into texture object #i
            glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, imgWidth, imgHeight, 0, format,
                                GL_UNSIGNED_BYTE, imgData);
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR); // Required since there are no mipmaps.
        }
        else {
            printf("Failed to get texture data from %s\n", textureFileNames[i]);
        }
    }
}


// ----------------- main routine -------------------------------------------------

int main(int argc, char** argv) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_DEPTH);
    glutInitWindowSize(750,300); 
    glutInitWindowPosition(100,100);
    glutCreateWindow("ARROW KEYS ROTATE THE TEAPOTS; HOME KEY RESETS");
    initGL();
    loadTextures();
    glutDisplayFunc(display); 
    glutSpecialFunc(specialKeyFunction);
    glutMainLoop();
    return 0;
}

