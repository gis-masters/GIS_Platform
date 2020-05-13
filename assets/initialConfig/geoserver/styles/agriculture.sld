<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0"
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>Предприятия и объекты сельского и лесного хозяйства, рыболовства и рыбоводства</se:Name>
        <UserStyle>
            <se:Name>Agriculture</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>60202020101</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020102</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020103</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020103</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020104</se:Name>
                    <se:Description>
                        <se:Title>Предприятие растениеводства планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020104</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020201</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока существующее
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020202</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020203</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020203</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020204</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению молочного крупного рогатого скота, производство сырого
                            молока планируемое к ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020204</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020301</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы существующее
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020302</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020303</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020303</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020304</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих пород крупного рогатого скота и буйволов,
                            производство спермы планируемое к ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020304</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020401</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных существующее
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020401</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020402</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020402</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020403</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020403</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020404</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению лошадей и прочих животных семейства лошадиных планируемое к
                            ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020404</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020501</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих
                            существующее
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020501</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020502</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемое
                            к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020502</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020503</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемое
                            к реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020503</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020504</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению верблюдов и прочих животных семейства верблюжьих планируемое
                            к ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020504</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020601</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020601</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020602</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020602</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020603</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020603</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020604</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению овец и коз планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020604</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020701</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020701</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020702</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020702</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020703</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020703</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020704</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению свиней планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020704</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020801</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020801</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020802</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020802</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020803</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020803</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020804</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению сельскохозяйственной птицы планируемое к ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020804</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020901</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020901</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020902</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020902</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020903</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020903</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202020904</se:Name>
                    <se:Description>
                        <se:Title>Предприятие пчеловодства планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202020904</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021001</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах существующее
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021001</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021002</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021002</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021003</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021003</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021004</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению кроликов и прочих пушных зверей на фермах планируемое к
                            ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021004</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021101</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021101</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021102</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021102</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021103</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021103</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021104</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению оленей планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021104</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021201</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021201</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021202</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021202</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021203</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021203</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021204</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по разведению прочих животных планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021204</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021301</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных существующее
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021301</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021302</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к размещению
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021302</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021303</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к реконструкции
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021303</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021304</se:Name>
                    <se:Description>
                        <se:Title>Предприятие смешанное - растениеводство в сочетании с животноводством без
                            специализированного производства культур или животных планируемое к ликвидации
                        </se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021304</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021401</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021401</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021402</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021402</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021403</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021403</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021404</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по лесоводству и лесозаготовкам планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021404</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021501</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству существующее</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021501</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021502</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к размещению</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021502</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                            <se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021503</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к реконструкции</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021503</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>60202021504</se:Name>
                    <se:Description>
                        <se:Title>Предприятие по рыболовству и рыбоводству планируемое к ликвидации</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>ruleid</ogc:PropertyName>
                            <ogc:Literal>60202021504</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
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
