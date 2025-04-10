<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
                       version="1.1.0" xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>Функциональные зоны</se:Name>
        <UserStyle>
            <se:Name>functionalzone_698</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>70101010001</se:Name>
                    <se:Description>
                        <se:Title>Жилые зоны существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff6450</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010002</se:Name>
                    <se:Description>
                        <se:Title>Жилые зоны планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff6450</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010101</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки индивидуальными жилыми домами существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffff32</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010102</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки индивидуальными жилыми домами планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffff32</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010201</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки малоэтажными жилыми домами (до 4 этажей, включая мансардный)
                            существующая
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffaa00</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010202</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки малоэтажными жилыми домами (до 4 этажей, включая мансардный)
                            планируемая к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffaa00</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010301</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки среднеэтажными жилыми домами (от 5 до 8 этажей, включая мансардный)
                            существующая
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff5500</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010302</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки среднеэтажными жилыми домами (от 5 до 8 этажей, включая мансардный)
                            планируемая к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff5500</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010401</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки многоэтажными жилыми домами (9 этажей и более) существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010401</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff3232</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101010402</se:Name>
                    <se:Description>
                        <se:Title>Зона застройки многоэтажными жилыми домами (9 этажей и более) планируемая к
                            размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101010402</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff3232</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101020001</se:Name>
                    <se:Description>
                        <se:Title>Зона смешанной и общественно деловой застройки существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101020001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#c2007b</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101020002</se:Name>
                    <se:Description>
                        <se:Title>Зона смешанной и общественно деловой застройки планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101020002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#c2007b</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030001</se:Name>
                    <se:Description>
                        <se:Title>Общественно-деловые зоны существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff00c5</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030002</se:Name>
                    <se:Description>
                        <se:Title>Общественно-деловые зоны планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ff00c5</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030101</se:Name>
                    <se:Description>
                        <se:Title>Многофункциональная общественно-деловая зона существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#a427a8</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030102</se:Name>
                    <se:Description>
                        <se:Title>Многофункциональная общественно-деловая зона планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#a427a8</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030201</se:Name>
                    <se:Description>
                        <se:Title>Зона специализированной общественной застройки существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ca7af5</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030202</se:Name>
                    <se:Description>
                        <se:Title>Зона специализированной общественной застройки планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ca7af5</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030301</se:Name>
                    <se:Description>
                        <se:Title>Зона исторической застройки существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#700000</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101030302</se:Name>
                    <se:Description>
                        <se:Title>Зона исторической застройки планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101030302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#700000</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040001</se:Name>
                    <se:Description>
                        <se:Title>Производственные зоны, зоны инженерной и транспортной инфраструктур существующие
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#896464</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040002</se:Name>
                    <se:Description>
                        <se:Title>Производственные зоны, зоны инженерной и транспортной инфраструктур планируемые к
                            размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#896464</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040101</se:Name>
                    <se:Description>
                        <se:Title>Производственная зона существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#895a44</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040102</se:Name>
                    <se:Description>
                        <se:Title>Производственная зона планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#895a44</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040201</se:Name>
                    <se:Description>
                        <se:Title>Коммунально-складская зона существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#bd9684</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040202</se:Name>
                    <se:Description>
                        <se:Title>Коммунально-складская зона планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#bd9684</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040301</se:Name>
                    <se:Description>
                        <se:Title>Научно-производственная зона существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#9c9c9c</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040302</se:Name>
                    <se:Description>
                        <se:Title>Научно-производственная зона планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#9c9c9c</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040401</se:Name>
                    <se:Description>
                        <se:Title>Зона инженерной инфраструктуры существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040401</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#636382</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040402</se:Name>
                    <se:Description>
                        <se:Title>Зона инженерной инфраструктуры планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040402</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#636382</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040501</se:Name>
                    <se:Description>
                        <se:Title>Зона транспортной инфраструктуры существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040501</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#006a91</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040502</se:Name>
                    <se:Description>
                        <se:Title>Зона транспортной инфраструктуры планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040502</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#006a91</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>



                <se:Rule>
                    <se:Name>70101040701</se:Name>
                    <se:Description>
                        <se:Title>Зона добычи полезных ископаемых существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040701</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#A17B19</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101040702</se:Name>
                    <se:Description>
                        <se:Title>Зона добычи полезных ископаемых планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101040702</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#A17B19</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>3.8</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>



                <se:Rule>
                    <se:Name>70101050001</se:Name>
                    <se:Description>
                        <se:Title>Зона сельскохозяйственного использования существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffffb6</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050002</se:Name>
                    <se:Description>
                        <se:Title>Зона сельскохозяйственного использования планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#ffffb6</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050101</se:Name>
                    <se:Description>
                        <se:Title>Зона сельскохозяйственных угодий существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d0e0b0</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050102</se:Name>
                    <se:Description>
                        <se:Title>Зона сельскохозяйственных угодий планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d0e0b0</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050201</se:Name>
                    <se:Description>
                        <se:Title>Зона садоводства, огородничества
                            существующая
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#aaff00</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050202</se:Name>
                    <se:Description>
                        <se:Title>Зона садоводства, огородничества
                            планируемая к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#aaff00</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>3.8</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050301</se:Name>
                    <se:Description>
                        <se:Title>Производственная зона сельскохозяйственных предприятий существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#c0c000</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050302</se:Name>
                    <se:Description>
                        <se:Title>Производственная зона сельскохозяйственных предприятий планируемая к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#c0c000</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050401</se:Name>
                    <se:Description>
                        <se:Title>Иные зоны сельскохозяйственного назначения существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050401</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#cdaa66</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101050402</se:Name>
                    <se:Description>
                        <se:Title>Иные зоны сельскохозяйственного назначения планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101050402</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#cdaa66</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060001</se:Name>
                    <se:Description>
                        <se:Title>Зоны рекреационного назначения существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#54958d</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060002</se:Name>
                    <se:Description>
                        <se:Title>Зоны рекреационного назначения планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#54958d</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060101</se:Name>
                    <se:Description>
                        <se:Title>Зона озелененных территорий общего пользования (парки, сады, скверы,
                            бульвары) существующая
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#00ffc5</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060102</se:Name>
                    <se:Description>
                        <se:Title>Зона озелененных территорий общего пользования (парки, сады, скверы,
                            бульвары) планируемая к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#00ffc5</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060201</se:Name>
                    <se:Description>
                        <se:Title>Зона отдыха существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#f57a7a</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060202</se:Name>
                    <se:Description>
                        <se:Title>Зона отдыха планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#f57a7a</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060301</se:Name>
                    <se:Description>
                        <se:Title>Курортная зона существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#1c8fbe</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060302</se:Name>
                    <se:Description>
                        <se:Title>Курортная зона планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#1c8fbe</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060401</se:Name>
                    <se:Description>
                        <se:Title>Лесопарковая зона существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060401</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#00b058</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060402</se:Name>
                    <se:Description>
                        <se:Title>Лесопарковая зона планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060402</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#00b058</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060501</se:Name>
                    <se:Description>
                        <se:Title>Зона лесов существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060501</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#1c8f69</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060502</se:Name>
                    <se:Description>
                        <se:Title>Зона лесов планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060502</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#1c8f69</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060601</se:Name>
                    <se:Description>
                        <se:Title>Иные рекреационные зоны существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060601</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#f4b6b6</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101060602</se:Name>
                    <se:Description>
                        <se:Title>Иные рекреационные зоны планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101060602</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#f4b6b6</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070001</se:Name>
                    <se:Description>
                        <se:Title>Зоны специального назначения существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#abcd66</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070002</se:Name>
                    <se:Description>
                        <se:Title>Зоны специального назначения планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#abcd66</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070101</se:Name>
                    <se:Description>
                        <se:Title>Зона кладбищ существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#305000</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://plus</se:WellKnownName>
                                        <se:Stroke/>
                                    </se:Mark>
                                    <se:Size>8</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                        <se:VendorOption name="random">grid</se:VendorOption>
                        <se:VendorOption name="random-tile-size">50</se:VendorOption>
                        <se:VendorOption name="random-symbol-count">1</se:VendorOption>
                        <se:VendorOption name="random-seed">1</se:VendorOption>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://plus</se:WellKnownName>
                                        <se:Stroke/>
                                    </se:Mark>
                                    <se:Size>7</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                        <se:VendorOption name="random">grid</se:VendorOption>
                        <se:VendorOption name="random-tile-size">50</se:VendorOption>
                        <se:VendorOption name="random-symbol-count">3</se:VendorOption>
                        <se:VendorOption name="random-seed">2</se:VendorOption>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070102</se:Name>
                    <se:Description>
                        <se:Title>Зона кладбищ планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#305000</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://plus</se:WellKnownName>
                                        <se:Stroke/>
                                    </se:Mark>
                                    <se:Size>8</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                        <se:VendorOption name="random">grid</se:VendorOption>
                        <se:VendorOption name="random-tile-size">50</se:VendorOption>
                        <se:VendorOption name="random-symbol-count">1</se:VendorOption>
                        <se:VendorOption name="random-seed">1</se:VendorOption>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://plus</se:WellKnownName>
                                        <se:Stroke/>
                                    </se:Mark>
                                    <se:Size>7</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                        <se:VendorOption name="random">grid</se:VendorOption>
                        <se:VendorOption name="random-tile-size">50</se:VendorOption>
                        <se:VendorOption name="random-symbol-count">3</se:VendorOption>
                        <se:VendorOption name="random-seed">2</se:VendorOption>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070201</se:Name>
                    <se:Description>
                        <se:Title>Зона складирования и захоронения отходов существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#e2c2f4</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070202</se:Name>
                    <se:Description>
                        <se:Title>Зона складирования и захоронения отходов планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#e2c2f4</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070301</se:Name>
                    <se:Description>
                        <se:Title>Зона озелененных территорий специального назначения существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#69b366</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101070302</se:Name>
                    <se:Description>
                        <se:Title>Зона озелененных территорий специального назначения планируемая к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101070302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#69b366</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101080001</se:Name>
                    <se:Description>
                        <se:Title>Зона режимных территорий существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101080001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d0d0ff</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101080002</se:Name>
                    <se:Description>
                        <se:Title>Зона режимных территорий планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101080002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d0d0ff</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101090001</se:Name>
                    <se:Description>
                        <se:Title>Зона акваторий существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101090001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d0f8fd</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101090002</se:Name>
                    <se:Description>
                        <se:Title>Зона акваторий планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101090002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#d0f8fd</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101100001</se:Name>
                    <se:Description>
                        <se:Title>Иные зоны существующие</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101100001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#8cedba</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.15</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101100002</se:Name>
                    <se:Description>
                        <se:Title>Иные зоны планируемые к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101100002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#8cedba</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke-width">0.15</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>5</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                </se:Rule>


                <se:Rule>
                    <se:Name>70101200101</se:Name>
                    <se:Description>
                        <se:Title>Зона виноградников существующая</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101200101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#EDF858</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>70101200102</se:Name>
                    <se:Description>
                        <se:Title>Зона виноградников планируемая к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>70101200102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:SvgParameter name="fill">#EDF858</se:SvgParameter>
                        </se:Fill>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>3.8</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
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
</StyledLayerDescriptor>
