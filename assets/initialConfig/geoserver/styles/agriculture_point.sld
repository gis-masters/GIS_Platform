<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
                       version="1.1.0"
                       xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>Предприятия и объекты сельского и лесного хозяйства, рыболовства и рыбоводства</se:Name>
        <UserStyle>
            <se:Name>Agriculture</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>60202020111</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства существующее федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020111</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020111.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020112</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к размещению федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020112</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020112.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020113</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020113</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020113.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020114</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к ликвидации федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020114</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020114.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020121</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства существующее регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020121</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020121.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020122</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к размещению регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020122</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020122.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020123</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020123</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020123.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020124</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к ликвидации регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020124</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020124.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020131</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020131</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020131.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020132</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к размещению местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020132</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020132.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020133</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к реконструкции местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020133</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020133.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020134</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к ликвидации местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020134</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020134.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020211</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока существующее федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020211</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020211.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020212</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020212</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020212.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020213</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020213</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020213.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020214</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020214</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020214.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020221</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока существующее регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020221</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020221.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020222</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020222</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020222.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020223</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020223</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020223.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020224</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020224</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020224.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020231</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока существующее местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020231</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020231.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020232</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020232</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020232.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020233</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020233</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020233.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020234</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020234</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020234.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020311</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы существующее федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020311</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020311.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020312</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020312</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020312.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020313</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020313</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020313.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020314</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020314</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020314.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020321</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы существующее регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020321</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020321.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020322</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020322</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020322.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020323</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020323</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020323.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020324</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020324</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020324.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020331</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы существующее местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020331</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020331.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020332</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020332</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020332.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020333</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020333</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020333.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020334</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020334</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020334.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020411</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных существующее
                            федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020411</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020411.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020412</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020412</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020412.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020413</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020413</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020413.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020414</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020414</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020414.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020421</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных существующее
                            регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020421</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020421.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020422</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020422</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020422.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020423</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020423</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020423.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020424</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020424</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020424.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020431</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных существующее
                            местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020431</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020431.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020432</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020432</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020432.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020433</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020433</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020433.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020434</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020434</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020434.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020511</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих
                            существующее федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020511</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020511.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020512</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемое
                            к размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020512</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020512.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020513</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемое
                            к реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020513</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020513.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020514</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемое
                            к ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020514</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020514.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020521</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих
                            существующий регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020521</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020521.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020522</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемый
                            к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020522</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020522.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020523</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемый
                            к реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020523</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020523.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020524</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемый
                            к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020524</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020524.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020531</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих
                            существующий местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020531</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020531.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020532</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемый
                            к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020532</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020532.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020533</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемый
                            к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020533</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020533.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020534</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемый
                            к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020534</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020534.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020611</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз существующее федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020611</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020611.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020612</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020612</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020612.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020613</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к реконструкции федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020613</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020613.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020614</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020614</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020614.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020621</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз существующее регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020621</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020621.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020622</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020622</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020622.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020623</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к реконструкции регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020623</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020623.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020624</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020624</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020624.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020631</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020631</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020631.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020632</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020632</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020632.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020633</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020633</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020633.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020634</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020634</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020634.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020711</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней существующее федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020711</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020711.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020712</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируеме к размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020712</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020712.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020713</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируеме к реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020713</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020713.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020714</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируеме к ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020714</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020714.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020721</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней существующее регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020721</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020721.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020722</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020722</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020722.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020723</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020723</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020723.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020724</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020724</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020724.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020731</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020731</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020731.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020732</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к размещению местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020732</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020732.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020733</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020733</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020733.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020734</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к ликвидации местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020734</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020734.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020811</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы существующее федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020811</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020811.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020812</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к размещению
                            федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020812</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020812.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020813</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к реконструкции
                            федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020813</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020813.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020814</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к ликвидации
                            федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020814</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020814.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020821</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы существующее регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020821</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020821.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020822</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к размещению
                            регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020822</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020822.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020823</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к реконструкции
                            регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020823</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020823.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020824</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к ликвидации
                            регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020824</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020824.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020831</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы существующее местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020831</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020831.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020832</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к размещению местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020832</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020832.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020833</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к реконструкции
                            местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020833</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020833.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020834</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к ликвидации местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020834</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020834.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020911</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства существующее федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020911</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020911.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020912</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое к размещению федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020912</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020912.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020913</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое к реконструкции федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020913</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020913.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020914</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое к ликвидации федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020914</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020914.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020921</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое существующее регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020921</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020921.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020922</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое планируемое к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020922</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020922.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020923</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое планируемое к реконструкции регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020923</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020923.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020924</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое планируемое к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020924</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020924.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020931</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020931</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020931.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020932</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое планируемое к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020932</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020932.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020933</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое планируемое к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020933</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020933.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020934</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое планируемое к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020934</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202020934.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021011</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах существующее
                            федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021011</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021011.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021012</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021012</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021012.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021013</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021013</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021013.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021014</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021014</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021014.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021021</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах существующее
                            регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021021</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021021.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021022</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021022</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021022.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021023</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021023</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021023.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021024</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021024</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021024.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021031</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах существующее
                            местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021031</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021031.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021032</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021032</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021032.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021033</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021033</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021033.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021034</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021034</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021034.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021111</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей существующее федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021111</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021111.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021112</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к размещению федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021112</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021112.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021113</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к реконструкции федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021113</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021113.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021114</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к ликвидации федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021114</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021114.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021121</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей существующее регионального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021121</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021121.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021122</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к размещению регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021122</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021122.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021123</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к реконструкции регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021123</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021123.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021124</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к ликвидации регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021124</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021124.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021131</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021131</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021131.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021132</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к размещению местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021132</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021132.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021133</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к реконструкции местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021133</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021133.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021134</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к ликвидации местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021134</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021134.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021211</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных существующее федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021211</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021211.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021212</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к размещению федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021212</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021212.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021213</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к реконструкции федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021213</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021213.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021214</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к ликвидации федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021214</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021214.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021221</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных существующее регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021221</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021221.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021222</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к размещению регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021222</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021222.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021223</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к реконструкции регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021223</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021223.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021224</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к ликвидации регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021224</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021224.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021231</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021231</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021231.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021232</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021232</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021232.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021233</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к реконструкции местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021233</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021233.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021234</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021234</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021234.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021311</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных существующее федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021311</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021311.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021312</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к размещению федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021312</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021312.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021313</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к реконструкции
                            федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021313</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021313.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021314</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к ликвидации федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021314</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021314.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021321</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных существующее регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021321</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021321.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021322</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к размещению регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021322</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021322.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021323</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к реконструкции
                            регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021323</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021323.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021324</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к ликвидации регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021324</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021324.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021331</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных существующее местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021331</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021331.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021332</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к размещению местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021332</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021332.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021333</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к реконструкции местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021333</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021333.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021334</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к ликвидации местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021334</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021334.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021411</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам существующее федерального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021411</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021411.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021412</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к размещению федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021412</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021412.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021413</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к реконструкции федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021413</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021413.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021414</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к ликвидации федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021414</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021414.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021421</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам существующее регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021421</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021421.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021422</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к размещению регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021422</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021422.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021423</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к реконструкции регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021423</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021423.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021424</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к ликвидации регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021424</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021424.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021431</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021431</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021431.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021432</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к размещению местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021432</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021432.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021433</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к реконструкции местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021433</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021433.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021434</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к ликвидации местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021434</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021434.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021511</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству существующее федерального значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021511</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021511.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021512</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к размещению федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021512</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021512.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021513</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к реконструкции федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021513</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021513.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021514</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к ликвидации федерального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021514</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021514.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021521</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству существующее регионального значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021521</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021521.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021522</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к размещению регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021522</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021522.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021523</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к реконструкции регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021523</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021523.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021524</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к ликвидации регионального
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021524</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021524.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021531</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству существующее местного значения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021531</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021531.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021532</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к размещению местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021532</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021532.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021533</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к реконструкции местного
                            значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021533</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021533.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021534</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к ликвидации местного значения
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021534</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple"
                                                   xlink:href="svg/02_Industry/02_Agriculture/60202021534.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
				<se:Rule>
					<se:Description>
						<se:Title>планируемый к размещению</se:Title>
					</se:Description>
					<ogc:Filter>
						<ogc:PropertyIsLike  wildCard="*" singleChar="." escapeChar="!">
						<ogc:PropertyName>ruleid</ogc:PropertyName>
						<ogc:Literal>*2</ogc:Literal>
						</ogc:PropertyIsLike>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#808080</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.1</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">15 7.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Description>
						<se:Title>Иной объект</se:Title>
					</se:Description>
					<ogc:Filter>
						<ogc:Not>
						<ogc:PropertyIsLike  wildCard="*" singleChar="." escapeChar="!">
						<ogc:PropertyName>ruleid</ogc:PropertyName>
						<ogc:Literal>*2</ogc:Literal>
						</ogc:PropertyIsLike>
						</ogc:Not>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#808080</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.1</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
                <se:Rule>
                    <se:Name>Default</se:Name>
                    <se:Description>
                        <se:Title>Не определено</se:Title>
                    </se:Description>
                    <se:ElseFilter/>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="svg/Else.svg"/>
                                <se:Format>image/svg+xml</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>40</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
            </se:FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>
