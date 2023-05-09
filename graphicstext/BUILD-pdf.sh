#!/bin/bash

# THIS SCRIPT BUILDS THE GRAPHICSTEXT PDF FILE (the version without links).

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
echo Building PDF...
echo
echo Running Xalan to create LaTeX source file...

if ! $XALAN_COMMAND -xsl convert-tex.xsl -in graphicstext-tex.xml -out tex/graphicstext.tex ; then
   echo
   echo "An error occurred while trying to run xalan on convert-tex.xsl."
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

$LATEX_COMMAND graphicstext.tex
$LATEX_COMMAND graphicstext.tex
$LATEX_COMMAND graphicstext.tex

if [ ! -e "graphicstext.dvi" ] ; then
   echo
   echo "An error occurred while trying to run latex on graphicstext.tex."
   echo "Exiting from BUILD-PDF.sh; latex files are in $GRAPHICSTEXT_SOURCE_DIR/tex"
   echo
   cd ..
   exit 1
fi

echo
echo Running dvipdf... 
echo

$DVIPDF_COMMAND graphicstext.dvi

if [ ! -e "graphicstext.pdf" ] ; then
   echo
   echo "An error occurred while trying to run dvipdf on graphicstext.dvi."
   echo "Exiting from BUILD-PDF.sh; latex files are in $GRAPHICSTEXT_SOURCE_DIR/tex"
   echo
   cd ..
   exit 1
fi

if [ ! -e "$BUILD_OUTPUT_DIR" ] ; then
   mkdir $BUILD_OUTPUT_DIR
fi
   
if ! mv graphicstext.pdf $BUILD_OUTPUT_DIR/graphicsbook.pdf ; then
   echo "PDF file successfully generated, but could not be moved to $BUILD_OUTPUT_DIR."
   echo "PDF can be found in $GRAPHICSTEXT_SOURCE_DIR/tex"
   cd ..
   exit 1
fi

echo
echo "BUILD-pdf.sh completed."
echo "graphicsbook.pdf created in $BUILD_OUTPUT_DIR"

cd ..

if [ "$KEEP_LATEX" != "no" ] ; then
   rm -rf $BUILD_OUTPUT_DIR/latex-source
   mv tex $BUILD_OUTPUT_DIR/latex-source
   echo latex-source created in $BUILD_OUTPUT_DIR
else
   rm -rf tex
fi

echo
exit 0

