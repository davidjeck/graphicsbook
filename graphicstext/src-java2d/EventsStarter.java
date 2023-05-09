import java.awt.*;        // import statements to make necessary classes available
import java.awt.event.*;
import java.awt.geom.*;
import java.awt.image.BufferedImage;

import javax.swing.*;

/**
 *  This class shows a setup for responding to user events in a graphics program.
 *  Mouse and keyboard events are implemented.  In this example, the image that
 *  should be displayed on the screen is stored in a BuffereImage.  The paintComponent
 *  method simply copies that image to the screen.  Event-handling methods make
 *  changes to the BufferedImage and call repaint() to get the changed image copied
 *  to the screen. 
 *     To experiment with events, modify the definitions of the event-handling
 *  methods, which are defined in nested classes MouseHandler and KeyHandler.
 */
public class EventsStarter extends JPanel {

	/**
	 * This main() routine makes it possible to run the class EventsStarter
	 * as an application.  It simply creates a window that contains a panel
	 * of type EventsStarter.  The program ends when the user closed the
	 * window by clicking its close box.
	 */
	public static void main(String[] args) {
		JFrame window;
		window = new JFrame("Java Events");  // The parameter shows in the window title bar.
		final EventsStarter panel = new EventsStarter(); // The drawing area.
		window.setContentPane( panel ); // Show the panel in the window.
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // End program when window closes.
		window.pack();  // Set window size based on the preferred sizes of its contents.
		window.setResizable(false); // Don't let user resize window.
		Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
		window.setLocation( // Center window on screen.
				(screen.width - window.getWidth())/2, 
				(screen.height - window.getHeight())/2 );
		panel.requestFocusInWindow();  // make sure key events go to the panel.
		window.setVisible(true); // Open the window, making it visible on the screen.
	}
	
	
	private BufferedImage OSC;  // The off-screen canvas.
    private Graphics2D OSG;     // Graphics context for drawing to OSC.
    
    private Color color = null; // For this example, the current drawing color.

	/**
	 * This constructor sets up an AnimationStarter when it is created.  Here, it
	 * sets the size of the drawing area.  (The size is set as a "preferred size,"
	 * which will be used by the pack() command in the main() routine.)
	 */
	public EventsStarter() {
		setPreferredSize( new Dimension(800,600) ); // Set size of drawing area, in pixels.
		OSC = new BufferedImage(800, 600, BufferedImage.TYPE_INT_ARGB);
		OSG = OSC.createGraphics();
		OSG.setColor(Color.WHITE);  // Initially, canvas is filled with white.
		OSG.fillRect(0,0,800,600);
		OSG.setColor(Color.BLACK);  // Initial drawing color for canvas.
		OSG.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		addMouseListener( new MouseHandler() ); // install an object to listen for mouse events.
		addKeyListener( new KeyHandler() );  // install an object to listen for key events.
	}
	
	
	/**
	 * The paintComponent method draws the content of the JPanel.  In this program,
	 * it simply copies the off-screen canvas to the screen.  (Often, a program would
	 * draw extra stuff on top of the image, such as a selection box.)
	 */
	protected void paintComponent(Graphics g) {
		g.drawImage(OSC, 0, 0, null);
	}
	
	
	/**
	 * This class defines the object that listens for mouse events.
	 */
	private class MouseHandler extends MouseAdapter {
		boolean dragging = false;  // set to true when a drag operation is in progress
		int startX, startY;  // The starting coordinates for a drag operation.
		int prevX, prevY;  // The previous mouse location, during a drag operation.
		
		public void mousePressed(MouseEvent evt) {
				// This method is called when the user presses a mouse button.
			    // Mouse coordinate are given by evt.getX() and evt.getY();
			if (dragging)
				return;  // don't start a new drag operation if one is already in progress.
			dragging = true; // (This doesn't necessarily happen for all mouse presses.)
			startX = prevX = evt.getX();
			startY = prevY = evt.getY();
			addMouseMotionListener(this);  // listen for mouse motion during a drag operation
		}
		
		public void mouseDragged(MouseEvent evt) {
			   // This method is called each time the mouse moves during a drag operation.
			if (!dragging)
				return;
			int x = evt.getX();  // Get current mouse position.
			int y = evt.getY();
			
			// Here, as an example, draw a colored circle at the current mouse position or,
			// if the shift key is down, draw a square.
			// Use the current drawing color or, if it is null, use a random color
			if (color == null)
				OSG.setColor( Color.getHSBColor((float)Math.random(), 1, 1));
			else
				OSG.setColor(color);
			if (evt.isShiftDown())
				OSG.fillRect(x-15,y-15,30,30);
			else
				OSG.fillOval(x-15,y-15,30,30);
			repaint();  // Make sure changes are copied to the screen!
			
			prevX = x;  // Previous mouse position for next call to mouseDragged
			prevY = y;
		}
		
		public void mouseReleased(MouseEvent evt) {
				// This method is called when a mouse button is released.
			if (!dragging)
				return;
			dragging = false;
		}
		
	} // end MouseHandler
	
	
	/**
	 * This class defines the object that listens for key events.
	 */
	private class KeyHandler extends KeyAdapter {
		
		public void keyPressed(KeyEvent evt) {
				// This method is called every time a key is pressed.
				// The key is encoded as evt.getKeyCode(), which is
				// a constant such as KeyEvent.VK_LEFT for the left arrow
				// key, KeyEvent.VK_A for the "A" key, and so on.
			int key = evt.getKeyCode();
			
			// Here, as an example, the space key clears the drawing
			// and the left and up arrow keys move the entire drawing by 10
			// pixels to the left or up, losing the part that moves off the screen.
			// (Note that moving it down or right wouldn't work; it's kind of
			// strange to copy an image to itself.)
			
			OSG.setColor(Color.WHITE);
			switch (key) {
			case KeyEvent.VK_LEFT:
				OSG.drawImage(OSC,-10,0,null);
				OSG.fillRect(OSC.getWidth()-10,0,10,OSC.getHeight());
				repaint();
				break;
			case KeyEvent.VK_UP:
				OSG.drawImage(OSC,0,-10,null);
				OSG.fillRect(0,OSC.getHeight(),OSC.getWidth(),10);
				repaint();
				break;
			case KeyEvent.VK_SPACE:
				OSG.fillRect(0,0,OSC.getWidth(),OSC.getHeight());
				repaint();
				break;
			}
			
		}
		
		public void keyTyped(KeyEvent evt) {
				// this method is called when the user types a character
			    // (which can involve several key presses and key
			    // releases).  The character is given by evt.getKeyChar()
			char ch = evt.getKeyChar();
			
			// Here, as an example, the current drawing color is changes if
			// the user types a "r", "g", "b", "k", or "x".
			switch (Character.toLowerCase(ch)) {
			case 'r':
				color = Color.RED;
				break;
			case 'g':
				color = Color.GREEN;
				break;
			case 'b':
				color = Color.BLUE;
				break;
			case 'k':
				color = Color.BLACK;
				break;
			case 'x':
				color = null;  // Random colors will be used.
				break;
			}
			
		}
		
	} // end KeyHandler
	
}
