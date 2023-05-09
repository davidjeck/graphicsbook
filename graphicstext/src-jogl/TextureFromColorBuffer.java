
import java.awt.*;
import java.awt.event.*;

import javax.swing.*;

import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.GLJPanel;
import com.jogamp.opengl.util.gl2.GLUT;

/**
 * This program demonstrates the technique of taking a texture 
 * image from the OpenGL color buffer.  The display() method draws
 * a 2D scene, grabs that scene as a texture, and then renders
 * a 3D object textured with that texture.  The 2D scene can be
 * animated, which animates the texture on the object.
 */
public class TextureFromColorBuffer extends JPanel implements GLEventListener {

	public static void main(String[] args) {
		JFrame window = new JFrame("Texture from Color Buffer");
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setContentPane(new TextureFromColorBuffer());
		window.pack();
		window.setVisible(true);
	}


	private GLJPanel drawable;  // The panel where the drawing is done.

	private Camera camera;  // Contains the current view transform and projection.
          	                // The user can drag with the mouse to rotate the view.

	private int frameNumber;    // Drives the animation.  A timer adds 1
								// to this value every 30 milliseconds
								// and repaints the panel.

	private JCheckBox animate;  // Controls whether the animation is running.

	private Timer animator;  // The timer that drives the animation,
							 // which is started and stopped in response
							 // to the animate checkbox.

	/* The following variables are used for selecting/rendering one object.
      Note that the objects that are used come with texture coordinates. */   
	private String[] objectNames = { "Sphere", "Cylinder", "Cube", "Cone", "Torus", "Teapot" };

	private JComboBox<String> objectSelect;  // Where the user selects which object to render.

	GLUT glut = new GLUT();

	/**
	 * Set up the JPanel containing a GLJPanel with some controls
	 * at the bottom.  Set up a Camera and TrackBall for 3D viewing.
	 */
	public TextureFromColorBuffer() {
		drawable = new GLJPanel();
		drawable.setPreferredSize(new Dimension(600,600));
		drawable.addGLEventListener(this);
		setLayout(new BorderLayout());
		add(drawable, BorderLayout.CENTER);
		animate = new JCheckBox("Animate");
		animate.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				if (animate.isSelected())
					animator.start();
				else
					animator.stop();
			}
		});
		JPanel bottom = new JPanel();
		bottom.setLayout(new FlowLayout(FlowLayout.CENTER));
		bottom.add(animate);
		add(bottom, BorderLayout.SOUTH);
		animator = new Timer(30, new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				frameNumber++;
				drawable.repaint();
			}
		});
		objectSelect = new JComboBox<String>();
		for (String s : objectNames)
			objectSelect.addItem(s);
		objectSelect.addItem("SHOW 2D SCENE");
		bottom.add(Box.createHorizontalStrut(15));
		bottom.add(objectSelect);
		objectSelect.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				camera.lookAt(0,0,30,0,0,0,0,1,0); // reset view to default
				repaint();
			}
		});
		camera = new Camera();
		camera.setScale(1);
		camera.installTrackball(this);
	}

	/**
	 * No OpenGL state is set in the init() method, since
	 * all necessary state is set up in the display method.
	 */
	public void init(GLAutoDrawable drawable) {
	}

	/**
	 * Draw a 3D object textured with an image that OpenGL has
	 * drawn and then grabbed from the color buffer.
	 */
	public void display(GLAutoDrawable drawable) {
		GL2 gl = drawable.getGL().getGL2();

		int[] viewPort = new int[4];  // The current viewport; x and y will be 0.
		gl.glGetIntegerv(GL2.GL_VIEWPORT, viewPort, 0);
		int textureWidth = viewPort[2];  // The width of the texture.
		int textureHeight = viewPort[3]; // The height of the texture.
		
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
//		System.out.println("Using texture image size " 
//				+ textureWidth + "-by-" + textureHeight);
		gl.glViewport(0,0,textureWidth,textureHeight);
		draw2DFrame(gl);
		gl.glViewport(0, 0, viewPort[2], viewPort[3]);  // Restore the full viewpoint.

		if (objectSelect.getSelectedIndex() == 6) {
			// Show the 2D image as it has been drawn into
			// the color buffer.
			return;
		}

		/* Grab the image from the color buffer for use as a 2D texture. */
		
		gl.glBindTexture(GL2.GL_TEXTURE_2D, 0); // JOGL requires binding texture 0??  Should be automatic?

		gl.glCopyTexImage2D(GL2.GL_TEXTURE_2D, 0, GL2.GL_RGBA, 
				0, 0, textureWidth, textureHeight, 0);

		/* Set up 3D viewing, enable 2D texture, and draw the object selected by the user. */

		gl.glPushAttrib(GL2.GL_LIGHTING_BIT | GL2.GL_TEXTURE_BIT);

		gl.glEnable(GL2.GL_LIGHTING);
		gl.glEnable(GL2.GL_LIGHT0);
		float[] dimwhite = { 0.4f, 0.4f, 0.4f };
		gl.glLightfv(GL2.GL_LIGHT0, GL2.GL_SPECULAR, dimwhite, 0);
		gl.glEnable(GL2.GL_DEPTH_TEST);
		gl.glLightModeli(GL2.GL_LIGHT_MODEL_LOCAL_VIEWER, GL2.GL_TRUE);

		gl.glLightModeli(GL2.GL_LIGHT_MODEL_COLOR_CONTROL, GL2.GL_SEPARATE_SPECULAR_COLOR);
	       // I am cheating by using separate specular color here, which requires OpenGL 1.2, but
	       // it gives nicer specular highlights on textured surfaces.

		gl.glClearColor(0,0,0,1);
		gl.glClear(GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT);
		camera.apply(gl);

		/* Since we don't have mipmaps, we MUST set the MIN filter to a non-mipmaped
		 * version; leaving the value at its default will produce no texturing at all! */
		gl.glTexParameteri(GL2.GL_TEXTURE_2D, GL2.GL_TEXTURE_MIN_FILTER, GL2.GL_LINEAR);

		gl.glEnable(GL2.GL_TEXTURE_2D);

		float[] white = { 1, 1, 1, 1 };
		gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_AMBIENT_AND_DIFFUSE, white, 0);
		gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_SPECULAR, white, 0);
		gl.glMateriali(GL2.GL_FRONT_AND_BACK, GL2.GL_SHININESS, 128);
		int selectedObject = objectSelect.getSelectedIndex();
		gl.glRotated(15,3,2,0);
		gl.glRotated(90,-1,0,0);
		if (selectedObject == 1 || selectedObject == 3)
			gl.glTranslated(0,0,-0.5);
		else if (selectedObject == 5)
			gl.glRotatef(90,1,0,0);
		switch (selectedObject) {
		case 0: TexturedShapes.uvSphere(gl); break;
		case 1: TexturedShapes.uvCylinder(gl); break;
		case 2: TexturedShapes.cube(gl); break;
		case 3: TexturedShapes.uvCone(gl); break;
		case 4: TexturedShapes.uvTorus(gl); break;
		case 5: glut.glutSolidTeapot(0.5);
		}

		gl.glPopAttrib();

	}


	/**
	 * This method is called by display() to draw the 2D scene that
	 * will be used as a texture.  The scene is the same one that
	 * was used in the program JoglHierarchicalModeling2D.
	 */
	public void draw2DFrame(GL2 gl2) {
		gl2.glDisable(GL2.GL_DEPTH_TEST);
		gl2.glClearColor(0.5f, 0.5f, 1, 1);
		gl2.glClear(GL2.GL_COLOR_BUFFER_BIT); // Fills the scene with blue.
		gl2.glMatrixMode(GL2.GL_PROJECTION);
		gl2.glLoadIdentity();
		gl2.glOrtho(0, 7, -1, 4, -1, 1);
		gl2.glMatrixMode(GL2.GL_MODELVIEW);
		gl2.glLoadIdentity();

		/* Draw three green triangles to form a ridge of hills in the background */

		gl2.glColor3f(0, 0.6f, 0.2f);
		gl2.glBegin(GL2.GL_POLYGON);
		gl2.glVertex2f(-3,-1);
		gl2.glVertex2f(1.5f,1.65f);
		gl2.glVertex2f(5,-1);
		gl2.glEnd();
		gl2.glBegin(GL2.GL_POLYGON);
		gl2.glVertex2f(-3,-1);
		gl2.glVertex2f(3,2.1f);
		gl2.glVertex2f(7,-1);
		gl2.glEnd();
		gl2.glBegin(GL2.GL_POLYGON);
		gl2.glVertex2f(0,-1);
		gl2.glVertex2f(6,1.2f);
		gl2.glVertex2f(20,-1);
		gl2.glEnd();

		/* Draw a bluish-gray rectangle to represent the road. */

		gl2.glColor3f(0.4f, 0.4f, 0.5f);
		gl2.glBegin(GL2.GL_POLYGON);
		gl2.glVertex2f(0,-0.4f);
		gl2.glVertex2f(7,-0.4f);
		gl2.glVertex2f(7,0.4f);
		gl2.glVertex2f(0,0.4f);
		gl2.glEnd();

		/* Draw a dashed white line to represent the stripe down the middle
		 * of the road.  Dotted/dashed lines use line "stippling" -- look it up
		 * if you want to know how to do it. */

		gl2.glLineWidth(6);  // Set the line width to be 6 pixels.
		gl2.glColor3f(1,1,1);
		gl2.glBegin(GL2.GL_LINES);
		gl2.glVertex2f(0,0);
		gl2.glVertex2f(7,0);
		gl2.glEnd();
		gl2.glLineWidth(1);  // Reset the line width to be 1 pixel.

		/* Draw the sun.  The drawSun method draws the sun centered at (0,0).  A 2D translation
		 * is applied to move the center of the sun to (5,3.3). */

		gl2.glPushMatrix();
		gl2.glTranslated(5,3.3,0);
		gl2.glRotated(-frameNumber*0.7,0,0,1);
		drawSun(gl2);
		gl2.glPopMatrix();

		/* Draw three windmills.  The drawWindmill method draws the windmill with its base 
		 * at (0,0), and the top of the pole at (0,3).  Each windmill is first scaled to change
		 * its size and then translated to move its base to a different paint.  In the animation,
		 * the vanes of the windmill rotate.  That rotation is done with a transform inside the
		 * drawWindmill method. */

		gl2.glPushMatrix();
		gl2.glTranslated(0.75,1,0);
		gl2.glScaled(0.6,0.6,1);
		drawWindmill(gl2);
		gl2.glPopMatrix();

		gl2.glPushMatrix();
		gl2.glTranslated(2.2,1.6,0);
		gl2.glScaled(0.4,0.4,1);
		drawWindmill(gl2);
		gl2.glPopMatrix();

		gl2.glPushMatrix();
		gl2.glTranslated(3.7,0.8,0);
		gl2.glScaled(0.7,0.7,1);
		drawWindmill(gl2);
		gl2.glPopMatrix();

		/* Draw the cart.  The drawCart method draws the cart with the center of its base at
		 * (0,0).  The body of the cart is 5 units long and 2 units high.  A scale is first
		 * applied to the cart to make its size more reasonable for the picture.  Then a
		 * translation is applied to move the cart horizontally.  The amount of the translation
		 * depends on the frame number, which makes the cart move from left to right across
		 * the screen as the animation progresses.  The cart animation repeats every 300 
		 * frames.  At the beginning of the animation, the cart is off the left edge of the
		 * screen. */

		gl2.glPushMatrix();
		gl2.glTranslated(-3 + 13*(frameNumber % 300) / 300.0, 0, 0);
		gl2.glScaled(0.3,0.3,1);
		drawCart(gl2);
		gl2.glPopMatrix();

	}

	/**
	 * Draw a sun with radius 0.5 centered at (0,0).  There are also 13 rays which
	 * extend outside from the sun for another 0.25 units.
	 */
	private void drawSun(GL2 gl2) {
		gl2.glColor3f(1,1,0);
		for (int i = 0; i < 13; i++) { // Draw 13 rays, with different rotations.
			gl2.glRotatef( 360f / 13, 0, 0, 1 ); // Note that the rotations accumulate!
			gl2.glBegin(GL2.GL_LINES);
			gl2.glVertex2f(0, 0);
			gl2.glVertex2f(0.75f, 0);
			gl2.glEnd();
		}
		drawDisk(gl2, 0.5);
		gl2.glColor3f(0,0,0);
	}

	/**
	 * Draw a 32-sided regular polygon as an approximation for a circular disk.
	 * (This is necessary since OpenGL has no commands for drawing ovals, circles,
	 * or curves.)  The disk is centered at (0,0) with a radius given by the 
	 * parameter.
	 */
	private void drawDisk(GL2 gl2, double radius) {
		gl2.glBegin(GL2.GL_POLYGON);
		for (int d = 0; d < 32; d++) {
			double angle = 2*Math.PI/32 * d;
			gl2.glVertex2d( radius*Math.cos(angle), radius*Math.sin(angle));
		}
		gl2.glEnd();
	}

	/**
	 * Draw a windmill, consisting of a pole and three vanes.  The pole extends from the
	 * point (0,0) to (0,3).  The vanes radiate out from (0,3).  A rotation that depends
	 * on the frame number is applied to the whole set of vanes, which causes the windmill
	 * to rotate as the animation proceeds.  Note that this method changes the current
	 * transform in the GL context gl!  The caller of this subroutine should take care
	 * to save and restore the original transform, if necessary.
	 */
	private void drawWindmill(GL2 gl2) {
		gl2.glColor3f(0.8f, 0.8f, 0.9f);
		gl2.glBegin(GL2.GL_POLYGON);
		gl2.glVertex2f(-0.05f, 0);
		gl2.glVertex2f(0.05f, 0);
		gl2.glVertex2f(0.05f, 3);
		gl2.glVertex2f(-0.05f, 3);
		gl2.glEnd();
		gl2.glTranslatef(0, 3, 0);
		gl2.glRotated(frameNumber * (180.0/46), 0, 0, 1);
		gl2.glColor3f(0.4f, 0.4f, 0.8f);
		for (int i = 0; i < 3; i++) {
			gl2.glRotated(120, 0, 0, 1);  // Note: These rotations accumulate.
			gl2.glBegin(GL2.GL_POLYGON);
			gl2.glVertex2f(0,0);
			gl2.glVertex2f(0.5f, 0.1f);
			gl2.glVertex2f(1.5f,0);
			gl2.glVertex2f(0.5f, -0.1f);
			gl2.glEnd();
		}
	}

	/**
	 * Draw a cart consisting of a rectangular body and two wheels.  The wheels
	 * are drawn by the drawWheel() method; a different translation is applied to each
	 * wheel to move them into position under the body.  The body of the cart
	 * is a red rectangle with corner at (0,-2.5), width 5, and height 2.  The
	 * center of the bottom of the rectangle is at (0,0).
	 */
	private void drawCart(GL2 gl2) {
		gl2.glPushMatrix();
		gl2.glTranslatef(-1.5f, -0.1f, 0);
		gl2.glScalef(0.8f,0.8f,1);
		drawWheel(gl2);
		gl2.glPopMatrix();
		gl2.glPushMatrix();
		gl2.glTranslatef(1.5f, -0.1f, 0);
		gl2.glScalef(0.8f,0.8f,1);
		drawWheel(gl2);
		gl2.glPopMatrix();
		gl2.glColor3f(1,0,0);
		gl2.glBegin(GL2.GL_POLYGON);
		gl2.glVertex2f(-2.5f,0);
		gl2.glVertex2f(2.5f,0);
		gl2.glVertex2f(2.5f,2);
		gl2.glVertex2f(-2.5f,2);
		gl2.glEnd();
	}

	/**
	 * Draw a wheel, centered at (0,0) and with radius 1. The wheel has 15 spokes
	 * that rotate in a clockwise direction as the animation proceeds.
	 */
	private void drawWheel(GL2 gl2) {
		gl2.glColor3f(0,0,0);
		drawDisk(gl2,1);
		gl2.glColor3f(0.75f, 0.75f, 0.75f);
		drawDisk(gl2, 0.8);
		gl2.glColor3f(0,0,0);
		drawDisk(gl2, 0.2);
		gl2.glRotatef(frameNumber*20,0,0,1);
		gl2.glBegin(GL2.GL_LINES);
		for (int i = 0; i < 15; i++) {
			gl2.glVertex2f(0,0);
			gl2.glVertex2d(Math.cos(i*2*Math.PI/15), Math.sin(i*2*Math.PI/15));
		}
		gl2.glEnd();
	}


	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
	}

	public void displayChanged(GLAutoDrawable drawable, boolean modeChanged,
			boolean deviceChanged) {
	}

	public void dispose(GLAutoDrawable drawable) {
	}
}
