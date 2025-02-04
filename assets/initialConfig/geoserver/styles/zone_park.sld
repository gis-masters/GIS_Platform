<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>zone_park</se:Name>
    <UserStyle>
      <se:Name>zone_park</se:Name>
      <se:FeatureTypeStyle>
	          <se:Rule>
          <se:Name>Лесопарковая подзона</se:Name>
          <se:Description>
            <se:Title>Лесопарковая подзона</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zone_name</ogc:PropertyName>
              <ogc:Literal>Лесопарковая подзона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#FFB03A</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FFB03A</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
		
		<se:Rule>
          <se:Name>Подзона тихого отдыха</se:Name>
          <se:Description>
            <se:Title>Подзона тихого отдыха</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zone_name</ogc:PropertyName>
              <ogc:Literal>Подзона тихого отдыха</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#E6FF59</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#E6FF59</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        
		<se:Rule>
          <se:Name>Административно-хозяйственная зона</se:Name>
          <se:Description>
            <se:Title>Административно-хозяйственная зона</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zone_name</ogc:PropertyName>
              <ogc:Literal>Административно-хозяйственная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#97828A</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#97828A</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
		
		<se:Rule>
          <se:Name>Историко-культурная подзона</se:Name>
          <se:Description>
            <se:Title>Историко-культурная подзона</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zone_name</ogc:PropertyName>
              <ogc:Literal>Историко-культурная подзона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#7D60FF</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7D60FF</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
		
		<se:Rule>
          <se:Name>Экспозиционная зона</se:Name>
          <se:Description>
            <se:Title>Экспозиционная зона</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zone_name</ogc:PropertyName>
              <ogc:Literal>Экспозиционная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
   <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>shape://vertline</se:WellKnownName>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#21FF93</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>7</se:Size>
                </se:Graphic>
              </se:GraphicFill>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#21FF93</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.35</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>