         Introduction to Computer Graphics, Version 1.4, Summer 2023

This is the README file for the full graphicsbook source files,
which are available in the GitHub repository

    https://github.com/davidjeck/graphicsbook
    
The free textbook itself can be found on the web at:

    http://math.hws.edu/graphicsbook/

Note that using the sources will require a fair amount of
expertise as well as some additional software (LaTeX, Java,
Xalan-J, and the bash shell).
                                                    
The graphicstext directory contains the source files that are used 
to produce the web site and PDF versions of "Introduction to Computer 
Graphics", Version 1.4.  

      Everything that I wrote in this directory is released under a 
      Creative Commons Attribution-NonCommercial-ShareAlike 4.0 License,
      see http://creativecommons.org/licenses/by-nc-sa/4.0/.
      (This does not include third-party libraries, such as those
      for JOGL, three.js, and gl-matrix, which use their own licenses.)
      You are given permission by the author and copyright holder,
      David J. Eck, to make and distribute copies of this work 
      or modified versions of this work, for non-commercial purposes,
      provided that you include a clear attribution  to the author of 
      the original work and make clear any modifications that you 
      have made.  The attribution should include a reference to the 
      web site, http://math.hws.edu/graphicsbook.  More specifically,
      this material is released under a creative commons attribution,
      non-commercial, share-alike license:
      http://creativecommons.org/licenses/by-nc-sa/4.0/
      
      ADDITIONALLY, permission is given to use source code from this 
      work in programming projects without restriction and without
      attribution, for commercial or non-commercial purposes.  No claim 
      is made about the suitability or reliability of any of the source
      code.  (If you use a substantial portion of the source code, I would
      appreciate attribution.)

The source files for "Introduction to Computer Graphics" include
XML files, which contain most of the text; XSLT transformation files,
which are used to translate the XML files into a web site and LaTeX 
files; image files for both the web and PDF versions; source 
code files for examples in the textbook; scripts for building the
web site and PDF versions; and other miscellaneous files.  Most of
the programs are web pages, and the source code is HTML and JavaScript
files.  Build scripts (.sh files) are provided for Linux; they should
also work for MacOS.

Making any modifications to the source will require a fair amount
of expertise in a variety of technologies.  The source was not 
originally designed for publication and comes with minimal instructions
and help.  It is provided as-is, with no guarantee of usefulness or
usability.
                              * * *
                         
To use the source files, you will need to edit the script named
"export-source.sh" in the "graphicstext" folder to adapt it to your
own environment.  When it is run, it will create a folder named
"graphicstext-1.4-source", which is the working directory for
producting the PDF and web site versions of the book.

The build the book, you will need Java and the Xalan-J Java XSLT 
processor (tested with version 2.7.2).  To build the PDF versions,
you will also need the TeX typesetting system -- in particular the
latex and dvipdf commands.  

For information on getting TeX, see https://www.latex-project.org/get/.
The build scripts for the PDF versions assume that the command
"latex" is available on your system, and also that "dvipdf" is
available.  Alternative command names, or full paths to the commands, can 
be set by editing the script "BUILD-env.sh" and providing new definitions 
for the appropriate variables.

Xalan can be obtained from https://xalan.apache.org/ with downloads
at https://dlcdn.apache.org/xalan/xalan-j/binaries/
As I write this, the name of the file is xalan-j_2_7_3-bin.zip 
but later versions of Xalan-J should also work fine.
To make things as easy as possible, you can extract Xalan-J in
the graphicsbook-1.4-source directory, and rename the directory from 
something like "xalan-j_2_7_3" to "xalan".  Alternatively, you can edit 
the script BUILD-env.sh, and define XALAN_DIR to refer to the correct 
directory name for Xalan. (Or, you could make a symbolic link in the
source directory from "xalan" to the Xalan directory.)  Note that you 
really only need the .jar files in the Xalan directory.

The following scripts are provided:

    BUILD-env.sh
          --- defines variables used in other scripts.

    BUILD-web-site.sh 
          --- creates the web site version of the book.
          --- This does NOT require LaTeX.
          
    BUILD-pdf.sh 
          --- creates the regular PDF version of the book,
              (suitable mostly for printing)
              
    BUILD-linked-pdf.sh
          --- creates the linked PDF version of the book,
              (suitable mostly for on-screen reading)
              
All these scripts put their output in a directory named
build_output (but the destination can be changed by
redefining BUILD_OUTPUT_DIR in BUILD-env.sh.)

Note that not all errors are detected by the scripts, so you will
have to check the output directory to make sure that the output
was actually produced correctly, even if the script says that it
finished successfully.
              
Here is a little more information for people who would like
to try producing modified versions of the textbook...

The original "graphicstext" folder is actually a project for the
Eclipse IDE.  If you would like to edit the sources in Eclipse,
you should install the Eclipse XML tools.

The XML files that define the sections of the various chapters
in the book can be found in one directory per chapter.  The
directories are named c1-introduction, c2-graphics2d, c3-gl1geom,
and so on.  These directories also contain other files, such as
images, that are used in each chapter in the web site version of
the book.  Most of the source code examples are in the
sources directory, but the in-line demos for the web site
are in the demos directory, and Java source code is in 
directories src-java2d and src-jogl.  JOGL jar files, which
are required for OpenGL in Java, are in the directory jogl-support.
To use them, you will have to add them to the project, as
described in Section 3.6.2 in the book.

The syntax of the XML files is defined by the DTD file,
graphicstext.dtd.  This is a fairly simple, home-brewed DTD.
Note that the elements <web>...</web>  and <webdiv>...</webdiv>
define content that is sent only to the web site version of 
the book, while <tex>...</tex> and <texdiv>...</texdiv> 
define content that goes only to the LaTeX (that is, PDF) 
versions.   Also note that entity names are defined to refer 
to the XML files that define the individual sections of the book.

The file graphicstext.xml is the main xml file that is processed
to create the web site version of the book.  It simply reads in
graphicstext-xml-includes.txt, which in turn reads in all the
individual xml files for the individual sections.  For the
LaTeX/PDF versions, the main xml file is graphicstext-tex.xml.
It redefines some of the entities from the .dtd file, which
are for the web site version.

Xalan is used with the XSLT files convert-web.xsl, convert-tex.xsl,
and convert-tex-linked.xsl to process the XML files.  Note that
the XSLT files use features specific to Xalan-j, so they cannot
be expected to work with other XSLT processors.

Many of the images used in the book were created using the 
program Inkscape on Linux.  The Inkscape sources can
be found in the directory named image-svg-originals.
The images were exported in PNG format for use on the web and
in EPS format for use with LaTeX.  The LaTeX images are in
the directory images-tex.  The PNG images are in the individual 
chapter directories in which they are used.  In some cases,
the PNG file is the original, and there is no Inkscape file.

You are welcome to email me for more information, but I can't
promise to help you through all the difficulties of using the
source code.

   --David J. Eck, Professor Emeritus
     Department of Mathematics and Computer Science
     Hobart and William Smith Colleges
     300 Pulteney Street
     Geneva, NY 14456    USA
     Email:  eck@hws.edu
     Web:    https://math.hws.edu/eck
 
