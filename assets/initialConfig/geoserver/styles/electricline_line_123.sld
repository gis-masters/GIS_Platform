<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
	<NamedLayer>
		<se:Name>Линии электропередачи (ЛЭП)</se:Name>
		<UserStyle>
			<se:Name>ElectricLine_123</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>60204030101</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 1150 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cc8aff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030102</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 1150 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030102</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cc8aff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030103</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 1150 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030103</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cc8aff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030104</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 1150 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030104</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cc8aff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cc8aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030201</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 800 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#948bb6</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030202</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 800 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030202</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#948bb6</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030203</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 800 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030203</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#948bb6</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030204</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 800 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030204</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#948bb6</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#948bb6</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030301</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 750 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0000c8</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030302</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 750 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0000c8</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030303</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 750 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030303</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0000c8</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030304</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 750 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030304</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0000c8</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0000c8</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030401</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 600 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3b2a98</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030402</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 600 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3b2a98</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030403</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 600 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030403</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3b2a98</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030404</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 600 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030404</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3b2a98</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#3b2a98</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030501</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 500 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cf0000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030502</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 500 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cf0000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030503</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 500 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030503</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cf0000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030504</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 500 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030504</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#cf0000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#cf0000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030601</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 400 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030601</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#f17e00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030602</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 400 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030602</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#f17e00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030603</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 400 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030603</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#f17e00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030604</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 400 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030604</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#f17e00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#f17e00</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030701</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 330 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030701</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00a900</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030702</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 330 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030702</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00a900</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030703</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 330 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030703</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00a900</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030704</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 330 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030704</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00a900</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#00a900</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030801</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 300 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030801</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#bbd700</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030802</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 300 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030802</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#bbd700</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030803</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 300 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030803</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#bbd700</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030804</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 300 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030804</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#bbd700</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#bbd700</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030901</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 220 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030901</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#b5b500</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030902</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 220 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030902</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#b5b500</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030903</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 220 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030903</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#b5b500</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204030904</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 220 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204030904</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#b5b500</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#b5b500</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031001</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 150 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#aedbf1</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031002</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 150 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#aedbf1</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031003</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 150 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031003</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#aedbf1</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031004</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 150 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031004</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#aedbf1</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#aedbf1</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031101</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 110 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0099ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031102</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 110 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031102</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0099ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031103</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 110 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031103</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0099ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031104</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 110 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031104</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#0099ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#0099ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031201</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 60 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#a51d12</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031202</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 60 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031202</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#a51d12</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031203</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 60 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031203</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#a51d12</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031204</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 60 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031204</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#a51d12</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#a51d12</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031301</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 35 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dd2a1b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031302</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 35 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dd2a1b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031303</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 35 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031303</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dd2a1b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031304</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 35 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031304</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dd2a1b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#dd2a1b</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031401</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 20 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbabd</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031402</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 20 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbabd</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031403</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 20 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031403</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbabd</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031404</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 20 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031404</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbabd</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ffbabd</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031501</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 10 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e10585</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031502</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 10 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e10585</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031503</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 10 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031503</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e10585</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031504</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 10 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031504</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e10585</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#e10585</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031601</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 6 кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031601</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#fae013</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ccfae0138aff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031602</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 6 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031602</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#fae013</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031603</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 6 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031603</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#fae013</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031604</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 6 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031604</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#fae013</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#fae013</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031701</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 4кВ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031701</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031702</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 4 кВ планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031702</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">25</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031703</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 4 кВ планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031703</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">0 2 18 5 5 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">17</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 95</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">36</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204031704</se:Name>
					<se:Description>
						<se:Title>Линии электропередачи 4 кВ планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204031704</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>triangle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
									<se:Rotation>-90</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 65</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">35</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://times</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#333333</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>Default</se:Name>
					<se:Description>
						<se:Title>Не определено</se:Title>
					</se:Description>
					<se:ElseFilter/>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff55ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>