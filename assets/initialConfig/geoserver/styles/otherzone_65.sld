<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:se="http://www.opengis.net/se" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd" version="1.1.0" xmlns:ogc="http://www.opengis.net/ogc">
  <NamedLayer>
    <se:Name>Иные зоны с особыми условиями использования</se:Name>
    <UserStyle>
      <se:Name>otherzone_65</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>60301170101</se:Name>
          <se:Description>
            <se:Title>Придорожная полоса существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170101</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#000000</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2.2</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>circle</se:WellKnownName>
                     <se:Fill>
                        <se:SvgParameter name="fill">#704489</se:SvgParameter>
                     </se:Fill>
                   </se:Mark>
                   <se:Size>2.2</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">3 3</se:SvgParameter>
             </se:Stroke>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170102</se:Name>
          <se:Description>
            <se:Title>Придорожная полоса планируемая к ликвидации</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170102</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
            </se:PolygonSymbolizer>
             <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FFFFFF</se:SvgParameter> 
              <se:SvgParameter name="stroke-width">2.2</se:SvgParameter> 
            </se:Stroke>
             </se:PolygonSymbolizer>
             <se:LineSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FFFFFF</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter> 
            </se:Stroke>
          </se:LineSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>circle</se:WellKnownName>
                     <se:Fill>
                        <se:SvgParameter name="fill">#704489</se:SvgParameter>
                     </se:Fill>
                   </se:Mark>
                   <se:Size>2.2</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">3 3</se:SvgParameter>
             </se:Stroke>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170201</se:Name>
          <se:Description>
            <se:Title>Приаэродромная территория существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170201</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#894444</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>shape://slash</se:WellKnownName>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#d7c29e</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>22.6</se:Size>
                  <se:Rotation>45</se:Rotation>
                </se:Graphic>
              </se:GraphicFill>
            </se:Fill>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170202</se:Name>
          <se:Description>
            <se:Title>Приаэродромная территория планируемый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170202</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#894444</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">11.3 5.6</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>shape://slash</se:WellKnownName>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#d7c29e</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>22.6</se:Size>
                </se:Graphic>
              </se:GraphicFill>
            </se:Fill>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170301</se:Name>
          <se:Description>
            <se:Title>Зона наблюдений существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170301</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>shape://slash</se:WellKnownName>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>22.6</se:Size>
                </se:Graphic>
              </se:GraphicFill>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170302</se:Name>
          <se:Description>
            <se:Title>Зона наблюдений планируемый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170302</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>shape://slash</se:WellKnownName>
                    <se:Stroke>
                      <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
                      <se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
                    </se:Stroke>
                  </se:Mark>
                  <se:Size>22.6</se:Size>
                </se:Graphic>
              </se:GraphicFill>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#ffff00</se:SvgParameter>
              <se:SvgParameter name="stroke-width">30</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">11 8.5</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170401</se:Name>
          <se:Description>
            <se:Title>Другие зоны, устанавливаемые в соответствии с законодательством Российской Федерации существующий</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170401</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
		  <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">0.56</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>2.8</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">8 62</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>2.8</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">0.56</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>2.8</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">8 62</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">40</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-2.8</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
        <se:Rule>
          <se:Name>60301170402</se:Name>
          <se:Description>
            <se:Title>Другие зоны, устанавливаемые в соответствии с законодательством Российской Федерации планируемый</se:Title>
          </se:Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>ruleid</ogc:PropertyName>
              <ogc:Literal>60301170402</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:SvgParameter name="fill">#f0f0f0</se:SvgParameter>
              <se:SvgParameter name="fill-opacity">0</se:SvgParameter>
            </se:Fill>
          </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
            <se:Stroke>
              <se:SvgParameter name="stroke">#703838</se:SvgParameter>
              <se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
              <se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
              <se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">22.6 5.6</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
		  <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">0.56</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">8 62</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">19</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>1.4</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
          <se:PolygonSymbolizer>
             <se:Stroke>
               <se:GraphicStroke>
                 <se:Graphic>
                   <se:Mark>
                     <se:WellKnownName>shape://vertline</se:WellKnownName>
                     <se:Stroke>
                       <se:SvgParameter name="stroke">#703838</se:SvgParameter>
                       <se:SvgParameter name="stroke-width">0.56</se:SvgParameter>
                     </se:Stroke>
                   </se:Mark>
                   <se:Size>4</se:Size>
                 </se:Graphic>
               </se:GraphicStroke>
               <se:SvgParameter name="stroke-dasharray">8 62</se:SvgParameter>
			   <se:SvgParameter name="stroke-dashoffset">40</se:SvgParameter>  
             </se:Stroke>
            <se:PerpendicularOffset>-1.4</se:PerpendicularOffset>
           </se:PolygonSymbolizer>
        </se:Rule>
                 <se:Rule>
					<se:Name>60301171201</se:Name>
					<se:Description>
						<se:Title>Зона охраняемого военного объекта, охранная зона военного объекта, запретные и специальные зоны, установленные в связи с размещением указаных объектов существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171201</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#78866B</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>40</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#78866B</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171202</se:Name>
					<se:Description>
						<se:Title>Зона охраняемого военного объекта, охранная зона военного объекта, запретные и специальные зоны, установленные в связи с размещением указаных объектов планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171202</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#78866B</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>40</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#78866B</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">11 8</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171301</se:Name>
					<se:Description>
						<se:Title>Зона ограничений передающего радиотехнического объекта, являющегося объектом капитального строительства существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171301</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#c891a0</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>40</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#c891a0</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171302</se:Name>
					<se:Description>
						<se:Title>Зона ограничений передающего радиотехнического объекта, являющегося объектом капитального строительства планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171302</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#c891a0</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.3</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>40</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#c891a0</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">14 11</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171401</se:Name>
					<se:Description>
						<se:Title>Охранная зона геодезических пунктов государственной геодезической сети, нивелирных пунктов государственной нивелирной сети и гравиметрических пунктов государственной гравиметрической существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171401</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#987c6d</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#753400</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.8</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171402</se:Name>
					<se:Description>
						<se:Title>Охранная зона геодезических пунктов государственной геодезической сети, нивелирных пунктов государственной нивелирной сети и гравиметрических пунктов государственной гравиметрической сети планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171402</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#753400</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#753400</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">11.3 8.5</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171501</se:Name>
					<se:Description>
						<se:Title>Зона безопасности с особым правовым режимом существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171501</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#137500</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#137500</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171502</se:Name>
					<se:Description>
						<se:Title>Зона безопасности с особым правовым режимом планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171502</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#137500</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#137500</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">11 8.5</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171601</se:Name>
					<se:Description>
						<se:Title>Рыбохозяйственная заповедная зона озера Байкал существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171601</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#3B4BEC</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3B4BEC</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171602</se:Name>
					<se:Description>
						<se:Title>Рыбохозяйственная заповедная зона озера Байкал планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171602</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#3B4BEC</se:SvgParameter>
											<se:SvgParameter name="stroke-width">1</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#3B4BEC</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">11.3 8.5</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171701</se:Name>
					<se:Description>
						<se:Title>Зона минимальных расстояний до магистральныхили промышленных трубопроводов(газопроводов,нефтепроводов и нефтепродуктопроводов, аммиакопроводов) существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171701</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#C03BEC</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#C03BEC</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171702</se:Name>
					<se:Description>
						<se:Title>Зона минимальных расстояний до магистральныхили промышленных трубопроводов(газопроводов,нефтепроводов и нефтепродуктопроводов, аммиакопроводов) планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171702</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#C03BEC</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.4</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#C03BEC</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.6</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">11.3 8.5</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171801</se:Name>
					<se:Description>
						<se:Title>Охранная зона объектов инфраструктуры метрополитена существующий</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171801</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#44005A</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>22.6</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#44005A</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
				<se:Rule>
					<se:Name>60301171802</se:Name>
					<se:Description>
						<se:Title>Охранная зона объектов инфраструктуры метрополитена планируемый</se:Title>
					</se:Description>
					<ogc:Filter
						xmlns:ogc="http://www.opengis.net/ogc">
						<ogc:PropertyIsEqualTo>
							<ogc:PropertyName>ruleid</ogc:PropertyName>
							<ogc:Literal>60301171802</ogc:Literal>
						</ogc:PropertyIsEqualTo>
					</ogc:Filter>
					<se:PolygonSymbolizer>
						<se:Fill>
							<se:GraphicFill>
								<se:Graphic>
									<se:Mark>
										<se:WellKnownName>shape://slash</se:WellKnownName>
										<se:Stroke>
											<se:SvgParameter name="stroke">#44005A</se:SvgParameter>
											<se:SvgParameter name="stroke-width">0.42</se:SvgParameter>
										</se:Stroke>
									</se:Mark>
									<se:Size>40</se:Size>
								</se:Graphic>
							</se:GraphicFill>
						</se:Fill>
					</se:PolygonSymbolizer>
					<se:PolygonSymbolizer>
						<se:Stroke>
							<se:SvgParameter name="stroke">#44005A</se:SvgParameter>
							<se:SvgParameter name="stroke-width">0.85</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">mitre</se:SvgParameter>
							<se:SvgParameter name="stroke-linecap">butt</se:SvgParameter>
							<se:SvgParameter name="stroke-dasharray">11.3 8.5</se:SvgParameter>
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
							<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
							<se:SvgParameter name="stroke-linejoin">bevel</se:SvgParameter>
						</se:Stroke>
					</se:PolygonSymbolizer>
				</se:Rule>
			</se:FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
