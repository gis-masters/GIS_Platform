<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0"
	xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>Леса</se:Name>
		<UserStyle>
			<se:Name>forest_698</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>70601010001</se:Name>
					<se:Description>
						<se:Title>Леса защитные существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601010001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#b5dfb2</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601010002</se:Name>
					<se:Description>
						<se:Title>Леса защитные планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601010002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#c9fdc6</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#b5e9b2</se:SvgParameter>
											<se:SvgParameter name="stroke-width">30.2</se:SvgParameter>
											<se:SvgParameter name="stroke-dasharray">0.5 0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>35</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601020001</se:Name>
					<se:Description>
						<se:Title>Леса эксплуатационные существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601020001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#c9fdc6</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601030001</se:Name>
					<se:Description>
						<se:Title>Леса резервные существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601030001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#a1c19e</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601040301</se:Name>
					<se:Description>
						<se:Title>Границы лесничества существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601040301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#A7D48F</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>8</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
                   <se:PolygonSymbolizer>
                        <se:Stroke>
                              <se:SvgParameter name="stroke">#A7D48F</se:SvgParameter>
                              <se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
                              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                              <se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
                        </se:Stroke>
                   </se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601040302</se:Name>
					<se:Description>
						<se:Title>Границы лесничества планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601040302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#A7D48F</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>8</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#f0f466</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
                    </se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601040401</se:Name>
					<se:Description>
						<se:Title>Лесной квартал существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601040401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#54E30A</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>8</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
                       <se:Stroke>
                            <se:SvgParameter name="stroke">#54E30A</se:SvgParameter>
                            <se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
                            <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
                            <se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601040402</se:Name>
					<se:Description>
						<se:Title>Лесной квартал планируемый к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601040402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#A7D48F</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>8</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
                        <se:Stroke>
                            <se:SvgParameter name="stroke">#f0f466</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
                        </se:Stroke>
                    </se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601040501</se:Name>
					<se:Description>
						<se:Title>Городские леса существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601040501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#ffffff</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#509e5c</se:SvgParameter>
											<se:SvgParameter name="stroke-width">4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#509e5c</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>70601040502</se:Name>
					<se:Description>
						<se:Title>Городские леса планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70601040502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:SvgParameter name="fill">#ffffff</se:SvgParameter>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#509e5c</se:SvgParameter>
											<se:SvgParameter name="stroke-width">4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#f0f466</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
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
							<se:SvgParameter name="stroke-width">1.89</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>