<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>lease_buffer</se:Name>
    <UserStyle>
      <se:Name>lease_buffer</se:Name>
       <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Зоны ответственности арендаторов</se:Name>
          <se:Description>
            <se:Title></se:Title>
          </se:Description>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>shape://backslash</se:WellKnownName>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#e600a9</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicFill>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#a80084</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
		</se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>