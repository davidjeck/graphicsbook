import java.awt.*;        // import statements to make necessary classes available
import java.awt.geom.*;

import javax.swing.*;

/**
 *  This class shows the setup for drawing static images using Java Graphics2D.
 *  The drawing code goes in the paintComponent() method.  When the program
 *  is run, the drawing is shown in a window on the screen.  See AnimationStarter.java
 *  for a somewhat more useful framework.
 */
public class GraphicsStarter extends JPanel {

	/**
	 * This main() routine makes it possible to run the class GraphicsStarter
	 * as an application.  It simply creates a window that contains a panel
	 * of type GraphicsStarter.  The program ends when the user closed the
	 * window by clicking its close box.
	 */
	public static void main(String[] args) {
		JFrame window;
		window = new JFrame("Java Graphics");  // The parameter shows in the window title bar.
		window.setContentPane( new GraphicsStarter() ); // Show a Graphics starter in the window.
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE); // End program when window closes.
		window.pack();  // Set window size based on the preferred sizes of its contents.
		window.setResizable(false); // Don't let user resize window.
		Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
		window.setLocation( // Center window on screen.
				(screen.width - window.getWidth())/2, 
				(screen.height - window.getHeight())/2 );
		window.setVisible(true); // Open the window, making it visible on the screen.
	}
	
	private float pixelSize;  // This is the measure of a pixel in the coordinate system
	                          // set up by calling the applyWindowToViewportTransformation method.
	                          // It can be used for setting line widths, for example.
	
	/**
	 * This constructor sets up a GraphicsStarter when it is created.  Here, it
	 * sets the size of the drawing area.  (The size is set as a "preferred size,"
	 * which will be used by the pack() command in the main() routine.)
	 */
	public GraphicsStarter() {
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
		 * the applyWindowToViewportTransformation() method that is defined below.
		 * Without this call, I would be using regular pixel coordinates.  This
		 * function sets the global variable pixelSize, which I need for stroke
		 * widths in the transformed coordinate system.
		 */
		
		applyWindowToViewportTransformation(g2, -5, 5, -5, 5, true);
		
		/* Finish by drawing a few shapes as an example.  You can erase the rest of 
		 * this subroutine and substitute your own drawing.
		 */
		
		g2.setPaint(Color.YELLOW);
		g2.fill( new Ellipse2D.Double(-6,-1,12,2) );
		g2.setPaint(Color.BLUE);
		g2.setStroke( new BasicStroke(5*pixelSize) );
		g2.draw( new Line2D.Double( -5, -5, 5, 5) );
		g2.draw( new Line2D.Double( -5, 5, 5, -5) );
		
		Path2D poly = new Path2D.Double();
		poly.moveTo(3,0);
		for (int i = 1; i < 6; i++) {
			double angle = (2*Math.PI/6) * i;
			poly.lineTo( 3*Math.cos(angle), 3*Math.sin(angle) );
		}
		poly.closePath();
		
		g2.setPaint( new Color(255, 0, 0, 100) ); // red with alpha-transparency
		g2.fill(poly);
		g2.setPaint( Color.RED );
		g2.draw(poly);
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
