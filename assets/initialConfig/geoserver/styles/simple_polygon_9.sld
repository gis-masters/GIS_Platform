<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Полигон 9</se:Name>
    <UserStyle>
      <se:Name>simple_polygon_9</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>green_hatching_9</se:Name>
          <se:Description>
            <se:Title>Зеленая штриховка /</se:Title>
          </se:Description>
          <se:PolygonSymbolizer>
                      <se:Stroke>
              <se:SvgParameter name="stroke">#9FF50A</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke">#9FF50A</se:SvgParameter>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>4</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>