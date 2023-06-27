<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor
	xmlns="http://www.opengis.net/sld"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	xmlns:se="http://www.opengis.net/se"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0"
	xmlns:ogc="http://www.opengis.net/ogc">
	<NamedLayer>
		<se:Name>Территории традиционного природопользования коренных малочисленных народов Севера, Сибири и Дальнего Востока РФ</se:Name>
		<UserStyle>
			<se:Name>TraditionalArea_123</se:Name>
			<se:FeatureTypeStyle>
				<se:Rule>
					<se:Name>70302010001</se:Name>
					<se:Description>
						<se:Title>Территории традиционного природопользования коренных малочисленных народов Севера, Сибири и Дальнего Востока РФ существующие</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>70302010001</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#4065eb</se:SvgParameter>
							<se:SvgParameter name="stroke-width">1.2</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">square</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>circle</se:WellKnownName>
										<se:Fill>
											<se:SvgParameter name="fill">#4065eb</se:SvgParameter>
										</se:Fill>
									</se:Mark>
									<se:Size>1</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
						<se:VendorOption name="random">grid</se:VendorOption>
						<se:VendorOption name="random-tile-size">3</se:VendorOption>
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