
/*
    This header file is referenced in all of the programs in the
    folder glut-mac.  It is used in those programs to provide kludgy
    support for high-resolution screens, which are not supported by
    the GLUT in MacOS.   See README.txt in this folder for more information.
    
    The value of PIXEL_SCALE is a multiplier that converts the
    width and height of the window to the corresponding number of
    pixels.  A typical value would be 2 or 3 for a high-res screen,
    or 1 for a regular resolution screen.
*/


const int PIXEL_SCALE = 1;
