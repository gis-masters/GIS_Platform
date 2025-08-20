<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
                       xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" 
                       xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Геодезические пункты</se:Name>
    <UserStyle>
      <se:Name>Geodetic network</se:Name>
      <se:FeatureTypeStyle>	
        <se:Rule>
          <se:Name>006-000-P</se:Name>
          <se:Description>
            <se:Title>Астрономический пункт</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>006-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/astronomicheskiy_punkt.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>006-000-P</se:Name>
          <se:Description>
            <se:Title>Астрономический пункт</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>006-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/astronomicheskiy_punkt.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>006-000-P</se:Name>
          <se:Description>
            <se:Title>Астрономический пункт</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>006-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/astronomicheskiy_punkt.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>006-000-P</se:Name>
          <se:Description>
            <se:Title>Астрономический пункт</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>006-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/astronomicheskiy_punkt.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>006-000-P</se:Name>
          <se:Description>
            <se:Title>Астрономический пункт</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>006-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/astronomicheskiy_punkt.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>001-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт г.г.с.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>001-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_ggs.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>001-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт г.г.с.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>001-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_ggs.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>001-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт г.г.с.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>001-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_ggs.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>001-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт г.г.с.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>001-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_ggs.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>001-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт г.г.с.</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>001-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_ggs.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>005-100-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети долговрем</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_dolgovremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-100-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети долговрем</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_dolgovremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-100-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети долговрем</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_dolgovremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-100-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети долговрем</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_dolgovremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-100-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети долговрем</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_dolgovremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>011-100-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР фундаментальный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_fundamentalniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-100-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР фундаментальный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_fundamentalniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-100-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР фундаментальный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_fundamentalniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-100-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР фундаментальный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_fundamentalniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-100-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР фундаментальный</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-100-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_fundamentalniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>003-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт геодезических сетей</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>003-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_geod_setey.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>003-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт геодезических сетей</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>003-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_geod_setey.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>003-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт геодезических сетей</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>003-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_geod_setey.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>003-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт геодезических сетей</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>003-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_geod_setey.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>003-000-P</se:Name>
          <se:Description>
            <se:Title>Пункт геодезических сетей</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>003-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/punkt_geod_setey.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>


        <se:Rule>
          <se:Name>005-200-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети временная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_vremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-200-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети временная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_vremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-200-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети временная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_vremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-200-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети временная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_vremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>005-200-P</se:Name>
          <se:Description>
            <se:Title>Точка плановой сети временная</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>005-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/tochka_planovoi_seti_vremennaya.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

        <se:Rule>
          <se:Name>008-000-P</se:Name>
          <se:Description>
            <se:Title>Знак межевой граничный столб</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>008-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/znak_mezhevoi_granichniy_stolb.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>008-000-P</se:Name>
          <se:Description>
            <se:Title>Знак межевой граничный столб</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>008-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/znak_mezhevoi_granichniy_stolb.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>008-000-P</se:Name>
          <se:Description>
            <se:Title>Знак межевой граничный столб</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>008-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/znak_mezhevoi_granichniy_stolb.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>008-000-P</se:Name>
          <se:Description>
            <se:Title>Знак межевой граничный столб</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>008-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/znak_mezhevoi_granichniy_stolb.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>008-000-P</se:Name>
          <se:Description>
            <se:Title>Знак межевой граничный столб</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>008-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/znak_mezhevoi_granichniy_stolb.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>011-200-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР грунтовый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_gruntoviy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-200-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР грунтовый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_gruntoviy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-200-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР грунтовый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_gruntoviy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-200-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР грунтовый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_gruntoviy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-200-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР грунтовый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-200-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_gruntoviy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>011-300-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР координированный    </se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-300-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_koordinirovanniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-300-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР координированный    </se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-300-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_koordinirovanniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-300-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР координированный    </se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-300-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_koordinirovanniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-300-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР координированный    </se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-300-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_koordinirovanniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>011-300-P</se:Name>
          <se:Description>
            <se:Title>РЕПЕР координированный    </se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>011-300-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/reper_koordinirovanniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        
        <se:Rule>
          <se:Name>012-000-P</se:Name>
          <se:Description>
            <se:Title>ПЕРЕСЕЧЕНИЕ КООРДИНАТНЫХ ЛИНИЙ</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>012-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>0</se:MinScaleDenominator>
          <se:MaxScaleDenominator>500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/peresechenie_koordinatnih_liniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>30</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>012-000-P</se:Name>
          <se:Description>
            <se:Title>ПЕРЕСЕЧЕНИЕ КООРДИНАТНЫХ ЛИНИЙ</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>012-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/peresechenie_koordinatnih_liniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>25</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>012-000-P</se:Name>
          <se:Description>
            <se:Title>ПЕРЕСЕЧЕНИЕ КООРДИНАТНЫХ ЛИНИЙ</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>012-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>1500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/peresechenie_koordinatnih_liniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>20</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>012-000-P</se:Name>
          <se:Description>
            <se:Title>ПЕРЕСЕЧЕНИЕ КООРДИНАТНЫХ ЛИНИЙ</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>012-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>1501</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/peresechenie_koordinatnih_liniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>012-000-P</se:Name>
          <se:Description>
            <se:Title>ПЕРЕСЕЧЕНИЕ КООРДИНАТНЫХ ЛИНИЙ</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>code</ogc:PropertyName>
              <ogc:Literal>012-000-P</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:MinScaleDenominator>2001</se:MinScaleDenominator>
          <se:MaxScaleDenominator>2500</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:ExternalGraphic xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink">
                <se:OnlineResource xlink:type="simple" xlink:href="icons/peresechenie_koordinatnih_liniy.png" />
                <se:Format>image/png</se:Format>
              </se:ExternalGraphic>
              <se:Size>5</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>

      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>