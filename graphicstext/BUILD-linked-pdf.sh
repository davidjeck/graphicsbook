#!/bin/bash

# THIS SCRIPT BUILDS THE LINKED GRAPHICSTEXT PDF FILE (the version WITH links).

# VARIABLES USED IN THIS SCRIPT CAN BE SET IN BUILT-env.sh; see that file
# for more information.

source BUILD-env.sh

# can't do anything if user hasn't set up xalan, so check that first.

if [ ! -f $XALAN_DIR/xalan.jar ] ; then
   echo Cannot find the xalan.jar file in $XALAN_DIR
   echo Cannot proceed without xalan.
   echo Did you set up Xalan-J correctly?  See README.txt.
   exit 1
fi

XALAN_COMMAND="$JAVA_COMMAND -cp $XALAN_DIR/xalan.jar:$XALAN_DIR/serializer.jar:$XALAN_DIR/xercesImpl.jar:$XALAN_DIR/xml-apis.jar org.apache.xalan.xslt.Process"

cd $GRAPHICSTEXT_SOURCE_DIR

rm -rf tex
mkdir tex

echo
echo Building linked PDF...
echo
echo Running Xalan to create LaTeX source file...

if ! $XALAN_COMMAND -xsl convert-tex-linked.xsl -in graphicstext-tex.xml -out tex/graphicstext-linked.tex ; then
   echo
   echo "An error occurred while trying to run xalan on convert-tex-linked.xsl."
   echo "Cleaning up and exiting from BUILD-PDF.sh"
   echo
   rm -rf tex
   exit 1
fi

echo Copying other files...

mkdir tex/images
cp images-tex/* tex/images
cp texmacros.tex tex

cd tex

echo
echo Running latex three times...
echo

$LATEX_COMMAND graphicstext-linked.tex
$LATEX_COMMAND graphicstext-linked.tex
$LATEX_COMMAND graphicstext-linked.tex

if [ ! -e "graphicstext-linked.dvi" ] ; then
   echo
   echo "An error occurred while trying to run latex on graphicstext-linked.tex."
   echo "Exiting from BUILD-PDF.sh; latex files are in $GRAPHICSTEXT_SOURCE_DIR/tex"
   echo
   cd ..
   exit 1
fi

echo
echo Running dvipdf... 
echo

$DVIPDF_COMMAND graphicstext-linked.dvi

if [ ! -e "graphicstext-linked.pdf" ] ; then
   echo
   echo "An error occurred while trying to run dvipdf on graphicstext-linked.dvi."
   echo "Exiting from BUILD-PDF.sh; latex files are in $GRAPHICSTEXT_SOURCE_DIR/tex"
   echo
   cd ..
   exit 1
fi

if [ ! -e "$BUILD_OUTPUT_DIR" ] ; then
   mkdir $BUILD_OUTPUT_DIR
fi
   
if ! mv graphicstext-linked.pdf $BUILD_OUTPUT_DIR/graphicsbook-linked.pdf ; then
   echo "PDF file successfully generated, but could not be moved to $BUILD_OUTPUT_DIR."
   echo "PDF can be found in $GRAPHICSTEXT_SOURCE_DIR/tex"
   cd ..
   exit 1
fi

echo
echo "BUILD-linked-pdf.sh completed."
echo "graphicsbook-linked.pdf created in $BUILD_OUTPUT_DIR"

cd ..

if [ "$KEEP_LATEX" != "no" ] ; then
   rm -rf $BUILD_OUTPUT_DIR/linked-latex-source
   mv tex $BUILD_OUTPUT_DIR/linked-latex-source
   echo linked-latex-source created in $BUILD_OUTPUT_DIR
else
   rm -rf tex
fi

echo
exit 0

