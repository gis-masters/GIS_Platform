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
      <se:Name>Mosti_i_puteprovodi_line</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>100-100-L</se:Name>
          <se:Description>
            <se:Title>Эстакада технологич.погрузная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>100-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>2.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
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
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>175-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
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
          <se:Name>175-100-L</se:Name>
          <se:Description>
            <se:Title>Лестница</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>175-100-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
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
          <se:Name>202-000-L</se:Name>
          <se:Description>
            <se:Title>Подземный переход</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>202-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
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
          <se:Name>319-400-L</se:Name>
          <se:Description>
            <se:Title>Сторона путепровода(0.15)</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>319-400-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
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
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:AnchorPoint>
                <se:AnchorPointX>1</se:AnchorPointX>
                <se:AnchorPointY>1</se:AnchorPointY>
              </se:AnchorPoint>
              <se:Displacement>
                <se:DisplacementX>-11</se:DisplacementX>
                <se:DisplacementY>-10</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-11</se:DisplacementX>
                <se:DisplacementY>10</se:DisplacementY>
              </se:Displacement>
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
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>319-500-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>15</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-11</se:DisplacementX>
                <se:DisplacementY>-10</se:DisplacementY>
              </se:Displacement>     
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2.5</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>15</se:Size>
               <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-11</se:DisplacementX>
                <se:DisplacementY>10</se:DisplacementY>
              </se:Displacement>    
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
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>323-300-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-11</se:DisplacementX>
                <se:DisplacementY>-10</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-11</se:DisplacementX>
                <se:DisplacementY>10</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>2</se:DisplacementX>
                <se:DisplacementY>-10</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>2</se:DisplacementX>
                <se:DisplacementY>10</se:DisplacementY>
              </se:Displacement>
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
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>325-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-12</se:DisplacementX>
                <se:DisplacementY>-7</se:DisplacementY>
              </se:Displacement>   
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-12</se:DisplacementX>
                <se:DisplacementY>7</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>12</se:DisplacementX>
                <se:DisplacementY>-7</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>12</se:DisplacementX>
                <se:DisplacementY>7</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>313-000-L</se:Name>
          <se:Description>
            <se:Title>Мосты прочие</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>313-000-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-12</se:DisplacementX>
                <se:DisplacementY>-7</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-12</se:DisplacementX>
                <se:DisplacementY>7</se:DisplacementY>
              </se:Displacement>  
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>12</se:DisplacementX>
                <se:DisplacementY>-7</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>10</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>12</se:DisplacementX>
                <se:DisplacementY>7</se:DisplacementY>
              </se:Displacement>
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
              <ogc:PropertyName>CODE</ogc:PropertyName>
              <ogc:Literal>323-380-L</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
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
              <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">10 10</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
            </se:Stroke>
            <se:PerpendicularOffset>-3.5</se:PerpendicularOffset>
          </se:LineSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>4</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-9</se:DisplacementX>
                <se:DisplacementY>-4</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>4</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>-9</se:DisplacementX>
                <se:DisplacementY>4</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://backslash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>4</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:Displacement>
                <se:DisplacementX>9</se:DisplacementX>
                <se:DisplacementY>-4</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://slash</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>4</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
              <se:AnchorPoint>
                <se:AnchorPointX>1</se:AnchorPointX>
                <se:AnchorPointY>1</se:AnchorPointY>
              </se:AnchorPoint>
              <se:Displacement>
                <se:DisplacementX>9</se:DisplacementX>
                <se:DisplacementY>4</se:DisplacementY>
              </se:Displacement>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="startpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://vertline</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>5</se:Size>
              <se:Rotation>
                <ogc:Function name="startAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
          <se:PointSymbolizer>
            <se:Geometry>
              <ogc:Function name="endpoint">
                <ogc:PropertyName>the_geom</ogc:PropertyName>
              </ogc:Function>
            </se:Geometry>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>shape://vertline</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#00000</se:SvgParameter>
                  <se:SvgParameter name="stroke-offset">1</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                  <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                  <se:SvgParameter name="stroke-linecap">round</se:SvgParameter>
                </se:Stroke>
              </se:Mark> 
              <se:Size>5</se:Size>
              <se:Rotation>
                <ogc:Function name="endAngle">
                  <ogc:PropertyName>the_geom</ogc:PropertyName>
                </ogc:Function>
              </se:Rotation>
            </se:Graphic>
          </se:PointSymbolizer>
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