<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" 
xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Точка 10</se:Name>
    <UserStyle>
      <se:Name>simple_point_10</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
        <se:Name>turquoise_plus_10</se:Name>
          <se:Description>
            <se:Title>Бирюзовый плюс</se:Title>
          </se:Description>
					 <se:PointSymbolizer>
         <se:Graphic>
           <se:Mark>
             <se:WellKnownName>cross</se:WellKnownName>
             <se:Fill>
               <se:SvgParameter name="fill">#00ffff</se:SvgParameter>
             </se:Fill>
             <se:Stroke>
               <se:SvgParameter name="stroke">#000000</se:SvgParameter>
               <se:SvgParameter name="stroke-width">2</se:SvgParameter>
             </se:Stroke>
           </se:Mark>
           <se:Size>20</se:Size>
         </se:Graphic>
       </se:PointSymbolizer>
				</se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>