<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Объекты фотофиксации</se:Name>
    <UserStyle>
      <se:Name>photo_uploader_id</se:Name>
      <se:FeatureTypeStyle>

        <se:Rule>
          <se:Name>Default</se:Name>
          <se:Description>
            <se:Title>Точка с номером</se:Title>
          </se:Description>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#399939
                  </se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#191919
                  </se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>34</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:TextSymbolizer>
            <se:Label>
              <ogc:Function name="strSubstringStart">
                <ogc:Function name="id" />
                <ogc:Add>
                  <ogc:Function name="strIndexOf">
                    <ogc:Function name="id" />
                    <ogc:Literal>.</ogc:Literal>
                  </ogc:Function>
                  <ogc:Literal>1</ogc:Literal>
                </ogc:Add>
              </ogc:Function>
            </se:Label>
            <se:LabelPlacement>
              <se:PointPlacement>
                <se:AnchorPoint>
                  <se:AnchorPointX>0.5</se:AnchorPointX>
                  <se:AnchorPointY>0.5</se:AnchorPointY>
                </se:AnchorPoint>
              </se:PointPlacement>
            </se:LabelPlacement>
            <se:Halo>
              <se:Radius>1.5</se:Radius>
              <se:Fill>
                <se:SvgParameter name="fill">#ffeeff</se:SvgParameter>
              </se:Fill>
            </se:Halo>
            <se:Fill>
              <se:SvgParameter name="fill">#111111</se:SvgParameter>
            </se:Fill>
          </se:TextSymbolizer>
        </se:Rule>

      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>

