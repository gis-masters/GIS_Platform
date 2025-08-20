<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se">
	<NamedLayer>
		<se:Name>Территория муниципального образования</se:Name>
		<UserStyle>
			<se:Name>AdmeMO_123</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>60102030101</se:Name>
					<se:Description>
						<se:Title>Муниципальный район существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030101</ogc:Literal>
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
					<se:Name>60102030102</se:Name>
					<se:Description>
						<se:Title>Муниципальный район планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030102</ogc:Literal>
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
					<se:Name>60102030201</se:Name>
					<se:Description>
						<se:Title>Городской округ существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030201</ogc:Literal>
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
					<se:Name>60102030202</se:Name>
					<se:Description>
						<se:Title>Городской округ планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030202</ogc:Literal>
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
					<se:Name>60102030801</se:Name>
					<se:Description>
						<se:Title>Муниципальный округ существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030801</ogc:Literal>
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
					<se:Name>60102030802</se:Name>
					<se:Description>
						<se:Title>Муниципальный округ планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030802</ogc:Literal>
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
					<se:Name>60102030901</se:Name>
					<se:Description>
						<se:Title>Территория агломерации существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030901</ogc:Literal>
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
					<se:Name>60102030902</se:Name>
					<se:Description>
						<se:Title>Территория агломерации планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030902</ogc:Literal>
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
					<se:Name>60102031001</se:Name>
					<se:Description>
						<se:Title>Межселенная территория существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102031001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#dd7195</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60102031002</se:Name>
					<se:Description>
						<se:Title>Межселенная территория планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102031002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#dd7195</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://backslash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#645d9a</se:SvgParameter>
											<se:SvgParameter name="stroke-width">4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15.5</se:Size>
								</se:Graphic>
							</se:GraphicFill>
							<se:SvgParameter name="fill">#dd7195</se:SvgParameter>
						</se:Fill>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3d5c9b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">28 7</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60102031101</se:Name>
					<se:Description>
						<se:Title>Федеральная территория существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102031101</ogc:Literal>
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
					<se:Name>60102031102</se:Name>
					<se:Description>
						<se:Title>Федеральная территория планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102031102</ogc:Literal>
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
					<se:Name>60102030301</se:Name>
					<se:Description>
						<se:Title>Городской округ с внутригородским делением существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030301</ogc:Literal>
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
					<se:Name>60102030302</se:Name>
					<se:Description>
						<se:Title>Городской округ с внутригородским делением планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030302</ogc:Literal>
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
					<se:Name>60102030401</se:Name>
					<se:Description>
						<se:Title>Внутригородская территория (внутригородское муниципальное образование) города федерального значения существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030401</ogc:Literal>
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
					<se:Name>60102030402</se:Name>
					<se:Description>
						<se:Title>Внутригородская территория (внутригородское муниципальное образование) города федерального значения планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030402</ogc:Literal>
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
					<se:Name>60102030501</se:Name>
					<se:Description>
						<se:Title>Внутригородской район существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030501</ogc:Literal>
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
					<se:Name>60102030502</se:Name>
					<se:Description>
						<se:Title>Внутригородской район планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030502</ogc:Literal>
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
					<se:Name>60102030601</se:Name>
					<se:Description>
						<se:Title>Городское поселение существующее</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030601</ogc:Literal>
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
					<se:Name>60102030602</se:Name>
					<se:Description>
						<se:Title>Городское поселение планируемое</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030602</ogc:Literal>
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
					<se:Name>60102030701</se:Name>
					<se:Description>
						<se:Title>Сельское поселение существующее</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030701</ogc:Literal>
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
					<se:Name>60102030702</se:Name>
					<se:Description>
						<se:Title>Сельское поселение планируемое</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60102030702</ogc:Literal>
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