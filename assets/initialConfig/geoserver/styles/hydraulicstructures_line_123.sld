<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
	<NamedLayer>
		<se:Name>Гидротехнические сооружения</se:Name>
		<UserStyle>
			<se:Name>HydraulicStructures_123</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>60204170101</se:Name>
					<se:Description>
						<se:Title>Водоподпорные и водонапорные гидротехнические сооружения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170102</se:Name>
					<se:Description>
						<se:Title>Водоподпорные и водонапорные гидротехнические сооружения планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170102</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170103</se:Name>
					<se:Description>
						<se:Title>Водоподпорные и водонапорные гидротехнические сооружения планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170103</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170104</se:Name>
					<se:Description>
						<se:Title>Водоподпорные и водонапорные гидротехнические сооружения планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170104</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
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
									<se:Size>10</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170201</se:Name>
					<se:Description>
						<se:Title>Водосбросные и водопропускные гидротехнические сооружения (в том числе сопрягающие) существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170202</se:Name>
					<se:Description>
						<se:Title>Водосбросные и водопропускные гидротехнические сооружения (в том числе сопрягающие) планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170202</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170203</se:Name>
					<se:Description>
						<se:Title>Водосбросные и водопропускные гидротехнические сооружения (в том числе сопрягающие) планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170203</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170204</se:Name>
					<se:Description>
						<se:Title>Водосбросные и водопропускные гидротехнические сооружения (в том числе сопрягающие) планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170204</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
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
									<se:Size>10</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170301</se:Name>
					<se:Description>
						<se:Title>Водозаборные гидротехнические сооружения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170302</se:Name>
					<se:Description>
						<se:Title>Водозаборные гидротехнические сооружения планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170303</se:Name>
					<se:Description>
						<se:Title>Водозаборные гидротехнические сооружения планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170303</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170304</se:Name>
					<se:Description>
						<se:Title>Водозаборные гидротехнические сооружения планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170304</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
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
									<se:Size>10</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170401</se:Name>
					<se:Description>
						<se:Title>Водопроводящие гидротехнические сооружения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170402</se:Name>
					<se:Description>
						<se:Title>Водопроводящие гидротехнические сооружения планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170403</se:Name>
					<se:Description>
						<se:Title>Водопроводящие гидротехнические сооружения планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170403</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170404</se:Name>
					<se:Description>
						<se:Title>Водопроводящие гидротехнические сооружения планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170404</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
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
									<se:Size>10</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170501</se:Name>
					<se:Description>
						<se:Title>Регуляционные и выправительные гидротехнические сооружения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170502</se:Name>
					<se:Description>
						<se:Title>Регуляционные и выправительные гидротехнические сооружения планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170503</se:Name>
					<se:Description>
						<se:Title>Регуляционные и выправительные гидротехнические сооружения планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170503</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170504</se:Name>
					<se:Description>
						<se:Title>Регуляционные и выправительные гидротехнические сооружения планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170504</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
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
									<se:Size>10</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170601</se:Name>
					<se:Description>
						<se:Title>Гидротехнические сооружения специального назначения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170601</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170602</se:Name>
					<se:Description>
						<se:Title>Гидротехнические сооружения специального назначения планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170602</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170603</se:Name>
					<se:Description>
						<se:Title>Гидротехнические сооружения специального назначения планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170603</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 4 4 4</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170604</se:Name>
					<se:Description>
						<se:Title>Гидротехнические сооружения специального назначения планируемые к ликвидации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170604</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
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
									<se:Rotation>-180</se:Rotation>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">6 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>5</se:PerpendicularOffset>
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
									<se:Size>10</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 29</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">56</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170701</se:Name>
					<se:Description>
						<se:Title>Мелиоративные объекты существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170701</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170702</se:Name>
					<se:Description>
						<se:Title>Мелиоративные объекты планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170702</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">10 5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204170703</se:Name>
					<se:Description>
						<se:Title>Мелиоративные объекты планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204170703</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">7 5</se:SvgParameter>
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