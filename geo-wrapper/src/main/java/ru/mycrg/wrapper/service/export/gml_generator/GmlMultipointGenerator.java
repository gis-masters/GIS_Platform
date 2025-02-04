package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_POINT;

@Component
public class GmlMultipointGenerator implements IGmlGeometryGenerator {

    private final GmlPointGenerator gmlPointGenerator;

    public GmlMultipointGenerator(GmlPointGenerator gmlPointGenerator) {
        this.gmlPointGenerator = gmlPointGenerator;
    }

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        return gmlPointGenerator.generate(document, geometry, inverted);
    }

    @Override
    public String getType() {
        return MULTI_POINT.getType();
    }
}
