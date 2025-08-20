<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" 
xmlns:se="http://www.opengis.net/se">
	<NamedLayer>
		<se:Name>advertising_point</se:Name>
		<UserStyle>
			<se:Name>advertising_point</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>510000001</se:Name>
					<se:Description>
						<se:Title>Модульная малая двухсторонняя</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/modul_mal_dvuhstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000002</se:Name>
					<se:Description>
						<se:Title>Модульная малая односторонняя</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/modul_mal_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000003</se:Name>
					<se:Description>
						<se:Title>Отдельно стоящий короб</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000003</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/otd_stoy_korob.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000004</se:Name>
					<se:Description>
						<se:Title>Панель-кронштейн на здании</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000004</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/panelkronshtein_na_zdanii.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000005</se:Name>
					<se:Description>
						<se:Title>Панель-кронштейн на опоре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000005</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/panelkronshtein_na_opore.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000006</se:Name>
					<se:Description>
						<se:Title>Панель-кронштейн на опоре односторонний</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000006</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/panelkronshtein_na_opore_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000007</se:Name>
					<se:Description>
						<se:Title>Светодиоидный V-образный экран</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000007</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/svetodiod_V_obr.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000008</se:Name>
					<se:Description>
						<se:Title>Светодиоидный односторонний экран</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000008</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/svetodiod_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000009</se:Name>
					<se:Description>
						<se:Title>Светодиоидная опора в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000009</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/svetodiod_opora_v_centre.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000010</se:Name>
					<se:Description>
						<se:Title>Светодиоидный трехсторонний экран</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000010</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/svetodiod_trehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000011</se:Name>
					<se:Description>
						<se:Title>Светодиоидный четырехсторонний экран</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000011</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/svetodiod_chetirehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000012</se:Name>
					<se:Description>
						<se:Title>Стелла, пилон</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000012</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/stella_pilon.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000013</se:Name>
					<se:Description>
						<se:Title>Стелла односторонняя, пилон</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000013</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/stella_pilon_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000014</se:Name>
					<se:Description>
						<se:Title>Уличный рекламный указатель</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000014</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/ulichn_rekl_ukazatel.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000015</se:Name>
					<se:Description>
						<se:Title>Флаг</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000015</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/flag.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000016</se:Name>
					<se:Description>
						<se:Title>Щитовая опора большого формата V-образная</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000016</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_V_obraznaya.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000017</se:Name>
					<se:Description>
						<se:Title>Щитовая опора большого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000017</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_opora_v_centre.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000018</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора большого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000018</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_opora_v_centre_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000019</se:Name>
					<se:Description>
						<se:Title>Щитовая опора большого формата сбоку</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000019</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_opora_sboku.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000020</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора большого формата сбоку</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000020</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_opora_sboku_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000022</se:Name>
					<se:Description>
						<se:Title>Щитовая опора большого формата сбоку 2</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000022</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_opora_sboku2.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000023</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора большого формата сбоку 2</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000023</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_opora_sboku2_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000024</se:Name>
					<se:Description>
						<se:Title>Щитовая трехсторонняя опора большого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000024</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_trehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000025</se:Name>
					<se:Description>
						<se:Title>Щитовая четырехсторонняя опора большого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000025</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_bolshaya_chetirehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000026</se:Name>
					<se:Description>
						<se:Title>Щитовая опора малого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000026</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000027</se:Name>
					<se:Description>
						<se:Title>Щитовая V- образная опора малого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000027</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_V_obraz.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000028</se:Name>
					<se:Description>
						<se:Title>Щитовая опора малого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000028</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_opora_v_centre.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000029</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора малого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000029</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_opora_v_centre_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000030</se:Name>
					<se:Description>
						<se:Title>Щитовая трехсторонняя опора малого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000030</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_trehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000031</se:Name>
					<se:Description>
						<se:Title>Щитовая трехсторонняя опора малого формата 2</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000031</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_trehstoron2.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000032</se:Name>
					<se:Description>
						<se:Title>Щитовая четырехсторонняя опора малого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000032</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_chetirehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000033</se:Name>
					<se:Description>
						<se:Title>Щитовая трехсторонняя опора малого формата на ножке</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000033</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_malaya_chetirehstoron_na_nozhke.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000034</se:Name>
					<se:Description>
						<se:Title>Щитовая V- образная опора сверхбольшого формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000034</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sverhbolshaya_V_obraznaya.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000035</se:Name>
					<se:Description>
						<se:Title>Щитовая опора сверхбольшого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000035</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sverhbolshaya_opora_v_centre.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000036</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора сверхбольшого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000036</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sverhbolshaya_opora_v_centre_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000037</se:Name>
					<se:Description>
						<se:Title>Щитовая трехсторонняя опора сверхбольшого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000037</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sverhbolshaya_opora_trehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000038</se:Name>
					<se:Description>
						<se:Title>Щитовая четырехсторонняя опора сверхбольшого формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000038</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sverhbolshaya_opora_chetirehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000039</se:Name>
					<se:Description>
						<se:Title>Щитовая V- образная опора среднего формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000039</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_V_obraz.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000040</se:Name>
					<se:Description>
						<se:Title>Щитовая опора среднего формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000040</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_opora_v_centre.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000041</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора среднего формата в центре</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000041</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_opora_v_centre_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000042</se:Name>
					<se:Description>
						<se:Title>Щитовая опора среднего формата сбоку</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000042</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_opora_sboku.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
                	<se:Rule>
					<se:Name>510000043</se:Name>
					<se:Description>
						<se:Title>Щитовая односторонняя опора среднего формата сбоку</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000043</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_opora_sboku_odnostoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000044</se:Name>
					<se:Description>
						<se:Title>Щитовая трехсторонняя опора среднего формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000044</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_trehstoron.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>50</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>510000045</se:Name>
					<se:Description>
						<se:Title>Щитовая четырехсторонняя опора среднего формата</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>510000045</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/advertising/schitovaya_sred_chetirehstoron.png" />
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
								<se:OnlineResource xlink:type="simple" xlink:href="svg/Else.svg" />
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