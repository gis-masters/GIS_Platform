<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <se:Name>electricline_topo_500</se:Name>
    <UserStyle>
      <se:Name>electricline_topo_500</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>1</se:Name>
          <se:Description>
            <se:Title>Линии электропередачи (ЛЭП) высокого напряжения</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>classid</ogc:PropertyName>
              <ogc:Literal>1</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#F17E00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#F17E00</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#F17E00</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>-90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>2</se:Name>
          <se:Description>
            <se:Title>Линии электропередачи (ЛЭП) низкого напряжения</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>classid</ogc:PropertyName>
              <ogc:Literal>2</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FAE013</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#FAE013</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#FAE013</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>-90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>3</se:Name>
          <se:Description>
            <se:Title>Электрокабели высокого напряжения</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>classid</ogc:PropertyName>
              <ogc:Literal>3</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#3B2A98</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#3B2A98</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#3B2A98</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>-90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>4</se:Name>
          <se:Description>
            <se:Title>Электрокабели низкого напряжения</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>classid</ogc:PropertyName>
              <ogc:Literal>4</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#E10585</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#E10585</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>triangle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#E10585</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>6</se:Size>
                  <se:Rotation>-90</se:Rotation>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
            </se:Stroke>
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