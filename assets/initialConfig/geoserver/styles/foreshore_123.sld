<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:ogc="http://www.opengis.net/ogc">
  <NamedLayer>
    <se:Name>Береговые полосы</se:Name>
    <UserStyle>
      <se:Name>Foreshore_123</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60301130101</se:Name>
          <se:Description>
            <se:Title>Береговая полоса существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301130101</ogc:Literal>
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
              <se:SvgParameter name="stroke">#004da8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 4 4 4 4 4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://slash</se:WellKnownName>
                     <se:Stroke>
                   		<se:SvgParameter name="stroke">#004da8</se:SvgParameter>
                   		<se:SvgParameter name="stroke-width">1</se:SvgParameter>
                 	 </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">4 34</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">12</se:SvgParameter>
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://backslash</se:WellKnownName>
                     <se:Stroke>
                   		<se:SvgParameter name="stroke">#004da8</se:SvgParameter>
                   		<se:SvgParameter name="stroke-width">1</se:SvgParameter>
                 	 </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">4 34</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">16</se:SvgParameter>
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301130102</se:Name>
          <se:Description>
            <se:Title>Береговая полоса планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301130102</ogc:Literal>
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
              <se:SvgParameter name="stroke">#0064c8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 4 4 4 4 4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://slash</se:WellKnownName>
                     <se:Stroke>
                   		<se:SvgParameter name="stroke">#0064c8</se:SvgParameter>
                   		<se:SvgParameter name="stroke-width">1</se:SvgParameter>
                 	 </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">4 34</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">12</se:SvgParameter>
             </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://backslash</se:WellKnownName>
                     <se:Stroke>
                   		<se:SvgParameter name="stroke">#0064c8</se:SvgParameter>
                   		<se:SvgParameter name="stroke-width">1</se:SvgParameter>
                 	 </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">4 34</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">16</se:SvgParameter>
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