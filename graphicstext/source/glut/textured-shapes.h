
// textured-shapes.c provides methods for drawing several 3D shapes in an OpenGL
// drawing context of type   The shapes come with optional texture coords.
// There are two functions for each shape, one with a lot of parameters and
// one with no parameters that draws a shape of size 1, with texture coords.
 

/*
 * Draws a cube with side 1, centered at the origin, with sides
 * parallel to the coordinate axes.  Texture coords are generated.
 */
void cube1();


/*
 * Draws a square with side 1, in the xy plane, centered at the origin, with sides
 * parallel to the coordinate axes.  Texture coords are generated.
 */
void square1();


/*
 * Draws a disk of radius 0.5 in the xy-plane, centered at the origin.  Texture
 * coordinates are generated.
 */
void circle1();


/*
 * Draws a ring (or "annulus") in the xy-plane, centered at the origin.  The inner
 * radius is 0.3 and the outerRadius is 0.5.  Texture coords are generated.
 */
void ring1();

/*
 * Calls uvSphere(0.5,32,16,1) to draw a unit sphere with texture coords.
 * The sphere is centered at (0,0,0) with its axis along the z-axis.
 */
void uvSphere1();


/*
 * Calls uvCylinder(0.5,1,32,10,5,1); to draw a cylinder with diameter and
 * height both equal to 1 and with texture coords.  The cylinder has its base
 * in the xy-plane and its axis along the positive z-axis.
 */
void uvCylinder1();


/*
 * Calls uvCone(0.5,1,32,10,5,1); to draw a cone with diameter and
 * height both equal to 1 and with texture coords.  The cone has its base
 * in the xy-plane and its axis along the positive z-axis.
 */
void uvCone1();


/*
 * Calls uvTorus(0.5,1.0/6,48,72,1); to draw a torus with radii 1/6 and 1/2.  
 * The torus is bisected by the xy-plane and has its axis along the positive 
 * z-axis and its center at (0,0,0).  Texture coords are generated for the toruns.
 */
void uvTorus1();


/*
 * Draw a sphere with a given radius, number of slices, and number
 * of stacks.  The number of slices is the number of lines of longitude
 * (like the slices of an orange).  The number of stacks is the number
 * of divisions perpendicular the axis; the lines of latitude are the
 * dividing lines between stacks, so there are stacks-1 lines of latitude.
 * The last parameter tells whether or not to generate texture
 * coordinates for the sphere.  The texture wraps once around the sphere.
 * The sphere is centered at (0,0,0), and its axis lies along the z-axis.
 */
void uvSphere(double radius, int slices, int stacks, int makeTexCoords);


/*
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
void uvCylinder(double radius, double height,
		int slices, int stacks, int rings, int makeTexCoords);
		
		
/*
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
void uvCone(double radius, double height, 
		int slices, int stacks, int rings, int makeTexCoords);
		
		

/*
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
void uvTorus(double outerRadius, double innerRadius, 
		int slices, int rings, int makeTexCoords);
		

/*
 * Draws a square in the xy-plane, with given side length,
 * and edges parallel to the x and y axes.  The third parameter
 * tells whether to generate texture coordinates for the square.
 * The full texture is applied to the square.
 */
void square(double side, int makeTexCoords);


/*
 * Draws a cube with a specified side length, centered at the origin
 * and with edges paralled to the coordinate axes.  The last parameter
 * tells whether to generated texture coordinates.  The full texture
 * is applied to each face of the cube.
 */
void cube(double side, int makeTexCoords);


/*
 * Draw a filled circle in the xy-plane, centered at the origin.  A polygonal
 * approximation of the circle is drawn.
 * @param radius  the radius of the circle
 * @param slices  the number of sides of the polygon
 * @param rings  number of radial subdivisions of the circle
 * @param makeTexCoords tells whether to make texture coordinates for the circle.
 *    A circular cutout from the texture is applied to the circle.
 */
void circle(double radius, int slices, int rings, int makeTexCoords);


/*
 * Draw a filled ring in the xy-plane, centered at the origin. 
 * @param innerRadius  the inner radius of the ring; must be >= 0.
 * @param outerRadius  the outer radius of the ring; must be > innerRadius.
 * @param slices  the number of sides of the polygon
 * @param rings  number of radial subdivisions of the ring
 * @param makeTexCoords tells whether to make texture coordinates for the circle.
 *    A cutout from the texture is applied to the ring.
 */
void ring(double innerRadius, double outerRadius, int slices, int rings, int makeTexCoords);



