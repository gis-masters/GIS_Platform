<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>buildings_construction_electro</se:Name>
    <UserStyle>
      <se:Name>buildings_construction_electro</se:Name>
      <se:FeatureTypeStyle>

     <se:Rule>
          <se:Name>1</se:Name>
          <se:Description>
            <se:Title>Поставлен на учет</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
                <ogc:Literal>Учтен</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            </ogc:Filter>
          <se:PolygonSymbolizer>
        <se:Fill>
          <se:SvgParameter name="fill">#b5ffdf</se:SvgParameter>
        </se:Fill>
      </se:PolygonSymbolizer>
      <se:PolygonSymbolizer>
      <se:Stroke>
      <se:SvgParameter name="stroke">#000000</se:SvgParameter>
      <se:SvgParameter name="stroke-width">1</se:SvgParameter>
      <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
    </se:Stroke>
      </se:PolygonSymbolizer>
        </se:Rule>
      



      <se:Rule>
          <se:Name>2</se:Name>
          <se:Description>
            <se:Title>Учтен без уточнения границ</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
                <ogc:Literal>Учтен без уточнения границ</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            </ogc:Filter>
        <se:PolygonSymbolizer>
        <se:Fill>
          <se:SvgParameter name="fill">#ffe37c</se:SvgParameter>
        </se:Fill>
      </se:PolygonSymbolizer>
      <se:PolygonSymbolizer>
      <se:Stroke>
      <se:SvgParameter name="stroke">#000000</se:SvgParameter>
      <se:SvgParameter name="stroke-width">1</se:SvgParameter>
      <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
    </se:Stroke>
      </se:PolygonSymbolizer>
    </se:Rule>



    <se:Rule>
          <se:Name>3</se:Name>
          <se:Description>
            <se:Title>Не поставлен на учет</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>status</ogc:PropertyName>
                <ogc:Literal>Не поставлен на учет</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            </ogc:Filter>
        <se:PolygonSymbolizer>
        <se:Fill>
          <se:SvgParameter name="fill">#ffe37c</se:SvgParameter>
        </se:Fill>
      </se:PolygonSymbolizer>
      <se:PolygonSymbolizer>
      <se:Stroke>
      <se:SvgParameter name="stroke">#000000</se:SvgParameter>
      <se:SvgParameter name="stroke-width">1</se:SvgParameter>
      <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
    </se:Stroke>
      </se:PolygonSymbolizer>
    </se:Rule>



 
        
        <se:Rule>
          <se:Name>Default</se:Name>
          <se:Description>
            <se:Title>Не определено</se:Title>
          </se:Description>
          <se:ElseFilter/>
          <se:PolygonSymbolizer>
          <se:Fill>
            <se:SvgParameter name="fill">#ff4f9c</se:SvgParameter>
      
          </se:Fill>
        </se:PolygonSymbolizer>
        <se:PolygonSymbolizer>
        <se:Stroke>
        <se:SvgParameter name="stroke">#000000</se:SvgParameter>
        <se:SvgParameter name="stroke-width">1</se:SvgParameter>
        <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
      </se:Stroke>
        </se:PolygonSymbolizer>
        </se:Rule>


      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>