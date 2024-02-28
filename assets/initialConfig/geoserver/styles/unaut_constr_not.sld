<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" 
xmlns:se="http://www.opengis.net/se">
	<NamedLayer>
		<se:Name>unaut_constr_not</se:Name>
		<UserStyle>
			<se:Name>unaut_constr_not</se:Name>
			<se:FeatureTypeStyle>
			<se:Rule>
					<se:Name>3001</se:Name>
					<se:Description>
						<se:Title>Решение о (сносе) / (приведении в соответствие с установленными требованиями) самовольной постройки</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>3001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/illegal_constr/demolition.png"/>
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>30</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>

				<se:Rule>
					<se:Name>3002</se:Name>
					<se:Description>
						<se:Title>Исковые заявления в суд о (сносе) / (приведении в соответствие с установленными требованиями) самовольной постройки</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>3002</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/illegal_constr/unauthorized.png"/>
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>30</se:Size>
						</se:Graphic>
					</se:PointSymbolizer>
				</se:Rule>

				<se:Rule>
					<se:Name>3003</se:Name>
					<se:Description>
						<se:Title>Уведомление об отсутствии признаков самовольной постройки</se:Title>
					</se:Description>
					<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>classid</ogc:PropertyName>
							<ogc:Literal>3003</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PointSymbolizer>
						<se:Graphic>
							<se:ExternalGraphic>
								<se:OnlineResource xlink:type="simple" xlink:href="otherIcons/illegal_constr/valid.png"/>
								<se:Format>image/png</se:Format>
							</se:ExternalGraphic>
							<se:Size>30</se:Size>
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