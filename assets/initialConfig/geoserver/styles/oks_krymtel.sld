<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>oks_krymtel</se:Name>
    <UserStyle>
      <se:Name>oks_krymtel</se:Name>
      <se:FeatureTypeStyle>

      <se:Rule>
          <se:Name>По материалам ЕГРН</se:Name>
          <se:Description>
            <se:Title>ЕГРН</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>source</ogc:PropertyName>
              <ogc:Literal>ЕГРН</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
          <se:Fill>
            <se:GraphicFill>
              <se:Graphic>
                <se:Mark>
                  <se:WellKnownName>shape://slash</se:WellKnownName>
                  <se:Stroke>
                    <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  </se:Stroke>
                </se:Mark>
                <se:Size>7</se:Size>
              </se:Graphic>
            </se:GraphicFill>
          </se:Fill>
        </se:PolygonSymbolizer>
        <se:PolygonSymbolizer>
          <se:Stroke>
            <se:SvgParameter name="stroke">#FF0D00</se:SvgParameter>
            <se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
          </se:Stroke>
        </se:PolygonSymbolizer>
        </se:Rule>




        <se:Rule>
        <se:Name>По материалам БТИ</se:Name>
        <se:Description>
          <se:Title>БТИ</se:Title>
        </se:Description>
        <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
          <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>source</ogc:PropertyName>
            <ogc:Literal>БТИ</ogc:Literal>
          </ogc:PropertyIsEqualTo>
        </ogc:Filter>
  
        <se:PolygonSymbolizer>
        <se:Fill>
          <se:SvgParameter name="fill">#7fd0dc</se:SvgParameter>

        </se:Fill>
      </se:PolygonSymbolizer>
      <se:PolygonSymbolizer>
      <se:Stroke>
      <se:SvgParameter name="stroke">#FF0D00</se:SvgParameter>
      <se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
      <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
    </se:Stroke>
      </se:PolygonSymbolizer>

    </se:Rule>




    <se:Rule>
    <se:Name>Выявленный при обследовании</se:Name>
    <se:Description>
      <se:Title>Выявленный при обследовании</se:Title>
    </se:Description>
    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
      <ogc:PropertyIsEqualTo>
        <ogc:PropertyName>source</ogc:PropertyName>
        <ogc:Literal>Выявленный при обследовании</ogc:Literal>
      </ogc:PropertyIsEqualTo>
    </ogc:Filter>
    <se:PolygonSymbolizer>
    <se:Fill>
      <se:SvgParameter name="fill">#FFB440</se:SvgParameter>

    </se:Fill>
  </se:PolygonSymbolizer>
  <se:PolygonSymbolizer>
  <se:Stroke>
  <se:SvgParameter name="stroke">#A66400</se:SvgParameter>
  <se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
  <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
</se:Stroke>
  </se:PolygonSymbolizer>
        </se:Rule>  

 
        
        <se:Rule>
          <se:Name>Default</se:Name>
          <se:Description>
            <se:Title>Не определено</se:Title>
          </se:Description>
          <se:ElseFilter/>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ff55ff</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
          <se:SvgParameter name="stroke">#FF0D00</se:SvgParameter>
          <se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
          <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
        </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>


      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>