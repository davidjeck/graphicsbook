
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import java.awt.geom.*;
import java.util.ArrayList;

/**
 * A panel that displays a two-dimensional animation that is constructed
 * using hierarchical modeling.  A cart rolls down a road while a sun
 * shines and three windmills turn in the background.  This class also
 * contains a main() routine that simply opens a window that displays
 * the animation.
 */
public class SceneGraphAPI2D extends JPanel {

   public static void main(String[] args) {
      JFrame window = new JFrame("SceneGraphAPI2D");
      window.setContentPane( new SceneGraphAPI2D() );
      window.pack();
      window.setLocation(100,60);
      window.setResizable(false);
      window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
      window.setVisible(true);
   }
   
   //------------------- A Simple Scene Object-Oriented Scene Graph API ----------------
   
   static abstract class SceneGraphNode {
       Color color;  // If not null, the default color for this node and its children.
                     // If null, the default color is inherited.
       SceneGraphNode setColor(Color c) {
           this.color = c;
           return this;
       }
       final void draw(Graphics2D g) {
           Color saveColor = null;
           if (color != null) {
               saveColor = g.getColor();
               g.setColor(color);
           }
           doDraw(g);
           if (saveColor != null) {
              g.setColor(saveColor);
           }
       }
       abstract void doDraw(Graphics2D g);
   }
   
   static class CompoundObject extends SceneGraphNode {
       ArrayList<SceneGraphNode> subobjects = new ArrayList<SceneGraphNode>();
       CompoundObject add(SceneGraphNode node) {
           subobjects.add(node);
           return this;
       }
       void doDraw(Graphics2D g) {
           for (SceneGraphNode node : subobjects)
              node.draw(g);
       }
   }
   
   static class TransformedObject extends SceneGraphNode {
       SceneGraphNode object;
       double rotationInDegrees = 0;
       double scaleX = 1, scaleY = 1;
       double translateX = 0, translateY = 0;
       TransformedObject(SceneGraphNode object) {
           this.object = object;
       }
       TransformedObject setRotation(double degrees) {
           rotationInDegrees = degrees;
           return this;
       }
       TransformedObject setTranslation(double dx, double dy) {
           translateX = dx;
           translateY = dy;
           return this;
       }
       TransformedObject setScale(double sx, double sy) {
           scaleX = sx;
           scaleY = sy;
           return this;
       }
       void doDraw(Graphics2D g) {
           AffineTransform savedTransform = g.getTransform();
           if (translateX != 0 || translateY != 0)
               g.translate(translateX,translateY);
           if (rotationInDegrees != 0)
               g.rotate( rotationInDegrees/180.0 * Math.PI);
           if (scaleX != 1 || scaleY != 1)
               g.scale(scaleX,scaleY);
           object.draw(g);
           g.setTransform(savedTransform);
       }
   }
   
   static SceneGraphNode line = new SceneGraphNode() {
       void doDraw(Graphics2D g) {  g.drawLine(0,0,1,0); }
   };
   
   static SceneGraphNode rect = new SceneGraphNode() {
       void doDraw(Graphics2D g) {  g.draw(new Rectangle2D.Double(-0.5,-0.5,1,1)); }
   };
   
   static SceneGraphNode filledRect = new SceneGraphNode() {
       void doDraw(Graphics2D g) {  g.fill(new Rectangle2D.Double(-0.5,-0.5,1,1)); }
   };
   
   static SceneGraphNode circle = new SceneGraphNode() {
       void doDraw(Graphics2D g) {  g.draw(new Ellipse2D.Double(-0.5,-0.5,1,1)); }
   };
   
   static SceneGraphNode filledCircle = new SceneGraphNode() {
       void doDraw(Graphics2D g) {  g.fill(new Ellipse2D.Double(-0.5,-0.5,1,1)); }
   };
   
   static SceneGraphNode ground = new SceneGraphNode() {
        Path2D path;
        {
           path = new Path2D.Float();
           path.moveTo(0,-1);
           path.lineTo(0,0.8F);
           path.lineTo(1.5F,1.65F);
           path.lineTo(1.8F,1.3F);
           path.lineTo(3,2.1F);
           path.lineTo(4.7F,0.7);
           path.lineTo(6.1F,1.2);
           path.lineTo(7,0.8F);
           path.lineTo(7,-1);
           path.closePath();
        }
        void doDraw(Graphics2D g) { g.fill(path); };
   };
   
   static SceneGraphNode windmillVane = new SceneGraphNode() {
        Path2D path;
        {
           path = new Path2D.Float();
           path.moveTo(0,0);
           path.lineTo(0.5F,0.1F);
           path.lineTo(1.5F,0);
           path.lineTo(0.5F,-0.1F);
           path.closePath();
        }
        void doDraw(Graphics2D g) { g.fill(path); };
   };
   
   //-----------------------------------------------------------------------------------
   
   private CompoundObject world;     // A SceneGraphNode representing the entire scene.
   
   private TransformedObject cart;   // Four variables for objects in the scene that
   private TransformedObject wheel;  //   are animated.  These are instance variables
   private TransformedObject sun;    //   to allow their transformations to be set
   private TransformedObject rotor;  //   in each frame.
   
   private int frameNumber; // For animation, increases by 1 in each frame.

   private float pixelSize;  // The size of a pixel in drawing coordinates.

   private double xleftRequested = 0;      // horizontal and vertical limits in the
   private double xrightRequested = 7;     //   coordinate system applied to the
   private double ytopRequested = 4;       //   drawing area.
   private double ybottomRequested = -1;


   /**
    * Constructor creates the scene graph data structure that represents the
    * scene that is to be drawn in this panel, by calling createWorld().
    * It also sets the preferred size of the panel to 700-by-500, adds
    * a gray border, and starts a timer that will drive the animation.
    */
   public SceneGraphAPI2D() {
      setPreferredSize( new Dimension(700,500));
      setBackground( new Color(200,200,255) );
      setBorder(BorderFactory.createLineBorder(Color.DARK_GRAY, 2));
      createWorld();
      new Timer(30,new ActionListener() {
         public void actionPerformed(ActionEvent evt) {
            updateFrame();
            repaint();
         }
      }).start();
   }
   
   
   /**
    * Draw the current frame of the animation.  This method sets up the graphics
    * environment, then calls the draw() in the object that represents the scene.
    */
   protected void paintComponent(Graphics g) {
      super.paintComponent(g);
      Graphics2D g2 = (Graphics2D)g.create();
      g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
      applyLimits(g2, xleftRequested, xrightRequested, ytopRequested, ybottomRequested, false);
      g2.setStroke( new BasicStroke(pixelSize) );
      world.draw(g2);
   }
   
   /**
    *  Builds the data structure that represents the entire picture.  This data structure
    *  is referred to by the global variable, world.  The global variables sun, wheel,
    *  cart, and windmill are also set in this method.
    */
   private void createWorld() {
       
       CompoundObject sunTemp = new CompoundObject();
       sunTemp.setColor(Color.YELLOW); // color for filled circle
       for (int i = 0; i < 12; i++) {  // add the 12 light rays, with different rotations
          sunTemp.add( new TransformedObject(line).setScale(0.75,0.75).setRotation(i*30).setColor(new Color(0xDD8800)) );
       }
       sunTemp.add( filledCircle );  // the face of the sun
       sunTemp.add( new TransformedObject(circle).setColor(new Color(0xDD8800)) ); // outlines the face
       sun = new TransformedObject(sunTemp);
       
       CompoundObject wheelTemp = new CompoundObject();
       wheelTemp.setColor(Color.BLACK); // color for all but one of the subobjects
       wheelTemp.add( new TransformedObject(filledCircle).setScale(2,2) );
       wheelTemp.add( new TransformedObject(filledCircle).setScale(1.6,1.6).setColor(Color.LIGHT_GRAY) );
       wheelTemp.add( new TransformedObject(filledCircle).setScale(0.4,0.4) );
       for (int i = 0; i < 12; i++) {  // add the 12 spokes
          wheelTemp.add( new TransformedObject(line).setRotation(i*30) );
       }
       wheel = new TransformedObject(wheelTemp);
       
       CompoundObject cartTemp = new CompoundObject();
       cartTemp.setColor(Color.RED); // color for the rectangular body of the cart
       cartTemp.add( new TransformedObject(wheel).setScale(0.8,0.8).setTranslation(1.65,-0.1) );
       cartTemp.add( new TransformedObject(wheel).setScale(0.8,0.8).setTranslation(-1.65,-0.1) );
       cartTemp.add( new TransformedObject(filledRect).setScale(6,1.5).setTranslation(0,1) ); // the body of the cart
       cartTemp.add( new TransformedObject(filledRect).setScale(2.6,1).setTranslation(-1,2) ); // the top of the cart
       cart = new TransformedObject(cartTemp).setScale(0.3,0.3);
       
       CompoundObject rotorTemp = new CompoundObject(); // a "rotor" consisting of three vanes
       rotorTemp.setColor( new Color(200,100,100) ); // color for all of the vanes
       rotorTemp.add( windmillVane );
       rotorTemp.add( new TransformedObject(windmillVane).setRotation(120) );
       rotorTemp.add( new TransformedObject(windmillVane).setRotation(240) );
       rotor = new TransformedObject(rotorTemp);
       
       CompoundObject windmill = new CompoundObject();
       windmill.setColor(new Color(0xAA9999)); // color for the pole
       windmill.add( new TransformedObject(filledRect).setScale(0.1,3).setTranslation(0,1.5) ); // the pole
       windmill.add( new TransformedObject(rotor).setTranslation(0,3) ); // the rotating vanes
       
       world = new CompoundObject();
       world.setColor(new Color(0,150,30)); // color used for the ground only
       world.add(ground);
       world.add( new TransformedObject(filledRect).setScale(7,0.8).setTranslation(3.5,0).setColor(new Color(100,100,150)) ); // road
       world.add( new TransformedObject(filledRect).setScale(7,0.06).setTranslation(3.5,0).setColor(Color.WHITE) ); // line in road
       world.add( new TransformedObject(windmill).setScale(0.6,0.6).setTranslation(0.75,1) );
       world.add( new TransformedObject(windmill).setScale(0.4,0.4).setTranslation(2.2,1.3) );
       world.add( new TransformedObject(windmill).setScale(0.7,0.7).setTranslation(3.7,0.8) );
       world.add( new TransformedObject(sun).setTranslation(5.5,3.3) );
       world.add( cart );
       
   } // end createWorld()
   
   
   /**
    * This method is called just before each frame is drawn.  It updates the modeling
    * transformations of the objects in the scene that are animated.
    */
   public void updateFrame() {
       frameNumber++;
       cart.setTranslation(-3 + 13*(frameNumber % 300) / 300.0, 0);
       wheel.setRotation(-frameNumber*3.1);
       sun.setRotation(-frameNumber);
       rotor.setRotation(frameNumber * 2.7);
   }

    
   /**
    * Applies a coordinate transform to a Graphics2D graphics context.  The upper left corner of 
    * the viewport where the graphics context draws is assumed to be (0,0).  The coordinate
    * transform will make a requested rectangle visible in the drawing area.  The requested
    * limits might be adjusted to preserve the aspect ratio.  (This method sets the global variable 
    * pixelSize to be equal to the size of one pixel in the transformed coordinate system.)
    * @param g2 The drawing context whose transform will be set.
    * @param xleft requested x-value at left of drawing area.
    * @param xright requested x-value at right of drawing area.
    * @param ytop requested y-value at top of drawing area.
    * @param ybottom requested y-value at bottom of drawing area; can be less than ytop, which will
    *     reverse the orientation of the y-axis to make the positive direction point upwards.
    * @param preserveAspect if preserveAspect is false, then the requested rectangle will exactly fill
    * the viewport; if it is true, then the limits will be expanded in one direction, horizontally or
    * vertically, to make the aspect ratio of the displayed rectangle match the aspect ratio of the
    * viewport.  Note that when preserveAspect is false, the units of measure in the horizontal and
    * vertical directions will be different.
    */
   private void applyLimits(Graphics2D g2, double xleft, double xright, double ytop, double ybottom, boolean preserveAspect) {
      int width = getWidth();   // The width of this drawing area, in pixels.
      int height = getHeight(); // The height of this drawing area, in pixels.
      if (preserveAspect) {
            // Adjust the limits to match the aspect ratio of the drawing area.
         double displayAspect = Math.abs((double)height / width);
         double requestedAspect = Math.abs(( ybottom-ytop ) / ( xright-xleft ));
         if (displayAspect > requestedAspect) {
            double excess = (ybottom-ytop) * (displayAspect/requestedAspect - 1);
            ybottom += excess/2;
            ytop -= excess/2;
         }
         else if (displayAspect < requestedAspect) {
            double excess = (xright-xleft) * (requestedAspect/displayAspect - 1);
            xright += excess/2;
            xleft -= excess/2;
         }
      }
      double pixelWidth = Math.abs(( xright - xleft ) / width);
      double pixelHeight = Math.abs(( ybottom - ytop ) / height);
      pixelSize = (float)Math.min(pixelWidth,pixelHeight);
      g2.scale( width / (xright-xleft), height / (ybottom-ytop) );
      g2.translate( -xleft, -ytop );
   }
   
}
