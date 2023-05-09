

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.GLJPanel;
import com.jogamp.opengl.util.gl2.GLUT;  // for drawing GLUT objects (such as the teapot)

/**
 * A template for a basic JOGL application with support for animation, and for
 * keyboard and mouse event handling, and for a menu.  To enable the support, 
 * uncomment the appropriate lines in main(), in the constructor, and in the
 * init() method.  See all the lines that are marked with "TODO".
 * 
 * See the JOGL documentation at http://jogamp.org/jogl/www/
 * Note that this program is based on JOGL 2.3, which has some differences
 * from earlier versions; in particular, some of the package names have changed.
 */
public class JoglStarter extends JPanel implements 
                   GLEventListener, KeyListener, MouseListener, MouseMotionListener, ActionListener {

	public static void main(String[] args) {
		JFrame window = new JFrame("JOGL");
		JoglStarter panel = new JoglStarter();
		window.setContentPane(panel);
		/* TODO: If you want to have a menu, comment out the following line. */
		//window.setJMenuBar(panel.createMenuBar());
		window.pack();
		window.setLocation(50,50);
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setVisible(true);
	}
	
	private GLJPanel display;
    private Timer animationTimer;

	private int frameNumber = 0;  // The current frame number for an animation.
	
	private GLUT glut = new GLUT();  // TODO: For drawing GLUT objects, otherwise, not needed.

	public JoglStarter() {
		GLCapabilities caps = new GLCapabilities(null);
		display = new GLJPanel(caps);
		display.setPreferredSize( new Dimension(600,600) );  // TODO: set display size here
		display.addGLEventListener(this);
		setLayout(new BorderLayout());
		add(display,BorderLayout.CENTER);
		// TODO:  Other components could be added to the main panel.
		
		// TODO:  Uncomment the next two lines to enable keyboard event handling
		//requestFocusInWindow();
		//addKeyListener(this);

		// TODO:  Uncomment the next one or two lines to enable mouse event handling
		//display.addMouseListener(this);
		//display.addMouseMotionListener(this);
		
		//TODO:  Uncomment the following line to start the animation
		//startAnimation();

	}

	// ---------------  Methods of the GLEventListener interface -----------
	
	/**
	 * This method is called when the OpenGL display needs to be redrawn.
	 */
	public void display(GLAutoDrawable drawable) {	
		    // called when the panel needs to be drawn

		GL2 gl = drawable.getGL().getGL2();
		gl.glClearColor(0,0,0,0);
		gl.glClear( GL.GL_COLOR_BUFFER_BIT | GL.GL_DEPTH_BUFFER_BIT ); // TODO? Omit depth buffer for 2D.

		gl.glMatrixMode(GL2.GL_PROJECTION);  // TODO: Set up a better projection?
		gl.glLoadIdentity();
		gl.glOrtho(-1,1,-1,1,-2,2);
		gl.glMatrixMode(GL2.GL_MODELVIEW);

		gl.glLoadIdentity();             // Set up modelview transform. 

		// TODO: add drawing code here!!

	}

	/**
	 * This is called when the GLJPanel is first created.  It can be used to initialize
	 * the OpenGL drawing context.
	 */
	public void init(GLAutoDrawable drawable) {
		    // called when the panel is created
		GL2 gl = drawable.getGL().getGL2();
		gl.glClearColor(0.3F, 0.3F, 0.3F, 1.0F);  // TODO: Set background color

		gl.glEnable(GL2.GL_DEPTH_TEST);  // TODO: Required for 3D drawing, not usually for 2D.
	    
	    // TODO: Uncomment the following 4 lines to do some typical initialization for 
	    // lighting and materials.

	    // gl.glEnable(GL2.GL_LIGHTING);        // Enable lighting.
	    // gl.glEnable(GL2.GL_LIGHT0);          // Turn on a light.  By default, shines from direction of viewer.
	    // gl.glEnable(GL2.GL_NORMALIZE);       // OpenGL will make all normal vectors into unit normals
	    // gl.glEnable(GL2.GL_COLOR_MATERIAL);  // Material ambient and diffuse colors can be set by glColor*
	}

	/**
	 * Called when the size of the GLJPanel changes.  Note:  glViewport(x,y,width,height)
	 * has already been called before this method is called!
	 */
	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
		// TODO: Add any code required to respond to the size of the display area.
		//             (Not usually needed.)
	}

	/**
	 * This is called before the GLJPanel is destroyed.  It can be used to release OpenGL resources.
	 */
	public void dispose(GLAutoDrawable drawable) {
	}
	
	
	// ------------ Support for a menu -----------------------
	
	public JMenuBar createMenuBar() {
		JMenuBar menubar = new JMenuBar();
		
		MenuHandler menuHandler = new MenuHandler(); // An object to respond to menu commands.
		
		JMenu menu = new JMenu("Menu"); // Create a menu and add it to the menu bar
		menubar.add(menu);
		
		JMenuItem item = new JMenuItem("Quit");  // Create a menu command.
		item.addActionListener(menuHandler);  // Set up handling for this command.
		menu.add(item);  // Add the command to the menu.
		
		// TODO:  Add additional menu commands and menus.
		
		return menubar;
	}
	
	/**
	 * A class to define the ActionListener object that will respond to menu commands.
	 */
	private class MenuHandler implements ActionListener {
		public void actionPerformed(ActionEvent evt) {
			String command = evt.getActionCommand();  // The text of the command.
			if (command.equals("Quit")) {
				System.exit(0);
			}
			// TODO: Implement any additional menu commands.
		}
	}

	
	// ------------ Support for keyboard handling  ------------

	/**
	 * Called when the user presses any key on the keyboard, including
	 * special keys like the arrow keys, the function keys, and the shift key.
	 * Note that the value of key will be one of the constants from
	 * the KeyEvent class that identify keys such as KeyEvent.VK_LEFT,
	 * KeyEvent.VK_RIGHT, KeyEvent.VK_UP, and KeyEvent.VK_DOWN for the arrow
	 * keys, KeyEvent.VK_SHIFT for the shift key, and KeyEvent.VK_F1 for a
	 * function key.
	 */
	public void keyPressed(KeyEvent e) {
		int key = e.getKeyCode();  // Tells which key was pressed.
		// TODO:  Add code to respond to key presses.
		display.repaint();  // Causes the display() function to be called.
	}

	/**
	 * Called when the user types a character.  This function is called in
	 * addition to one or more calls to keyPressed and keyTyped. Note that ch is an
	 * actual character such as 'A' or '@'.
	 */
	public void keyTyped(KeyEvent e) { 
		char ch = e.getKeyChar();  // Which character was typed.
		// TODO:  Add code to respond to the character being typed.
		display.repaint();  // Causes the display() function to be called.
	}

	/**
	 * Called when the user releases any key.
	 */
	public void keyReleased(KeyEvent e) { 
	}
	
	
	// --------------------------- animation support ---------------------------
	
	/* You can call startAnimation() to run an animation.  A frame will be drawn every
	 * 30 milliseconds (can be changed in the call to glutTimerFunc.  The global frameNumber
	 * variable will be incremented for each frame.  Call pauseAnimation() to stop animating.
	 */
	
	private boolean animating;  // True if animation is running.  Do not set directly.
	                            // This is set by startAnimation() and pauseAnimation().
	
	private void updateFrame() {
		frameNumber++;
		// TODO:  add any other updating required for the next frame.
	}
	
	public void startAnimation() {
		if ( ! animating ) {
			if (animationTimer == null) {
				animationTimer = new Timer(30, this);
			}
			animationTimer.start();
			animating = true;
		}
	}
	
	public void pauseAnimation() {
		if (animating) {
			animationTimer.stop();
			animating = false;
		}
	}
	
	public void actionPerformed(ActionEvent evt) {
		updateFrame();
		display.repaint();
	}

	
	
	// ---------------------- support for mouse events ----------------------
	
	private boolean dragging;  // is a drag operation in progress?
	
	private int startX, startY;  // starting location of mouse during drag
	private int prevX, prevY;    // previous location of mouse during drag
	
	/**
	 * Called when the user presses a mouse button on the display.
	 */
	public void mousePressed(MouseEvent evt) {
		if (dragging) {
			return;  // don't start a new drag while one is already in progress
		}
		int x = evt.getX();  // mouse location in pixel coordinates.
		int y = evt.getY();
		// TODO: respond to mouse click at (x,y)
		dragging = true;  // might not always be correct!
		prevX = startX = x;
		prevY = startY = y;
		display.repaint();    //  only needed if display should change
	}

	/**
	 * Called when the user releases a mouse button after pressing it on the display.
	 */
	public void mouseReleased(MouseEvent evt) {
		if (! dragging) {
			return;
		}
		dragging = false;
		// TODO:  finish drag (generally nothing to do here)
	}

	/**
	 * Called during a drag operation when the user drags the mouse on the display/
	 */
	public void mouseDragged(MouseEvent evt) {
		if (! dragging) {
			return;
		}
		int x = evt.getX();  // mouse location in pixel coordinates.
		int y = evt.getY();
		// TODO:  respond to mouse drag to new point (x,y)
		prevX = x;
		prevY = y;
		display.repaint();
	}

	public void mouseMoved(MouseEvent evt) { }    // Other methods required for MouseListener, MouseMotionListener.
	public void mouseClicked(MouseEvent evt) { }
	public void mouseEntered(MouseEvent evt) { }
	public void mouseExited(MouseEvent evt) { }



}
