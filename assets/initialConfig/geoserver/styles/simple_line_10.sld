<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Линия 10</se:Name>
    <UserStyle>
      <se:Name>simple_line_10</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>dotted_line_of_dots_10</se:Name>
          <se:Description>
            <se:Title>Пунктир из точек</se:Title>
          </se:Description>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#a83800</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#a83800</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">3</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>2.5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">2 12</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>      
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>