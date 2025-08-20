<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" 
xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>trees</se:Name>
    <UserStyle>
      <se:Name>trees</se:Name>
         <se:FeatureTypeStyle>
           <se:Rule>
           <se:Name>Лиственные</se:Name>
			 <se:Description>
              <se:Title>Лиственные</se:Title>
             </se:Description>
		  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>vid</ogc:PropertyName>
            <ogc:Literal>Лиственные</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
	<se:PointSymbolizer>
         <se:Graphic>
           <se:Mark>
             <se:WellKnownName>circle</se:WellKnownName>
             <se:Fill>
               <se:SvgParameter name="fill">#21FF11</se:SvgParameter>
             </se:Fill>
             <se:Stroke>
               <se:SvgParameter name="stroke">#404040</se:SvgParameter>
               <se:SvgParameter name="stroke-width">1</se:SvgParameter>
             </se:Stroke>
           </se:Mark>
           <se:Size>5</se:Size>
         </se:Graphic>
       </se:PointSymbolizer>
	</se:Rule>
	 <se:Rule>
           <se:Name>Хвойные</se:Name>
			 <se:Description>
              <se:Title>Хвойные</se:Title>
             </se:Description>
		  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
            <ogc:PropertyName>vid</ogc:PropertyName>
            <ogc:Literal>Хвойные</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
	<se:PointSymbolizer>
         <se:Graphic>
           <se:Mark>
             <se:WellKnownName>circle</se:WellKnownName>
             <se:Fill>
               <se:SvgParameter name="fill">#59b352</se:SvgParameter>
             </se:Fill>
             <se:Stroke>
               <se:SvgParameter name="stroke">#404040</se:SvgParameter>
               <se:SvgParameter name="stroke-width">1</se:SvgParameter>
             </se:Stroke>
           </se:Mark>
           <se:Size>5</se:Size>
         </se:Graphic>
       </se:PointSymbolizer>
	</se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>