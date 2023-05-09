This folder, glut-mac, contains C source programs from my introductory
computer graphics textbook that use the GLUT OpenGL library, modified 
for use on MacOS.  For programs that use image textures 
(texture-objects-rgb.c and texture-demo-rgb.c), you will have to
copy the folder named textures-rgb from the main glut source folder
into this glut-mac folder.  (The image texture programs that use
the FreeImage library are not included here.)

OpenGL has been part of MacOS and is supported by Apple's development
system, known as XCode.  It has been "deprecated," meaning that 
it might be entirely removed in future versions of XCode.  However,
while it is supported, if you have installed XCode Developer Tools,
you should be able to compile and run these programs.

The XCode C compiler is named "clang", not "gcc". (You can actually
use "gcc" as the compilation command, but it will still run the
clang compiler.)  The header files for OpenGL, GLU, and GLUT are
found in so-called "frameworks".  They should be included into
OpenGL programs with commands such as

     #include <OpenGL/gl.h>
     #include <OpenGL/glu.h>
     #include <GLUT/glut.h>
     
When a program is compiled, it must be linked to the frameworks.
For example:

    clang -o myOpenGLProg  myOpenGLProg.c  -framework OpenGL -framework GLUT
    
(The OpenGL framework includes the GLU library.)

If you actually use this command as shown, you will get a large number of
warnings that OpenGL functions are deprecated.  You can suppress these
warnings by adding the option  -DGL_SUPPRESS_DEPRECATION to the command:

    clang -DGL_SUPPRESS_DEPRECATION -o myOpenGLProg  myOpenGLProg.c  -framework OpenGL -framework GLUT
    
Each of the programs in this folder includes a sample command for compiling it,
in the comment at the top of the program.

-----

THE HIGH-RESOLUTION SCREEN PROBLEM:

Many MacOS computers have high resolution screens, which are not really
supported by the MacOS version of GLUT.  The symptom for this is that
you run a program, and the content of your scene appears only in the lower
left quarter section (or less) of the window.  The problem is that GLUT is 
measuring window size using nominal standard pixels (about 100 to the inch), 
while OpenGL is using actual pixels (which on a high-resolution screen might 
be 2 or 3 actual pixels to one nominal pixel).  The solution is to use glViewport()
to set the viewport using the actual number of pixels in the window.
For example, in a GLUT reshape function:

       void reshape( int width, int height ) {
           glViewport( 0, 0, width*PIXEL_SCALE, height*PIXEL_SCALE );
       }

where PIXEL_SCALE is the number of actual pixels per nominal pixel,
probably 2 or 3, or 1 for a regular resolution screen.

I have not found an easy way to determine PIXEL_SCALE programmatically.
To make it easier for you to experiment with OpenGL, I have defined
it in a header file, pixel-scale.h, and included this header file in
all the programs in this folder.  The programs have been modified to
take PIXEL_SCALE into account.  The value of PIXEL_SCALE in pixel-scale.h
is 1, making it appropriate for a regular resolution screen.  If you
have a high-resolution screen, you should edit pixel-scale.h and 
change it to 2 or 3 or whatever value works for you.

-----

INSTALLING XCODE DEVELOPEMENT TOOLS:

XCode development tools do not come preinstalled on MacOS.  But if you
try to use the gcc or clang command on the command line (in the Terminal
application), you should be asked whether you want to install them.
Just agree to the installation, and they will be installed.
