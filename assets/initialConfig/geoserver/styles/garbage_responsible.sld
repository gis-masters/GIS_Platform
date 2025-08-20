<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" 
xmlns:se="http://www.opengis.net/se">
	<NamedLayer>
		<se:Name>garbage_responsible</se:Name>
		<UserStyle>
			<se:Name>garbage_responsible</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>50103001</se:Name>
					<se:Description>
						<se:Title>МУП Аванград </se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>50103001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/garbage_responsible/mup_avangard.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>25</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>50103002</se:Name>
					<se:Description>
						<se:Title>МУП Железнодорожный ЖС</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>50103002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/garbage_responsible/zhd_zhilservis.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>25</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>50103003</se:Name>
					<se:Description>
						<se:Title>МУП Киевский ЖС</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>50103003</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/garbage_responsible/mup_kievskiy_zhilservis.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>25</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>50103004</se:Name>
					<se:Description>
						<se:Title>МУП Центральный ЖС </se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>50103004</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/garbage_responsible/mup_centr.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>25</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>50103005</se:Name>
					<se:Description>
						<se:Title>МБУ Город</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>50103005</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/garbage_responsible/mbu_gorod.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>25</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>50103006</se:Name>
					<se:Description>
						<se:Title>ТСЖ и прочие</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>50103006</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/garbage_responsible/tszh.png" />
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>25</se:Size>
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
							<se:Size>25</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>