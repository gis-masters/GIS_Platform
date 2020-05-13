<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <se:Name>Сети электросвязи</se:Name>
    <UserStyle>
      <se:Name>TelecomNetworkLine</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60204160101</se:Name>
          <se:Description>
            <se:Title>Линия связи существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160101</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
		<se:Rule>
          <se:Name>60204160102</se:Name>
          <se:Description>
            <se:Title>Линия связи планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160102</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204160103</se:Name>
          <se:Description>
            <se:Title>Линия связи планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160103</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 25</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">23</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204160104</se:Name>
          <se:Description>
            <se:Title>Линия связи планируемая к ликвидации</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160104</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>
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
                       <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
               <se:SvgParameter name="stroke-dashoffset">8</se:SvgParameter>
             </se:Stroke>
           </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204160201</se:Name>
          <se:Description>
            <se:Title>Линейно-кабельное сооружение связи существующее</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160201</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204160202</se:Name>
          <se:Description>
            <se:Title>Линейно-кабельное сооружение связи планируемое к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160202</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204160203</se:Name>
          <se:Description>
            <se:Title>Линейно-кабельное сооружение связи планируемое к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160203</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 25</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">23</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204160204</se:Name>
          <se:Description>
            <se:Title>Линейно-кабельное сооружение связи планируемое к ликвидации</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204160204</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#000000</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>4</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>
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
                       <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>5</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">5 20</se:SvgParameter>
               <se:SvgParameter name="stroke-dashoffset">8</se:SvgParameter>
             </se:Stroke>
           </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.1</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Default</se:Name>
          <se:Description>
            <se:Title>Не определено</se:Title>
          </se:Description>
          <se:ElseFilter/>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff55ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>