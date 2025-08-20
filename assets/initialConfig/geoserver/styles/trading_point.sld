<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                       xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
                       version="1.1.0"
                       xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>trading_point</se:Name>
        <UserStyle>
            <se:Name>trading_point</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>311310000</se:Name>
                    <se:Description>
                        <se:Title>Кондитерские изделия</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311310000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/sweeties.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311320000</se:Name>
                    <se:Description>
                        <se:Title>Сельскохозяйственная продукция</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311320000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/agriproduct.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311330000</se:Name>
                    <se:Description>
                        <se:Title>Яйцо</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311330000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/eggs.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311340000</se:Name>
                    <se:Description>
                        <se:Title>Продовольственные товары</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311340000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/foodstuffs.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311350000</se:Name>
                    <se:Description>
                        <se:Title>Колбасные изделия</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311350000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/wurst.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311360000</se:Name>
                    <se:Description>
                        <se:Title>Хлебобулочные изделия</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311360000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/bakery.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311370000</se:Name>
                    <se:Description>
                        <se:Title>Горячие напитки со спец. аппарата</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311370000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/hot_drinks.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311380000</se:Name>
                    <se:Description>
                        <se:Title>Напитки, мороженое</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311380000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/drinks_ice_cream.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311390000</se:Name>
                    <se:Description>
                        <se:Title>Квас</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311390000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/quass.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311400000</se:Name>
                    <se:Description>
                        <se:Title>Квас, мороженое</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311400000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/quass_ice_cream.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311410000</se:Name>
                    <se:Description>
                        <se:Title>Живая рыба</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311410000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/fish.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311420000</se:Name>
                    <se:Description>
                        <se:Title>Мед и продукция пчеловодства</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311420000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/honey.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311430000</se:Name>
                    <se:Description>
                        <se:Title>Бахчевые культуры</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311430000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/melons.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311440000</se:Name>
                    <se:Description>
                        <se:Title>Живые цветы</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311440000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/flowers.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311450000</se:Name>
                    <se:Description>
                        <se:Title>Хвойные насаждения</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311450000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/conifers.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311460000</se:Name>
                    <se:Description>
                        <se:Title>Хлебобулочные и кондитерские изделия</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311460000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/bread_sweeties.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311470000</se:Name>
                    <se:Description>
                        <se:Title>Молочная продукция</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311470000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/milk.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311480000</se:Name>
                    <se:Description>
                        <se:Title>Общественный туалет</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311480000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/wc.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311490000</se:Name>
                    <se:Description>
                        <se:Title>Общественное питание</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311490000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/food_services.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311500000</se:Name>
                    <se:Description>
                        <se:Title>Питьевая вода</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311500000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/water.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311510000</se:Name>
                    <se:Description>
                        <se:Title>Иные нестационарные объекты</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311510000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/other.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311520000</se:Name>
                    <se:Description>
                        <se:Title>Непродовольственные товары</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311520000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/nonfood.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311530000</se:Name>
                    <se:Description>
                        <se:Title>Бытовые услуги</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311530000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/social.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311550000</se:Name>
                    <se:Description>
                        <se:Title>Автосервис</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311550000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/car_service.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
                <se:Rule>
                    <se:Name>311560000</se:Name>
                    <se:Description>
                        <se:Title>Лекарственные средства</se:Title>
                    </se:Description>
                    <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>classid</ogc:PropertyName>
                            <ogc:Literal>311560000</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:ExternalGraphic>
                                <se:OnlineResource xlink:type="simple" xlink:href="otherIcons/trading/pharma_drugs.png"/>
                                <se:Format>image/png</se:Format>
                            </se:ExternalGraphic>
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
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
                            <se:Size>50</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
            </se:FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor>