package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_LINE_STRING;

@Component
public class GmlMultiLineStringGenerator extends BaseGmlGenerator implements IGmlGeometryGenerator {

    private final GmlLineStringGenerator gmlLineStringGenerator;

    public GmlMultiLineStringGenerator(GmlLineStringGenerator gmlLineStringGenerator) {
        this.gmlLineStringGenerator = gmlLineStringGenerator;
    }

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        return gmlLineStringGenerator.generate(document, geometry, inverted);
    }

    @Override
    public String getType() {
        return MULTI_LINE_STRING.getType();
    }
}
