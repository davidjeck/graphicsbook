import java.io.*;


public class WritePolyhedraForC {

	public static void main(String[] args) throws IOException {
		PrintStream out = new PrintStream("/home/eck/Desktop/Polyhedron.c");
		writePoly(Polyhedron.cube, "cube", out);
		writePoly(Polyhedron.house, "house", out);
		writePoly(Polyhedron.cube, "cube", out);
		writePoly(Polyhedron.dodecahedron, "dodecahedron", out);
		writePoly(Polyhedron.icosahedron, "icosahedron", out);
		writePoly(Polyhedron.octahedron, "octahedron", out);
		writePoly(Polyhedron.rhombicDodecahedron, "rhombicDodecahedron", out);
		writePoly(Polyhedron.socerBall, "socerBall", out);
		writePoly(Polyhedron.stellatedDodecahedron, "stellatedDodecahedron", out);
		writePoly(Polyhedron.stellatedIcosahedron, "stellatedIcosahedron", out);
		writePoly(Polyhedron.stellatedOctahedron, "stellatedOctahedron", out);
		writePoly(Polyhedron.tetrahedron, "tetrahedron", out);
		writePoly(Polyhedron.truncatedIcosahedron, "truncatedIcosahedron", out);
		writePoly(Polyhedron.truncatedRhombicDodecahedron, "truncatedRhombicDodecahedron", out);
	}

	static void writePoly(Polyhedron poly, String name, PrintStream out) {
		int i;
		out.println();
		out.println("extern Polyhedron " + name + ";");
		out.println();
		out.println("static Polyhedron create_" + name + "IFS() {");
		out.println("   Polyhedron poly;");
		out.println("   poly.vertexCount = " + poly.vertices.length + ";");
		out.println("   poly.faceCount = " + poly.faces.length + ";");
		out.println("   poly.vertices = malloc( poly.vertexCount*3*sizeof(double) );");
		if (poly.faceColors == null)
			out.println("   poly.faceColors = NULL;");
		else
			out.println("   poly.faceColors = malloc( poly.faceCount*3*sizeof(double) );");
		out.println("   poly.normals = malloc( poly.faceCount*3*sizeof(double) );");
		int faceSize = 0;
		for (i = 0; i < poly.faces.length; i++)
			faceSize += poly.faces[i].length + 1;
		out.println("   poly.faces = malloc( " + faceSize + "*sizeof(int) );");
		out.println("   doubleArray(poly.vertices, 3*poly.vertexCount,");
		for (i = 0; i < poly.vertices.length - 1; i++)
			out.printf("      %1.3f, %1.3f, %1.3f,\n", poly.vertices[i][0], poly.vertices[i][1], poly.vertices[i][2]);
		out.printf("      %1.3f, %1.3f, %1.3f\n", poly.vertices[i][0], poly.vertices[i][1], poly.vertices[i][2]);
		out.println("   );");
		out.println("   doubleArray(poly.normals, 3*poly.faceCount,");
		for (i = 0; i < poly.faces.length - 1; i++)
			out.printf("      %1.3f, %1.3f, %1.3f,\n", poly.normals[i][0], poly.normals[i][1], poly.normals[i][2]);
		out.printf("      %1.3f, %1.3f, %1.3f\n", poly.normals[i][0], poly.normals[i][1], poly.normals[i][2]);
		out.println("   );");
		out.println("   intArray(poly.faces, " + faceSize + ",");
		for (i = 0; i < poly.faces.length - 1; i++) {
			out.print("      ");
			for (int j = 0; j < poly.faces[i].length; j++)
				out.print(poly.faces[i][j] + ",");
			out.println("-1,");
		}
		out.print("      ");
		for (int j = 0; j < poly.faces[i].length; j++)
			out.print(poly.faces[i][j] + ",");
		out.println("-1");
		out.println("   );");
		if (poly.faceColors != null) {
			out.println("   doubleArray(poly.faceColors, 3*poly.faceCount,");
			for (i = 0; i < poly.faces.length - 1; i++)
				out.printf("      %1.3f, %1.3f, %1.3f,\n", poly.faceColors[i][0], poly.faceColors[i][1], poly.faceColors[i][2]);
			out.printf("      %1.3f, %1.3f, %1.3f\n", poly.faceColors[i][0], poly.faceColors[i][1], poly.faceColors[i][2]);
			out.println("   );");
		}
		out.println("   return poly;");
		out.println("}");
	}

}
