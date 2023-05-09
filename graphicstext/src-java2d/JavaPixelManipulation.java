import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import javax.swing.*;
import java.io.*;

/**
 *  A demo program that manipulates colors of individual pixels in
 *  a BufferedImage.  The program lets the user draw using some basic
 *  shapes.  The user can also load an image from a file; the loaded
 *  image is scaled to exactly fill the panel.  A copy of the panel
 *  content is stored in a BufferedImage.  The user can apply "filters"
 *  such as "Blur" to the image.  The filter is computed by hand, using
 *  the RGB color data in the BufferedImage.  There is also a "Smudge"
 *  tool that the user can drag on the image to spread color around like
 *  wet paint; it works with the pixel data from the BufferedImage.
 */
public class JavaPixelManipulation extends JPanel {

	/**
	 * The main routine simply opens a window that shows a JavaPixelManipulation panel.
	 * The window is fixed size, and the size is set to allow the panel to have its
	 * preferred size.
	 */
	public static void main(String[] args) {
		JFrame window = new JFrame("Java Paint Demo");
		JavaPixelManipulation content = new JavaPixelManipulation();
		window.setContentPane(content);
		window.setJMenuBar(content.getMenuBar());
		window.pack();  
		window.setResizable(false); 
		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		window.setLocation( (screenSize.width - window.getWidth())/2,
				(screenSize.height - window.getHeight())/2 );
		window.setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
		window.setVisible(true);
	}

	private BufferedImage OSC;  // Stores a copy of the panel content.
	private Graphics2D OSG;     // Graphics context for drawing to OSC/
	private String tool = "Sketch";    // Identifies the current drawing tool.
	private Color color = Color.BLACK; // The current drawing color.
	private BasicStroke stroke; // The current stroke, used for lines and curves. 

	private Image saveLoadedImage = null;  // Keeps a copy of the last loaded image,
	                                       // for convenience.  A "Reload Image" menu
	                                       // item will load the same image.
	private JMenuItem reloadImageMenuItem; // The "Reload Image" menu item.
	
	private String dragShape = null; // When non-null, the user is dragging with
	                                 // the Oval, Rectangle, or Line tool.  The
	                                 // current shape is drawn in paintComponent()
	                                 // over the BufferedImage.  The shape is only
	                                 // added to the image when the drag action ends.
	private int dragStartX, dragStartY;     // Start point of drag for use with dragShape.
	private int dragCurrentX, dragCurrentY; // Current mouse position for use with dragShape.

	private double[][] smudgeRed, smudgeBlue, smudgeGreen; // Data used by "Smudge" tool.

	
	/**
	 * The constructor sets the preferred size of the panel, creates the BufferedImage,
	 * and installs a mouse listener on the panel to implement drawing actions.
	 */
	public JavaPixelManipulation() {
		setPreferredSize(new Dimension(640,480));
		OSC = new BufferedImage(640,480,BufferedImage.TYPE_INT_RGB);
		OSG = OSC.createGraphics();
		OSG.setColor(Color.WHITE);
		OSG.fillRect(0,0,640,480);
		OSG.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
		stroke = new BasicStroke(5, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND);
		smudgeRed = new double[7][7];
		smudgeBlue = new double[7][7];
		smudgeGreen = new double[7][7];
		addMouseListener( new MouseHandler() ); // nested class MouseHandler is defined below.
	}


	/**
	 * The paintComponent() copies the BufferedImage to the screen.  If the user is dragging
	 * with the "Line", "Rectangle", or "Oval" tool, the shape is drawn over the image from
	 * the BufferedImage.
	 */
	protected void paintComponent(Graphics g) {
		g.drawImage(OSC,0,0,null);
		if (dragShape != null) {
			Graphics2D g2 = (Graphics2D)g.create();
			g2.setStroke( stroke );
			g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
			putShape(g2,dragShape,dragStartX,dragStartY,dragCurrentX,dragCurrentY,false);
		}
	}

	/**
	 *  For drawing the Line, Rectangle, or OvalShape defined by the two points (x1,y1) and (x2,y2).
	 *  If the repaint parameter is true, then the panel's repaint() method is called for a rectangle
	 *  that contains the shape.  When this method is used to draw to the BufferedImage, repaint is
	 *  true, so that the change to the BufferedImage will also be shown on the screen. When it
	 *  is called to draw the dragShape in paintComponent(), repaint is false.
	 */
	private void putShape(Graphics2D g, String shape, int x1, int y1, int x2, int y2, boolean repaint) {
		int x = Math.min(x1,x2);
		int y = Math.min(y1,y2);
		int w = Math.abs(x1-x2);
		int h = Math.abs(y1-y2);
		g.setColor(color);
		g.setStroke(stroke);
		switch (shape) {
		case "Line": g.drawLine(x1,y1,x2,y2); break;
		case "Rectangle": g.fillRect(x,y,w,h); break;
		case "Oval": g.fillOval(x,y,w,h); break;
		}
		if (repaint) {
			repaint(x-13,y-13,w+26,h+26); // large enough to contain widest stroke
		}
	}


	/**
	 * Apply the "Smudge" or "Erase" tool at the point (x,y)
	 */
	private void applyTool(String tool, int x, int y) {
		if (tool.equals("Erase")) { // Clear a 10-by-10 square, centered at (x,y).
			OSG.setColor(Color.WHITE);
			OSG.fillRect(x-5,y-5,10,10);  // Erase the sqaure in the BufferedImage.
			repaint(x-5,y-5,10,10);  // Make change visible on the screen.
		}
		else { // For the "Smudge" tool, mix some of the "paint" on the tool with the image,
			   // in a 7-by-7 square centered at x,y.
			swapSmudgeData(x, y);
			repaint(x-4,y-4,8,8);  // Make change visible on the screen.
		}
	}
	
	
	/**
	 * Copy pixel colors from a 7-by-7 square centered at (x,y) into the
	 * smudge data arrays.  The color components are separated into their
	 * red, green, and blue components, which are stored in separate arrays.
	 * The values are stored as type double, not int, since they will be
	 * used in averaging calculations that require real arithmetic.
	 * This method is called at the point where the user starts a drag
	 * operation with the "Smudge" tool.
	 */
	private void grabSmudgeData(int x, int y) {
		int w = OSC.getWidth();
		int h = OSC.getHeight();
		for (int i = 0; i < 7; i++) {
			for (int j = 0; j < 7; j++) {
				int r = y + j - 3;
				int c = x + i - 3;
				if (r < 0 || r >= h || c < 0 || c >= w) {
					// A -1 in the smudgeRed array indicates that the
					// corresponding pixel was outside the canvas.
					smudgeRed[i][j] = -1;
				}
				else {
					int color = OSC.getRGB(c,r);
					smudgeRed[i][j] = (color >> 16) & 0xFF;
					smudgeGreen[i][j] = (color >> 8) & 0xFF;
					smudgeBlue[i][j] = color & 0xFF;
				}
			}
		}
	}
	
	
	/**
	 *  Swap some of the color stored in the smudge data arrays with
	 *  color in a 7-by-7 square centered at (x,y) in the BufferedImage.
	 *  That is, the color values in the arrays are replaced by a weighted
	 *  average of the color values in the arrays and the color values in
	 *  the image.  At the same time, the color values in the image are
	 *  replaced by a weighted average of the color values in the image
	 *  and the color values in the arrays.  This method is called at
	 *  each point along the path that the mouse visits as the user
	 *  drags the "Smudge" tool.
	 */
	private void swapSmudgeData(int x, int y) {
	    int w = OSC.getWidth();  
        int h = OSC.getHeight();  
		for (int i = 0; i < 7; i++) { // row number in the smudge data arrays
			int c = x + i - 3;  // column number (x-coord) of a pixel in the image.
			for (int j = 0; j < 7; j++) {  // column number in the smudge data arrays
				int r = y + j - 3;  // row number (y-coord) of a pixel in the image
				if ( ! (r < 0 || r >= h || c < 0 || c >= w || smudgeRed[i][j] == -1) ) {
					int curCol = OSC.getRGB(c,r);  // Current color of the pixel in the image.
					int curRed = (curCol >> 16) & 0xFF;  // RGB components from image
					int curGreen = (curCol >> 8) & 0xFF;
					int curBlue = curCol & 0xFF;
					int newRed = (int)(curRed*0.7 + smudgeRed[i][j]*0.3);  // New RGB's for image.
					int newGreen = (int)(curGreen*0.7 + smudgeGreen[i][j]*0.3);
					int newBlue = (int)(curBlue*0.7 + smudgeBlue[i][j]*0.3);
					int newCol = newRed << 16 | newGreen << 8 | newBlue;
					OSC.setRGB(c,r,newCol); // Replace the color of the pixel in the image.
					smudgeRed[i][j] = curRed*0.3 + smudgeRed[i][j]*0.7; // New RGBs for smudge arrays
					smudgeGreen[i][j] = curGreen*0.3 + smudgeGreen[i][j]*0.7;
					smudgeBlue[i][j] = curBlue*0.3 + smudgeBlue[i][j]*0.7;
				}
			}
		}
	}

	
	/**
	 *  For the "Smudge" and "Erase" tools, apply the tool to every point along the
	 *  line from (x1,y1) to (x2,y2).  This is called each time the mouse moves as
	 *  the user drags the tool.
	 */
	private void applyToolAlongLine(String tool, int x1, int y1, int x2, int y2) {
		if (Math.abs(x1-x2) >= Math.abs(y1-y2)) {
			   // Horizontal distance is greater than vertical distance.  Apply the
			   // tool once for each x-value between x1 and x2, computing the
			   // y-value for each x-value from the equation of a line. 
			double slope = (double)(y2-y1)/(x2-x1);
			if (x1 <= x2) { // Increment up from x1 to x2.
				for (int x = x1; x <= x2; x++) {
					int y = (int)(y1 + slope*(x-x1) + 0.5);
					applyTool(tool,x,y);
				}
			}
			else { // Decrement down from x1 to x2
				for (int x = x1; x >= x2; x--) {
					int y = (int)(y1 + slope*(x-x1) + 0.5);
					applyTool(tool,x,y);
				}
			}
		}
		else {
			   // Vertical distance is greater than horizontal distance.  Apply the
			   // tool once for each y-value between y1 and y2, computing the
			   // x-value for each y-value from the equation of a line. 
			double slope = (double)(x2-x1)/(y2-y1);
			if (y1 <= y2) {  // Increment up from y1 to y2.
				for (int y = y1; y <= y2; y++) {
					int x = (int)(x1 + slope*(y-y1) + 0.5);
					applyTool(tool,x,y);
				}
			}
			else {  // Decrement down from y1 to y2.
				for (int y = y1; y >= y2; y--) {
					int x = (int)(x1 + slope*(y-y1) + 0.5);
					applyTool(tool,x,y);
				}
			}
		}
	}

	
	/**
	 *  Defines the mouse listener object that responds to user mouse actions on
	 *  the panel.
	 */
	private class MouseHandler extends MouseAdapter {
		boolean dragging = false;  // Set to true if a dragging operation is in progress.
		int startX, startY;  // The point at which the drag action started.
		int prevX, prevY;   // The location of the mouse the previous time mousePressed 
		                    // or mouseDragged was called.
		public void mousePressed(MouseEvent evt) {
			if (dragging)
				return;  // There is already a mouse drag in progress; don't try to start a new one.
			dragging = true;
			startX = prevX = evt.getX();
			startY = prevY = evt.getY();
			if (tool.equals("Line") || tool.equals("Oval") || tool.equals("Rectangle")) {
				dragShape = tool;  // Tells paintComponent about the drag action.
				dragStartX = startX;
				dragStartY = startY;
			}
			else if (tool.equals("Erase")) {
				applyTool("Erase",startX,startY);  // Erase a square around the starting point.
			}
			else if (tool.equals("Smudge")) {
				grabSmudgeData(startX,startY);  // Get data from the image that is needed for the Smudge tool.
			}
			addMouseMotionListener(this);  // Monitor mouse moves during the drag operation.
		}
		public void mouseDragged(MouseEvent evt) {
			if (!dragging)
				return;
			int x = evt.getX();
			int y = evt.getY();
			if (tool.equals("Line") || tool.equals("Oval") || tool.equals("Rectangle")) {
				dragCurrentX = x;
				dragCurrentY = y;
				repaint();  // paintComponent() will draw the current shape on top of the image content.
			}
			else if (tool.equals("Sketch"))
				putShape(OSG, "Line", prevX, prevY, x, y, true);  // Draw line segment directly in BufferedImage.
			else 
				applyToolAlongLine(tool,prevX,prevY,x,y); // For Smudge and Erase tools.
			prevX = x;
			prevY = y;
		}
		public void mouseReleased(MouseEvent evt) {
			if (!dragging)
				return;
			removeMouseMotionListener(this);  // Stop monitoring mouse motions, since drag is ending.
			dragging = false;
			dragShape = null;  // paintComponent will no longer draw the extra shape
			if (tool.equals("Line") || tool.equals("Oval") || tool.equals("Rectangle")) {
				putShape(OSG, tool, startX, startY, prevX, prevY, true);  // add shape to BufferedImage
				repaint();  // should be unnecessary; just to be sure that the panel shows the right thing.
			}
		}
	}
	
	
	/**
	 *  Apply one of the image filters from the "Filter" menu to the BufferedImage, and
	 *  copy the result to the screen.  A filters is implemented as a "convolution" with
	 *  3-by-3 arrays.  That is, the RGB components of each pixel in the image is replaced
	 *  with a weighted average of the RGB components of the pixels in a 3-by-3 square.
	 *  The weighting factors are given by the convolution array.  For example, for the
	 *  "Blur" filter, all the weight factors in the array are equal, and the filter is
	 *  just a simple averaging operation.  (To make things easy on myself, I don't change
	 *  the colors of the pixels along the border of the image; this lets me assume that
	 *  when I work on a pixel, the 3-by-3 square centerd at that pixel is entirely within
	 *  the image.)  The filter must be one of the strings form the "Filter" menu.
	 */
	private void applyFilter(String filter) {
		int w = OSC.getWidth();
		int h = OSC.getHeight();
		double[] filterArray = null;  // The convolution array for the filter.
		int[] rgbArray = new int[ w*h ];  // An array to hold the RGB colors of the entire image. 
		OSC.getRGB(0, 0, w, h, rgbArray, 0, w);  // Grab the RGB color data from the image.
		double v;
		switch (filter) {
		case "Blur":
			v = 1.0/9.0;
			filterArray = new double[] { v,v,v, v,v,v, v,v,v }; 
			break;
		case "Sharpen":
			v = 1.0/3.0;
			filterArray = new double[] { 0,-v,0, -v,7*v,-v, 0,-v,0 };
			break;
		case "Emboss":
			filterArray = new double[] { -2,-1,0, -1,1,1, 0,1,2 };
			break;
		case "Edge Detect":
			filterArray = new double[] { 0,1,0, 1,-4,1, 0,1,0 }; 
			break;
		}
		for (int x = 1; x < w-1; x++) {
			for (int y = 1; y < h-1; y++) {
				double rNew = 0, gNew = 0, bNew = 0;
				int k = 0;
				int rgb, r, g, b;
				for (int j = y-1; j <= y+1; j++) {
					for (int i = x-1; i <= x+1; i++) {
						rgb = rgbArray[i + j*w];
						r = (rgb >> 16) & 255;
						g = (rgb >> 8) & 255;
						b = rgb & 255;
						rNew += r*filterArray[k];
						gNew += g*filterArray[k];
						bNew += b*filterArray[k];
						k++;
					}
				}
				r = (int)Math.round(Math.min(255, Math.abs(rNew)));
				g = (int)Math.round(Math.min(255, Math.abs(gNew)));
				b = (int)Math.round(Math.min(255, Math.abs(bNew)));
				rgb = (r << 16) | (g << 8) | b;
				OSC.setRGB(x, y, rgb);
			}
		}
		repaint();
	}
	
	
	/**
	 * Load an image from a file selected by the user.  The image is scaled to
	 * exactly fill the panel, possibly changing the aspect ratio.
	 */
	private void loadImageFile() {
		JFileChooser fileDialog;
		fileDialog = new JFileChooser();
		fileDialog.setSelectedFile(null); 
		int option = fileDialog.showOpenDialog(this);
		if (option != JFileChooser.APPROVE_OPTION)
			return;  // User canceled or clicked the dialog's close box.
		File selectedFile = fileDialog.getSelectedFile();
		FileInputStream stream;
		try {
			stream = new FileInputStream(selectedFile);
		}
		catch (Exception e) {
			JOptionPane.showMessageDialog(this,
					"Sorry, but an error occurred while trying to open the file:\n" + e);
			return;
		}
		try {
			BufferedImage image = ImageIO.read(stream);
			if (image == null)
				throw new Exception("File does not contain a recognized image format.");
			Graphics g = OSC.createGraphics();
			g.drawImage(image,0,0,OSC.getWidth(),OSC.getHeight(),null);
			g.dispose();
			repaint();
			saveLoadedImage = image;  // Keep a copy of the image so it can be reused with "Reload Image" command.
			reloadImageMenuItem.setEnabled(true);  // Enable the "Reload Image command.
		}
		catch (Exception e) {
			JOptionPane.showMessageDialog(this,
					"Sorry, but an error occurred while trying to read the image:\n" + e);
		}   
	}

	
	/**
	 * Create the menus for the program, and provide listeners to implement the menu commands.
	 */
	private JMenuBar getMenuBar() {
		JMenuBar menuBar = new JMenuBar();
		ActionListener flistener = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				switch (evt.getActionCommand()) {
				case "Clear":
					OSG.setColor(Color.WHITE);
					OSG.fillRect(0,0,OSC.getWidth(),OSC.getHeight());
					repaint();
					break;
				case "Quit":
					System.exit(0);
					break;
				case "Load Image...":
					loadImageFile();
					break;
				case "Reload Image":
					OSG.drawImage(saveLoadedImage,0,0,OSC.getWidth(),OSC.getHeight(),null);
					repaint();
				}
			}
		};
		JMenu file = new JMenu("File");
		file.add( makeMenuItem("Clear",flistener) );
		file.add( makeMenuItem("Load Image...",flistener));
		reloadImageMenuItem = makeMenuItem("Reload Image",flistener);
		file.add(reloadImageMenuItem);
		reloadImageMenuItem.setEnabled(false);  // Command will be enabled when an image is loaded.
		file.addSeparator();
		file.add( makeMenuItem("Quit",flistener));
		menuBar.add(file);
		ActionListener tlistener = new ActionListener(){
			public void actionPerformed(ActionEvent evt) {
				tool = evt.getActionCommand();
			}
		};
		JMenu tools = new JMenu("Tool");
		tools.add( makeMenuItem("Sketch",tlistener) );
		tools.add( makeMenuItem("Line",tlistener) );
		tools.add( makeMenuItem("Rectangle",tlistener) );
		tools.add( makeMenuItem("Oval",tlistener) );
		tools.addSeparator();
		tools.add( makeMenuItem("Smudge",tlistener) );
		tools.add( makeMenuItem("Erase",tlistener) );
		menuBar.add(tools);
		ActionListener clistener = new ActionListener(){
			public void actionPerformed(ActionEvent evt) {
				if (tool.equals("Smudge") || tool.equals("Erase"))
					tool = "Sketch";
				switch (evt.getActionCommand()) {
				case "Black": color = Color.BLACK; return;
				case "Red": color = Color.RED; return;
				case "Green": color = Color.GREEN; return;
				case "Blue": color = Color.BLUE; return;
				case "Cyan": color = Color.CYAN; return;
				case "Magenta": color = Color.MAGENTA; return;
				case "Yellow": color = Color.YELLOW; return;
				case "Gray": color = Color.GRAY; return;
				case "Custom...":
					Color c = JColorChooser.showDialog(
							JavaPixelManipulation.this, "Select Drawing Color", color);
					if (c != null) {
						color = c;
					}
				}
			}
		};
		JMenu colors = new JMenu("Color");
		colors.add( makeMenuItem("Black",clistener) );
		colors.add( makeMenuItem("Red",clistener) );
		colors.add( makeMenuItem("Green",clistener) );
		colors.add( makeMenuItem("Blue",clistener) );
		colors.add( makeMenuItem("Cyan",clistener) );
		colors.add( makeMenuItem("Yellow",clistener) );
		colors.add( makeMenuItem("Magenta",clistener) );
		colors.add( makeMenuItem("Gray",clistener) );
		colors.add( makeMenuItem("Custom...",clistener) );
		menuBar.add(colors);
		ActionListener wlistener = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				int lineWidth = Integer.parseInt(evt.getActionCommand());
				stroke = new BasicStroke(lineWidth, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND);
				if (tool.equals("Smudge") || tool.equals("Erase"))
					tool = "Sketch";
			}
		};
		JMenu width = new JMenu("LineWidth");
		width.add( makeMenuItem("1",wlistener) );
		width.add( makeMenuItem("2",wlistener) );
		width.add( makeMenuItem("3",wlistener) );
		width.add( makeMenuItem("5",wlistener) );
		width.add( makeMenuItem("7",wlistener) );
		width.add( makeMenuItem("10",wlistener) );
		width.add( makeMenuItem("15",wlistener) );
		width.add( makeMenuItem("20",wlistener) );
		width.add( makeMenuItem("25",wlistener) );
		menuBar.add(width);
		ActionListener filterlistener = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				if (evt.getActionCommand().startsWith("Blur 5")) {
					for (int i = 0; i < 5; i++)
						applyFilter("Blur");
					if (evt.getActionCommand().equals("Blur 5, Emboss"))
						applyFilter("Emboss");
				}
				else {
					applyFilter(evt.getActionCommand());
				}
			}
		};
		JMenu filter = new JMenu("Filter");
		filter.add( makeMenuItem("Blur", filterlistener) );
		filter.add( makeMenuItem("Sharpen", filterlistener) );
		filter.add( makeMenuItem("Emboss", filterlistener) );
		filter.add( makeMenuItem("Edge Detect", filterlistener) );
		filter.addSeparator();
		filter.add( makeMenuItem("Blur 5 Times", filterlistener) );
		filter.add( makeMenuItem("Blur 5, Emboss", filterlistener) );
		menuBar.add(filter);
		return menuBar;
	}

	
	/**
	 * Utility method used by getMenuBar to create menu items.
	 */
	private JMenuItem makeMenuItem(String itemName, ActionListener listener) {
		JMenuItem item = new JMenuItem(itemName);
		item.addActionListener(listener);
		return item;
	}

}

