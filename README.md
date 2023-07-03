# graphicsbook
This git repository contains the full source files for the free textbook *Introduction to Computer Graphics,* Version 1.4.
This version is under development in summer 2023.  The latest release version is 1.3.1.
See the [preface](https://math.hws.edu/graphicsbook/preface.html) for information about the book.

*Introduction to Computer Graphics* can be accessed on the web at
[https://math.hws.edu/graphicsbook/](https://math.hws.edu/graphicsbook/).
The front page of each web site has links for downloading the textbook in
web-site and PDF formats.

This repository contains the source files that are used to generate the book in all formats.
The sources include XML, XSLT, DTD, Java, C, HTML, and other files, 
plus some scripts for generating the web site and PDFs.  The
scripts were written for Linux but should also work on MacOS.
Since the source files were not originally meant for publication, they
are not very cleanly written, and using them would require a lot of expertise.

To produce the book from the XML/XSLT files, you will need a copy of the XSLT processor 
[Xalan-J](https://xml.apache.org/xalan-j/), and you will need command-line Java to run it.
The XSLT files use some features that are specific to Xalan-J.  To produce the
PDF versions, you will also need an installation of the TeX typesetting system.

The sources are stored in an Eclipse project named graphicstext.
To use it to produce the book, you first
need to export the files by editing and running the script *export-source.sh* from the graphicstext folder.  (The
script must first be edited to specify the correct directory names for the local environment.)  The exported 
directory will contain scripts for building the book in various formats and a file, README.txt,
with instructions for using the scripts.

Note that if you want to use the project in Eclipse, your Eclipse should have the XML tools plugin installed.
The project includes the .jar files required for JOGL, the Java implementation of OpenGL.  There will be
errors in the src-jogl directory unless you configure the project to use the JOGL jar files, as discussed
in [Subsection 3.6.2](https://math.hws.edu/graphicsbook/c3/s6.html#gl1geom.6.2) of the textbook.

(Note: The initial commit for the git repository consisted of the source files for Version 1.3.1 of the book;
earlier versions did not use git.)

