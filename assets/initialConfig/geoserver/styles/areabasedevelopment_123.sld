<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0"
	xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>Комплексное развитие территорий</se:Name>
		<UserStyle>
			<se:Name>AreaBaseDevelopment_123</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>70402010002</se:Name>
					<se:Description>
						<se:Title>Территория комплексного развития, включая территории, подлежащие комплексному освоению, в том числе в целях строительства стандартного жилья, территории размещения земельных участков, подлежащих предоставлению многодетным семьям планируемая к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70402010002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0000ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>square</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
						<se:VendorOption name="random">grid</se:VendorOption>
						<se:VendorOption name="random-tile-size">20</se:VendorOption>
						<se:VendorOption name="random-symbol-count">1</se:VendorOption>
						<se:VendorOption name="random-seed">1</se:VendorOption>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70402020002</se:Name>
					<se:Description>
						<se:Title>Территории, подлежащие градостроительному преобразованию (развитие застроенных территорий, реорганизация промышленных территорий, иное существенное изменение плотности использования или функции территории) планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70402020002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#b400b4</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>square</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b400b4</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
						<se:VendorOption name="random">grid</se:VendorOption>
						<se:VendorOption name="random-tile-size">20</se:VendorOption>
						<se:VendorOption name="random-symbol-count">1</se:VendorOption>
						<se:VendorOption name="random-seed">1</se:VendorOption>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70402030002</se:Name>
					<se:Description>
						<se:Title>Территории освоения подземного пространства в градостроительных целях планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70402030002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>square</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
						<se:VendorOption name="random">grid</se:VendorOption>
						<se:VendorOption name="random-tile-size">20</se:VendorOption>
						<se:VendorOption name="random-symbol-count">1</se:VendorOption>
						<se:VendorOption name="random-seed">1</se:VendorOption>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70402040002</se:Name>
					<se:Description>
						<se:Title>Искусственные земельные участки планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70402040002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>square</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffff00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
						<se:VendorOption name="random">grid</se:VendorOption>
						<se:VendorOption name="random-tile-size">20</se:VendorOption>
						<se:VendorOption name="random-symbol-count">1</se:VendorOption>
						<se:VendorOption name="random-seed">1</se:VendorOption>
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