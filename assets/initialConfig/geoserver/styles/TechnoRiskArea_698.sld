<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0"
	xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>Территории, подверженные риску возникновения чрезвычайных ситуаций техногенного характера</se:Name>
		<UserStyle>
			<se:Name>technoriskarea_698</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>60601020101</se:Name>
					<se:Description>
						<se:Title>Территории, подверженные риску возникновения чрезвычайных ситуаций техногенного характера существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60601020101</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#000000</se:SvgParameter>
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
										<se:WellKnownName>shape://backslash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#000000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
                    <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/08_RiskZone/02_TechnoRiskArea/60601020101.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60601020201</se:Name>
					<se:Description>
						<se:Title>Зона, подверженная риску радиоактивного загрязнения существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60601020201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
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
										<se:WellKnownName>shape://backslash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
                    <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/08_RiskZone/02_TechnoRiskArea/60601020201.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60601020301</se:Name>
					<se:Description>
						<se:Title>Зона, подверженная риску химического заражения существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60601020301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#a80000</se:SvgParameter>
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
										<se:WellKnownName>shape://backslash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#a80000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#a80000</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
                    <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/08_RiskZone/02_TechnoRiskArea/60601020301.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60601020401</se:Name>
					<se:Description>
						<se:Title>Зона возможного катастрофического затопления (при аварии на гидродинамически опасном объекте) существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60601020401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#007396</se:SvgParameter>
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
										<se:WellKnownName>shape://backslash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#007396</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#007396</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
                    <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/08_RiskZone/02_TechnoRiskArea/60601020401.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60601020501</se:Name>
					<se:Description>
						<se:Title>Зона локального загрязнения почвы существующая</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60601020501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3c8650</se:SvgParameter>
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
										<se:WellKnownName>shape://backslash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#3c8650</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#3c8650</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>15</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
                    <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/08_RiskZone/02_TechnoRiskArea/60601020501.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
        <se:Rule>
          <se:Name>606010206 </se:Name>
          <se:Description>
            <se:Title>Зона локального загрязнения почв</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>606010206 </ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#3c8650</se:SvgParameter>
              <se:SvgParameter name="stroke-width">1.13</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
            <se:SvgParameter name="stroke-dasharray">1.1 11</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/08_RiskZone/02_TechnoRiskArea/606010206.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
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
                    <se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="svg_698/Else.svg" />
								<se:Format>image/svg+xml</se:Format>
							</se:ExternalGraphic>
							<se:Size>40</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
