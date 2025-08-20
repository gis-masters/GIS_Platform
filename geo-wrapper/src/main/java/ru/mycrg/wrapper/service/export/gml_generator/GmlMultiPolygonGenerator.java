package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.LineString;
import org.locationtech.jts.geom.Polygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_POLYGON;
import static ru.mycrg.wrapper.service.export.GmlUtil.convertToString;

@Component
public class GmlMultiPolygonGenerator implements IGmlGeometryGenerator {

    private final Logger log = LoggerFactory.getLogger(GmlMultiPolygonGenerator.class);

    private final String GML_POLYGON = "gml:Polygon";

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        try {
            Element polygonElement = document.createElement(GML_POLYGON);

            Polygon onlyFirstGeometry = (Polygon) geometry.getGeometryN(0);
            LineString exteriorRing = onlyFirstGeometry.getExteriorRing();
            if (exteriorRing != null) {
                Element exterior = document.createElement("gml:exterior");
                polygonElement.appendChild(exterior);

                Element linearRing = document.createElement("gml:LinearRing");
                exterior.appendChild(linearRing);

                Element coordinate = document.createElement(GML_COORDINATES);
                coordinate.setTextContent(convertToString(exteriorRing.getCoordinates(), inverted));
                linearRing.appendChild(coordinate);
            }

            int numInteriorRing = onlyFirstGeometry.getNumInteriorRing();
            if (numInteriorRing > 0) {
                for (int i = 0; i < numInteriorRing - 1; i++) {
                    LineString hole = onlyFirstGeometry.getInteriorRingN(i);

                    Element interior = document.createElement("gml:interior");
                    polygonElement.appendChild(interior);

                    Element linearRing = document.createElement("gml:LinearRing");
                    interior.appendChild(linearRing);

                    Element coordinate = document.createElement(GML_COORDINATES);
                    coordinate.setTextContent(convertToString(hole.getCoordinates(), inverted));
                    linearRing.appendChild(coordinate);
                }
            }

            return Optional.of(polygonElement);
        } catch (Exception e) {
            log.warn("Failed to create {} element", GML_POLYGON);

            return Optional.empty();
        }
    }

    @Override
    public String getType() {
        return MULTI_POLYGON.getType();
    }
}
