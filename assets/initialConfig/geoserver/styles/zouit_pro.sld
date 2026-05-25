<<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0">
  <NamedLayer>
    <se:Name>zouit_pro</se:Name>
    <UserStyle>
      <se:Name>zouit_pro</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Зоны с особыми условиями использования территории</se:Name>
          <se:Description>
            <se:Title>Зоны с особыми условиями использования территории</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зоны с особыми условиями использования территории</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#c3c2e7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#6767c3</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Район падения отделяющихся частей ракет</se:Name>
          <se:Description>
            <se:Title>Район падения отделяющихся частей ракет</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Район падения отделяющихся частей ракет</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ffb7b7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.7</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff4949</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Прочие зоны с особыми условиями использования территории</se:Name>
          <se:Description>
            <se:Title>Прочие зоны с особыми условиями использования территории</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Прочие зоны с особыми условиями использования территории</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#6bceff</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#b7e7ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона публичного сервитута</se:Name>
          <se:Description>
            <se:Title>Зона публичного сервитута</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона публичного сервитута</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#e0b7ff</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#b756ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона резервирования земель</se:Name>
          <se:Description>
            <se:Title>Зона резервирования земель</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона резервирования земель</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ced9ce</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.4</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#839f83</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Особая экономическая зона</se:Name>
          <se:Description>
            <se:Title>Особая экономическая зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Особая экономическая зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f8f7b5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.7</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#eae82c</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Иные зоны с особыми условиями использования территории</se:Name>
          <se:Description>
            <se:Title>Иные зоны с особыми условиями использования территории</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Иные зоны с особыми условиями использования территории</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b7e7ff</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#58c8ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Иная зона с особыми условиями использования территории</se:Name>
          <se:Description>
            <se:Title>Иная зона с особыми условиями использования территории</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Иная зона с особыми условиями использования территории</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b7e7ff</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#58c8ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зоны охраны природных объектов</se:Name>
          <se:Description>
            <se:Title>Зоны охраны природных объектов</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зоны охраны природных объектов</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#bdd7c0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#4c9154</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Водоохранная зона</se:Name>
          <se:Description>
            <se:Title>Водоохранная зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Водоохранная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b2e7fa</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#31bff0</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Прибрежная защитная полоса</se:Name>
          <se:Description>
            <se:Title>Прибрежная защитная полоса</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Прибрежная защитная полоса</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f1dbb4</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#e2b665</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона санитарной охраны источников водоснабжения и водопроводов питьевого назначения</se:Name>
          <se:Description>
            <se:Title>Зона санитарной охраны источников водоснабжения и водопроводов питьевого назначения</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона санитарной охраны источников водоснабжения и водопроводов питьевого назначения</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b2c4f6</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#2f60e7</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Особо ценные земли</se:Name>
          <se:Description>
            <se:Title>Особо ценные земли</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Особо ценные земли</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#debdfc</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#a64bf7</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Загрязненные земли</se:Name>
          <se:Description>
            <se:Title>Загрязненные земли</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Загрязненные земли</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#d7c4c4</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#a37676</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона охраняемого объекта</se:Name>
          <se:Description>
            <se:Title>Зона охраняемого объекта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона охраняемого объекта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#00BFFF</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.4</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#a37676</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона загрязненных земель</se:Name>
          <se:Description>
            <se:Title>Охранная зона загрязненных земель</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона загрязненных земель</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#eabbbb</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ce6060</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Горный отвод</se:Name>
          <se:Description>
            <se:Title>Горный отвод</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Горный отвод</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ddb5cc</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#b05289</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зеленая зона</se:Name>
          <se:Description>
            <se:Title>Зеленая зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зеленая зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b2e7bd</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#4cc666</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Территория традиционного природопользования</se:Name>
          <se:Description>
            <se:Title>Территория традиционного природопользования</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Территория традиционного природопользования</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#c8dfcd</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#7eb48a</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона геодезического пункта</se:Name>
          <se:Description>
            <se:Title>Охранная зона геодезического пункта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона геодезического пункта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#fce3b6</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#f7bd54</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона стационарного пункта наблюдений за состоянием окружающей природной среды</se:Name>
          <se:Description>
            <se:Title>Охранная зона стационарного пункта наблюдений за состоянием окружающей природной среды</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона стационарного пункта наблюдений за состоянием окружающей природной среды</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#cceac5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#89ce78</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона транспорта</se:Name>
          <se:Description>
            <se:Title>Охранная зона транспорта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона транспорта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#efbfbf</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#da6a6a</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона инженерных коммуникаций</se:Name>
          <se:Description>
            <se:Title>Охранная зона инженерных коммуникаций</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона инженерных коммуникаций</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#bbc4f1</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#6177de</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Приаэродромная территория</se:Name>
          <se:Description>
            <se:Title>Приаэродромная территория</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Приаэродромная территория</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#B0E0E6</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона линий и сооружений связи и линий и сооружений радиофикации</se:Name>
          <se:Description>
            <se:Title>Охранная зона линий и сооружений связи и линий и сооружений радиофикации</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона линий и сооружений связи и линий и сооружений радиофикации</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f8cdb8</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ee8a5a</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Придорожная полоса</se:Name>
          <se:Description>
            <se:Title>Придорожная полоса</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Придорожная полоса</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#dcd6d2</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#c9bfb9</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зоны защиты населения</se:Name>
          <se:Description>
            <se:Title>Зоны защиты населения</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зоны защиты населения</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#eaebfa</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#cdd1f3</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона ограничения от передающего радиотехнического объекта</se:Name>
          <se:Description>
            <se:Title>Зона ограничения от передающего радиотехнического объекта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона ограничения от передающего радиотехнического объекта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f1eabb</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#dece60</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зоны охраны искусственных объектов</se:Name>
          <se:Description>
            <se:Title>Зоны охраны искусственных объектов</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зоны охраны искусственных объектов</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#e0e0e0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#b7b7b7</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Запретная зона при военном складе</se:Name>
          <se:Description>
            <se:Title>Запретная зона при военном складе</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Запретная зона при военном складе</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f3b2b2</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#dd2f2f</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Запретный район при военном складе</se:Name>
          <se:Description>
            <se:Title>Запретный район при военном складе</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Запретный район при военном складе</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#fccfcf</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#f68989</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Санитарно-защитная зона предприятий сооружений и иных объектов</se:Name>
          <se:Description>
            <se:Title>Санитарно-защитная зона предприятий, сооружений и иных объектов</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Санитарно-защитная зона предприятий, сооружений и иных объектов</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b2caf1</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ff0f0f</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">4 2</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Санитарный разрыв (санитарная полоса отчуждения)</se:Name>
          <se:Description>
            <se:Title>Санитарный разрыв (санитарная полоса отчуждения)</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Санитарный разрыв (санитарная полоса отчуждения)</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b2bed2</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#3d5b8e</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Пригородная зона</se:Name>
          <se:Description>
            <se:Title>Пригородная зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Пригородная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#fbdab7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#f49a3c</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Пограничная зона</se:Name>
          <se:Description>
            <se:Title>Пограничная зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Пограничная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f2fab4</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#dbf134</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Территория особо охраняемого природного объекта</se:Name>
          <se:Description>
            <se:Title>Территория особо охраняемого природного объекта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Территория особо охраняемого природного объекта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b9dab8</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#429b40</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона особо охраняемого природного объекта</se:Name>
          <se:Description>
            <se:Title>Охранная зона особо охраняемого природного объекта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона особо охраняемого природного объекта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#d9f2d9</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8ed78d</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Территория объекта культурного наследия</se:Name>
          <se:Description>
            <se:Title>Территория объекта культурного наследия</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Территория объекта культурного наследия</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#dae2e7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#446e89</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона охраны объекта культурного наследия</se:Name>
          <se:Description>
            <se:Title>Зона охраны объекта культурного наследия</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона охраны объекта культурного наследия</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#dae7f8</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8db6e8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Придорожные полосы автомобильных дорог</se:Name>
          <se:Description>
            <se:Title>Придорожные полосы автомобильных дорог</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Придорожные полосы автомобильных дорог</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#E2E0B5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#9B9652</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Граница зоны с особыми условиями использования территории</se:Name>
          <se:Description>
            <se:Title>Граница зоны с особыми условиями использования территории</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>boundary_1</ogc:PropertyName>
              <ogc:Literal>Граница зоны с особыми условиями использования территории</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#1B8C6C</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Граница территории объекта культурного наследия</se:Name>
          <se:Description>
            <se:Title>Граница территории объекта культурного наследия</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>boundary_1</ogc:PropertyName>
              <ogc:Literal>Граница территории объекта культурного наследия</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#6A0DAD</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона с особыми условиями использования территории</se:Name>
          <se:Description>
            <se:Title>Зона с особыми условиями использования территории</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>boundary_1</ogc:PropertyName>
                <ogc:Literal>Зона с особыми условиями использования территории</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:Or>
                <ogc:PropertyIsNull>
                  <ogc:PropertyName>zonetype</ogc:PropertyName>
                </ogc:PropertyIsNull>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>zonetype</ogc:PropertyName>
                  <ogc:Literal/>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
            </ogc:And>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#F8BBD0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#C2185B</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Территория объекта культурного наследия</se:Name>
          <se:Description>
            <se:Title>Территория объекта культурного наследия</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>boundary_1</ogc:PropertyName>
              <ogc:Literal>Территория объекта культурного наследия</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#dae2e7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#446e89</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона санитарной охраны источников питьевого и хозяйственно-бытового водоснабжения</se:Name>
          <se:Description>
            <se:Title>Зона санитарной охраны источников питьевого и хозяйственно-бытового водоснабжения</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона санитарной охраны источников питьевого и хозяйственно-бытового водоснабжения, а также устанавливаемые в случаях, предусмотренных Водным кодексом Российской Федерации, в отношении подземных водных объектов зоны специальной охраны</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#C9DAF0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#6B85A3</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зоны затопления и подтопления</se:Name>
          <se:Description>
            <se:Title>Зоны затопления и подтопления</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зоны затопления и подтопления</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#FAD0BC</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#C46A48</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона стационарных пунктов наблюдений за состоянием окружающей среды</se:Name>
          <se:Description>
            <se:Title>Охранная зона стационарных пунктов наблюдений за состоянием окружающей среды</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона стационарных пунктов наблюдений за состоянием окружающей среды, ее загрязнением</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#cceac5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#89ce78</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона трубопроводов</se:Name>
          <se:Description>
            <se:Title>Охранная зона трубопроводов</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона трубопроводов (газопроводов, нефтепроводов и нефтепродуктопроводов, аммиакопроводов)</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#E09A7A</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#A85030</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зоны охраны объектов культурного наследия</se:Name>
          <se:Description>
            <se:Title>Зоны охраны объектов культурного наследия</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зоны охраны объектов культурного наследия</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#dae7f8</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#8db6e8</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Иная зона</se:Name>
          <se:Description>
            <se:Title>Иная зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Иная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#b7e7ff</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#1fb6ff</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона объектов электроэнергетики</se:Name>
          <se:Description>
            <se:Title>Охранная зона объектов электроэнергетики</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона объектов электроэнергетики (объектов электросетевого хозяйства и объектов по производству электрической энергии)</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#F2E8D5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#B8A99A</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона линий и сооружений связи</se:Name>
          <se:Description>
            <se:Title>Охранная зона линий и сооружений связи</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона линий и сооружений связи</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#EBE0C5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#B8A46B</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона пунктов государственной геодезической сети</se:Name>
          <se:Description>
            <se:Title>Охранная зона пунктов государственной геодезической сети</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона пунктов государственной геодезической сети, государственной нивелирной сети и государственной гравиметрической сети</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#F0C4C8</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#BC6068</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Санитарно-защитная зона</se:Name>
          <se:Description>
            <se:Title>Санитарно-защитная зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Санитарно-защитная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#C7D9C5</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#6D8263</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона охраняемого природного ландшафта</se:Name>
          <se:Description>
            <se:Title>Зона охраняемого природного ландшафта</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона охраняемого природного ландшафта</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#efe5dc</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ccae92</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Зона регулирования застройки и хозяйственной деятельности</se:Name>
          <se:Description>
            <se:Title>Зона регулирования застройки и хозяйственной деятельности</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Зона регулирования застройки и хозяйственной деятельности</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#d8d5d3</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#877d75</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>Охранная зона</se:Name>
          <se:Description>
            <se:Title>Охранная зона</se:Title>
          </se:Description>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>zonetype</ogc:PropertyName>
              <ogc:Literal>Охранная зона</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#ffe0b7</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0.6</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffa01f</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
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
              <se:SvgParameter name="fill">#ff55ff</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>>