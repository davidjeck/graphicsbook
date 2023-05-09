<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
        xmlns:redirect="org.apache.xalan.xslt.extensions.Redirect"
        extension-element-prefixes="redirect">
<xsl:output method="html"/>
    
<xsl:template match="/">
   <redirect:write file="web/index.html">
        <html>
        <head>
        <title>Introduction to Computer Graphics -- Title Page</title>
        <link href="resource/graphicstext.css" rel="stylesheet" type="text/css"/>
        </head>
        <body><div class="page">
        <div class="content">
        <hr/>
        <h2 class="chapter_title">Introduction to Computer Graphics</h2>
        <h3 class="chapter_title">Version 1.3, August 2021</h3>
        <p style="text-align:center; text-indent:0pt">(<i>Version 1.3.1, December 2021</i>)</p>
        <h4 align="center">Author:&#160; <a href="http://math.hws.edu/eck/">David J. Eck</a>&#160;
                 (<a href="mailto:eck@hws.edu">eck@hws.edu</a>)</h4>        
        <hr/>
        <table border="0">
        <tr valign="top"><td><p style="margin-right:20pt"><img height="235" width="180" src="resource/graphicstext-cover-180x235.png"/></p></td>
        <td style="margin-left:1cm">
        <p><big>W</big>ELCOME TO <i>Introduction to Computer Graphics</i>,
         a free, on-line textbook covering the fundamentals of computer graphics and
         computer graphics programming.  This book is meant for use as a textbook in
         a one-semester course that would typically be taken by undergraduate computer science majors
         in their third or fourth year of college.  Version 1.3 contains significant updates
         from Version 1.2 of January 2018, including an update of the <i>three.js</i> material to release number
         129, the addition of some material on WebGL&#160;2.0, and an update of Appendix&#160;B to Blender&#160;2.93.
         See the <a href="preface.html">preface</a> for more information.
        </p>
        <p>The web pages for this book include live, interactive demos that require a modern
        web browser such as recent versions of Chrome, Firefox, Safari, or Edge.  You might
        have to experiment to find a browser in which the demos will work well.  While the
        book is mainly designed for reading on a desktop computer, most of the demos should also work
        on recent mobile devices, using a touchscreen instead of a mouse.</p>
        <p>Words in the book that are shown in <span class="newword" style="cursor:inherit">this&#160;style</span> or underlined
        <span class="word" style="cursor:inherit">like&#160;this</span> refer to glossary entries; click the
        word to see a definition.</p>
         <p>You can download this web site for use on your own computer. 
         PDF versions of the textbook are also available.
         Links to the downloads can be found at the bottom of this page.
         </p>
        <h3>Short Table of Contents:</h3>
        <ul class="contents">
        <li><b><a href="contents-with-subsections.html">Full Table of Contents</a></b></li>
        <xsl:if test="/graphicstext/preface">
           <li><a href="preface.html">Preface</a></li>
        </xsl:if>
        <xsl:for-each select="/graphicstext/chapter">
            <li>Chapter <xsl:value-of select="position()"/>: <b><a><xsl:attribute name="href"><xsl:value-of select="concat('c',position(),'/index.html')"/></xsl:attribute><xsl:value-of select="@title"/></a></b></li>
        </xsl:for-each>
        <xsl:if test="/graphicstext/appendix">
           <xsl:for-each select="/graphicstext/appendix">
               <li>Appendix <xsl:number count="appendix" format="A"/>: <b><a><xsl:attribute name="href"><xsl:value-of select="concat('a',position(),'/index.html')"/></xsl:attribute><xsl:value-of select="@title"/></a></b></li>
           </xsl:for-each>
        </xsl:if>
        <xsl:if test="/graphicstext/source">
           <li>Appendix D: <a href="source/index.html"><b>Source Code for Sample Programs</b></a></li>
        </xsl:if>
        <li>Appendix E: <a href="glossary.html"><b>Glossary</b></a></li>
        <li><a href="news.html">News</a></li>
        </ul>
        </td></tr></table>
        <hr/>
        <div style="margin-left: 40px; margin-right:40px">
         <i>&#169;2015&#8211;2021, David J. Eck.<br/>
            <small>This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-Noncommercial-ShareAlike 4.0 License</a>.
            (This license allows you to redistribute this book in unmodified form for non-commercial purposes.  It allows you
            to make and distribute modified versions for non-commercial purposes, as long as you include an attribution to the
            original author, clearly describe the modifications that you have made, and distribute
            the modified work under the same license as the original.  Permission might be given by the
            author for other uses.  See the
            <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">license</a> for full
            details.)<br/><br/>
            The home site for this book is:
            <a href="http://math.hws.edu/graphicsbook/">http://math.hws.edu/graphicsbook/</a></small></i>
          </div>
        <hr/>
        <h3>Downloading Links</h3>
        <ul>
        <li>
          <b>Full Web Site Download:</b>
          <ul>
          <li><b><a href="http://math.hws.edu/eck/cs424/downloads/graphicsbook-web-site.zip">http://math.hws.edu/eck/cs424/downloads/graphicsbook-web-site.zip</a></b> &#8212;
          This "zip" archive contains a complete copy of the web site for this textbook.  You can publish a copy of the web site on
          your own web server, or you can use it locally on your own computer.  
          Size:&#160;24&#160;Megabytes.
          </li>
          </ul>
        </li>
         <li>
          <b>PDF Downloads:</b>
          <ul>
          <li>
          <b><a href="http://math.hws.edu/eck/cs424/downloads/graphicsbook-linked.pdf">http://math.hws.edu/eck/cs424/downloads/graphicsbook-linked.pdf</a></b> &#8212;
          a PDF version with internal links for navigation and external links to source code
          files and other resources that are not included in the PDF.
          Recommended for on-screen reading. 456&#160;pages.
          Size:&#160;5.3&#160;Megabytes.
          </li>
          <li>
          <b><a href="http://math.hws.edu/eck/cs424/downloads/graphicsbook.pdf">http://math.hws.edu/eck/cs424/downloads/graphicsbook.pdf</a></b> &#8212;
          a PDF version without links, more suitable for printing. 463&#160;pages.
          Size:&#160;5.0&#160;Megabytes.
          </li>
          </ul>
        </li>
        </ul>
        <h3>Printed Version</h3>
        <ul>
        <li>The web site and linked PDF are the preferred versions for reading this book, but for the convenience of readers who would
        like a bound copy, I have made a printed version available at the publish-on-demand site <i>lulu.com</i>.  (Note that the printed
        version is sold at lulu.com's cost, and that I don't make any profit from it.)  You can purchase the printed version through
        this link: <a href="https://www.lulu.com/shop/david-eck/introduction-to-computer-graphics/paperback/product-1jzn2z5r.html">https://www.lulu.com/shop/david-eck/introduction-to-computer-graphics/paperback/product-1jzn2z5r.html</a></li>
        </ul>
        <hr/>
        <div align="right"><small><i>1 August 2015, Version 1.0 released<br/>
        28 January 2016, Version 1.1 released<br/>
        6 January 2018, Version 1.2 released<br/>
        1 August 2021, Version 1.3 released</i><br/>
        20 December 2021, Version 1.3.1 released</small></div>
        </div>
        </div></body>
        </html>
   </redirect:write>
   <xsl:call-template name="table-of-contents">
      <xsl:with-param name="subsections" select="true()"/>
   </xsl:call-template>
   <xsl:call-template name="table-of-contents">
      <xsl:with-param name="subsections" select="false()"/>
   </xsl:call-template>
   <xsl:apply-templates select="/graphicstext/preface"/>
   <xsl:apply-templates select="/graphicstext/chapter"/>
   <xsl:apply-templates select="/graphicstext/appendix"/>
   <xsl:apply-templates select="/graphicstext/source"/>
   <xsl:call-template name="makeglossary"/>
</xsl:template>
   
<xsl:template name="table-of-contents">
   <xsl:param name="subsections"/>
   <xsl:variable name="file">web/contents<xsl:if test="$subsections">-with-subsections</xsl:if>.html</xsl:variable>
   <redirect:write select="$file">
     <html>
     <head>
     <title>Introduction to Computer Graphics Table of Contents</title>
     <link href="resource/graphicstext.css" rel="stylesheet" type="text/css"/>
     <style>p { text-indent: 0; }</style>
     </head>
     <body><div class="page">
     <div class="content">
        <h3 align="center">Introduction to Computer Graphics, Version 1.3</h3>
        <h2 align="center">Table of Contents</h2>
        <hr/>
        <p align="center" class="firstpar">This is the Table of Contents for the free on-line
           textbook <a href="index.html"><i>Introduction to Computer Graphics</i></a>.</p>
        <xsl:choose>
           <xsl:when test="$subsections">
              <p align="center"><b><a href="contents.html">(Click here to hide subsections.)</a></b></p>
           </xsl:when>
           <xsl:otherwise>
              <p align="center"><b><a href="contents-with-subsections.html">(Click here to show subsections.)</a></b></p>
           </xsl:otherwise>
        </xsl:choose>
        <hr/>
        <div style="margin-left: 30pt">
        <p><a href="preface.html"><b>Preface</b></a></p>
        <xsl:for-each select="/graphicstext/chapter">
           <xsl:variable name="chapter"><xsl:value-of select="position()"/></xsl:variable>
           <p><b>Chapter <xsl:value-of select="$chapter"/>:&#160;
              <a><xsl:attribute name="href"><xsl:value-of 
                      select="concat('c',$chapter,'/index.html')"/></xsl:attribute><xsl:value-of select="@title"/></a></b></p>
           <ul>
           <xsl:for-each select="section">
              <xsl:variable name="section"><xsl:value-of select="position()"/></xsl:variable>
              <li>Section <xsl:value-of select="$chapter"/>.<xsl:value-of select="$section"/>&#160;
                 <a><xsl:attribute name="href"><xsl:value-of 
                         select="concat('c',$chapter,'/s',$section,'.html')"/></xsl:attribute><xsl:value-of select="@title"/></a>
               <xsl:if test="$subsections and subsection">
                  <ul>
                     <xsl:for-each select="subsection">
                        <li>
                           <xsl:value-of select="$chapter"/>.<xsl:value-of select="$section"/>.<xsl:value-of select="position()"/>&#160;
                                 <a><xsl:attribute name="href"><xsl:value-of 
                                        select="concat('c',$chapter,'/s',$section,'.html#',@id)"/></xsl:attribute><xsl:value-of select="@title"/></a>
                        </li>
                     </xsl:for-each>
                  </ul>
               </xsl:if>
              </li>
           </xsl:for-each>
           <xsl:if test="exercises">
              <li><a><xsl:attribute name="href"><xsl:value-of select="concat('c',$chapter,'/exercises.html')"/></xsl:attribute>Programming Exercises</a></li>
           </xsl:if>
           <xsl:if test="quiz">
              <li><a><xsl:attribute name="href"><xsl:value-of select="concat('c',$chapter,'/quiz.html')"/></xsl:attribute>Quiz</a></li>
           </xsl:if>
           </ul>
        </xsl:for-each>
        <xsl:for-each select="/graphicstext/appendix">
           <xsl:variable name="appendix"><xsl:number count="appendix" format="A"/></xsl:variable>
           <xsl:variable name="appnum"><xsl:number count="appendix"/></xsl:variable>
           <p><b>Appendix <xsl:value-of select="$appendix"/>:&#160;
              <a><xsl:attribute name="href"><xsl:value-of 
                      select="concat('a',$appnum,'/index.html')"/></xsl:attribute><xsl:value-of select="@title"/></a></b></p>
           <ul>
           <xsl:for-each select="section">
              <xsl:variable name="section"><xsl:value-of select="position()"/></xsl:variable>
              <li>Section <xsl:value-of select="$appendix"/>.<xsl:value-of select="$section"/>&#160;
                 <a><xsl:attribute name="href"><xsl:value-of 
                         select="concat('a',$appnum,'/s',$section,'.html')"/></xsl:attribute><xsl:value-of select="@title"/></a>
               <xsl:if test="$subsections and subsection">
                  <ul>
                     <xsl:for-each select="subsection">
                        <li>
                           <xsl:value-of select="$appendix"/>.<xsl:value-of select="$section"/>.<xsl:value-of select="position()"/>&#160;
                                 <a><xsl:attribute name="href"><xsl:value-of 
                                        select="concat('a',$appnum,'/s',$section,'.html#',@id)"/></xsl:attribute><xsl:value-of select="@title"/></a>
                        </li>
                     </xsl:for-each>
                  </ul>
               </xsl:if>
              </li>
           </xsl:for-each>
           </ul>
        </xsl:for-each>
        <p><b>Appendix D: </b> <a href="source/index.html">Source Code for Sample Programs</a></p>
        <p><b>Appendix E: </b> <a href="glossary.html">Glossary</a></p>
     </div>
     <hr/>
     <div align="right"><small><a href="http://math.hws.edu/eck/index.html">David Eck</a>, August 2021</small></div>
     </div>
     </div></body>
     </html>
   </redirect:write>
</xsl:template>

<xsl:template match="chapter">
   <redirect:write select="concat('web/c',position(),'/index.html')">
        <html>
        <head>
        <title>Introduction to Computer Graphics, Chapter <xsl:value-of select="position()"/> -- <xsl:value-of select="@title"/></title>
        <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
        </head>
        <body><div class="page">
        <div align="right"><xsl:call-template name="chapter-navbar"/></div>
        <hr/>
        <div class="content">
        <h3 class="chapter_title">Chapter <xsl:value-of select="position()"/></h3>
        <h2 class="chapter_title"><xsl:value-of select="@title"/></h2>
        <hr class="break"/>
        <xsl:apply-templates select="intro"/>
        <hr class="break"/>
        <h3>Contents of Chapter <xsl:value-of select="position()"/>:</h3>
        <ul class="contents">
        <xsl:for-each select="section">
            <li>Section <xsl:value-of select="position()"/>: <a><xsl:attribute name="href"><xsl:value-of select="concat('s',position(),'.html')"/></xsl:attribute><xsl:value-of select="@title"/></a></li>
        </xsl:for-each>
        <xsl:if test="exercises">
           <li><a href="exercises.html">Programming Exercises</a></li>
        </xsl:if>
        <xsl:if test="quiz">
           <li><a href="quiz.html">Quiz on This Chapter</a></li>
        </xsl:if>
        </ul>
        </div>
        <hr/>
        <div align="right"><xsl:call-template name="chapter-navbar"/></div>
        </div></body>
        <xsl:if test="intro/descendant::word or intro/descendant::newword"><script src="../resource/glossary.js"></script></xsl:if>
        </html>
   </redirect:write>
   <xsl:apply-templates select="section">
       <xsl:with-param name="chapternum" select="position()"/>
   </xsl:apply-templates>
   <xsl:if test="exercises">
      <xsl:call-template name="do-exercises"></xsl:call-template>
      <xsl:call-template name="do-exercise-answers"></xsl:call-template>
   </xsl:if>
   <xsl:apply-templates select="quiz">
      <xsl:with-param name="answers" select="false()"/>
   </xsl:apply-templates>
   <xsl:apply-templates select="quiz">
      <xsl:with-param name="answers" select="true()"/>
   </xsl:apply-templates>
</xsl:template>
<xsl:template name="chapter-navbar">
    <small>
        [  <a href="s1.html">First Section</a> |
           <xsl:if test="position()>1">
               <a><xsl:attribute name="href"><xsl:value-of select="concat('../c',position()-1,'/index.html')"/></xsl:attribute>Previous Chapter</a> |
           </xsl:if>
           <xsl:if test="not(position()=last())">
               <a><xsl:attribute name="href"><xsl:value-of select="concat('../c',position()+1,'/index.html')"/></xsl:attribute>Next Chapter</a> |
           </xsl:if>
        <a href="../index.html">Main Index</a> ]
    </small>
</xsl:template>
   
<xsl:template match="appendix">
   <redirect:write select="concat('web/a',position(),'/index.html')">
        <html>
        <head>
        <title>Introduction to Computer Graphics, Appendix <xsl:number count="appendix" format="A"/> -- <xsl:value-of select="@title"/></title>
        <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
        </head>
        <body><div class="page">
        <div align="right"><xsl:call-template name="appendix-navbar"/></div>
        <hr/>
        <div class="content">
        <h3 class="chapter_title">Appendix <xsl:number count="appendix" format="A"/></h3>
        <h2 class="chapter_title"><xsl:value-of select="@title"/></h2>
        <hr class="break"/>
        <xsl:apply-templates select="intro"/>
        <hr class="break"/>
        <h3>Contents of Appendix <xsl:number count="appendix" format="A"/>:</h3>
        <ul class="contents">
        <xsl:for-each select="section">
            <li>Section <xsl:value-of select="position()"/>: <a><xsl:attribute name="href"><xsl:value-of select="concat('s',position(),'.html')"/></xsl:attribute><xsl:value-of select="@title"/></a></li>
        </xsl:for-each>
        </ul>
        </div>
        <hr/>
        <div align="right"><xsl:call-template name="appendix-navbar"/></div>
        </div></body>
        <xsl:if test="intro/descendant::word or intro/descendant::newword"><script src="../resource/glossary.js"></script></xsl:if>
        </html>
   </redirect:write>
   <xsl:apply-templates select="section">
       <xsl:with-param name="chapternum" select="position()"/>
   </xsl:apply-templates>
</xsl:template>

<xsl:template name="appendix-navbar">
    <small>
        [  <a href="s1.html">First Section</a> |
           <xsl:if test="position()>1">
               <a><xsl:attribute name="href"><xsl:value-of select="concat('../a',position()-1,'/index.html')"/></xsl:attribute>Previous Appendix</a> |
           </xsl:if>
           <xsl:if test="not(position()=last())">
               <a><xsl:attribute name="href"><xsl:value-of select="concat('../a',position()+1,'/index.html')"/></xsl:attribute>Next Appendix</a> |
           </xsl:if>
        <a href="../index.html">Main Index</a> ]
    </small>
</xsl:template>
   
<xsl:template match="preface">
   <redirect:write select="'web/preface.html'">
     <html>
     <head>
     <title>Introduction to Computer Graphics Preface</title>
     <link href="resource/graphicstext.css" rel="stylesheet" type="text/css"/>
     </head>
     <body><div class="page">
     <div class="content">
        <h3 align="center">Introduction to Computer Graphics, Version 1.3.1<br/></h3>
        <h2 align="center">Preface</h2>
        <hr class="break"/>
        <xsl:apply-templates/>
     </div>
     <hr/>
     <div align="right"><small><a href="http://math.hws.edu/eck/index.html">David Eck</a></small></div>
     </div></body>
     </html>
   </redirect:write>
</xsl:template>
    
<xsl:template match="source">
   <redirect:write select="'web/source/index.html'">
     <html>
     <head>
     <title>Introduction to Computer Graphics Source Code</title>
     <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
     </head>
     <body><div class="page">
     <div class="content">
        <h3 align="center">Introduction to Computer Graphics, Version 1.3</h3>
        <h2 align="center">Source Code and Demos</h2>
        <hr class="break"/>
        <xsl:apply-templates/>
     </div>
     <hr/>
     <div align="right"><small><a href="http://math.hws.edu/eck/index.html">David Eck</a>, August 2021</small></div>
     </div></body>
     <script src="../resource/glossary.js"></script>
     </html>
   </redirect:write>
</xsl:template>

<xsl:template match="glossary"></xsl:template>

<xsl:template name="makeglossary">
    <redirect:write select="'web/glossary.html'">
     <html>
     <head>
     <title>Introduction to Computer Graphics Glossary</title>
     <link href="resource/graphicstext.css" rel="stylesheet" type="text/css"/>
     </head>
     <body><div class="page">
     <div class="content">
        <h3 align="center">Introduction to Computer Graphics, Version 1.3</h3>
        <h2 align="center">Glossary</h2>
        <hr class="break"/>
        <xsl:for-each select="//gitem">
        	<xsl:sort select="@term"/>
        	<p class="glossary_item"><span class="glossary_term"><xsl:value-of select="@term"/>.</span>&#160;
            <span class="glossary_definition"><xsl:apply-templates/></span></p>
        </xsl:for-each>
     </div>
     <hr/>
     <div align="right"><small><a href="http://math.hws.edu/eck/index.html">David Eck</a>, August 2021</small></div>
     </div></body>
     </html>
    </redirect:write>
</xsl:template>
        
<xsl:template match="section">
    <xsl:param name="chapternum"/>
    <xsl:variable name="file">
        <xsl:choose>
        <xsl:when test="ancestor::chapter"><xsl:text>c</xsl:text><xsl:value-of select="$chapternum"/></xsl:when>
        <xsl:otherwise><xsl:text>a</xsl:text><xsl:value-of select="$chapternum"/></xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="chapter">
        <xsl:choose>
        <xsl:when test="ancestor::chapter"><xsl:value-of select="$chapternum"/></xsl:when>
        <xsl:otherwise><xsl:number count="appendix" format="A"/></xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <redirect:write select="concat('web/',$file,'/s',position(),'.html')">
        <html>
        <head>
        <title>Introduction to Computer Graphics, Section <xsl:value-of select="$chapter"/>.<xsl:value-of select="position()"/> -- <xsl:value-of select="@title"/></title>
        <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
        </head>
        <body><div class="page">
        <div align="right"><xsl:call-template name="section-navbar"/></div>
        <hr/>
        <xsl:if test="subsection">
           <table border="2" cellpadding="5" class="subsections"><tr><td>
              <div align="center">
                 <b>Subsections</b><hr/>
                 <small><xsl:for-each select="subsection">
                    <a><xsl:attribute name="href"><xsl:value-of select="concat('#',@id)"/></xsl:attribute><xsl:value-of select="@title"/></a><br/>
                 </xsl:for-each>
                 </small>
              </div>
           </td></tr></table>
        </xsl:if>
        <div class="content section">
        <h3 class="section_title">Section <xsl:value-of select="$chapter"/>.<xsl:value-of select="position()"/></h3>
        <h2 class="section_title"><xsl:value-of select="@title"/></h2>
        <hr class="break"/>
        <xsl:apply-templates/>
        </div>
        <hr/>
        <div align="right"><xsl:call-template name="section-navbar"/></div>
        </div></body>
        <xsl:if test="descendant::word or descendant::newword"><script src="../resource/glossary.js"></script></xsl:if>
        </html>
    </redirect:write>
</xsl:template>
<xsl:template name="section-navbar">
    <small>
        [  <xsl:if test="position()>1">
               <a><xsl:attribute name="href"><xsl:value-of select="concat('s',position()-1,'.html')"/></xsl:attribute>Previous Section</a> |
           </xsl:if>
           <xsl:if test="not(position()=last())">
               <a><xsl:attribute name="href"><xsl:value-of select="concat('s',position()+1,'.html')"/></xsl:attribute>Next Section</a> |
           </xsl:if>
        <xsl:if test="ancestor::chapter">
	        <a href="index.html">Chapter Index</a> | 
	    </xsl:if>
        <xsl:if test="ancestor::appendix">
	        <a href="index.html">Appendix Index</a> | 
	    </xsl:if>
        <a href="../index.html">Main Index</a> ]
    </small>
</xsl:template>
    
<xsl:template match="subsection">
    <xsl:variable name="num">
        <xsl:choose>
           <xsl:when test="ancestor::source"><xsl:number count="subsection"/>.&#160;</xsl:when>
           <xsl:when test="ancestor::appendix"><xsl:number count="appendix" format="A"/>.<xsl:number count="section"/>.<xsl:number count="subsection"/>&#160;&#160;</xsl:when>
           <xsl:otherwise><xsl:number count="chapter"/>.<xsl:number count="section"/>.<xsl:number count="subsection"/>&#160;&#160;</xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <div class="subsection">
    <hr class="break"/>
    <h3 class="subsection_title"><xsl:attribute name="id"><xsl:value-of select="@id"/></xsl:attribute><xsl:value-of select="$num"/><xsl:value-of select="@title"/></h3>
    <xsl:apply-templates/>
    </div>
</xsl:template>

<xsl:template name="do-exercises">
    <xsl:variable name="chapternum">
       <xsl:number count="chapter"/>
    </xsl:variable>
    <redirect:write select="concat('web/c',$chapternum,'/exercises.html')">
        <html>
        <head>
        <title>Introduction to Computer Graphics, Exercises for Chapter <xsl:value-of select="$chapternum"/></title>
        <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
        </head>
        <body><div class="page">
        <div align="right"><xsl:call-template name="exercises-navbar"></xsl:call-template></div>
        <hr/>
        <div class="content">
        <h2>Programming Exercises for Chapter <xsl:value-of select="$chapternum"/></h2>
        <hr class="break"/>
        <p class="firstpar">This page contains several exercises for Chapter <xsl:value-of select="$chapternum"/>
        in <a href="../index.html">Introduction to Computer Graphics</a>.  For each exercise, a link to
        a possible solution is provided.   Each solution includes a discussion of how a programmer might approach the
        problem and interesting points raised by the problem or its solution, as well as complete source
        code of the solution.</p>
        <xsl:for-each select="exercises/exercise">
           <hr/>
           <h3 class="exercise">Exercise <xsl:value-of select="$chapternum"/>.<xsl:value-of select="position()"/>:</h3>
           <xsl:apply-templates select="exercise-question"/>
           <p align="right"><a><xsl:attribute name="href"><xsl:value-of select="concat('ex',position(),'-ans.html')"/></xsl:attribute>See the Solution</a></p>
        </xsl:for-each>
        </div>
        <hr/>
        <div align="right"><xsl:call-template name="exercises-navbar"></xsl:call-template></div>
        </div></body>
        </html>
    </redirect:write>
</xsl:template>
<xsl:template name="exercises-navbar">
    <small>
        [  <a href="index.html">Chapter Index</a> | 
        <a href="../index.html">Main Index</a> ]
    </small>
</xsl:template>
       
<xsl:template name="do-exercise-answers">
    <xsl:variable name="chapternum">
       <xsl:number count="chapter"/>
    </xsl:variable>
    <xsl:for-each select="exercises/exercise">
       <redirect:write select="concat('web/c',$chapternum,'/ex',position(),'-ans.html')">
           <html>
           <head>
           <title>Introduction to Computer Graphics, Solution to Exercise <xsl:value-of select="position()"/>, Chapter <xsl:value-of select="$chapternum"/></title>
           <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
           </head>
           <body><div class="page">
           <div align="right"><xsl:call-template name="exercise-answer-navbar"></xsl:call-template></div>
           <hr/>
           <div class="content">
           <h2>Solution for Programming Exercise <xsl:value-of select="$chapternum"/>.<xsl:value-of select="position()"/></h2>
           <hr class="break"/>
           <p class="firstpar">This page contains a sample solution to
           one of the exercises from <a href="../index.html">Introduction to Computer Graphics</a>.</p>
           <hr/>
              <h3 class="exercise">Exercise <xsl:value-of select="$chapternum"/>.<xsl:value-of select="position()"></xsl:value-of>:</h3>
              <xsl:apply-templates select="exercise-question"/>
           <hr/>
           <div align="center" class="exercisesubtitle"><big><b>Discussion</b></big></div>
           <hr/>
           <xsl:apply-templates select="exercise-discuss"/>
           <hr/>
           <div align="center" class="exercisesubtitle"><big><b>The Solution</b></big></div>
           <hr/>
           <xsl:apply-templates select="exercise-code"/>
           </div>
           <hr/>
           <div align="right"><xsl:call-template name="exercise-answer-navbar"></xsl:call-template></div>
           </div></body>
           </html>
       </redirect:write>
    </xsl:for-each>
</xsl:template>
<xsl:template name="exercise-answer-navbar">
    <small>
        [ <a href="exercises.html">Exercises</a> |
        <a href="index.html">Chapter Index</a> | 
        <a href="../index.html">Main Index</a> ]
    </small>
</xsl:template>

<xsl:template match="quiz">
    <xsl:param name="answers"/>
    <xsl:variable name="chapternum">
       <xsl:number count="chapter"/>
    </xsl:variable>
    <xsl:variable name="filename">
       <xsl:choose>
          <xsl:when test="$answers"><xsl:text>quiz_answers</xsl:text></xsl:when>
          <xsl:otherwise><xsl:text>quiz</xsl:text></xsl:otherwise>
       </xsl:choose>
    </xsl:variable>
    <redirect:write select="concat('web/c',$chapternum,'/',$filename,'.html')">
        <html>
        <head>
        <title>Introduction to Computer Graphics, <xsl:if test="$answers">Answers for </xsl:if>Quiz on Chapter <xsl:value-of select="$chapternum"/></title>
        <link href="../resource/graphicstext.css" rel="stylesheet" type="text/css"/>
        </head>
        <body><div class="page">
        <div align="right"><xsl:call-template name="quiz-navbar"><xsl:with-param name="answers" select="$answers"/></xsl:call-template></div>
        <hr/>
        <div class="content">
        <h2 class="quiz_title"><xsl:if test="$answers">Answers for </xsl:if>Quiz on Chapter <xsl:value-of select="$chapternum"/></h2>
           <xsl:choose>
           <xsl:when test="$answers">
           <p class="firstpar">This page contains sample answers to the quiz on Chapter <xsl:value-of select="$chapternum"/> of
           <a href="../index.html"><i>Introduction to Computer Graphics</i></a>.
           Note that generally, there are lots of correct answers to a given question.</p>
           </xsl:when>
           <xsl:otherwise>
           <p class="firstpar">This page contains questions on Chapter <xsl:value-of select="$chapternum"/> of
           <a href="../index.html"><i>Introduction to Computer Graphics</i></a>.
           You should be able to answer these questions after studying that chapter.
           Sample answers to these questions can be found <a href="quiz_answers.html">here</a>.</p>
           </xsl:otherwise>
        </xsl:choose>
        <table width="95%" cellpadding="8" align="center" border="1">
        <xsl:for-each select="question">
           <tr class="question"><td valign="top"><span class="question">Question&#160;<xsl:number count="question"/>:</span></td>
           <td><xsl:apply-templates select="ques"/></td></tr>
           <xsl:if test="$answers">
              <tr class="answer"><td valign="top"><span class="answer">Answer:</span></td>
              <td><xsl:apply-templates select="ans"/></td></tr>
           </xsl:if>
        </xsl:for-each>
        </table>
        </div>
        <hr/>
        <div align="right"><xsl:call-template name="quiz-navbar"><xsl:with-param name="answers" select="$answers"/></xsl:call-template></div>
        </div></body>
        </html>
    </redirect:write>
</xsl:template>
<xsl:template name="quiz-navbar">
    <xsl:param name="answers"/>
    <small>
        [  <xsl:if test="not($answers)"><a href="quiz_answers.html">Quiz Answers</a> | </xsl:if>
        <a href="index.html">Chapter Index</a> | 
        <a href="../index.html">Main Index</a> ]
    </small>
</xsl:template>

<xsl:template match="p">
    <p><xsl:if test="@align">
            <xsl:attribute name="align">
                <xsl:value-of select="@align"/>
            </xsl:attribute>
        </xsl:if>
        <xsl:apply-templates/></p>
</xsl:template>

<xsl:template match="p1"><p class="firstpar"><xsl:apply-templates/></p></xsl:template>
<xsl:template match="np"><p class="noindent"><xsl:apply-templates/></p></xsl:template>

<xsl:template match="ol|ul|li|big|u|i|b|sup|sub">
   <xsl:copy><xsl:apply-templates/></xsl:copy>
</xsl:template>

<xsl:template match="pre">
   <xsl:choose>
      <xsl:when test="ancestor::exercise-code"><pre class="exercisecode">
         <xsl:apply-templates/>
         </pre>
      </xsl:when>
      <xsl:otherwise><pre>
         <xsl:apply-templates/>
         </pre>
      </xsl:otherwise>
   </xsl:choose>
</xsl:template>

<xsl:template match="code|ptype|codedef|bnf|newcode|classname|atype">
    <span><xsl:attribute name="class"><xsl:value-of select="local-name()"/></xsl:attribute><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="newword|word">
    <xsl:variable name="t">
        <xsl:choose>
            <xsl:when test="@term"><xsl:value-of select="@term"/></xsl:when>
            <xsl:otherwise><xsl:value-of select="text()"/></xsl:otherwise>
        </xsl:choose>
    </xsl:variable>
    <xsl:if test="not(//gitem[@term = $t])">
        <xsl:message><xsl:value-of select="concat('NO DEFINITION FOUND FOR GITEM TERM ', $t)"/></xsl:message>
    </xsl:if>
    <span><xsl:attribute name="class"><xsl:value-of select="local-name()"/></xsl:attribute>
          <xsl:attribute name="data-term"><xsl:value-of select="$t"/></xsl:attribute>
          <xsl:attribute name="data-definition"><xsl:value-of select="//gitem[@term = $t]"/></xsl:attribute>
          <xsl:attribute name="title"><xsl:value-of select="concat('Click for a definition of ', $t, '.')"/></xsl:attribute><xsl:apply-templates/></span>
</xsl:template>

<xsl:template match="gitem"></xsl:template>

<xsl:template match="tag"><span class="tag"><xsl:text>&lt;</xsl:text><xsl:apply-templates/><xsl:text>&gt;</xsl:text></span></xsl:template>
    
<xsl:template match="a">
    <a><xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute><xsl:apply-templates/></a>
</xsl:template>
    
<xsl:template match="sourceref">
   <xsl:variable name="ref">
      <xsl:choose>
         <xsl:when test="ancestor::source"><xsl:value-of select="@href"/></xsl:when>
         <xsl:otherwise><xsl:text>../source/</xsl:text><xsl:value-of select="@href"/></xsl:otherwise>
      </xsl:choose>
   </xsl:variable>
   <span class="sourceref"><a><xsl:attribute name="href"><xsl:value-of select="$ref"/></xsl:attribute>
   <xsl:choose>
      <xsl:when test="text()"><xsl:apply-templates/></xsl:when>
      <xsl:otherwise><xsl:value-of select="@href"/></xsl:otherwise>
   </xsl:choose>
   </a></span>
</xsl:template>
    
<xsl:template match="demoref">
   <xsl:variable name="ref"><xsl:text>../demos/</xsl:text><xsl:value-of select="@href"/></xsl:variable>
   <span class="sourceref"><a><xsl:attribute name="href"><xsl:value-of select="$ref"/></xsl:attribute>
   <xsl:choose>
      <xsl:when test="text()"><xsl:apply-templates/></xsl:when>
      <xsl:otherwise><xsl:value-of select="@href"/></xsl:otherwise>
   </xsl:choose>
   </a></span>
</xsl:template>


<xsl:template match="jarref">
   <xsl:variable name="ref">
      <xsl:text>../jars/chapter</xsl:text><xsl:number count="chapter"/><xsl:text>/</xsl:text><xsl:value-of select="@href"/>   
   </xsl:variable>
   <span class="sourceref"><a><xsl:attribute name="href"><xsl:value-of select="$ref"/></xsl:attribute>
   <xsl:choose>
      <xsl:when test="text()"><xsl:apply-templates/></xsl:when>
      <xsl:otherwise><xsl:value-of select="@href"/></xsl:otherwise>
   </xsl:choose>
   </a></span>
</xsl:template>
    
<xsl:template match="localref">
    <xsl:if test="not(id(@href))"><xsl:message>Undefined reference <xsl:value-of select="@href"/></xsl:message></xsl:if>
    <xsl:variable name="href">
        <xsl:choose>
            <xsl:when test="not(id(@href))"><xsl:value-of select="@href"/></xsl:when>
            <xsl:when test="name(id(@href))='chapter'">
                <xsl:for-each select="id(@href)">
                <xsl:text>../c</xsl:text>
                <xsl:number count="chapter"/>
                <xsl:text>/index.html</xsl:text>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='appendix'">
                <xsl:for-each select="id(@href)">
                <xsl:text>../a</xsl:text>
                <xsl:number count="appendix"/>
                <xsl:text>/index.html</xsl:text>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='section'">
                <xsl:for-each select="id(@href)">
                <xsl:choose>
                  <xsl:when test="ancestor::chapter">
                     <xsl:text>../c</xsl:text>
                     <xsl:number count="chapter"/>
                     <xsl:text>/s</xsl:text>
                     <xsl:number count="section" from="chapter"/>
                     <xsl:text>.html</xsl:text>
                  </xsl:when>
                  <xsl:otherwise>
                     <xsl:text>../a</xsl:text>
                     <xsl:number count="appendix"/>
                     <xsl:text>/s</xsl:text>
                     <xsl:number count="section" from="appendix"/>
                     <xsl:text>.html</xsl:text>
                   </xsl:otherwise>
                </xsl:choose>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='subsection'">
                <xsl:for-each select="id(@href)">
                <xsl:choose>
                   <xsl:when test="ancestor::chapter">
                      <xsl:text>../c</xsl:text>
                      <xsl:number count="chapter"/>
                      <xsl:text>/s</xsl:text>
                      <xsl:number count="section" from="chapter"/>
                      <xsl:text>.html#</xsl:text>
                      <xsl:value-of select="@id"/>
                   </xsl:when>
                   <xsl:otherwise>
                      <xsl:text>../a</xsl:text>
                      <xsl:number count="appendix"/>
                      <xsl:text>/s</xsl:text>
                      <xsl:number count="section" from="appendix"/>
                      <xsl:text>.html#</xsl:text>
                      <xsl:value-of select="@id"/>
                   </xsl:otherwise>
                </xsl:choose>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='exercise'">
               <xsl:for-each select="id(@href)">
                <xsl:text>../c</xsl:text>
                <xsl:number count="chapter"/>
                <xsl:text>/ex</xsl:text>
                <xsl:number count="exercise" from="chapter"/>
                <xsl:text>-ans.html</xsl:text>
               </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='fudgeref'">futurelink</xsl:when>
        </xsl:choose>
    </xsl:variable>
    <xsl:variable name="reftext">
        <xsl:choose>
            <xsl:when test="text()"><xsl:apply-templates/></xsl:when>
            <xsl:when test="not(id(@href))"><xsl:text>(unknown&#160;reference)</xsl:text></xsl:when>
            <xsl:when test="name(id(@href))='chapter'">
                <xsl:for-each select="id(@href)">
                <xsl:text>Chapter&#160;</xsl:text>
                <xsl:number count="chapter"/>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='appendix'">
                <xsl:for-each select="id(@href)">
                <xsl:text>Appendix&#160;</xsl:text>
                <xsl:number count="appendix" format="A"/>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='section'">
                <xsl:for-each select="id(@href)">
                <xsl:choose>
                   <xsl:when test="ancestor::chapter">
                      <xsl:text>Section&#160;</xsl:text>
                      <xsl:number count="chapter"/>
                      <xsl:text>.</xsl:text>
                      <xsl:number count="section" from="chapter"/>
                   </xsl:when>
                   <xsl:otherwise>
                      <xsl:text>Section&#160;</xsl:text>
                      <xsl:number count="appendix" format="A"/>
                      <xsl:text>.</xsl:text>
                      <xsl:number count="section" from="appendix"/>
                   </xsl:otherwise>
                </xsl:choose>
                </xsl:for-each>
            </xsl:when>
            <xsl:when test="name(id(@href))='subsection'">
                <xsl:for-each select="id(@href)">
                <xsl:choose>
                   <xsl:when test="ancestor::chapter">
                      <xsl:text>Subsection&#160;</xsl:text>
                      <xsl:number count="chapter"/>
                      <xsl:text>.</xsl:text>
                      <xsl:number count="section" from="chapter"/>
                      <xsl:text>.</xsl:text>
                      <xsl:number count="subsection" from="section"/>
                   </xsl:when>
                   <xsl:otherwise>
                      <xsl:text>Subsection&#160;</xsl:text>
                      <xsl:number count="appendix" format="A"/>
                      <xsl:text>.</xsl:text>
                      <xsl:number count="section" from="appendix"/>
                      <xsl:text>.</xsl:text>
                      <xsl:number count="subsection" from="section"/>
                   </xsl:otherwise>
                </xsl:choose>
                </xsl:for-each>
            </xsl:when>
           <xsl:when test="name(id(@href))='exercise'">
                <xsl:for-each select="id(@href)">
                <xsl:text>Exercise&#160;</xsl:text>
                <xsl:number count="chapter"/>
                <xsl:text>.</xsl:text>
                <xsl:number count="exercise"/>
                </xsl:for-each>
           </xsl:when>
            <xsl:when test="name(id(@href))='fudgeref'">
                <xsl:for-each select="id(@href)"><xsl:value-of select="@text"/></xsl:for-each>
            </xsl:when>
        </xsl:choose>
    </xsl:variable>
    <a><xsl:attribute name="href"><xsl:value-of select="$href"/></xsl:attribute><xsl:value-of select="$reftext"/></a>
</xsl:template>

<xsl:template match="fudgeref"/>
    
<xsl:template match="break">
    <hr class="break"/>
</xsl:template>
   
<xsl:template match="br">
   <br/>
</xsl:template>
   
<xsl:template match="narrower">
   <xsl:variable name="margin"><xsl:choose>
      <xsl:when test="@margin"><xsl:value-of select="@margin"/></xsl:when>
      <xsl:otherwise>100</xsl:otherwise>
   </xsl:choose></xsl:variable>
<div>
<xsl:attribute name="style">margin-left: <xsl:value-of select="$margin"/>; margin-right: <xsl:value-of select="$margin"/>;</xsl:attribute>
<xsl:apply-templates/>
</div>
</xsl:template>
    
<xsl:template match="img">
    <xsl:choose>
    <xsl:when test="@align">
        <xsl:call-template name="copy-image"></xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
        <p align="center"><xsl:call-template name="copy-image"></xsl:call-template></p>
    </xsl:otherwise>
    </xsl:choose>
</xsl:template>
<xsl:template name="copy-image">
    <img>
       <xsl:attribute name="src"><xsl:value-of select="@src"/></xsl:attribute>
       <xsl:if test="@width"><xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute></xsl:if>
       <xsl:if test="@height"><xsl:attribute name="height"><xsl:value-of select="@height"/></xsl:attribute></xsl:if>
       <xsl:if test="@align"><xsl:attribute name="align"><xsl:value-of select="@align"/></xsl:attribute></xsl:if>
       <xsl:attribute name="alt"><xsl:value-of select="@alt"/></xsl:attribute>
       <xsl:if test="@bordered"><xsl:attribute name="class"><xsl:text>bordered</xsl:text></xsl:attribute></xsl:if>
    </img>
</xsl:template>

<xsl:template match="demo">
<xsl:apply-templates/>
<div class="demo">
<noscript><h4 style="color:red; text-align:center">Demos require JavaScript.<br/>Since JavaScript is not available,<br/>the demo is not functional.</h4></noscript>
<p align="center"><iframe>
   <xsl:attribute name="src"><xsl:value-of select="concat('../demos/',@src)"/></xsl:attribute>
   <xsl:attribute name="width"><xsl:value-of select="@width"/></xsl:attribute>
   <xsl:attribute name="height"><xsl:value-of select="@height"/></xsl:attribute>
</iframe></p>
</div>
</xsl:template>
   
<xsl:template match="imageclear">
   <br clear="all"/>
</xsl:template>
    
<xsl:template match="centered">
<div align="center">
<xsl:apply-templates/>
</div>
</xsl:template>
   
<xsl:template match="endchapter">
    <hr/>
    <div align="center"><b><small>End of Chapter <xsl:number count="chapter"/></small></b></div>
    <hr/>
</xsl:template>
    
<xsl:template match="prog">
    <xsl:apply-templates/>
</xsl:template>
    
<xsl:template match="web">
    <xsl:apply-templates/>
</xsl:template>
    
<xsl:template match="webdiv">
    <xsl:apply-templates/>
</xsl:template>
    
<xsl:template match="tex"></xsl:template>
    
<xsl:template match="texdiv"></xsl:template>
    
</xsl:stylesheet>
