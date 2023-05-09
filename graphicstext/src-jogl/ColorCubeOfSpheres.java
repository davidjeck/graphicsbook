
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.*;
import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.GLJPanel;

import com.jogamp.opengl.util.GLBuffers;

import java.nio.FloatBuffer;



/**
 * A Jogl/OpenGL application that an 11-by-11-by-11 cube of
 * spheres in different colors.  Five rendering methods are 
 * available, selected using a popup menu.  The rendering time
 * to draw the scene is shown.  Use the mouse to rotate
 * the scene and force a redraw.  (You can also force a redraw
 * by resizing the window.)  This program requires OpenGL 1.5
 * or higher for support of vertex buffer objects.
 */
public class ColorCubeOfSpheres extends JPanel implements GLEventListener, ActionListener {

	public static void main(String[] args) {
		JFrame window = new JFrame("Color Cube of Spheres -- USE MOUSE TO ROTATE");
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setContentPane(new ColorCubeOfSpheres());
		window.pack();
		window.setLocation(50,50);
		window.setVisible(true);
	}

	private Camera camera;
	
	private int sphereDisplayList;  // A display list for drawing one sphere.
	
	private FloatBuffer sphereVertexBuffer; // Holds the vertex coords, for use with glDrawArrays
	private FloatBuffer sphereNormalBuffer; // Holds the normal vectors, for use with glDrawArrays
	
	private float[] sphereVertexArray;  // The same data as in sphereVertexBuffer, stored in an array.
	private float[] sphereNormalArray;  // The same data as in sphereNormalBuffer, stored in an array.

	private int vertexVboId;   // identifier for the Vertex Buffer Object to hold the vertex coords
	private int normalVboId;   // identifier for the Vertex Buffer Object to hold the normla vectors

	private JComboBox<String> renderModeSelect; // For selecting the type of rendering

	private JLabel message;  // Displays the elapsed time in milliseconds for the most
	                          // recent rendering of the display.
	
	private int currentRenderMode;  // Which of the five render modes is selected.
	private int renderCount;  // Number of time image has been rendered using current render technique.
	private double renderTimeSum;  // Sum of the rendering times (since the current technique was selected).

	/**
	 * Make a regular JPanel to hold the GLJPanel,  Add a small panel at the
	 * bottom to hold a check box that determines whether a display list is used
	 * for rendering and a label that displays the rendering time of the most
	 * recent display of the GLJPanel.  The user can rotate the view with the
	 * mouse.
	 */
	public ColorCubeOfSpheres() {
		renderModeSelect = new JComboBox<String>();
		renderModeSelect.addItem("Direct Draw, Recomputing Vertex Data");
		renderModeSelect.addItem("Direct Draw, Precomputed Data");
		renderModeSelect.addItem("Use Display List");
		renderModeSelect.addItem("Use DrawArrays");
		renderModeSelect.addItem("Use DrawArrays with VBOs");
		renderModeSelect.setSelectedIndex(2);
		renderModeSelect.addActionListener(this);
		currentRenderMode = 2;
		message = new JLabel("Average Render time:");
		JPanel bottom = new JPanel();
		bottom.setLayout(new BorderLayout(20,20));
		bottom.add(renderModeSelect, BorderLayout.WEST);
		bottom.add(message, BorderLayout.CENTER);
		bottom.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
		GLJPanel drawable = new GLJPanel();
		drawable.setPreferredSize(new Dimension(600,600));
		drawable.addGLEventListener(this);
		setLayout(new BorderLayout());
		add(drawable, BorderLayout.CENTER);
		add(bottom, BorderLayout.SOUTH);
		camera = new Camera();
		camera.setLimits(-10,10,-10,10,-10,10);
		camera.installTrackball(this);
	}
	
	public void actionPerformed(ActionEvent evt) {
		repaint();
	}

	/**
	 * This method will be called when the GLJPanel is first
	 * created.  It can be used to initialize the GL context.
	 */
	public void init(GLAutoDrawable drawable) {
		GL2 gl = drawable.getGL().getGL2();
		gl.glEnable(GL2.GL_LIGHTING);
		gl.glEnable(GL2.GL_LIGHT0);
		gl.glEnable(GL2.GL_DEPTH_TEST);
		gl.glShadeModel(GL2.GL_SMOOTH);
		gl.glEnable(GL2.GL_COLOR_MATERIAL);
		gl.glClearColor(0.5f,0.5f,0.5f,1);

		/* Create a display list that contains all the OpenGL
		 * commands that are generated when the sphere is drawn.
		 */
		sphereDisplayList = gl.glGenLists(1);
		gl.glNewList(sphereDisplayList, GL2.GL_COMPILE);
		uvSphere(gl, 0.4, 32, 16, false);
		gl.glEndList();
		
		/* Create the data for glDrawArrays, for render modes 2 and 3
		 */
		createSphereArraysAndVBOs(gl);
	}

	/**
	 * Draw a color cube of spheres, 11 spheres on each side, using
	 * different colors.  Each of the red, green, and blue components
	 * of the color varies along one dimension of the cube.
	 */
	public void display(GLAutoDrawable drawable) {
		GL2 gl = drawable.getGL().getGL2();
		gl.glClear(GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT);
		camera.apply(gl);
		int mode = renderModeSelect.getSelectedIndex();
		if (mode != currentRenderMode) {
			currentRenderMode = mode;  // Change mode, and reset timing variables.
			renderCount = 0;
			renderTimeSum = 0;
		}
		long start = System.currentTimeMillis();  // Starting time for rendering.
		if (mode == 4 || mode == 3) {
			    // We need to enable the vertex and normal arrays, and set
			    // the vertex and normal points for these modes.
			gl.glEnableClientState(GL2.GL_VERTEX_ARRAY);
			gl.glEnableClientState(GL2.GL_NORMAL_ARRAY);
			if (mode == 4) {
				     // When using VBOs, the vertex and normal pointers
				     // refer to data in the VBOs.
				gl.glBindBuffer(GL.GL_ARRAY_BUFFER, vertexVboId);
				gl.glVertexPointer(3,GL.GL_FLOAT,0,0); 
				gl.glBindBuffer(GL.GL_ARRAY_BUFFER, normalVboId);
				gl.glNormalPointer(GL.GL_FLOAT,0,0); 
				gl.glBindBuffer(GL.GL_ARRAY_BUFFER, 0);
			}
			else {
				     // When not using VBOs, the points point to the FloatBuffers.
				gl.glVertexPointer(3,GL.GL_FLOAT,0,sphereVertexBuffer);
				gl.glNormalPointer(GL.GL_FLOAT,0,sphereNormalBuffer);
			}
		}
		for (int i = 0; i <= 10; i++) {
			float r = i/10.0f;
			for (int j = 0; j <= 10; j++) {
				float g = j/10.0f;
				for (int k = 0; k <= 10; k++) {
					float b = k/10.0f;
					gl.glColor3f(r,g,b);
					gl.glPushMatrix();
					gl.glTranslatef(i-5,j-5,k-5);
					if (mode == 0)
						uvSphere(gl, 0.4, 32, 16, false);  // Draw sphere directly.
					else if (mode == 1)
						drawSphereDirectWithDataFromArrays(gl);
					else if (mode == 2)
						gl.glCallList(sphereDisplayList);  // Draw by calling a display list.
					else
						drawSphereWithDrawArrays(gl);  // Draw using DrawArrays
					gl.glPopMatrix();
				}
			}
		}
		if (mode == 4 || mode == 3) {
			gl.glDisableClientState(GL2.GL_VERTEX_ARRAY);
			gl.glDisableClientState(GL2.GL_NORMAL_ARRAY);
		}
		gl.glFlush();  // Make sure all commands are sent to graphics card.
		gl.glFinish(); // Wait for all commands to complete, before checking time.
		long time = System.currentTimeMillis() - start;
		renderCount++;
		renderTimeSum += time;
		String text = String.format("Average Render Time = %1.2f", renderTimeSum/renderCount);
		message.setText(text);
	}



	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
	}

	public void dispose(GLAutoDrawable drawable) {
	}
	
	//----------------- for glDrawArrays and Vertex Buffer Object ----------------------------------
	
	/**
	 * Creates the vertex coordinate and normal vectors for a sphere.
	 * The data is stored in the FloatBuffers sphereVertexBuffer and
	 * sphereNormalBuffer.  In addition, VBOs are created to hold
	 * the data and the data is copied from the FloatBuffers into
	 * the VBOs.  (Note: The VBOs are used for render mode 4; the
	 * FloatBuffers are used for render mode 3.)
	 */
	private void createSphereArraysAndVBOs(GL2 gl) {
		double radius = 0.4;
		int stacks = 16;
		int slices = 32;
		int size = stacks * (slices+1) * 2 * 3;
		sphereVertexBuffer = GLBuffers.newDirectFloatBuffer(size);
		sphereNormalBuffer = GLBuffers.newDirectFloatBuffer(size);
		sphereVertexArray = new float[size];
		sphereNormalArray = new float[size];
		for (int j = 0; j < stacks; j++) {
			double latitude1 = (Math.PI/stacks) * j - Math.PI/2;
			double latitude2 = (Math.PI/stacks) * (j+1) - Math.PI/2;
			double sinLat1 = Math.sin(latitude1);
			double cosLat1 = Math.cos(latitude1);
			double sinLat2 = Math.sin(latitude2);
			double cosLat2 = Math.cos(latitude2);
			for (int i = 0; i <= slices; i++) {
				double longitude = (2*Math.PI/slices) * i;
				double sinLong = Math.sin(longitude);
				double cosLong = Math.cos(longitude);
				double x1 = cosLong * cosLat1;
				double y1 = sinLong * cosLat1;
				double z1 = sinLat1;
				double x2 = cosLong * cosLat2;
				double y2 = sinLong * cosLat2;
				double z2 = sinLat2;
				sphereNormalBuffer.put( (float)x2 );
				sphereNormalBuffer.put( (float)y2 );
				sphereNormalBuffer.put( (float)z2 );
				sphereVertexBuffer.put( (float)(radius*x2) );
				sphereVertexBuffer.put( (float)(radius*y2) );
				sphereVertexBuffer.put( (float)(radius*z2) );
				sphereNormalBuffer.put( (float)x1 );
				sphereNormalBuffer.put( (float)y1 );
				sphereNormalBuffer.put( (float)z1 );
				sphereVertexBuffer.put( (float)(radius*x1) );
				sphereVertexBuffer.put( (float)(radius*y1) );
				sphereVertexBuffer.put( (float)(radius*z1) );
			}
		}
		for (int i = 0; i < size; i++) {
			sphereVertexArray[i] = sphereVertexBuffer.get(i);
			sphereNormalArray[i] = sphereNormalBuffer.get(i);
		}
		sphereVertexBuffer.rewind();
		sphereNormalBuffer.rewind();
		int[] bufferIDs = new int[2];
		gl.glGenBuffers(2, bufferIDs,0);
		vertexVboId = bufferIDs[0];
		normalVboId = bufferIDs[1];
        gl.glBindBuffer(GL2.GL_ARRAY_BUFFER, vertexVboId);
        gl.glBufferData(GL2.GL_ARRAY_BUFFER, size*4, sphereVertexBuffer, GL2.GL_STATIC_DRAW);
        gl.glBindBuffer(GL2.GL_ARRAY_BUFFER, normalVboId);
        gl.glBufferData(GL2.GL_ARRAY_BUFFER, size*4, sphereNormalBuffer, GL2.GL_STATIC_DRAW);
        gl.glBindBuffer(GL.GL_ARRAY_BUFFER, 0);
	}

	/**
	 * Draw one sphere.  The VertexPointer and NormalPointer must already
	 * be set to point to the data for the sphere, and they must be enabled.
	 */
	private void drawSphereWithDrawArrays(GL2 gl) {
		int slices = 32;
		int stacks = 16;
		int vertices = (slices+1)*2;
		for (int i = 0; i < stacks; i++) {
			int pos = i*(slices+1)*2;
			gl.glDrawArrays(GL2.GL_QUAD_STRIP, pos, vertices);
		}
	}
	
	void drawSphereDirectWithDataFromArrays(GL2 gl) {
	    int i,j;
	    int slices = 32;
	    int stacks = 16;
	    int vertices = (slices+1)*2;
	    for (i = 0; i < stacks; i++) {
	        int pos = i*(slices+1)*2*3;
	        gl.glBegin(GL2.GL_QUAD_STRIP);
	        for (j = 0; j < vertices; j++) {
//	            gl.glNormal3fv(sphereNormalArray, pos+3*j);  /* This worked but took 3 times as long!!! */
//	            gl.glVertex3fv(sphereVertexArray, pos+3*j);
	        	gl.glNormal3f(sphereNormalArray[pos+3*j],sphereNormalArray[pos+3*j+1],sphereNormalArray[pos+3*j+2]);
	        	gl.glVertex3f(sphereVertexArray[pos+3*j],sphereVertexArray[pos+3*j+1],sphereVertexArray[pos+3*j+2]);
	        }
	        gl.glEnd();
	    }
	}
	
	/**
	 * Draw a sphere with a given radius, number of slices, and number
	 * of stacks.  The number of slices is the number of lines of longitude
	 * (like the slices of an orange).  The number of stacks is the number
	 * of divisions perpendicular the axis; the lines of latitude are the
	 * dividing lines between stacks, so there are stacks-1 lines of latitude.
	 * The last parameter tells whether or not to generate texture
	 * coordinates for the sphere.  The texture wraps once around the sphere.
	 * The sphere is centered at (0,0,0), and its axis lies along the z-axis.
	 * (Copied from TexturedShapes.uvSphere().)
	 */
	public static void uvSphere(GL2 gl, double radius, int slices, int stacks, boolean makeTexCoords) {
		if (radius <= 0)
			throw new IllegalArgumentException("Radius must be positive.");
		if (slices < 3)
			throw new IllegalArgumentException("Number of slices must be at least 3.");
		if (stacks < 2)
			throw new IllegalArgumentException("Number of stacks must be at least 2.");
		for (int j = 0; j < stacks; j++) {
			double latitude1 = (Math.PI/stacks) * j - Math.PI/2;
			double latitude2 = (Math.PI/stacks) * (j+1) - Math.PI/2;
			double sinLat1 = Math.sin(latitude1);
			double cosLat1 = Math.cos(latitude1);
			double sinLat2 = Math.sin(latitude2);
			double cosLat2 = Math.cos(latitude2);
			gl.glBegin(GL2.GL_QUAD_STRIP);
			for (int i = 0; i <= slices; i++) {
				double longitude = (2*Math.PI/slices) * i;
				double sinLong = Math.sin(longitude);
				double cosLong = Math.cos(longitude);
				double x1 = cosLong * cosLat1;
				double y1 = sinLong * cosLat1;
				double z1 = sinLat1;
				double x2 = cosLong * cosLat2;
				double y2 = sinLong * cosLat2;
				double z2 = sinLat2;
				gl.glNormal3d(x2,y2,z2);
				if (makeTexCoords)
					gl.glTexCoord2d(1.0/slices * i, 1.0/stacks * (j+1));
				gl.glVertex3d(radius*x2,radius*y2,radius*z2);
				gl.glNormal3d(x1,y1,z1);
				if (makeTexCoords)
					gl.glTexCoord2d(1.0/slices * i, 1.0/stacks * j);
				gl.glVertex3d(radius*x1,radius*y1,radius*z1);
			}
			gl.glEnd();
		}
	} // end uvSphere
}
