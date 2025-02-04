package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.LINE_STRING;

@Component
public class GmlLineStringGenerator extends BaseGmlGenerator implements IGmlGeometryGenerator {

    private final String GML_LINE_STRING = "gml:LineString";

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        return createElement(document, geometry, inverted, GML_LINE_STRING);
    }

    @Override
    public String getType() {
        return LINE_STRING.getType();
    }
}
