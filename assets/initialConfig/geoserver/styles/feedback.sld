<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
                       version="1.1.0" xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>feedback</se:Name>
        <UserStyle>
            <se:Name>feedback</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>62030000001</se:Name>
                    <se:Description>
                        <se:Title>Ожидает</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>status</ogc:PropertyName>
                            <ogc:Literal>62030000001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke">#8a0000</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>2</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#4d0000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>63030000001</se:Name>
                    <se:Description>
                        <se:Title>Выполнено</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>status</ogc:PropertyName>
                            <ogc:Literal>63030000001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke">#A9FDA9</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>2</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>64030000001</se:Name>
                    <se:Description>
                        <se:Title>В работе</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>status</ogc:PropertyName>
                            <ogc:Literal>64030000001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Fill>
                            <se:GraphicFill>
                                <se:Graphic>
                                    <se:Mark>
                                        <se:WellKnownName>shape://slash</se:WellKnownName>
                                        <se:Stroke>
                                            <se:SvgParameter name="stroke">#FFFF00</se:SvgParameter>
                                        </se:Stroke>
                                    </se:Mark>
                                    <se:Size>2</se:Size>
                                </se:Graphic>
                            </se:GraphicFill>
                        </se:Fill>
                    </se:PolygonSymbolizer>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#ff0000</se:SvgParameter>
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