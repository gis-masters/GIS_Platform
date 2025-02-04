package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.PGgeometry;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_SURFACE;

@Component
public class GmlMultiSurfaceHandler implements IGmlImportGeometryHandler {

    private final GmlPolygonHandler polygonHandler;

    public GmlMultiSurfaceHandler(GmlPolygonHandler polygonHandler) {
        this.polygonHandler = polygonHandler;
    }

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        return polygonHandler.generate(element, invertCoordinates, defaultEpsg);
    }

    @Override
    public String getType() {
        return MULTI_SURFACE.getType();
    }
}
