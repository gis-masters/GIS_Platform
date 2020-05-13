<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
  <NamedLayer>
    <se:Name>Распределительные трубопроводы для транспортировки газа</se:Name>
    <UserStyle>
      <se:Name>GasPipeline</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60204060101</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный высокого давления существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060101</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#8400a8</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>8</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">21</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060102</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный высокого давления планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060102</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#8400a8</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>8</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">21</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060103</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный высокого давления планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060103</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#8400a8</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                  <se:Size>8</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">28</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060201</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный среднего давления существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060201</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>6</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060202</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный среднего давления планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060202</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>6</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060203</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный среднего давления планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060203</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">1</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>6</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">27</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060301</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный низкого давления существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060301</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060302</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный низкого давления планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060302</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060303</se:Name>
          <se:Description>
            <se:Title>Газопровод распределительный низкого давления планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060303</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#8400a8</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">27</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060401</se:Name>
          <se:Description>
            <se:Title>Газопровод промысловый (газопровод подключения) существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060401</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#397d7c</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#397d7c</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060402</se:Name>
          <se:Description>
            <se:Title>Газопровод промысловый (газопровод подключения) планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060402</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#397d7c</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#397d7c</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060403</se:Name>
          <se:Description>
            <se:Title>Газопровод промысловый (газопровод подключения) планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060403</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#397d7c</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#397d7c</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">27</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060501</se:Name>
          <se:Description>
            <se:Title>Газопровод соединительный (газопровод-перемычка) существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060501</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060502</se:Name>
          <se:Description>
            <se:Title>Газопровод соединительный (газопровод-перемычка) планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060502</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060503</se:Name>
          <se:Description>
            <se:Title>Газопровод соединительный (газопровод-перемычка) планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060503</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#000000</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">27</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060601</se:Name>
          <se:Description>
            <se:Title>Конденсато-продукто-этанолопровод существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060601</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#267300</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#267300</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060602</se:Name>
          <se:Description>
            <se:Title>Конденсато-продукто-этанолопровод планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060602</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#267300</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#267300</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060603</se:Name>
          <se:Description>
            <se:Title>Конденсато-продукто-этанолопровод планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060603</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#267300</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#267300</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">27</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060701</se:Name>
          <se:Description>
            <se:Title>Этиленопровод существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060701</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#990078</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
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
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#990078</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060702</se:Name>
          <se:Description>
            <se:Title>Этиленопровод планируемый к размещению</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060702</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#990078</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">25 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#990078</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">5 55</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">20</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60204060703</se:Name>
          <se:Description>
            <se:Title>Этиленопровод планируемый к реконструкции</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60204060703</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
		  <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#990078</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">18 5 5 5</se:SvgParameter>
            </se:Stroke>
          </se:LineSymbolizer>
          <se:LineSymbolizer>
            <se:Stroke>
              <se:GraphicStroke>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#ffffff</se:SvgParameter>
                    </se:Fill>
                    <se:Stroke>
               			<se:SvgParameter name="stroke">#990078</se:SvgParameter>
               			<se:SvgParameter name="stroke-width">0.7</se:SvgParameter>
             		</se:Stroke>
                  </se:Mark>
                  <se:Size>5</se:Size>
                </se:Graphic>
              </se:GraphicStroke>
              <se:SvgParameter name="stroke-dasharray">6 60</se:SvgParameter>
              <se:SvgParameter name="stroke-dashoffset">27</se:SvgParameter>
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