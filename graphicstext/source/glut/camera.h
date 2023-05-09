// This header file defines functions for using a basic "camera" for use
// with GLUT.  It also defines basic trackball-style mouse rotation,
// for use with the camera.  The functions are defined in camera.c,
// which must be linked to your main program.  The GL, glut, GLU,
// and math libraries must all be available.  For example:
//     gcc myglutprog.c camera.c -lGL -lglut -lGLU -lm
// (You might not need to specify all the libraries explicitly.  I only
// need -lglut and -lGLU.)


/*
 Apply the camera to an OpenGL context.  This method completely replaces the
 * projection and the modelview transformation in the context.  It sets these
 * transformations to the identity and then applies the view and projection
 * represented by the camera.  This method is meant to be called at the begining
 * of the display function and should replace any other means of setting the
 * projection and view.
 */
void cameraApply();


/**
 * Set the information for the viewing transformation.  The view will be set
 * in the apply method with a call to gluLookAt.  The camera is at the point
 * (eyeX,eyeY,eyeZ), looking towards (viewCenterX,viewCenterY,viewCenterZ), and
 * the vector (viewUpX,viewUpY,viewUpZ) points upwards in the view.
 * Default is cameraLookAt( 0,0,30, 0,0,0, 0,1,0 )
 */
void cameraLookAt(double eyeX, double eyeY, double eyeZ,
                  double viewCenterX, double viewCenterY, double viewCenterZ,
                  double viewUpX, double viewUpY, double viewUpZ);
                  

/* Set the limits of the view volume.  The limits are set with respect to the
 * viewing coordinates.  That is, the view center is assumed to be at the point
 * (0,0) in the plane of the screen.  The view up vector (more precisely, its projection
 * onto the screen) points upwards on the screen.  The z-axis is perpendicular to the
 * screen, with the positive direction of the z-axis pointing out of the screen.
 * In this coordinate system, xmin and xmax give the horizontal limits on the screen,
 * ymin and ymax give the vertical limits on the screen, and zmin and zmax give
 * the limits of the view volume along the z-axis.  (Note that this is NOT exactly
 * the same as the parameters in either glOrtho or glFrustum!  Most important to 
 * note is that zmin and zmax are given with reference to the view center, not the
 * eye.)  Note that xmin/xmax or ymin/ymax might be adjusted to match the aspect
 * ratio of the display area.  Default is cameraSetLimits(-5,5,-5,5,-10,-10)
 */
void cameraSetLimits(double xmin, double xmax, 
                     double ymin, double ymax, 
                     double zmin, double zmax);


/* A convenience method for calling setLimits(-limit,limit,-limit,limit,-2*limit,2*limit)
 */
void cameraSetScale(double limit);


/*
 * Sets whether the xy-limits should be adjusted to match the
 * aspect ratio of the display area.  The value is 0 or 1, 
 * default is 1.
 */
void cameraSetPreserveAspect(int preserve);


/* Sets whether the projection is orthographic or perspective.
 * The default is perspective.  Value is 0 or non-zero, default is 0.
 */
void cameraSetOrthographic(int ortho);


/* This function is for use with GLUT.  It must be used together with the
 * applyCamera() and trackballMotionFunction() functions from this file.
 * To implement basic trackball rotation with mouse dragging, call
 * cameraApply() at the start of your GLUT display function, call
 * glutMouseFunc(trackballMouseFunction) and glutMotionFunc(trackballMotionFunction)
 * during initialization.  (You can't use this at the same time as other
 * mouse-handling functions.)
 *    Note that rotation is always about the origin, so the trackball
 * really only works will if the x- and y-limits are symmetric about the
 * origin.
 */
void trackballMouseFunction(int button, int buttonState, int x, int y);


/* This function is for use with GLUT.  See the comment on the previous
 * function.
 */
void trackballMotionFunction(int x, int y);

