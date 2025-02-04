<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>greenery</se:Name>
    <UserStyle>
      <se:Name>greenery</se:Name>
      <se:FeatureTypeStyle>
	  
        <se:Rule>
          <se:Name>Естественная</se:Name>
          <se:Description>
            <se:Title>Естественная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
              <ogc:Literal>Естественная</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#CEFACB</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#00AA00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
		
		<se:Rule>
          <se:Name>Историческая</se:Name>
          <se:Description>
            <se:Title>Историческая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
              <ogc:Literal>Историческая</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#FFCDFF</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#9B00AD</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        
		<se:Rule>
          <se:Name>Современная</se:Name>
          <se:Description>
            <se:Title>Современная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
              <ogc:Literal>Современная</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
           <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#FFCDB3</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FF4B00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
						
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>