<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>garbage_border</se:Name>
    <UserStyle>
      <se:Name>garbage_border</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Граница</se:Name>
          <se:Description>
            <se:Title>Граница</se:Title>
          </se:Description>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#D1FFF6</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#004A7F</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>        
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>