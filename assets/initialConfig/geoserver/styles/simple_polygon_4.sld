<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Полигон 4</se:Name>
    <UserStyle>
      <se:Name>simple_polygon_4</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>red_contour_4</se:Name>
          <se:Description>
            <se:Title>Красный контур</se:Title>
          </se:Description>
           <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff2323</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>