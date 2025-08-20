<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Объекты фотофиксации</se:Name>
    <UserStyle>
      <se:Name>photo_uploader_live_red</se:Name>
      <se:FeatureTypeStyle>

      <!-- Ниже только для для отображения в легенде-->
        <se:Rule>
          <se:Name>1</se:Name>
          <se:Description>
            <se:Title>Сегодня</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
          <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:Literal>1</ogc:Literal>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              </ogc:And>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Literal>#50bb30</ogc:Literal>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>2</se:Name>
          <se:Description>
            <se:Title>Вчера</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
          <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:Literal>1</ogc:Literal>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              </ogc:And>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Literal>#8aba30</ogc:Literal>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>3</se:Name>
          <se:Description>
            <se:Title>Последняя неделя</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
              <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:Literal>1</ogc:Literal>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              </ogc:And>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Literal>#aaaa33</ogc:Literal>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>4</se:Name>
          <se:Description>
            <se:Title>Последний месяц</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
              <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:Literal>1</ogc:Literal>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              </ogc:And>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Literal>#886622</ogc:Literal>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>5</se:Name>
          <se:Description>
            <se:Title>Последние два месяца</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
              <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:Literal>1</ogc:Literal>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              </ogc:And>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Literal>#bb3311</ogc:Literal>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>6</se:Name>
          <se:Description>
            <se:Title>Более двух месяцев</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
              <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:Literal>1</ogc:Literal>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              </ogc:And>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Literal>#ee0505</ogc:Literal>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <!-- Выше только для для отображения в легенде-->

        <se:Rule>
          <se:Name>unrotate</se:Name>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>rotation</ogc:PropertyName>
                <ogc:Literal>1800</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>rotation</ogc:PropertyName>
                <ogc:Literal></ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:Or>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Function name="Categorize">
                      <ogc:Function name="dateDifference">
                        <ogc:Function name="now"/>
                        <ogc:PropertyName>photography_time</ogc:PropertyName>
                      </ogc:Function>
                      <ogc:Literal>#50bb30</ogc:Literal>
                      <ogc:Literal>86400000</ogc:Literal>
                      <ogc:Literal>#8aba30</ogc:Literal>
                      <ogc:Literal>172800000</ogc:Literal>
                      <ogc:Literal>#aaaa33</ogc:Literal>
                      <ogc:Literal>604800000</ogc:Literal>
                      <ogc:Literal>#886622</ogc:Literal>
                      <ogc:Literal>2592000000</ogc:Literal>
                      <ogc:Literal>#bb3311</ogc:Literal>
                      <ogc:Literal>5184000000</ogc:Literal>
                      <ogc:Literal>#ee0505</ogc:Literal>
                    </ogc:Function>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>Default</se:Name>
					<se:ElseFilter/>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">
                    <ogc:Function name="Categorize">
                      <ogc:Function name="dateDifference">
                        <ogc:Function name="now"/>
                        <ogc:PropertyName>photography_time</ogc:PropertyName>
                      </ogc:Function>
                      <ogc:Literal>#50bb30</ogc:Literal>
                      <ogc:Literal>86400000</ogc:Literal>
                      <ogc:Literal>#8aba30</ogc:Literal>
                      <ogc:Literal>172800000</ogc:Literal>
                      <ogc:Literal>#aaaa33</ogc:Literal>
                      <ogc:Literal>604800000</ogc:Literal>
                      <ogc:Literal>#886622</ogc:Literal>
                      <ogc:Literal>2592000000</ogc:Literal>
                      <ogc:Literal>#bb3311</ogc:Literal>
                      <ogc:Literal>5184000000</ogc:Literal>
                      <ogc:Literal>#ee0505</ogc:Literal>
                    </ogc:Function>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#111111
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic>
                <se:OnlineResource xlink:type="simple" xlink:href="svg/photo_upload.svg"/>
                <se:Format>image/svg+xml</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
              <se:Rotation>
                <ogc:PropertyName>rotation</ogc:PropertyName>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
