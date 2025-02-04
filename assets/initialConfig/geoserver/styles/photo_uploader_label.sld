<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Объекты фотофиксации</se:Name>
    <UserStyle>
      <se:Name>photo_uploader_label</se:Name>
      <se:FeatureTypeStyle>

        <!-- Ниже только для для отображения в легенде-->
        <se:Rule>
          <se:Name>1</se:Name>
          <se:Description>
            <se:Title>Цвет зависит от значения поля "ментки"</se:Title>
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
                    <ogc:Function name="Interpolate">
                      <ogc:Function name="random"/>

                      <ogc:Literal>0</ogc:Literal>
                      <ogc:Literal>#ee00ee</ogc:Literal>

                      <ogc:Literal>0.5</ogc:Literal>
                      <ogc:Literal>#eeee00</ogc:Literal>

                      <ogc:Literal>1</ogc:Literal>
                      <ogc:Literal>#00eeee</ogc:Literal>

                      <ogc:Literal>color</ogc:Literal>
                    </ogc:Function>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">
                  <ogc:Function name="Interpolate">
                      <ogc:Function name="random"/>

                      <ogc:Literal>0</ogc:Literal>
                      <ogc:Literal>#660066</ogc:Literal>

                      <ogc:Literal>0.5</ogc:Literal>
                      <ogc:Literal>#666600</ogc:Literal>

                      <ogc:Literal>1</ogc:Literal>
                      <ogc:Literal>#006666</ogc:Literal>

                      <ogc:Literal>color</ogc:Literal>
                    </ogc:Function>
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
          <se:Name>Default</se:Name>
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
                  <se:SvgParameter name="fill">#<ogc:PropertyName>label_fill_color</ogc:PropertyName>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#<ogc:PropertyName>label_stroke_color</ogc:PropertyName>
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
                  <se:SvgParameter name="fill">#<ogc:PropertyName>label_fill_color</ogc:PropertyName>
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#<ogc:PropertyName>label_stroke_color</ogc:PropertyName>
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