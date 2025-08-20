<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Линия 6</se:Name>
    <UserStyle>
      <se:Name>simple_line_6</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Black_line_with_marks_6</se:Name>
          <se:Description>
            <se:Title>Черная линия с отметками</se:Title>
          </se:Description>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">20 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">24</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">20 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">4</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">20 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">4</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#333333</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>7</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">10 10</se:SvgParameter>
               <se:SvgParameter name="stroke-dashoffset">8</se:SvgParameter>
             </se:Stroke>
           </se:LineSymbolizer>
          <se:LineSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://times</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#333333</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">1.5</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>11</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">15 45</se:SvgParameter>
             </se:Stroke>
           </se:LineSymbolizer>
        </se:Rule>      
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>