package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.*;
import static ru.mycrg.data_service_contract.enums.GeometryType.SURFACE;

@Component
public class GmlSurfaceHandler implements IGmlImportGeometryHandler {

    private static final Logger log = LoggerFactory.getLogger(GmlSurfaceHandler.class);

    public static final String GML_SURFACE = "gml:Surface";
    public static final String GML_POLYGON_PATCH = "gml:PolygonPatch";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element surfaceElement = (Element) element.getElementsByTagName(GML_SURFACE).item(0);
        if (surfaceElement == null) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, surfaceElement);

        log.info("Визуализация MultiSurface пока не поддерживается, преобразуем объект в полигоны");
        NodeList allPolygonPatches = surfaceElement.getElementsByTagName(GML_POLYGON_PATCH);
        List<Polygon> allPolygons = new ArrayList<>();
        for (int i = 0; i < allPolygonPatches.getLength(); i++) {
            Element polygonPatchElement = (Element) allPolygonPatches.item(i);

            Polygon polygon = makePolygonFromRing(invertCoordinates, polygonPatchElement);
            allPolygons.add(polygon);
        }

        MultiPolygon multiPolygon = new MultiPolygon(allPolygons.toArray(Polygon[]::new));
        multiPolygon.setSrid(srid);

        return Optional.of(new PGgeometry(multiPolygon));
    }

    @Override
    public String getType() {
        return SURFACE.getType();
    }
}
