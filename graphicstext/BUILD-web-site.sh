#!/bin/bash

# THIS SCRIPT BUILDS THE GRAPHICSTEXT WEB SITE.

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

function copyfiles() {
   cp $1/* web/$2
   rm web/$2/*.xml
#   dest="web/source/chapter$1"
#   mkdir -p $dest
#   cp -a src-c$1/* $dest
}

cd $GRAPHICSTEXT_SOURCE_DIR

rm -rf web
mkdir web

echo
echo Building web site...
echo
echo Running Xalan to create web site html files...

if  $XALAN_COMMAND -xsl convert-web.xsl -in graphicstext.xml ; then

   echo Copying other web site files...

   cp -r resource web
   cp -r demos web
   cp news* web
   rm web/demos/demos.komodoproject
   rm -r web/demos/test
   cp -r source web
   rm web/source/source.komodoproject
   rm web/source/source.xml
   mkdir web/source/java2d
   cp -r src-java2d/* web/source/java2d
   mkdir web/source/jogl
   cp -r src-jogl/* web/source/jogl
   cp README.txt web/README-git.txt

   copyfiles c02-graphics2d c2
   copyfiles c03-gl1geom c3
   copyfiles c04-gl1light c4
   copyfiles c05-threejs c5
   copyfiles c06-webgl c6
   copyfiles c07-webgl3d c7
   copyfiles c08-advanced c8
   copyfiles c09-webgpu c9
   
   copyfiles a1-proglang a1
   copyfiles a2-blender a2
   copyfiles a3-gimp-inkscape a3
   
   if [ ! -e "$BUILD_OUTPUT_DIR" ] ; then
      mkdir $BUILD_OUTPUT_DIR
   else
      rm -rf $BUILD_OUTPUT_DIR/web-site
   fi
   
   if [ ! -e "web/index.html" ] ; then
      echo Some error occurred while creating the web site.
      exit 1
   fi
   
   echo
   echo Fixing html DOCTYPES...
   sed -i -e '1 s/<html>/<!DOCTYPE html>\n<html>/' `find . -name "*.html"`
   
   if ! mv web $BUILD_OUTPUT_DIR/web-site ; then
      echo
      echo Web site successfully generated, but could not be moved to $BUILD_OUTPUT_DIR.
      echo The web site can be found in $GRAPHICSTEXT_SOURCE_DIR/web
      exit 1
    fi

   echo
   echo "BUILD-web-site.sh completed."
   echo "Created Javanotes web site in $BUILD_OUTPUT_DIR/web-site."
   echo
   exit 0
   
else
   echo
   echo "An error occurred while trying to run xalan on convert-web.xsl."
   echo "Cleaning up and exiting from BUILD-web-site.sh"
   echo
   rm -rf web
   exit 1
fi




