<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>planned_territory_inspection</se:Name>
    <UserStyle>
      <se:Name>planned_territory_inspection</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>1001</se:Name>
          <se:Description>
            <se:Title>План-график</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
          <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>classid</ogc:PropertyName>
              <ogc:Literal>1001</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
         <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#F97E18</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.8</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
            <se:SvgParameter name="stroke">#F97E18</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.35</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>