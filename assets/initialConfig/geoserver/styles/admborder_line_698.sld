<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld" version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>Границы единиц административно-территориального деления Российской Федерации</se:Name>
		<UserStyle>
			<se:Name>AdmBorder_698</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>60101010001</se:Name>
					<se:Description>
						<se:Title>Государственная граница Российской Федерации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101010001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff6464</se:SvgParameter>
							<se:SvgParameter name="stroke-width">13</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
						<se:PerpendicularOffset>6</se:PerpendicularOffset>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">6</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">30 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">7 43</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">13</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101020001</se:Name>
					<se:Description>
						<se:Title>Граница субъекта Российской Федерации</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101020001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbebe</se:SvgParameter>
							<se:SvgParameter name="stroke-width">8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">30 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030101</se:Name>
					<se:Description>
						<se:Title>Граница муниципального района существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbebe</se:SvgParameter>
							<se:SvgParameter name="stroke-width">4.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030102</se:Name>
					<se:Description>
						<se:Title>Граница муниципального района планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030102</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffbebe</se:SvgParameter>
							<se:SvgParameter name="stroke-width">4.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030201</se:Name>
					<se:Description>
						<se:Title>Граница городского округа существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dcdcdc</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
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
							<se:SvgParameter name="stroke-dasharray">25 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030202</se:Name>
					<se:Description>
						<se:Title>Граница городского округа планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030202</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dcdcdc</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030301</se:Name>
					<se:Description>
						<se:Title>Граница городского округа с внутригородским делением существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e8beff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
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
							<se:SvgParameter name="stroke-dasharray">25 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030302</se:Name>
					<se:Description>
						<se:Title>Граница городского округа с внутригородским делением планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e8beff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 10</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030401</se:Name>
					<se:Description>
						<se:Title>Граница внутригородской территории (внутригородского муниципального образования) города федерального значения существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00ffff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
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
							<se:SvgParameter name="stroke-dasharray">25 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 27</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030402</se:Name>
					<se:Description>
						<se:Title>Граница внутригородской территории (внутригородского муниципального образования) города федерального значения планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00ffff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 27</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030501</se:Name>
					<se:Description>
						<se:Title>Граница внутригородского района существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e8beff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">15</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030502</se:Name>
					<se:Description>
						<se:Title>Граница внутригородского района планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#e8beff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">15</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030601</se:Name>
					<se:Description>
						<se:Title>Граница городского поселения существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030601</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00ffff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
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
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">15</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030602</se:Name>
					<se:Description>
						<se:Title>Граница городского поселения планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030602</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#00ffff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">15</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030701</se:Name>
					<se:Description>
						<se:Title>Граница сельского поселения существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030701</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dcdcdc</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
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
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">15</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030702</se:Name>
					<se:Description>
						<se:Title>Граница сельского поселения планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030702</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dcdcdc</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">2.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">15</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 40</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030801</se:Name>
					<se:Description>
						<se:Title>Граница муниципального округа существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030801</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#4b874b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">4.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">22.7 13.2</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4.6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30.9</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030802</se:Name>
					<se:Description>
						<se:Title>Граница муниципального округа планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030802</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#4b874b</se:SvgParameter>
							<se:SvgParameter name="stroke-width">8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">4.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">22.7 13.2</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4.6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 30.9</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">9</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030901</se:Name>
					<se:Description>
						<se:Title>Граница агломерации существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030901</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffdb6d</se:SvgParameter>
							<se:SvgParameter name="stroke-width">8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">4.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 7</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>4.6</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">5 27</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">5.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101030902</se:Name>
					<se:Description>
						<se:Title>Граница агломерации планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101030902</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#dd3d05</se:SvgParameter>
							<se:SvgParameter name="stroke-width">6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">26.5 30.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">3 54</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">18.5</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101040001</se:Name>
					<se:Description>
						<se:Title>Граница населенного пункта существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101040001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffffff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">16.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">11.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">6.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101040002</se:Name>
					<se:Description>
						<se:Title>Граница населенного пункта планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101040002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffffff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">16.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">11.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">6.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101040101</se:Name>
					<se:Description>
						<se:Title>Граница федеральной территории существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101040101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffdb6d</se:SvgParameter>
							<se:SvgParameter name="stroke-width">6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">16.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">11.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#000000</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">6.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60101040102</se:Name>
					<se:Description>
						<se:Title>Граница федеральной территории планируемая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60101040102</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffdb6d</se:SvgParameter>
							<se:SvgParameter name="stroke-width">6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ff00ff</se:SvgParameter>
							<se:SvgParameter name="stroke-width">3.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">25 20</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">16.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">11.8</se:SvgParameter>
						</se:Stroke>
					</se:LineSymbolizer>
					<se:LineSymbolizer>
						<se:Stroke>
							<se:GraphicStroke>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#ff00ff</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>3</se:Size>
								</se:Graphic>
							</se:GraphicStroke>
							<se:SvgParameter name="stroke-dasharray">4 41</se:SvgParameter>
							<se:SvgParameter name="stroke-dashoffset">6.8</se:SvgParameter>
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
