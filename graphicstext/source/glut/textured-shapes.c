
#include "GL/gl.h"
#include "math.h"

// Provides methods for drawing several 3D shapes in an OpenGL
// drawing context of type   The shapes come with optional texture coords.
// THE HEADER FILE FOR THIS LIBRARY IS textured-shapes.h; comments
// about the functions defined here can be found in the header file.

 
static const double PI = 3.141592654;

void uvSphere(double radius, int slices, int stacks, int makeTexCoords) {
    int i,j;
	for (j = 0; j < stacks; j++) {
		double latitude1 = (PI/stacks) * j - PI/2;
		double latitude2 = (PI/stacks) * (j+1) - PI/2;
		double sinLat1 = sin(latitude1);
		double cosLat1 = cos(latitude1);
		double sinLat2 = sin(latitude2);
		double cosLat2 = cos(latitude2);
		glBegin(GL_QUAD_STRIP);
		for (i = 0; i <= slices; i++) {
			double longitude = (2*PI/slices) * i;
			double sinLong = sin(longitude);
			double cosLong = cos(longitude);
			double x1 = cosLong * cosLat1;
			double y1 = sinLong * cosLat1;
			double z1 = sinLat1;
			double x2 = cosLong * cosLat2;
			double y2 = sinLong * cosLat2;
			double z2 = sinLat2;
			glNormal3d(x2,y2,z2);
			if (makeTexCoords)
				glTexCoord2d(1.0/slices * i, 1.0/stacks * (j+1));
			glVertex3d(radius*x2,radius*y2,radius*z2);
			glNormal3d(x1,y1,z1);
			if (makeTexCoords)
				glTexCoord2d(1.0/slices * i, 1.0/stacks * j);
			glVertex3d(radius*x1,radius*y1,radius*z1);
		}
		glEnd();
	}
} // end uvSphere

void uvCylinder(double radius, double height,
		int slices, int stacks, int rings, int makeTexCoords) {
	int i,j;
	for (j = 0; j < stacks; j++) {
		double z1 = (height/stacks) * j;
		double z2 = (height/stacks) * (j+1);
		glBegin(GL_QUAD_STRIP);
		for (i = 0; i <= slices; i++) {
			double longitude = (2*PI/slices) * i;
			double sinLong = sin(longitude);
			double cosLong = cos(longitude);
			double x = cosLong;
			double y = sinLong;
			glNormal3d(x,y,0);
			if (makeTexCoords)
				glTexCoord2d(1.0/slices * i, 1.0/stacks * (j+1));
			glVertex3d(radius*x,radius*y,z2);
			if (makeTexCoords)
				glTexCoord2d(1.0/slices * i, 1.0/stacks * j);
			glVertex3d(radius*x,radius*y,z1);
		}
		glEnd();
	}
	if (rings > 0) { // draw top and bottom
		glNormal3d(0,0,1);
		for (j = 0; j < rings; j++) {
			double d1 = (1.0/rings) * j;
			double d2 = (1.0/rings) * (j+1);
			glBegin(GL_QUAD_STRIP);
			for (i = 0; i <= slices; i++) {
				double angle = (2*PI/slices) * i;
				double s = sin(angle);
				double c = cos(angle);
				if (makeTexCoords)
					glTexCoord2d(0.5*(1+c*d1),0.5*(1+s*d1));
				glVertex3d(radius*c*d1,radius*s*d1,height);
				if (makeTexCoords)
					glTexCoord2d(0.5*(1+c*d2),0.5*(1+s*d2));
				glVertex3d(radius*c*d2,radius*s*d2,height);
			}
			glEnd();
		}
		glNormal3d(0,0,-1);
		for (j = 0; j < rings; j++) {
			double d1 = (1.0/rings) * j;
			double d2 = (1.0/rings) * (j+1);
			glBegin(GL_QUAD_STRIP);
			for (i = 0; i <= slices; i++) {
				double angle = (2*PI/slices) * i;
				double s = sin(angle);
				double c = cos(angle);
				if (makeTexCoords)
					glTexCoord2d(0.5*(1+c*d2),0.5*(1+s*d2));
				glVertex3d(radius*c*d2,radius*s*d2,0);
				if (makeTexCoords)
					glTexCoord2d(0.5*(1+c*d1),0.5*(1+s*d1));
				glVertex3d(radius*c*d1,radius*s*d1,0);
			}
			glEnd();
		}
	}
} // end uvCylinder

void uvCone(double radius, double height, 
		int slices, int stacks, int rings, int makeTexCoords) {
	int i,j;
	for (j = 0; j < stacks; j++) {
		double z1 = (height/stacks) * j;
		double z2 = (height/stacks) * (j+1);
		glBegin(GL_QUAD_STRIP);
		for (i = 0; i <= slices; i++) {
			double longitude = (2*PI/slices) * i;
			double sinLong = sin(longitude);
			double cosLong = cos(longitude);
			double x = cosLong;
			double y = sinLong;
			double nz = radius/height;
			double normLength = sqrt(x*x+y*y+nz*nz);
			glNormal3d(x/normLength,y/normLength,nz/normLength);
			if (makeTexCoords)
				glTexCoord2d(1.0/slices * i, 1.0/stacks * (j+1));
			glVertex3d((height-z2)/height*radius*x,(height-z2)/height*radius*y,z2);
			if (makeTexCoords)
				glTexCoord2d(1.0/slices * i, 1.0/stacks * j);
			glVertex3d((height-z1)/height*radius*x,(height-z1)/height*radius*y,z1);
		}
		glEnd();
	}
	if (rings > 0) {
		glNormal3d(0,0,-1);
		for (j = 0; j < rings; j++) {
			double d1 = (1.0/rings) * j;
			double d2 = (1.0/rings) * (j+1);
			glBegin(GL_QUAD_STRIP);
			for (i = 0; i <= slices; i++) {
				double angle = (2*PI/slices) * i;
				double s = sin(angle);
				double c = cos(angle);
				if (makeTexCoords)
					glTexCoord2d(0.5*(1+c*d2),0.5*(1+s*d2));
				glVertex3d(radius*c*d2,radius*s*d2,0);
				if (makeTexCoords)
					glTexCoord2d(0.5*(1+c*d1),0.5*(1+s*d1));
				glVertex3d(radius*c*d1,radius*s*d1,0);
			}
			glEnd();
		}
	}
} // end uvCone

void uvTorus(double outerRadius, double innerRadius, 
		int slices, int rings, int makeTexCoords) {
	int i,j;
	if (outerRadius < innerRadius) {
		double temp = outerRadius;
		outerRadius = innerRadius;
		innerRadius = temp;
	}
	double centerRadius = (innerRadius + outerRadius) / 2;
	double tubeRadius = outerRadius - centerRadius;
	for (i = 0; i < slices; i++) {
		double s1 = 1.0/slices * i;
		double s2 = 1.0/slices * (i+1);
		double centerCos1 = cos(2*PI*s1);
		double centerSin1 = sin(2*PI*s1);
		double centerCos2 = cos(2*PI*s2);
		double centerSin2 = sin(2*PI*s2);
		glBegin(GL_QUAD_STRIP);
		for (j = 0; j <= rings; j++) {
			double t = 1.0/rings * j;
			double c = cos(2*PI*t - PI);
			double s = sin(2*PI*t - PI);
			double x1 = centerCos1*(centerRadius + tubeRadius*c);
			double y1 = centerSin1*(centerRadius + tubeRadius*c);
			double z1 = s*tubeRadius;
			glNormal3d(centerCos1*c,centerSin1*c,s);
			if (makeTexCoords)
				glTexCoord2d(s1,t);
			glVertex3d(x1,y1,z1);
			double x2 = centerCos2*(centerRadius + tubeRadius*c);
			double y2 = centerSin2*(centerRadius + tubeRadius*c);
			double z2 = s*tubeRadius;
			glNormal3d(centerCos2*c,centerSin2*c,s);
			if (makeTexCoords)
				glTexCoord2d(s2,t);
			glVertex3d(x2,y2,z2);
		}
		glEnd();
	}
} // end uvTorus

void square(double side, int makeTexCoords) {
	double radius = side/2;
	glBegin(GL_POLYGON);
	glNormal3f(0,0,1);
	if (makeTexCoords)
		glTexCoord2d(0,0);
	glVertex2d(-radius,-radius);
	if (makeTexCoords)
		glTexCoord2d(1,0);
	glVertex2d(radius,-radius);
	if (makeTexCoords)
		glTexCoord2d(1,1);
	glVertex2d(radius,radius);
	if (makeTexCoords)
		glTexCoord2d(0,1);
	glVertex2d(-radius,radius);
	glEnd();
} // end square

void cube(double side, int makeTexCoords) {
	glPushMatrix();
	glRotatef(-90,-1,0,0);  // This puts the textures in the orientation I want.
	glPushMatrix();
	glTranslated(0,0,side/2);
	square(side,makeTexCoords);  // Each side of the cube is a transformed square.
	glPopMatrix();
	glPushMatrix();
	glRotatef(90,0,1,0);
	glTranslated(0,0,side/2);
	square(side,makeTexCoords);
	glPopMatrix();
	glPushMatrix();
	glRotatef(180,0,1,0);
	glTranslated(0,0,side/2);
	square(side,makeTexCoords);
	glPopMatrix();
	glPushMatrix();
	glRotatef(270,0,1,0);
	glTranslated(0,0,side/2);
	square(side,makeTexCoords);
	glPopMatrix();
	glPushMatrix();
	glRotatef(90,-1,0,0);
	glTranslated(0,0,side/2);
	square(side,makeTexCoords);
	glPopMatrix();
	glPushMatrix();
	glRotatef(-90,-1,0,0);
	glTranslated(0,0,side/2);
	square(side,makeTexCoords);
	glPopMatrix();
	glPopMatrix();
} // end cube

void ring(double innerRadius, double outerRadius, int slices, int rings, int makeTexCoords) {
      int i,j;
      glNormal3d(0,0,1);
      double dr = (outerRadius - innerRadius) / rings;
      for (j = 0; j < rings; j++) {
         double d1 = innerRadius + dr * j;
         double d2 = innerRadius + dr * (j+1);
         glBegin(GL_QUAD_STRIP);
         for (i = 0; i <= slices; i++) {
            double angle = (2*PI/slices) * i;
            double s = sin(angle);
            double c = cos(angle);
            if (makeTexCoords)
               glTexCoord2d(0.5*(1+c*d1/outerRadius),0.5*(1+s*d1/outerRadius));
            glVertex3d(c*d1,s*d1,0);
            if (makeTexCoords)
               glTexCoord2d(0.5*(1+c*d2/outerRadius),0.5*(1+s*d2/outerRadius));
            glVertex3d(c*d2,s*d2,0);
         }
         glEnd();
      }
} // end ring

void circle(double radius, int slices, int rings, int makeTexCoords) {
    ring(0,radius,slices,rings,makeTexCoords);
}

void cube1() {
	cube(1,1);
}

void square1() {
	square(1,1);
}

void circle1() {
	circle(0.5,32,5, 1);
}

void ring1() {
    ring(0.3,0.5,32,5,1);
}

void uvSphere1() {
	uvSphere(0.5,32,16,1);
}

void uvCylinder1() {
	uvCylinder(0.5,1,32,10,5,1);
}

void uvCone1() {
	uvCone(0.5,1,32,10,5,1);
}

void uvTorus1() {
	uvTorus(0.5,1.0/6,48,72,1);
}





