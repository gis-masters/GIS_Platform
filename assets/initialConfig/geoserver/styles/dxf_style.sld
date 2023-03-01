<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:se="http://www.opengis.net/se" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
   <NamedLayer>
      <Name>dxf_style</Name>
      <UserStyle>
         <Title>dxf_style</Title>
         <Abstract>Generic style</Abstract>
         <FeatureTypeStyle>
            <Rule>
               <Name>Polygon</Name>
               <Title>Polygon</Title>
               <ogc:Filter>
                  <ogc:PropertyIsEqualTo>
                     <ogc:Function name="dimension">
                        <ogc:Function name="geometry" />
                     </ogc:Function>
                     <ogc:Literal>2</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
               </ogc:Filter>
               <MinScaleDenominator>0</MinScaleDenominator>
               <MaxScaleDenominator>2000</MaxScaleDenominator>
               <PolygonSymbolizer>
                  <Fill>
                     <CssParameter name="fill">#f2e4e4</CssParameter>
                     <CssParameter name="fill-opacity">0.3</CssParameter>
                  </Fill>
                  <Stroke>
                     <CssParameter name="stroke">#b8b4b4</CssParameter>
                     <CssParameter name="stroke-width">1</CssParameter>
                  </Stroke>
               </PolygonSymbolizer>
            </Rule>
            <Rule>
               <Name>Line_all</Name>
               <Title>Line_all</Title>
               <ogc:Filter>
                  <ogc:PropertyIsEqualTo>
                     <ogc:Function name="dimension">
                        <ogc:Function name="geometry" />
                     </ogc:Function>
                     <ogc:Literal>1</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
               </ogc:Filter>
               <MinScaleDenominator>0</MinScaleDenominator>
               <MaxScaleDenominator>2000</MaxScaleDenominator>
               <LineSymbolizer>
                  <Stroke>
                     <CssParameter name="stroke">#ff222e</CssParameter>
                     <CssParameter name="stroke-opacity">1</CssParameter>
                  </Stroke>
               </LineSymbolizer>
            </Rule>
            <Rule>
               <Name>Line_200</Name>
               <Title>Line_200</Title>
               <ogc:Filter>
                  <ogc:And>
                     <ogc:PropertyIsEqualTo>
                        <ogc:Function name="dimension">
                           <ogc:Function name="geometry" />
                        </ogc:Function>
                        <ogc:Literal>1</ogc:Literal>
                     </ogc:PropertyIsEqualTo>
                     <ogc:PropertyIsGreaterThan>
                        <ogc:Function name="geomLength">
                           <ogc:Function name="envelope">
                              <ogc:PropertyName>the_geom</ogc:PropertyName>
                           </ogc:Function>
                        </ogc:Function>
                        <ogc:Literal>250</ogc:Literal>
                     </ogc:PropertyIsGreaterThan>
                  </ogc:And>
               </ogc:Filter>
               <MinScaleDenominator>2001</MinScaleDenominator>
               <MaxScaleDenominator>10000</MaxScaleDenominator>
               <LineSymbolizer>
                  <Stroke>
                     <CssParameter name="stroke">#ff222e</CssParameter>
                     <CssParameter name="stroke-opacity">1</CssParameter>
                  </Stroke>
               </LineSymbolizer>
            </Rule>
            <Rule>
               <Name>Line_1000</Name>
               <Title>Line_1000</Title>
               <ogc:Filter>
                  <ogc:And>
                     <ogc:PropertyIsEqualTo>
                        <ogc:Function name="dimension">
                           <ogc:Function name="geometry" />
                        </ogc:Function>
                        <ogc:Literal>1</ogc:Literal>
                     </ogc:PropertyIsEqualTo>
                     <ogc:PropertyIsGreaterThan>
                        <ogc:Function name="geomLength">
                           <ogc:Function name="envelope">
                              <ogc:PropertyName>the_geom</ogc:PropertyName>
                           </ogc:Function>
                        </ogc:Function>
                        <ogc:Literal>1000</ogc:Literal>
                     </ogc:PropertyIsGreaterThan>
                  </ogc:And>
               </ogc:Filter>
               <MinScaleDenominator>10001</MinScaleDenominator>
               <LineSymbolizer>
                  <Stroke>
                     <CssParameter name="stroke">#ff222e</CssParameter>
                     <CssParameter name="stroke-opacity">1</CssParameter>
                  </Stroke>
               </LineSymbolizer>
            </Rule>
            <Rule>
               <Name>point</Name>
               <Title>Point</Title>
               <ElseFilter />
               <MinScaleDenominator>0</MinScaleDenominator>
               <MaxScaleDenominator>2000</MaxScaleDenominator>
               <PointSymbolizer>
                  <Graphic>
                     <Mark>
                        <WellKnownName>circle</WellKnownName>
                        <Fill>
                           <CssParameter name="fill">#080600</CssParameter>
                        </Fill>
                     </Mark>
                     <Size>6</Size>
                  </Graphic>
               </PointSymbolizer>
            </Rule>
            <Rule>
               <MinScaleDenominator>0</MinScaleDenominator>
               <MaxScaleDenominator>800</MaxScaleDenominator>
               <TextSymbolizer>
                  <Label>
                     <ogc:PropertyName>Text</ogc:PropertyName>
                  </Label>
                  <LabelPlacement>
                     <PointPlacement>
                        <AnchorPoint>
                           <AnchorPointX>2.5</AnchorPointX>
                           <AnchorPointY>2.5</AnchorPointY>
                        </AnchorPoint>
                     </PointPlacement>
                  </LabelPlacement>
                  <Halo>
                     <Radius>2</Radius>
                  </Halo>
                  <VendorOption name="maxDisplacement">150</VendorOption>
               </TextSymbolizer>
            </Rule>
         </FeatureTypeStyle>
      </UserStyle>
   </NamedLayer>
</StyledLayerDescriptor>