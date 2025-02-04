<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Санитарный разрыв (санитарная полоса отчуждения) инженерных коммуникаций</se:Name>
    <UserStyle>
      <se:Name>EngSanitaryGapZone</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60301030101</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв магистральных трубопроводов углеводородного сырья существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301030101</ogc:Literal>
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
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
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
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 20</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301030102</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв магистральных трубопроводов углеводородного сырья планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301030102</ogc:Literal>
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
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 20</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301030201</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв компрессорных установок существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301030201</ogc:Literal>
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
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
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
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 20</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301030202</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв компрессорных установок планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301030202</ogc:Literal>
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
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 20</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301030301</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв линий электропередачи существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301030301</ogc:Literal>
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
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
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
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 20</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301030302</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв линий электропередачи планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301030302</ogc:Literal>
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
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 20</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
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