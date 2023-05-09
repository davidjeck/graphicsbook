import java.awt.*;
import java.awt.event.*;

import javax.swing.*;
import com.jogamp.opengl.*;
import com.jogamp.opengl.awt.*;

/**
 *  A viewer for the polyhedral models defined in Polyhedron.java.
 *  The user can select the model and can control some aspects of the
 *  display.  If a model does not already have colors for its faces,
 *  then random colors are assigned.  The user can drag the polyhedron
 *  to rotate the view.
 */
public class IFSPolyhedronViewer extends GLJPanel implements GLEventListener {

	/**
	 * A main routine to create and show a window that contains a
	 * panel of type IFSPolyhedronViewer.  The program ends when the
	 * user closes the window.
	 */
	public static void main(String[] args) {
		JFrame window = new JFrame("IFS Polyhedron Viewer -- ROTATE WITH MOUSE");
		IFSPolyhedronViewer panel = new IFSPolyhedronViewer();
		window.setContentPane(panel);
		window.setJMenuBar(panel.createMenuBar());
		window.pack();
		window.setLocation(50,50);
		window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		window.setVisible(true);
		panel.requestFocusInWindow();
	}

	/**
	 * Constructor for class UnlitCube.
	 */
	public IFSPolyhedronViewer() {
		super( new GLCapabilities(null) ); // Makes a panel with default OpenGL "capabilities".
		setPreferredSize( new Dimension(500,500) );
		addGLEventListener(this);
	}

	//-------------------- methods to draw the cube ----------------------

	private Camera camera;
	private Polyhedron currentModel;

	private JRadioButtonMenuItem orthographic, drawEdges, drawFaces, drawBoth, coloredFaces;

	//-------------------- GLEventListener Methods -------------------------

	/**
	 * Draw the current model, with display options determined by the radio button menu items.
	 */
	public void display(GLAutoDrawable drawable) {	

		GL2 gl2 = drawable.getGL().getGL2(); // The object that contains all the OpenGL methods.

		gl2.glClear( GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT );

		if (currentModel.faceColors == null) {
			// Make up random face colors.
			currentModel.faceColors = new double[currentModel.faces.length][];
			for (int i = 0; i < currentModel.faceColors.length; i++) {
				double[] rgb = { Math.random(), Math.random(), Math.random() };
				currentModel.faceColors[i] = rgb;
			}
		}

		camera.setOrthographic(orthographic.isSelected());
		camera.apply(gl2);
		gl2.glPushMatrix();
		double scale = 1.0/currentModel.maxVertexLength;
		gl2.glScaled(scale,scale,scale);  // scale to fit nicely in window
		boolean colored = coloredFaces.isSelected();
		int i,j;
		if (drawFaces.isSelected() || drawBoth.isSelected()) {
			if (drawBoth.isSelected()) {
				gl2.glEnable(GL2.GL_POLYGON_OFFSET_FILL);
			}
			gl2.glColor3f(1,1,1); // in case colored is false
			for (i = 0; i < currentModel.faces.length; i++) {
				if (colored) {
					gl2.glColor3dv( currentModel.faceColors[i], 0 );
				}
				gl2.glBegin(GL2.GL_TRIANGLE_FAN);
				for (j = 0; j < currentModel.faces[i].length; j++) {
					int vertexNum = currentModel.faces[i][j];
					gl2.glVertex3dv( currentModel.vertices[vertexNum], 0 );
				}
				gl2.glEnd();
			}
			gl2.glDisable(GL2.GL_POLYGON_OFFSET_FILL);
		}
		if (drawEdges.isSelected() || drawBoth.isSelected()) {
			if (drawBoth.isSelected()) {
				gl2.glColor3f(0,0,0);
			}
			else {
				gl2.glColor3f(1,1,1);
			}
			for (i = 0; i < currentModel.faces.length; i++) {
				gl2.glBegin(GL2.GL_LINE_LOOP);
				for (j = 0; j < currentModel.faces[i].length; j++) {
					int vertexNum = currentModel.faces[i][j];
					gl2.glVertex3dv( currentModel.vertices[vertexNum], 0 );
				}
				gl2.glEnd();
			}
		}
		gl2.glPopMatrix();

	} // end display()

	public void init(GLAutoDrawable drawable) {
		// called when the panel is created
		GL2 gl2 = drawable.getGL().getGL2();
		gl2.glClearColor( 0, 0, 0, 1 );
		gl2.glEnable(GL2.GL_DEPTH_TEST);
		gl2.glLineWidth(2);
		gl2.glPolygonOffset(1,2);
		camera = new Camera();
		camera.lookAt(2,2,6, 0,0,0, 0,1,0);
		camera.setScale(1.2);
		camera.installTrackball(this);
		currentModel = Polyhedron.stellatedDodecahedron;
	}

	public void dispose(GLAutoDrawable drawable) {
		// called when the panel is being disposed
	}

	public void reshape(GLAutoDrawable drawable, int x, int y, int width, int height) {
		// called when user resizes the window
	}

	// ---------------------- Menu bar ------------------------------------------------

	private JMenuBar createMenuBar() {
		JMenuBar menuBar = new JMenuBar();
		JMenu model = new JMenu("Polyhedron");
		JMenu render = new JMenu("Render Options");
		menuBar.add(model);
		menuBar.add(render);
		
		ActionListener repainter = new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				repaint();
			}
		};

		JRadioButtonMenuItem[] items;
		items = createRadioMenuGroup(new String[] {"Colored Faces", "WhiteFaces"}, render, repainter);
		coloredFaces = items[0];
		coloredFaces.setSelected(true);
		render.addSeparator();
		items = createRadioMenuGroup(new String[] {"Draw Faces Only", "Draw Edges Only", "Draw Both"}, 
				                                            render, repainter);
		drawFaces = items[0];
		drawEdges = items[1];
		drawBoth = items[2];
		drawBoth.setSelected(true);
		render.addSeparator();
		items = createRadioMenuGroup(new String[] {"Perspective Projetion", "Orthographics Projection"}, render, repainter);
		orthographic = items[1];
		items[0].setSelected(true);

		items = createRadioMenuGroup(new String[] {
				"House",
				"Cube",
				"Dodecahedron",
				"Icosahedron",
				"Octahedron",
				"Rhombic Dodecahedron",
				"Socer Ball",
				"Stellated Dodecahedron",
				"Stellated Icosahedron",
				"Stellated Octahedron",
				"Tetrahedron",
				"Truncated Icosahedron",
				"Truncated Rhombic Dodecahedron"
		}, 
		model,
		new ActionListener() {
			public void actionPerformed(ActionEvent evt) {
				switch (evt.getActionCommand()) {
				case "House": currentModel = Polyhedron.house; break;
				case "Cube": currentModel = Polyhedron.cube; break;
				case "Dodecahedron": currentModel = Polyhedron.dodecahedron; break;
				case "Icosahedron": currentModel = Polyhedron.icosahedron; break;
				case "Octahedron": currentModel = Polyhedron.octahedron; break;
				case "Rhombic Dodecahedron": currentModel = Polyhedron.rhombicDodecahedron; break;
				case "Socer Ball": currentModel = Polyhedron.socerBall; break;
				case "Stellated Dodecahedron": currentModel = Polyhedron.stellatedDodecahedron; break;
				case "Stellated Icosahedron": currentModel = Polyhedron.stellatedIcosahedron; break;
				case "Stellated Octahedron": currentModel = Polyhedron.stellatedOctahedron; break;
				case "Tetrahedron": currentModel = Polyhedron.tetrahedron; break;
				case "Truncated Icosahedron": currentModel = Polyhedron.truncatedIcosahedron; break;
				case "Truncated Rhombic Dodecahedron": currentModel = Polyhedron.truncatedRhombicDodecahedron; break;
				}
				camera.lookAt(2,2,6, 0,0,0, 0,1,0);
				repaint();
			}
		});
		items[7].setSelected(true);

		return menuBar;
	}

	private JRadioButtonMenuItem[] createRadioMenuGroup(String[] itemNames, JMenu menu, ActionListener listener) {
		JRadioButtonMenuItem[] items = new JRadioButtonMenuItem[itemNames.length];
		ButtonGroup group = new ButtonGroup();
		for (int i = 0; i < itemNames.length; i++) {
			JRadioButtonMenuItem item = new JRadioButtonMenuItem(itemNames[i]);
			group.add(item);
			items[i] = item;
			menu.add(item);
			if (listener != null) {
				item.addActionListener(listener);
			}
		}
		return items;
	}

}
