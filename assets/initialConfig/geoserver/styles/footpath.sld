<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>footpath</se:Name>
    <UserStyle>
      <se:Name>footpath</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Транспортные и пешеходные пути</se:Name>
          <se:Description>
            <se:Title>Транспортные и пешеходнве пути</se:Title>
          </se:Description>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#FF8C00</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FF4423</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>