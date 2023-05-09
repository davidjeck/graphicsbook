
/*
 *  Header file for Polyhedron, which defines several polyhedra
 *  as IFS models.  Note that createPolyhedra() MUST be called 
 *  before using any of the polyhedra.
 * 
 *  A polyhedron is a struct of type Polyhedron, with the following
 *  fields
 */

typedef struct Polyhedron {  // Data type for polyhedra.
    int vertexCount;    // Number of vertices in the polyhedron.
    int faceCount;      // Number of faces in the polyhedron.
    double maxVertexLength;  // Longest vertex, treating the vertices as vectors.
    double* vertices;   // Array of vertex coordinates, 3 numbers per vertex; length = vertexCount*3
    int* faces;         // Array of face data.  For each face, it contains a list of vertex numbers
                        //    vertices of that face, followed by a -1 to mark the end of the data
                        //    for that face.  Length depends on how many vertices all the faces
                        //    have.  Note that the location for the data for vertex number n is
                        //    at index 3*x in the vertex array.
    double* faceColors; // Can be NULL.  Otherwise, an array of color data, with 3 numbers
                        //    for each face giving the RGB for that face.  Length is 3*faceCount.
                        //    Note that the data for face n is at index 3*n.
    double* normals;    // Array of normal vectors for the faces, with 3 numbers per face.
                        //    Note that the data for face n is at index 3*n.
} Polyhedron;

void createPolyhedra();  // CALL THIS BEFORE USING THE FOLLOWING VARIABLES!

/* The available polyhedral models. */

extern Polyhedron house;
extern Polyhedron cube;
extern Polyhedron dodecahedron;
extern Polyhedron icosahedron;
extern Polyhedron octahedron;
extern Polyhedron rhombicDodecahedron;
extern Polyhedron socerBall;
extern Polyhedron stellatedDodecahedron;
extern Polyhedron stellatedIcosahedron;
extern Polyhedron stellatedOctahedron;
extern Polyhedron tetrahedron;
extern Polyhedron truncatedIcosahedron;
extern Polyhedron truncatedRhombicDodecahedron;
