<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Default Line</se:Name>
    <UserStyle>
      <se:Name>GreenSquare</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Default</se:Name>
          <se:Description>
            <se:Title></se:Title>
          </se:Description>
          <se:ElseFilter/>
          <se:PointSymbolizer>
            <se:Graphic>
                <se:Mark>
                  <se:WellKnownName>square</se:WellKnownName>
                  <se:Fill>
                    <se:SvgParameter name="fill">#54b04a</se:SvgParameter>
                  </se:Fill>
                  <se:Stroke>
                    <se:SvgParameter name="stroke">#3d8035</se:SvgParameter>
                    <se:SvgParameter name="stroke-width">1</se:SvgParameter>
            	  </se:Stroke>
                </se:Mark>
              	<se:Size>8</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>