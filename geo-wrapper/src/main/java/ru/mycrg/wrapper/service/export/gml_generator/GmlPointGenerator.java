package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.POINT;

@Component
public class GmlPointGenerator extends BaseGmlGenerator implements IGmlGeometryGenerator {

    public final String GML_POINT = "gml:Point";

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        return createElement(document, geometry, inverted, GML_POINT);
    }

    @Override
    public String getType() {
        return POINT.getType();
    }
}
