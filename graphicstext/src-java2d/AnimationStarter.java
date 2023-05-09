import java.awt.*;        // import statements to make necessary classes available
import java.awt.event.*;
import java.awt.geom.*;

import javax.swing.*;

/**
 *  This class shows the setup for drawing animated images using Java Graphics2D.
 *  The drawing code goes in the paintComponent() method.  When the program
 *  is run, the drawing is shown in a window on the screen.  The paintComponent()
 *  method will be called about 60 times per second, and the value of the global
 *  variables frameNumber and elapsedTimeMillis will increase.  These variables
 *  can be used in paintComponent(), so that the image will change each time
 *  it is drawn.
 */
public class AnimationStarter extends JPanel {

	/**
	 * This main() routine makes it possible to run the class AnimationStarter
	 * as an application.  It simply creates a window that contains a panel
	 * of type AnimationStarter.  The program ends when the user closed the
	 * window by clicking its close box.
	 */
	public static void main(String[] args) {
		JFrame window;
		window = new JFrame("Java Animation");  // The parameter shows in the window title bar.
		final AnimationStarter panel = new AnimationStarter(); // The drawing area.
		window.setContentPane( panel ); // Show the panel in the window.
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // End program when window closes.
		window.pack();  // Set window size based on the preferred sizes of its contents.
		window.setResizable(false); // Don't let user resize window.
		Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
		window.setLocation( // Center window on screen.
				(screen.width - window.getWidth())/2, 
				(screen.height - window.getHeight())/2 );
		Timer animationTimer;  // A Timer that will emit events to drive the animation.
		final long startTime = System.currentTimeMillis();
		animationTimer = new Timer(16, new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				panel.frameNumber++;
				panel.elapsedTimeMillis = System.currentTimeMillis() - startTime;
				panel.repaint();
			}
		});
		window.setVisible(true); // Open the window, making it visible on the screen.
		animationTimer.start();  // Start the animation running.
	}
	
	private int frameNumber;  // A counter that increases by one in each frame.
	private long elapsedTimeMillis;  // The time, in milliseconds, since the animation started.
	
	private float pixelSize;  // This is the measure of a pixel in the coordinate system
                              // set up by calling the applyLimits method.  It can be used
                              // for setting line widths, for example.

	/**
	 * This constructor sets up an AnimationStarter when it is created.  Here, it
	 * sets the size of the drawing area.  (The size is set as a "preferred size,"
	 * which will be used by the pack() command in the main() routine.)
	 */
	public AnimationStarter() {
		setPreferredSize( new Dimension(800,600) ); // Set size of drawing area, in pixels.
	}
	
	/**
	 * The paintComponent method draws the content of the JPanel.  The parameter
	 * is a graphics context that can be used for drawing on the panel.  Note that
	 * it is declared to be of type Graphics but is actually of type Graphics2D,
	 * which is a subclass of Graphics.
	 */
	protected void paintComponent(Graphics g) {
		
		/* First, create a Graphics2D drawing context for drawing on the panel.
		 * (g.create() makes a copy of g, which will draw to the same place as g,
		 * but changes to the returned copy will not affect the original.)
		 */
		Graphics2D g2 = (Graphics2D)g.create();
		
		/* Turn on antialiasing in this graphics context, for better drawing.
		 */
		g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		
		/* Fill in the entire drawing area with white.
		 */

		g2.setPaint(Color.WHITE);
		g2.fillRect(0,0,getWidth(),getHeight()); // From the old graphics API!
		
		/* Here, I set up a new coordinate system on the drawing area, by calling
		 * the applyLimits() method that is defined below.  Without this call, I
		 * would be using regular pixel coordinates.  This function sets the value
		 * of the global variable pixelSize, which I need for stroke widths in the
		 * transformed coordinate system.
		 */
		
		applyWindowToViewportTransformation(g2, -5, 5, -5, 5, true);
		
		/* Finish by drawing the content of the current frame, using frameNumber
		 * and/or elapsedTimeMillis in the drawing so that the image will change
		 * from frame to frame.  Here, a simple hierarchical scene is drawn as
		 * an example.
		 */
				
		Path2D bars ; // Will the outline of a hexagon, with spokes from center to vetices.
		bars = new Path2D.Double();
		bars.moveTo(3,0);
		for (int i = 1; i < 6; i++) {
			double angle = (2*Math.PI/6) * i;
			bars.lineTo( 3*Math.cos(angle), 3*Math.sin(angle) );
		}
		bars.closePath();
		for (int i = 0; i < 6; i++) {
			double angle = (2*Math.PI/6) * i;
			bars.moveTo(0,0);
			bars.lineTo( 3*Math.cos(angle), 3*Math.sin(angle) );
		}
		
		g2.rotate(frameNumber * 0.001); // makes the whole picture rotate slowly

		g2.setStroke( new BasicStroke(4*pixelSize) );
		g2.setPaint( Color.BLUE );
		g2.draw(bars);
		
		// Now, draw a quickly rotating square at each vertex of the hexaon.
		Rectangle2D square = new Rectangle2D.Double(-0.5,-0.5,1,1);  // six copies of this square will be drawn
		g2.setStroke( new BasicStroke(2*pixelSize) );
		for (int i = 0; i < 6; i++) {
			AffineTransform savedTransform = g2.getTransform();  // save the current transform
			double angle = (2*Math.PI/6) * i;
			   // (NOTE: Remember that transforms are applied in the reverse of their order in the code!)
			g2.rotate(angle);  // rotate the translated square onto the i-th vertex of the hexagon.
			g2.translate(3,0); // translate the quickly rotating square to (3,0)
			g2.rotate( frameNumber*0.02 );   // make the square rotate quickly about its center.
			g2.setPaint( new Color(255,0,0,100) ); // translucent red.
			g2.fill(square);  // draw the 1-by-1 square, centered at (0,0).
			g2.setPaint( Color.RED );
			g2.draw(square);
			g2.setTransform(savedTransform);  // restore the saved transform
		}
	}
	
	/**
     * Applies a coordinate transform to a Graphics2D graphics context.  The upper
     * left corner of the viewport where the graphics context draws is assumed to
     * be (0,0).  The coordinate transform will make a requested view window visible
     * in the drawing area.  The requested limits might be adjusted to preserve the
     * aspect ratio.
     *     This method sets the value of the global variable pixelSize, which is defined as the
     * maximum of the width of a pixel and the height of a pixel as measured in the
     * coordinate system.  (If the aspect ratio is preserved, then the width and 
     * height will agree.
     * @param g2 The drawing context whose transform will be set.
     * @param left requested x-value at left of drawing area.
     * @param right requested x-value at right of drawing area.
     * @param bottom requested y-value at bottom of drawing area; can be less than
     *     top, which will reverse the orientation of the y-axis to make the positive
     *     direction point upwards.
     * @param top requested y-value at top of drawing area.
     * @param preserveAspect if preserveAspect is false, then the requested view window
     *     rectangle will exactly fill the viewport; if it is true, then the limits will be
     *     expanded in one direction, horizontally or vertically, if necessary, to make the
     *     aspect ratio of the view window match the aspect ratio of the viewport.
     *     Note that when preserveAspect is false, the units of measure in the horizontal 
     *     and vertical directions will be different.
     */
	private void applyWindowToViewportTransformation(Graphics2D g2,
			double left, double right, double bottom, double top, 
			boolean preserveAspect) {
		int width = getWidth();   // The width of this drawing area, in pixels.
		int height = getHeight(); // The height of this drawing area, in pixels.
		if (preserveAspect) {
			// Adjust the limits to match the aspect ratio of the drawing area.
			double displayAspect = Math.abs((double)height / width);
			double requestedAspect = Math.abs(( bottom-top ) / ( right-left ));
			if (displayAspect > requestedAspect) {
				// Expand the viewport vertically.
				double excess = (bottom-top) * (displayAspect/requestedAspect - 1);
				bottom += excess/2;
				top -= excess/2;
			}
			else if (displayAspect < requestedAspect) {
				// Expand the viewport vertically.
				double excess = (right-left) * (requestedAspect/displayAspect - 1);
				right += excess/2;
				left -= excess/2;
			}
		}
		g2.scale( width / (right-left), height / (bottom-top) );
		g2.translate( -left, -top );
		double pixelWidth = Math.abs(( right - left ) / width);
		double pixelHeight = Math.abs(( bottom - top ) / height);
		pixelSize = (float)Math.max(pixelWidth,pixelHeight);
	}
	
}
