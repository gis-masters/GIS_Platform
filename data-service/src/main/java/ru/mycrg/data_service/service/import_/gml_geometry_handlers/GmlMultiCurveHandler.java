package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.PGgeometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_CURVE;

@Component
public class GmlMultiCurveHandler implements IGmlImportGeometryHandler {

    private static final Logger log = LoggerFactory.getLogger(GmlMultiCurveHandler.class);

    private final GmlMultiLineStringHandler multiLineStringHandler;

    public GmlMultiCurveHandler(GmlMultiLineStringHandler multiLineStringHandler) {
        this.multiLineStringHandler = multiLineStringHandler;
    }

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        log.info("Визуализация MultiCurve пока не поддерживается, преобразуем объект в линии");

        return multiLineStringHandler.generate(element, invertCoordinates, defaultEpsg);
    }

    @Override
    public String getType() {
        return MULTI_CURVE.getType();
    }
}
