#!/bin/bash

VERSION='graphicstext-1.4-work'
PROJECT='graphicstext'

SOURCE_DIR='/home/eck/git/graphicsbook'
EXPORT_DIR="/home/eck/Desktop/$VERSION-source"
XALAN_DIR="/home/eck/xalan-j_2_7_2"

if [ ! -x "$SOURCE_DIR/$PROJECT" ] ; then
   echo "Directory $SOURCE_DIR/$PROJECT does not exist."
   echo "You need to edit export-source.sh to reflect your own environment!"
   exit
fi

if [ -x "$EXPORT_DIR" ] ; then
   rm -r $EXPORT_DIR/*
else
   mkdir $EXPORT_DIR
fi

cp -r $SOURCE_DIR/$PROJECT $EXPORT_DIR

cd $EXPORT_DIR

perl -i -p -e 's/\t/    /g' `find . -name "*.java"`
perl -i -p -e 's/<!DOCTYPE.*graphicstext.dtd" *>//' `find . -name "*.xml" -and ! -name "graphicstext*"`

rm $PROJECT/export-source.sh
rm -r $PROJECT/bin
mv $PROJECT/publish.sh .
mv $PROJECT/BUILD* .
chmod +x BUILD*.sh
chmod +x publish.sh
cp $PROJECT/README.txt .
if [ -x "$XALAN_DIR" ] ; then
   ln -s $XALAN_DIR xalan
else
   echo "You need a copy of xalan-j to create the pdf's and web site."
   echo "(Edit export-source.sh to specify the correct location of xalan-j)."
fi
cd ..


