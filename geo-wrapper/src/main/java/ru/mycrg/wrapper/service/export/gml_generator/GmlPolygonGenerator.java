package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.POLYGON;

@Component
public class GmlPolygonGenerator implements IGmlGeometryGenerator {

    private final GmlMultiPolygonGenerator gmlMultiPolygonGenerator;

    public GmlPolygonGenerator(GmlMultiPolygonGenerator gmlMultiPolygonGenerator) {
        this.gmlMultiPolygonGenerator = gmlMultiPolygonGenerator;
    }

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        return gmlMultiPolygonGenerator.generate(document, geometry, inverted);
    }

    @Override
    public String getType() {
        return POLYGON.getType();
    }
}
