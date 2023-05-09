

import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.net.URL;

import javax.imageio.ImageIO;
import com.jogamp.opengl.awt.GLJPanel;

import javax.swing.*;
import com.jogamp.opengl.*;

import com.jogamp.opengl.util.awt.ImageUtil;
import com.jogamp.opengl.util.gl2.GLUT;
import com.jogamp.opengl.util.texture.Texture;
import com.jogamp.opengl.util.texture.awt.AWTTextureIO;

/**
 * A panel of type TextureDemo displays a textured object,
 * which the user can rotate by dragging the mouse.  The main
 * routine in this class creates a window containing six
 * panels of type Texture Demo, with a variety of different
 * objects and textures.  The main routine shows a windoe 
 * that contains a TexttureDemo panel.
 */
public class TextureDemo extends GLJPanel implements GLEventListener, KeyListener {

	public static void main(String[] args){
		JFrame window = new JFrame("USE ARROW KES TO CHANGE OBJECTS/TEXTURES");
		GLJPanel content = new TextureDemo();
		window.setContentPane(content);
		window.pack();
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setVisible(true);
		System.out.println("The left and right arrow keys will change the object.");
		System.out.println("The up and down arrow keys will change the texture.");
		System.out.println("The HOME key restores the original point of view.");
		System.out.println("The mouse can be used to rotate the view.");
		content.requestFocusInWindow();
	}

	private Camera camera;  // Contains the current view transform and projection.
	                         // The user can drag with the mouse to rotate the view.

	private int currentObject;  // Code for the object  displayed in the panel.

	private int currentTexture;  // Code for the texture currently in use.
	
	private String[] textureFileNames = {
			"Earth-1024x512.jpg",
			"NightEarth-512x256.jpg",
			"brick001.jpg",
			"marble.jpg",
			"metal003.gif",
			"mandelbrot.jpeg"
	};
	
	private Texture[] textures = new Texture[textureFileNames.length];
	
	private final static int
	     SPHERE = 0,
	     CYLINDER = 1,
	     CONE = 2,
	     CUBE = 3,
	     TORUS = 4,
	     TEAPOT = 5,
	     SQUARE = 6,
	     CIRCLE = 7,
	     RING = 8;
	
	
	private GLUT glut = new GLUT();


	/**
	 * Create a TextureDemo panel to show an object with a texture, and sets up
	 * the camera and trackball so that the object can be rotated with the mouse.
	 */
	public TextureDemo() {
		setPreferredSize(new Dimension(600,600));
		addGLEventListener(this);
		camera = new Camera();
		camera.setScale(1);
		camera.installTrackball(this);
		addKeyListener(this);
	}

	/**
	 * This method will be called when the GLJPanel is first
	 * created.  Here, in addition to the usual setup for 3D,
	 * it sets a white material color, suitable for texturing.
	 * It also loads, binds and enables the texture. (Since the
	 * one texture will be used throughout the program, it
	 * makes sense to do this once in the init method.)
	 */
	public void init(GLAutoDrawable drawable) {
		GL2 gl = drawable.getGL().getGL2();
		gl.glClearColor(0,0,0,1);
		gl.glEnable(GL2.GL_LIGHTING);
		gl.glEnable(GL2.GL_LIGHT0);
		gl.glEnable(GL2.GL_DEPTH_TEST);
		gl.glLightModeli(GL2.GL_LIGHT_MODEL_TWO_SIDE, 1);
		gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_AMBIENT_AND_DIFFUSE, new float[] { 1,1,1,1 }, 0);
		gl.glMaterialfv(GL2.GL_FRONT_AND_BACK, GL2.GL_SPECULAR, new float[] { 0.3f, 0.3f, 0.3f, 1 }, 0);
		gl.glMateriali(GL2.GL_FRONT_AND_BACK, GL2.GL_SHININESS, 100);
		gl.glLightModeli(GL2.GL_LIGHT_MODEL_COLOR_CONTROL, GL2.GL_SEPARATE_SPECULAR_COLOR);
		     // I am cheating by using separate specular color, which requires OpenGL 1.2, but
		     // it gives nicer specular highlights on textured surfaces.
		for (int i = 0; i < textureFileNames.length; i++) {
			try {
				URL textureURL;
				textureURL = getClass().getClassLoader().getResource("textures/" + textureFileNames[i]);
				if (textureURL != null) {
//					textures[i] = TextureIO.newTexture(textureURL, true, null);  // Alternative loader, gives upside down textures!
					BufferedImage img = ImageIO.read(textureURL);
					ImageUtil.flipImageVertically(img);
					textures[i] = AWTTextureIO.newTexture(GLProfile.getDefault(), img, true);
					textures[i].setTexParameteri(gl, GL2.GL_TEXTURE_WRAP_S, GL2.GL_REPEAT);
					textures[i].setTexParameteri(gl, GL2.GL_TEXTURE_WRAP_T, GL2.GL_REPEAT);
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
		textures[0].enable(gl);
	}

	/**
	 * Display method renders the current object, using the current texture.
	 */
	public void display(GLAutoDrawable drawable) {
		GL2 gl = drawable.getGL().getGL2();
		
		gl.glClear(GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT);
		camera.apply(gl);
		if (currentObject <= CONE)
			gl.glRotated(90,-1,0,0);  // rotate axis of object from z-axis to y-axis
		if (currentObject == CONE || currentObject == CYLINDER)
		    gl.glTranslated(0,0,-0.5);  // moves center of object to the origin

		textures[currentTexture].bind(gl);  // Says which texture to use.

		switch (currentObject) {
		case SPHERE: TexturedShapes.uvSphere(gl); break;
		case CYLINDER: TexturedShapes.uvCylinder(gl); break;
		case CONE: TexturedShapes.uvCone(gl); break;
		case CUBE: TexturedShapes.cube(gl); break;
		case TORUS: TexturedShapes.uvTorus(gl); break;
		case TEAPOT: 
			gl.glFrontFace(GL2.GL_CW); // Teapot has non-standard front faces
			                           // that don't work right with two-sided lighting.
			                           // This reverses the usual test for front face.
			glut.glutSolidTeapot(0.5);
			gl.glFrontFace(GL2.GL_CCW);  
			break;
		case SQUARE: TexturedShapes.square(gl); break;
		case CIRCLE: TexturedShapes.circle(gl); break;
		case RING: TexturedShapes.ring(gl); break;
		}
	}

	// Extra, unused methods of the GLEventListener interface
	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) { }
	public void displayChanged(GLAutoDrawable drawable, boolean modeChanged, boolean deviceChanged) { }
	public void dispose(GLAutoDrawable drawable) { }

	/**
	 * Left/right arrow keys change the current object.
	 * Up/down arrow keys change the current texture.
	 * Home key restores the default camera viewpoint.
	 */
	public void keyPressed(KeyEvent e) {
		int key = e.getKeyCode();
		if ( key == KeyEvent.VK_UP ) {
			currentTexture++;
			if (currentTexture >= textureFileNames.length)
				currentTexture = 0;
		}
		else if ( key == KeyEvent.VK_DOWN ) {
			currentTexture--;
			if (currentTexture < 0 )
				currentTexture = textureFileNames.length - 1;
		}
		else if ( key == KeyEvent.VK_LEFT ) {
			currentObject--;
			if (currentObject < 0)
				currentObject = 8;
		}
		else if ( key == KeyEvent.VK_RIGHT ) {
			currentObject++;
			if (currentObject > 8)
				currentObject = 0;
		}
		else if ( key == KeyEvent.VK_HOME ) {
			camera.lookAt(0,0,30, 0,0,0, 0,1,0);
		}
		repaint();
	}

	// Extra, unused methods of the KeyListener interface.
	public void keyReleased(KeyEvent e) { }
	public void keyTyped(KeyEvent e) { }
}
