<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" xmlns:ogc="http://www.opengis.net/ogc" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Улично-дорожная сеть городского населенного пункта</se:Name>
    <UserStyle>
      <se:Name>Street</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60203040101</se:Name>
          <se:Description>
            <se:Title>Магистральная городская дорога существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040101</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffa500</se:SvgParameter>
              <se:SvgParameter name="stroke-width">19.2</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8000ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">17</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040102</se:Name>
          <se:Description>
            <se:Title>Магистральная городская дорога планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040102</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffa500</se:SvgParameter>
              <se:SvgParameter name="stroke-width">19.2</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffffff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">17</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8000ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">17</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 14</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040103</se:Name>
          <se:Description>
            <se:Title>Магистральная городская дорога планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040103</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffa500</se:SvgParameter>
              <se:SvgParameter name="stroke-width">19.2</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8000ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">17</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffa500</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>square</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#8000ff</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>14</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
                <se:AnchorPoint>
                  <se:AnchorPointX>1</se:AnchorPointX>
                  <se:AnchorPointY>0.5</se:AnchorPointY>
                </se:AnchorPoint>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://oarrow</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#ffa500</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>30</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040201</se:Name>
          <se:Description>
            <se:Title>Магистральная дорога регулируемого движения существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040201</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#00ff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">15.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8000ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">13.2</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040202</se:Name>
          <se:Description>
            <se:Title>Магистральная дорога регулируемого движения планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040202</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#00ff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">15.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffffff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">13.2</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8000ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">13.2</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 14</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040203</se:Name>
          <se:Description>
            <se:Title>Магистральная дорога регулируемого движения планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040203</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#00ff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">15.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8000ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">13.2</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#00ff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>square</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#8000ff</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>14</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
                <se:AnchorPoint>
                  <se:AnchorPointX>1</se:AnchorPointX>
                  <se:AnchorPointY>0.5</se:AnchorPointY>
                </se:AnchorPoint>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://oarrow</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00ff00</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>30</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040301</se:Name>
          <se:Description>
            <se:Title>Магистральная улица общегородского значения существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040301</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">11.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">9.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040302</se:Name>
          <se:Description>
            <se:Title>Магистральная улица общегородского значения планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040302</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#0ac03a</se:SvgParameter>
              <se:SvgParameter name="stroke-width">11.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffffff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">9.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7030a0</se:SvgParameter>
              <se:SvgParameter name="stroke-width">9.4</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 14</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040303</se:Name>
          <se:Description>
            <se:Title>Магистральная улица общегородского значения планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040303</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">11.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">9.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>square</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#000000</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>9</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
                <se:AnchorPoint>
                  <se:AnchorPointX>1</se:AnchorPointX>
                  <se:AnchorPointY>0.5</se:AnchorPointY>
                </se:AnchorPoint>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://oarrow</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#ff0000</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>30</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040401</se:Name>
          <se:Description>
            <se:Title>Магистральная улица общегородского значения регулируемого движения существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040401</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffffff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">11.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">9.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040402</se:Name>
          <se:Description>
            <se:Title>Магистральная улица общегородского значения регулируемого движения планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040402</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#076f02</se:SvgParameter>
              <se:SvgParameter name="stroke-width">5.7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040403</se:Name>
          <se:Description>
            <se:Title>Магистральная улица общегородского значения регулируемого движения планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040403</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.9</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#005118</se:SvgParameter>
              <se:SvgParameter name="stroke-width">5.7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040501</se:Name>
          <se:Description>
            <se:Title>Магистральная улица районного значения существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040501</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7d00ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040502</se:Name>
          <se:Description>
            <se:Title>Магистральная улица районного значения планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040502</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7d00ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.6</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18.9 7.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040503</se:Name>
          <se:Description>
            <se:Title>Магистральная улица районного значения планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040503</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">11.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">9.4</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>square</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#000000</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>9</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
                <se:AnchorPoint>
                  <se:AnchorPointX>1</se:AnchorPointX>
                  <se:AnchorPointY>0.5</se:AnchorPointY>
                </se:AnchorPoint>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endPoint">
                <ogc:PropertyName>shape</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://oarrow</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#ff0000</se:SvgParameter>
                </se:Fill>
              </se:Mark>
              <se:Size>30</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>shape</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040601</se:Name>
          <se:Description>
            <se:Title>Улицы и дороги местного значения существующие</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040601</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#005118</se:SvgParameter>
              <se:SvgParameter name="stroke-width">5.7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040602</se:Name>
          <se:Description>
            <se:Title>Улицы и дороги местного значения планируемые к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040602</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#005118</se:SvgParameter>
              <se:SvgParameter name="stroke-width">5.7</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">26.5 15.1</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040603</se:Name>
          <se:Description>
            <se:Title>Улицы и дороги местного значения планируемые к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040603</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.9</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#005118</se:SvgParameter>
              <se:SvgParameter name="stroke-width">5.7</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040701</se:Name>
          <se:Description>
            <se:Title>Дорожка велосипедная существующая</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040701</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7d00ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040702</se:Name>
          <se:Description>
            <se:Title>Дорожка велосипедная планируемая к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040702</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7d00ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.6</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18.9 7.6</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60203040703</se:Name>
          <se:Description>
            <se:Title>Дорожка велосипедная планируемая к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60203040703</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">7.9</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#007dff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">5.7</se:SvgParameter>
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
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>