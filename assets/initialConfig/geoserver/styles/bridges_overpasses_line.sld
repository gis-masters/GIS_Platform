<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.1.0"
                       xmlns="http://www.opengis.net/sld" 
                       xmlns:xlink="http://www.w3.org/1999/xlink" 
                       xmlns:se="http://www.opengis.net/se" 
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                       xmlns:ogc="http://www.opengis.net/ogc" 
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <se:Name>Мосты и путепроводы линейные</se:Name>
    <UserStyle>
      <se:Name>Bridges</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>100-100-L</se:Name>
          <se:Description>
            <se:Title>Эстакада технологич.погрузная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>100-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>100-100-L</se:Name>
          <se:Description>
            <se:Title>Эстакада технологич.погрузная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>100-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>100-100-L</se:Name>
          <se:Description>
            <se:Title>Эстакада технологич.погрузная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>100-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>100-100-L</se:Name>
          <se:Description>
            <se:Title>Эстакада технологич.погрузная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>100-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-000-L</se:Name>
          <se:Description>
            <se:Title>Виадук пешех над ж.д.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-000-L</se:Name>
          <se:Description>
            <se:Title>Виадук пешех над ж.д.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-000-L</se:Name>
          <se:Description>
            <se:Title>Виадук пешех над ж.д.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-000-L</se:Name>
          <se:Description>
            <se:Title>Виадук пешех над ж.д.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-100-L</se:Name>
          <se:Description>
            <se:Title>Лестница</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
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
                  <se:Size>8</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-100-L</se:Name>
          <se:Description>
            <se:Title>Лестница</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
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
                  <se:Size>6</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-100-L</se:Name>
          <se:Description>
            <se:Title>Лестница</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
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
              <se:SvgParameter name="stroke-dasharray">4 3</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>175-100-L</se:Name>
          <se:Description>
            <se:Title>Лестница</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>175-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>202-000-L</se:Name>
          <se:Description>
            <se:Title>Подземный переход</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>202-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">15</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>202-000-L</se:Name>
          <se:Description>
            <se:Title>Подземный переход</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>202-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">12</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>202-000-L</se:Name>
          <se:Description>
            <se:Title>Подземный переход</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>202-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">9</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">3</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>202-000-L</se:Name>
          <se:Description>
            <se:Title>Подземный переход</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>202-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">15</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-400-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.15)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-400-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-400-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.15)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-400-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-400-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.15)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-400-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-400-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.15)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-400-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-400-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.15)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-400-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-500-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.4)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-500-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-500-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.4)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-500-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-500-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.4)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-500-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-500-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.4)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-500-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/storona_0_4verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>319-500-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.4)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>319-500-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>323-300-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-300-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
         <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
         <se:Rule>
          <se:Name>323-300-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-300-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
         <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>323-300-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-300-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
         <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>323-300-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-300-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
         <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_mal_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>323-300-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-300-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
         <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-opacity">0</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>325-000-L</se:Name>
          <se:Description>
            <se:Title>Мост пешеходный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>325-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>

              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>325-000-L</se:Name>
          <se:Description>
            <se:Title>Мост пешеходный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>325-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>325-000-L</se:Name>
          <se:Description>
            <se:Title>Мост пешеходный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>325-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>325-000-L</se:Name>
          <se:Description>
            <se:Title>Мост пешеходный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>325-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>325-000-L</se:Name>
          <se:Description>
            <se:Title>Мост пешеходный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>325-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>1.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>313-000-L</se:Name>
          <se:Description>
            <se:Title>Мост прочий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>313-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>313-000-L</se:Name>
          <se:Description>
            <se:Title>Мост прочий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>313-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>313-000-L</se:Name>
          <se:Description>
            <se:Title>Мост прочий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>313-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>313-000-L</se:Name>
          <se:Description>
            <se:Title>Мост прочий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>313-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most2.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/most.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>313-000-L</se:Name>
          <se:Description>
            <se:Title>Мост прочий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>313-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>1.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
        </se:Rule>




        <se:Rule>
          <se:Name>323-380-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная 2 л.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-380-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">10 10</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">10 10</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>18</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>    
        </se:Rule>
        
        <se:Rule>
          <se:Name>323-380-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная 2 л.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-380-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">8 8</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">4</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">8 8</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">4</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>    
        </se:Rule>
        
        <se:Rule>
          <se:Name>323-380-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная 2 л.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-380-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">7 7</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">3</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">7 7</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">3</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>12</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>    
        </se:Rule>
        
        <se:Rule>
          <se:Name>323-380-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная 2 л.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-380-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">5 5</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">2</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">5 5</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">2</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-2</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_niz.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/truba_vodopropusknaya_verh.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>    
        </se:Rule>
        
         <se:Rule>
          <se:Name>323-380-L</se:Name>
          <se:Description>
            <se:Title>Труба водопропускная 2 л.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>323-380-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2501</se:MinScaleDenominator>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">4 4</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>1.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">4 4</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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