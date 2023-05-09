<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!--  run with the following command:
export XALAN_DIR='/home/eck/xalan-j_2_7_1' && java -cp $XALAN_DIR/xalan.jar:$XALAN_DIR/serializer.jar:$XALAN_DIR/xercesImpl.jar:$XALAN_DIR/xml-apis.jar org.apache.xalan.xslt.Process -xsl glossary-items-list.xsl -in graphicstext.xml -out glossary-items.txt
 -->

<xsl:output method="text"/>

<xsl:template match="/">
<xsl:for-each select="//gitem">
<xsl:sort select="@term"/>
<xsl:value-of select="@term"/><xsl:text>&#10;</xsl:text>
</xsl:for-each>

</xsl:template>

</xsl:stylesheet>


