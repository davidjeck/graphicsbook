import com.jogamp.opengl.GL2;

/**
 * Provides static methods for drawing several 3D shapes in an OpenGL
 * drawing context of type GL2.  The shapes come with optional texture coords.
 */
public class TexturedShapes {

	/**
	 * Draws a cube with side 1, centered at the origin, with sides
	 * parallel to the coordinate axes.  Texture coords are generated.
	 */
	public static void cube(GL2 gl) {
		cube(gl,1,true);
	}

	/**
	 * Draws a square with side 1, in the xy plane, centered at the origin, with sides
	 * parallel to the coordinate axes.  Texture coords are generated.
	 */
	public static void square(GL2 gl) {
		square(gl,1,true);
	}

	/**
	 * Draws a disk of radius 0.5 in the xy-plane, centered at the origin.  Texture
	 * coordinates are generated.
	 */
	public static void circle(GL2 gl) {
		circle(gl,0.5,32,5,true);
	}
	
	/**
	 * Draws a ring (or "annulus") in the xy-plane, centered at the origin.  The outer radius
	 * of the ring is 0.5 and the inner radius is 0.3.  Texture coordinates are generated.
	 */
	public static void ring(GL2 gl) {
		ring(gl,0.3,0.5,32,5,true);
	}

	/**
	 * Calls uvSphere(gl,0.5,32,16,true) to draw a unit sphere with texture coords.
	 * The sphere is centered at (0,0,0) with its axis along the z-axis.
	 */
	public static void uvSphere(GL2 gl) {
		uvSphere(gl,0.5,32,16,true);
	}

	/**
	 * Calls uvCylinder(gl,0.5,1,32,10,5,true); to draw a cylinder with diameter and
	 * height both equal to 1 and with texture coords.  The cylinder has its base
	 * in the xy-plane and its axis along the positive z-axis.
	 */
	public static void uvCylinder(GL2 gl) {
		uvCylinder(gl,0.5,1,32,10,5,true);
	}

	/**
	 * Calls uvCone(gl,0.5,1,32,10,5,true); to draw a cone with diameter and
	 * height both equal to 1 and with texture coords.  The cone has its base
	 * in the xy-plane and its axis along the positive z-axis.
	 */
	public static void uvCone(GL2 gl) {
		uvCone(gl,0.5,1,32,10,5,true);
	}

	/**
	 * Calls uvTorus(gl,0.5,1.0/6,48,72,true); to draw a torus with radii 1/6 and 1/2.  
	 * The torus is bisected by the xy-plane and has its axis along the positive 
	 * z-axis and its center at (0,0,0).  Texture coords are generated for the toruns.
	 */
	public static void uvTorus(GL2 gl) {
		uvTorus(gl,0.5,1.0/6,48,72,true);
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

	/**
	 * Draw a cylinder with a given radius, number of slices, number of stacks, and
	 * number of rings.  The number of slices is the number of divisions parallel to the 
	 * axis (like the slices of an orange).  The number of stacks is the number
	 * of divisions perpendicular the axis.  If the number or rings is less than or
	 * equal to zero, then the top and bottom caps are not drawn.  If the number of
	 * rings is positive, then the top and bottom caps are drawn, and they are divided
	 * radially into the specified number of rings for drawing; the number of axial 
	 * divisions of the caps is the same as the number of slices.  The last parameter
	 * tells whether to generate texture coordinates for the cylinder.  The texture
	 * will be wrapped once around the cylinder.  For the top an bottom caps, a circular
	 * cutout from the texture is used.  The cylinder has its base in the xy-plane, with 
	 * center at (0,0,0), and its axis lies along the positive direction of the z-axis.
	 */
	public static void uvCylinder(GL2 gl, double radius, double height,
			int slices, int stacks, int rings, boolean makeTexCoords) {
		if (radius <= 0)
			throw new IllegalArgumentException("Radius must be positive.");
		if (height <= 0)
			throw new IllegalArgumentException("Height must be positive.");
		if (slices < 3)
			throw new IllegalArgumentException("Number of slices must be at least 3.");
		if (stacks < 2)
			throw new IllegalArgumentException("Number of stacks must be at least 2.");
		for (int j = 0; j < stacks; j++) {
			double z1 = (height/stacks) * j;
			double z2 = (height/stacks) * (j+1);
			gl.glBegin(GL2.GL_QUAD_STRIP);
			for (int i = 0; i <= slices; i++) {
				double longitude = (2*Math.PI/slices) * i;
				double sinLong = Math.sin(longitude);
				double cosLong = Math.cos(longitude);
				double x = cosLong;
				double y = sinLong;
				gl.glNormal3d(x,y,0);
				if (makeTexCoords)
					gl.glTexCoord2d(1.0/slices * i, 1.0/stacks * (j+1));
				gl.glVertex3d(radius*x,radius*y,z2);
				if (makeTexCoords)
					gl.glTexCoord2d(1.0/slices * i, 1.0/stacks * j);
				gl.glVertex3d(radius*x,radius*y,z1);
			}
			gl.glEnd();
		}
		if (rings > 0) { // draw top and bottom
			gl.glNormal3d(0,0,1);
			for (int j = 0; j < rings; j++) {
				double d1 = (1.0/rings) * j;
				double d2 = (1.0/rings) * (j+1);
				gl.glBegin(GL2.GL_QUAD_STRIP);
				for (int i = 0; i <= slices; i++) {
					double angle = (2*Math.PI/slices) * i;
					double sin = Math.sin(angle);
					double cos = Math.cos(angle);
					if (makeTexCoords)
						gl.glTexCoord2d(0.5*(1+cos*d1),0.5*(1+sin*d1));
					gl.glVertex3d(radius*cos*d1,radius*sin*d1,height);
					if (makeTexCoords)
						gl.glTexCoord2d(0.5*(1+cos*d2),0.5*(1+sin*d2));
					gl.glVertex3d(radius*cos*d2,radius*sin*d2,height);
				}
				gl.glEnd();
			}
			gl.glNormal3d(0,0,-1);
			for (int j = 0; j < rings; j++) {
				double d1 = (1.0/rings) * j;
				double d2 = (1.0/rings) * (j+1);
				gl.glBegin(GL2.GL_QUAD_STRIP);
				for (int i = 0; i <= slices; i++) {
					double angle = (2*Math.PI/slices) * i;
					double sin = Math.sin(angle);
					double cos = Math.cos(angle);
					if (makeTexCoords)
						gl.glTexCoord2d(0.5*(1+cos*d2),0.5*(1+sin*d2));
					gl.glVertex3d(radius*cos*d2,radius*sin*d2,0);
					if (makeTexCoords)
						gl.glTexCoord2d(0.5*(1+cos*d1),0.5*(1+sin*d1));
					gl.glVertex3d(radius*cos*d1,radius*sin*d1,0);
				}
				gl.glEnd();
			}
		}
	} // end uvCylinder

	/**
	 * Draw a cone with a given radius, number of slices, number of stacks, and
	 * number of rings.  The number of slices is the number of divisions parallel to the 
	 * axis (like the slices of an orange).  The number of stacks is the number
	 * of divisions perpendicular the axis.  If the number or rings is less than or
	 * equal to zero, then the bottom is not drawn.  If the number of
	 * rings is positive, then the bottom is drawn, and is divided
	 * radially into the specified number of rings for drawing; the number of axial 
	 * divisions of the base is the same as the number of slices.  The last
	 * parameter tells whether to generate texture coordinates for the cone. The cone
	 * has its base in the xy-plane, with center at (0,0,0), and its axis lies
	 * along the positive direction of the z-axis. 
	 */
	public static void uvCone(GL2 gl, double radius, double height, 
			int slices, int stacks, int rings, boolean makeTexCoords) {
		if (radius <= 0)
			throw new IllegalArgumentException("Radius must be positive.");
		if (height <= 0)
			throw new IllegalArgumentException("Height must be positive.");
		if (slices < 3)
			throw new IllegalArgumentException("Number of slices must be at least 3.");
		if (stacks < 2)
			throw new IllegalArgumentException("Number of stacks must be at least 2.");
		for (int j = 0; j < stacks; j++) {
			double z1 = (height/stacks) * j;
			double z2 = (height/stacks) * (j+1);
			gl.glBegin(GL2.GL_QUAD_STRIP);
			for (int i = 0; i <= slices; i++) {
				double longitude = (2*Math.PI/slices) * i;
				double sinLong = Math.sin(longitude);
				double cosLong = Math.cos(longitude);
				double x = cosLong;
				double y = sinLong;
				double nz = radius/height;
				double normLength = Math.sqrt(x*x+y*y+nz*nz);
				gl.glNormal3d(x/normLength,y/normLength,nz/normLength);
				if (makeTexCoords)
					gl.glTexCoord2d(1.0/slices * i, 1.0/stacks * (j+1));
				gl.glVertex3d((height-z2)/height*radius*x,(height-z2)/height*radius*y,z2);
				if (makeTexCoords)
					gl.glTexCoord2d(1.0/slices * i, 1.0/stacks * j);
				gl.glVertex3d((height-z1)/height*radius*x,(height-z1)/height*radius*y,z1);
			}
			gl.glEnd();
		}
		if (rings > 0) {
			gl.glNormal3d(0,0,-1);
			for (int j = 0; j < rings; j++) {
				double d1 = (1.0/rings) * j;
				double d2 = (1.0/rings) * (j+1);
				gl.glBegin(GL2.GL_QUAD_STRIP);
				for (int i = 0; i <= slices; i++) {
					double angle = (2*Math.PI/slices) * i;
					double sin = Math.sin(angle);
					double cos = Math.cos(angle);
					if (makeTexCoords)
						gl.glTexCoord2d(0.5*(1+cos*d2),0.5*(1+sin*d2));
					gl.glVertex3d(radius*cos*d2,radius*sin*d2,0);
					if (makeTexCoords)
						gl.glTexCoord2d(0.5*(1+cos*d1),0.5*(1+sin*d1));
					gl.glVertex3d(radius*cos*d1,radius*sin*d1,0);
				}
				gl.glEnd();
			}
		}
	} // end uvCone

	/**
	 * Create a torus (doughnut) lying bisected by the xy-plane, centered at the origin,
	 * and with its central axis lying along the z-axis.
	 * The first two parameters give the outer and inner radii of the torus.
	 * @param outerRadius  The outer radius of the torus.
	 *    (Note: if the outerRadius is smaller than the innerRadius, then the
	 *    values are swapped, so that in effect the first two parameters are
	 *    the two radii in either order.)
	 * @param innerRadius  The inner radius of the torus.
	 * @param slices The number of slices, like the slices of an orange, that are
	 *    used to  approximate the torus.  The slices are cross-sections
	 *    of the tube of the torus. Must be 3 or more.
	 * @param rings The number of divisions around the circumference of the tube
	 *    of the torus.  Must be 3 or more.
	 * @param makeTexCoords Tells whether to generate texture coords for the torus.
	 *    The texture will wrap once around the torus in each direction.
	 */
	public static void uvTorus(GL2 gl, double outerRadius, double innerRadius, 
			int slices, int rings, boolean makeTexCoords) {
		if (outerRadius == innerRadius)
			throw new IllegalArgumentException("Outer and inner radii can't be the same.");
		if (outerRadius < innerRadius) {
			double temp = outerRadius;
			outerRadius = innerRadius;
			innerRadius = temp;
		}
		if (innerRadius < 0)
			throw new IllegalArgumentException("Radius can't be negative.");
		if (slices < 3)
			throw new IllegalArgumentException("Number of slices must be 3 or more.");
		if (rings < 3)
			throw new IllegalArgumentException("Number of rings must be 3 or more.");
		double centerRadius = (innerRadius + outerRadius) / 2;
		double tubeRadius = outerRadius - centerRadius;
		for (int i = 0; i < slices; i++) {
			double s1 = 1.0/slices * i;
			double s2 = 1.0/slices * (i+1);
			double centerCos1 = Math.cos(2*Math.PI*s1);
			double centerSin1 = Math.sin(2*Math.PI*s1);
			double centerCos2 = Math.cos(2*Math.PI*s2);
			double centerSin2 = Math.sin(2*Math.PI*s2);
			gl.glBegin(GL2.GL_QUAD_STRIP);
			for (int j = 0; j <= rings; j++) {
				double t = 1.0/rings * j;
				double cos = Math.cos(2*Math.PI*t - Math.PI);
				double sin = Math.sin(2*Math.PI*t - Math.PI);
				double x1 = centerCos1*(centerRadius + tubeRadius*cos);
				double y1 = centerSin1*(centerRadius + tubeRadius*cos);
				double z1 = sin*tubeRadius;
				gl.glNormal3d(centerCos1*cos,centerSin1*cos,sin);
				if (makeTexCoords)
					gl.glTexCoord2d(s1,t);
				gl.glVertex3d(x1,y1,z1);
				double x2 = centerCos2*(centerRadius + tubeRadius*cos);
				double y2 = centerSin2*(centerRadius + tubeRadius*cos);
				double z2 = sin*tubeRadius;
				gl.glNormal3d(centerCos2*cos,centerSin2*cos,sin);
				if (makeTexCoords)
					gl.glTexCoord2d(s2,t);
				gl.glVertex3d(x2,y2,z2);
			}
			gl.glEnd();
		}
	} // end uvTorus

	/**
	 * Draws a cube with a specified side length, centered at the origin
	 * and with edges paralled to the coordinate axes.  The last parameter
	 * tells whether to generated texture coordinates.  The full texture
	 * is applied to each face of the cube.
	 */
	public static void cube(GL2 gl, double side, boolean makeTexCoords) {
		gl.glPushMatrix();
		gl.glRotatef(-90,-1,0,0);  // This puts the textures in the orientation I want.
		gl.glPushMatrix();
		gl.glTranslated(0,0,side/2);
		square(gl,side,makeTexCoords);  // Each side of the cube is a transformed square.
		gl.glPopMatrix();
		gl.glPushMatrix();
		gl.glRotatef(90,0,1,0);
		gl.glTranslated(0,0,side/2);
		square(gl,side,makeTexCoords);
		gl.glPopMatrix();
		gl.glPushMatrix();
		gl.glRotatef(180,0,1,0);
		gl.glTranslated(0,0,side/2);
		square(gl,side,makeTexCoords);
		gl.glPopMatrix();
		gl.glPushMatrix();
		gl.glRotatef(270,0,1,0);
		gl.glTranslated(0,0,side/2);
		square(gl,side,makeTexCoords);
		gl.glPopMatrix();
		gl.glPushMatrix();
		gl.glRotatef(90,-1,0,0);
		gl.glTranslated(0,0,side/2);
		square(gl,side,makeTexCoords);
		gl.glPopMatrix();
		gl.glPushMatrix();
		gl.glRotatef(-90,-1,0,0);
		gl.glTranslated(0,0,side/2);
		square(gl,side,makeTexCoords);
		gl.glPopMatrix();
		gl.glPopMatrix();
	} // end cube

	/**
	 * Draws a square in the xy-plane, with given side length,
	 * and edges parallel to the x and y axes.  The third parameter
	 * tells whether to generate texture coordinates for the square.
	 * The full texture is applied to the square.
	 */
	public static void square(GL2 gl, double side, boolean makeTexCoords) {
		double radius = side/2;
		gl.glBegin(GL2.GL_POLYGON);
		gl.glNormal3f(0,0,1);
		if (makeTexCoords)
			gl.glTexCoord2d(0,0);
		gl.glVertex2d(-radius,-radius);
		if (makeTexCoords)
			gl.glTexCoord2d(1,0);
		gl.glVertex2d(radius,-radius);
		if (makeTexCoords)
			gl.glTexCoord2d(1,1);
		gl.glVertex2d(radius,radius);
		if (makeTexCoords)
			gl.glTexCoord2d(0,1);
		gl.glVertex2d(-radius,radius);
		gl.glEnd();
	} // end square

	/**
	 * Draw a filled circle in the xy-plane, centered at the origin.  A polygonal
	 * approximation of the circle is drawn.
	 * @param radius  the radius of the circle
	 * @param slices  the number of sides of the polygon
	 * @param rings  number of radial subdivisions of the circle
	 * @param makeTexCoords tells whether to make texture coordinates for the circle.
	 *    A circular cutout from the texture is applied to the circle.
	 */
	public static void circle(GL2 gl, double radius, int slices, int rings, boolean makeTexCoords) {
		if (radius <= 0)
			throw new IllegalArgumentException("Radius must be greater than zero.");
		ring(gl,0,radius,slices,rings,makeTexCoords);
	}

	/**
	 * Draw a filled ring in the xy-plane, centered at the origin.  The ring is a disk
	 * with a smaller disk deleted from its center.  A polygonal
	 * approximation of the ring is drawn.
	 * @param innerRadius  the radius of the hole in the ring.  Must be greater than or
	 *    equal to zero; if the value is zero, then a completely filled disk is drawn.
	 * @param outerRradius  the radius of the ring, measured from center to outer edge.
	 *    Must be greater than innerRadius.
	 * @param slices  the number of sides of the polygon
	 * @param rings  number of radial subdivisions of the disk
	 * @param makeTexCoords tells whether to make texture coordinates for the circle.
	 *    A  cutout from the texture is applied to the disk.
	 */
	public static void ring(GL2 gl, double innerRadius, double outerRadius,
			                            int slices, int rings, boolean makeTexCoords) {
		if (innerRadius < 0)
			throw new IllegalArgumentException("innerRadius must be greater than or equal to zero.");
		if (outerRadius <= innerRadius)
			throw new IllegalArgumentException("outerRadius must be greater than innerRadius.");
		if (slices < 3)
			throw new IllegalArgumentException("Number of slices must be 3 or more.");
		if (rings < 1)
			throw new IllegalArgumentException("Number of rings must be 1 or more.");
	      gl.glNormal3d(0,0,1);
	      double dr = (outerRadius - innerRadius) / rings;
	      for (int j = 0; j < rings; j++) {
	         double d1 = innerRadius + dr * j;
	         double d2 = innerRadius + dr * (j+1);
	         gl.glBegin(GL2.GL_QUAD_STRIP);
	         for (int i = 0; i <= slices; i++) {
	            double angle = (2*Math.PI/slices) * i;
	            double sin = Math.sin(angle);
	            double cos = Math.cos(angle);
	            if (makeTexCoords)
	               gl.glTexCoord2d(0.5*(1+cos*d1/outerRadius),0.5*(1+sin*d1/outerRadius));
	            gl.glVertex3d(cos*d1,sin*d1,0);
	            if (makeTexCoords)
	               gl.glTexCoord2d(0.5*(1+cos*d2/outerRadius),0.5*(1+sin*d2/outerRadius));
	            gl.glVertex3d(cos*d2,sin*d2,0);
	         }
	         gl.glEnd();
	      }
	}

}
