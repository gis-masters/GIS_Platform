<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:ogc="http://www.opengis.net/ogc">
  <NamedLayer>
    <se:Name>Охранная зона иного назначения</se:Name>
    <UserStyle>
      <se:Name>OtherProtectionZone</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60301070101</se:Name>
          <se:Description>
            <se:Title>Охранная зона стационарных пунктов наблюдений за состоянием окружающей природной среды, ее загрязнением существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301070101</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301070102</se:Name>
          <se:Description>
            <se:Title>Охранная зона стационарных пунктов наблюдений за состоянием окружающей природной среды, ее загрязнением планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301070102</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">14 4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301070201</se:Name>
          <se:Description>
            <se:Title>Охранная зона обсерваторий и иных научных объектов существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301070201</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301070202</se:Name>
          <se:Description>
            <se:Title>Охранная зона обсерваторий и иных научных объектов планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301070202</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">14 4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 13</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
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