package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.PGgeometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_CURVE;

@Component
public class GmlMultiCurveHandler implements IGmlImportGeometryHandler {

    private final GmlLineStringHandler lineStringHandler;

    public GmlMultiCurveHandler(GmlLineStringHandler lineStringHandler) {
        this.lineStringHandler = lineStringHandler;
    }

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        return lineStringHandler.generate(element, invertCoordinates, defaultEpsg);
    }

    @Override
    public String getType() {
        return MULTI_CURVE.getType();
    }
}
