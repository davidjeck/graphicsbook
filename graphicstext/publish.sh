#!/bin/bash

VERSION='graphicsbook-1.3.1'
PROJECT='graphicstext'

if [ ! -d build_output ] ; then
   echo Cannot find build_output directory
   exit
fi

echo Changing to build_output
cd build_output

if [ -e graphicstext.pdf -o -e graphicstext-linked.pdf -o -e web-site ] ; then
   echo Creating downloads directory
   mkdir downloads
else
   echo "Nothing to publish!"
   exit
fi

if [ -e "graphicsbook.pdf" ] ; then
   echo Move graphicsbook.pdf to downloads directory
   mv graphicsbook.pdf downloads
fi

if [ -e "graphicsbook-linked.pdf" ] ; then
   echo Move graphicsbook-linked.pdf to downloads directory 
   mv graphicsbook-linked.pdf downloads
fi

if [ -e "web-site" ] ; then
   echo Creating archive of web site and renaming web-site directory to graphicsbook2018
   mv web-site graphicsbook-1.3.1-web-site
   zip -r graphicsbook-web-site.zip graphicsbook-1.3.1-web-site > /dev/null
   mv graphicsbook-web-site.zip downloads
   mv graphicsbook-1.3.1-web-site graphicsbook-1.3.1
   mv graphicsbook-1.3.1/news-for-web.html graphicsbook-1.3.1/news.html
fi


cd ..

echo
echo To copy files to web site, use this command:
echo rsync -e ssh -r build_output/* dje@math.hws.edu:/var/www/htdocs/eck/cs424
echo


