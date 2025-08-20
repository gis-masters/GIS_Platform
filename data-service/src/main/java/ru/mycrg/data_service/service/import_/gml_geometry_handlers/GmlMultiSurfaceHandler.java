package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.PGgeometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_SURFACE;

@Component
public class GmlMultiSurfaceHandler implements IGmlImportGeometryHandler {

    private static final Logger log = LoggerFactory.getLogger(GmlMultiSurfaceHandler.class);

    private final GmlMultiPolygonHandler multiPolygonHandler;

    public GmlMultiSurfaceHandler(GmlMultiPolygonHandler multiPolygonHandler) {
        this.multiPolygonHandler = multiPolygonHandler;
    }

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        log.info("Визуализация MultiSurface пока не поддерживается, преобразуем объект в полигоны");

        return multiPolygonHandler.generate(element, invertCoordinates, defaultEpsg);
    }

    @Override
    public String getType() {
        return MULTI_SURFACE.getType();
    }
}
