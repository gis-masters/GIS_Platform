<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:se="http://www.opengis.net/se" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc">
  <NamedLayer>
    <se:Name>red_line</se:Name>
    <UserStyle>
      <se:Name>red_line</se:Name>
      <se:FeatureTypeStyle>
        
        
        <se:Rule>
          <se:Name>Отменяемый</se:Name>
          <se:Description>
            <se:Title>Отменяемый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
              <ogc:Literal>7Е.3</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ff0000</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:LineSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://times</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>6</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
               <se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
             </se:Stroke>
           </se:LineSymbolizer>
        </se:Rule>
        
        
        
        <se:Rule>
          <se:Name>Существующий</se:Name>
          <se:Description>
            <se:Title>Существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
              <ogc:Literal>7Е.1</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#36d8c0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#e31a1c</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Планируемый</se:Name>
          <se:Description>
            <se:Title>Планируемый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
              <ogc:Literal>7Е.2</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f7f7f7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#232323</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <!--SymbolLayerV2 HashLine not implemented yet-->
          <!--SymbolLayerV2 HashLine not implemented yet-->
        </se:Rule>

        <se:Rule>
                    <se:Name>Default</se:Name>
                    <se:Description>
                        <se:Title>Не определено</se:Title>
                    </se:Description>
                    <se:ElseFilter/>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff55ff</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>