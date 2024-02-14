<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:ogc="http://www.opengis.net/ogc" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd">
	<NamedLayer>
		<se:Name>Объекты инженерной защиты от опасных геологических процессов</se:Name>
		<UserStyle>
			<se:Name>EngProtectionObj_123</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>60204180101</se:Name>
					<se:Description>
						<se:Title>Сооружения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>5</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4.3 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-2</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180102</se:Name>
					<se:Description>
						<se:Title>Сооружения планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180102</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">21 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>5</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4.3 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-2</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180103</se:Name>
					<se:Description>
						<se:Title>Сооружения планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180103</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">21 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>5</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4.3 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-2</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180201</se:Name>
					<se:Description>
						<se:Title>Сооружения противоселевые существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4.3 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-2</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180202</se:Name>
					<se:Description>
						<se:Title>Сооружения противоселевые планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180202</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">21 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4.3 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-2</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180203</se:Name>
					<se:Description>
						<se:Title>Сооружения противоселевые планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180203</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">21 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4.3 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-2</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180301</se:Name>
					<se:Description>
						<se:Title>Сооружения противолавинные существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180301</ogc:Literal>
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
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">2 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180302</se:Name>
					<se:Description>
						<se:Title>Сооружения противолавинные планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">21 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">2 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180303</se:Name>
					<se:Description>
						<se:Title>Сооружения противолавинные планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180303</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">21 4 4 4</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>5</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">2 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">1</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1</se:PerpendicularOffset>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180401</se:Name>
					<se:Description>
						<se:Title>Сооружения для защиты берегов морей, водохранилищ, озер, рек существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180401</ogc:Literal>
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
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180402</se:Name>
					<se:Description>
						<se:Title>Сооружения для защиты берегов морей, водохранилищ, озер, рек планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 7</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 7</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>-1.5</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180403</se:Name>
					<se:Description>
						<se:Title>Сооружения для защиты берегов морей, водохранилищ, озер, рек планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180403</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
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
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180501</se:Name>
					<se:Description>
						<se:Title>Сооружения для защиты от затопления и подтопления существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180501</ogc:Literal>
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
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180502</se:Name>
					<se:Description>
						<se:Title>Сооружения для защиты от затопления и подтопления планируемые к размещению</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">18 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60204180503</se:Name>
					<se:Description>
						<se:Title>Сооружения для защиты от затопления и подтопления планируемые к реконструкции</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60204180503</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
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
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://vertline</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 5</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">0.5</se:SvgParameter>
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