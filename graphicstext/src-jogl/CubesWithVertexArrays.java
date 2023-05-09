import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.*;
import com.jogamp.common.nio.Buffers;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;


/**
 * Use OpenGL to draw two cubes, one using glDrawArrays,
 * and one using glDrawElements.  The arrow keys can be
 * used to rotate both cubes.
 *
 * Note that this program does not use lighting.
 */
public class CubesWithVertexArrays extends GLJPanel implements GLEventListener, KeyListener {

	/**
	 * A main routine to create and show a window that contains a
	 * panel of type CubesWithVertexArrays.  The program ends when the
	 * user closes the window.
	 */
	public static void main(String[] args) {
		JFrame window = new JFrame("USE ARROW KEYS TO ROTATE; HOME KEY RESETS");
		CubesWithVertexArrays panel = new CubesWithVertexArrays();
		window.setContentPane(panel);
		window.pack();
		window.setLocation(50,50);
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setVisible(true);
		panel.requestFocusInWindow();
	}

	/**
	 * Constructor for class UnlitCube.
	 */
	public CubesWithVertexArrays() {
		super( new GLCapabilities(null) ); // Makes a panel with default OpenGL "capabilities".
		setPreferredSize( new Dimension(600,300) );
		addGLEventListener(this); // A listener is essential! The listener is where the OpenGL programming lives.
		addKeyListener(this);
	}

	private double rotateX = 15;    // rotations of the cube about the axes
	private double rotateY = -15;
	private double rotateZ = 0;

	//---------------------- data for glDrawArrays and glDrawElements  ----------------

	/* Arrays for use with glDrawElements.  This is the data for a cube with 6 different
	 * colors at the six vertices.  (Looks kind of strange without lighting.)
	 */

	private float[] vertexCoords = {  // Coordinates for the vertices of a cube.
			1,1,1,   1,1,-1,   1,-1,-1,   1,-1,1,
			-1,1,1,  -1,1,-1,  -1,-1,-1,  -1,-1,1  };

	private float[] vertexColors = {  // An RGB color value for each vertex
			1,1,1,   1,0,0,   1,1,0,   0,1,0,
			0,0,1,   1,0,1,   0,0,0,   0,1,1  };

	private int[] elementArray = {  // Vertex number for the six faces.
			0,1,2,3, 0,3,7,4, 0,4,5,1,
			6,2,1,5, 6,5,4,7, 6,7,3,2  };


	/* We will draw edges for the first cube using this array with glDrawElements.
	 * (It looks pretty bad without lighting if edges aren't drawn.
	 */

	private int[] edgeElementArray = {
			0,1,  1,5,  5,4,  4,0,    // edges of the top face
			7,3,  3,2,  2,6,  6,7,    // edges of the bottom face
			1,2,  0,3,  4,7,  5,6  }; // edges connecting top face to bottom face

	/* Arrays for use with glDrawArrays.  The coordinate array contains four sets of vertex
	 * coordinates for each face.  The color array must have a color for each vertex.  Since
	 * the color of each face is solid, there is a lot of redundancy in the color array.
	 * There is also redundancy in the coordinate array, compared to using glDrawElements.
	 * But note that it is impossible to use a single call to glDrawElements to draw a cube 
	 * with six faces where each face has a different solid color, since with glDrawElements, 
	 * the colors are associated with the vertices, not the faces.
	 */

	private float[] cubeCoords = {
			1,1,1,    -1,1,1,   -1,-1,1,   1,-1,1,      // face #1
			1,1,1,     1,-1,1,   1,-1,-1,  1,1,-1,      // face #2
			1,1,1,     1,1,-1,  -1,1,-1,  -1,1,1,       // face #3
			-1,-1,-1, -1,1,-1,   1,1,-1,   1,-1,-1,     // face #4
			-1,-1,-1, -1,-1,1,  -1,1,1,   -1,1,-1,      // face #5
			-1,-1,-1,  1,-1,-1,  1,-1,1,   -1,-1,1  };  // face #6

	private float[] cubeFaceColors = {
			1,0,0,  1,0,0,  1,0,0,  1,0,0,      // face #1 is red
			0,1,0,  0,1,0,  0,1,0,  0,1,0,      // face #2 is green
			0,0,1,  0,0,1,  0,0,1,  0,0,1,      // face #3 is blue
			1,1,0,  1,1,0,  1,1,0,  1,1,0,      // face #4 is yellow
			0,1,1,  0,1,1,  0,1,1,  0,1,1,      // face #5 is cyan
			1,0,1,  1,0,1,  1,0,1,  1,0,1,   }; // face #6 is red

	// ----------------------- Data Buffers -------------------------------

	/* For use with glDrawArrays and glDrawElements with JOGL, the data must
	 * be in "buffers", since Java arrays are not suitable for use with OpenGL.
	 * This is an unfortunate necessity, as it complicates the API. Fortunately,
	 * we can simply wrap the arrays into buffers.
	 */

	// For glDrawElements, to draw the cube faces.
	private FloatBuffer vertexCoordBuffer = Buffers.newDirectFloatBuffer(vertexCoords);
	private FloatBuffer vertexColorBuffer = Buffers.newDirectFloatBuffer(vertexColors);
	private IntBuffer elementBuffer = Buffers.newDirectIntBuffer(elementArray);

	// For glDrawElements, to draw the cube edges.
	private IntBuffer edgeElementBuffer = Buffers.newDirectIntBuffer(edgeElementArray);

    // For glDrawArrays, to draw the second cube.
	private FloatBuffer cubeCoordBuffer = Buffers.newDirectFloatBuffer(cubeCoords); 
	private FloatBuffer cubeFaceColorBuffer = Buffers.newDirectFloatBuffer(cubeFaceColors);  


	//-------------------- GLEventListener Methods -------------------------

	/**
	 * The display method is called when the panel needs to be redrawn.
	 * The is where the code goes for drawing the image, using OpenGL commands.
	 */
	public void display(GLAutoDrawable drawable) {	

		GL2 gl2 = drawable.getGL().getGL2(); // The object that contains all the OpenGL methods.

		gl2.glClear( GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT );

	    gl2.glLoadIdentity();             // Set up modelview transform, first cube.
	    gl2.glTranslated(-2, 0, 0);     // Move cube to left half of window.
	    
	    gl2.glRotated(rotateZ,0,0,1);     // Apply rotations.
	    gl2.glRotated(rotateY,0,1,0);
	    gl2.glRotated(rotateX,1,0,0);
	    
	    gl2.glVertexPointer( 3, GL2.GL_FLOAT, 0, cubeCoordBuffer );  // Set data type and location, first cube.
	    gl2.glColorPointer( 3,GL2. GL_FLOAT, 0, cubeFaceColorBuffer );

	    gl2.glEnableClientState( GL2.GL_VERTEX_ARRAY );
	    gl2.glEnableClientState( GL2.GL_COLOR_ARRAY );

	    gl2.glDrawArrays( GL2.GL_QUADS, 0, 24 ); // Draw the first cube!
	    

	    // Second cube, using glDrawElements.  Also draw the cube edges, and enable polygon offset
	    // while the faces of the cube are being drawn.
	    
	    gl2.glLoadIdentity();             // Set up modelview transform, first cube.

	    gl2. glTranslated(2, 0, 0);      // Move cube to right half of window.

	    gl2.glRotated(rotateZ,0,0,1);     // Apply rotations.
	    gl2.glRotated(rotateY,0,1,0);
	    gl2.glRotated(rotateX,1,0,0);
	    
	    gl2.glVertexPointer( 3, GL2.GL_FLOAT, 0, vertexCoordBuffer );  // Set data type and location, second cube.
	    gl2.glColorPointer( 3, GL2.GL_FLOAT, 0, vertexColorBuffer );
	    

	    gl2.glEnable(GL2.GL_POLYGON_OFFSET_FILL);
	    gl2. glPolygonOffset(1,1);
	    gl2.glDrawElements(GL2. GL_QUADS, 24, GL2.GL_UNSIGNED_INT, elementBuffer ); // Draw the second cube!
	    gl2.glDisable(GL2.GL_POLYGON_OFFSET_FILL);
	    
	    gl2.glDisableClientState( GL2.GL_COLOR_ARRAY );  // Don't use color array for the edges.
	    gl2.glColor3f(0,0,0);  // The edges will be black.
	    gl2.glLineWidth(2);
	    
	    gl2.glDrawElements( GL2.GL_LINES, 24, GL2.GL_UNSIGNED_INT, edgeElementBuffer );  // Draw the edges!

	} // end display()

	public void init(GLAutoDrawable drawable) {
		// called when the panel is created
		GL2 gl2 = drawable.getGL().getGL2();
		gl2.glMatrixMode(GL2.GL_PROJECTION);
		gl2.glOrtho(-4, 4, -2, 2, -2, 2);  // simple orthographic projection
		gl2.glMatrixMode(GL2.GL_MODELVIEW);
		gl2.glClearColor( 0.5F, 0.5F, 0.5F, 1 );
		gl2.glEnable(GL2.GL_DEPTH_TEST);
	}

	public void dispose(GLAutoDrawable drawable) {
		// called when the panel is being disposed
	}

	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
		// called when user resizes the window
	}

	// ----------------  Methods from the KeyListener interface --------------

	public void keyPressed(KeyEvent evt) {
		int key = evt.getKeyCode();
		if ( key == KeyEvent.VK_LEFT )
			rotateY -= 15;
		else if ( key == KeyEvent.VK_RIGHT )
			rotateY += 15;
		else if ( key == KeyEvent.VK_DOWN)
			rotateX += 15;
		else if ( key == KeyEvent.VK_UP )
			rotateX -= 15;
		else if ( key == KeyEvent.VK_PAGE_UP )
			rotateZ += 15;
		else if ( key == KeyEvent.VK_PAGE_DOWN )
			rotateZ -= 15;
		else if ( key == KeyEvent.VK_HOME )
			rotateX = rotateY = rotateZ = 0;
		repaint();
	}

	public void keyReleased(KeyEvent evt) {
	}

	public void keyTyped(KeyEvent evt) {
	}

}
