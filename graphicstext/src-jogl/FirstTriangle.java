import java.awt.*;
import javax.swing.*;
import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.*;


public class FirstTriangle extends GLJPanel implements GLEventListener{
	
	/**
	 * A main routine to create and show a window that contains a
	 * panel of type FirstTriangle.  The program ends when the
	 * user closes the window.
	 */
	public static void main(String[] args) {
		JFrame window = new JFrame("The Basic OpenGL RGB Triangle");
		FirstTriangle panel = new FirstTriangle();
		window.setContentPane(panel);
		window.pack();
		window.setLocation(50,50);
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setVisible(true);
	}
	
	/**
	 * Constructor for class FirstTriangle.
	 */
	public FirstTriangle() {
		super( new GLCapabilities(null) ); // Makes a panel with default OpenGL "capabilities".
		setPreferredSize( new Dimension(500,500) );
		addGLEventListener(this); // A listener is essential! The listener is where the OpenGL programming lives.
	}
	
	
	//-------------------- GLEventListener Methods -------------------------

	/**
	 * The display method is called when the panel needs to be redrawn.
	 * The is where the code goes for drawing the image, using OpenGL commands.
	 */
	public void display(GLAutoDrawable drawable) {	
		
		GL2 gl2 = drawable.getGL().getGL2(); // The object that contains all the OpenGL methods.
		 
	    gl2.glClearColor( 0, 0, 0, 1 );  // (In fact, this is the default.)
	    gl2.glClear( GL2.GL_COLOR_BUFFER_BIT );
	    
	    gl2.glBegin(GL2.GL_TRIANGLES);
	    gl2.glColor3d( 1, 0, 0 ); // red
	    gl2.glVertex2d( -0.8, -0.8 );
	    gl2.glColor3d( 0, 1, 0 ); // green
	    gl2.glVertex2d( 0.8, -0.8 );
	    gl2.glColor3d( 0, 0, 1 ); // blue
	    gl2.glVertex2d( 0, 0.9 );
	    gl2.glEnd(); 
		
	} // end display()

	public void init(GLAutoDrawable drawable) {
		   // called when the panel is created
	}

	public void dispose(GLAutoDrawable drawable) {
			// called when the panel is being disposed
	}

	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
			// called when user resizes the window
	}
	
}
