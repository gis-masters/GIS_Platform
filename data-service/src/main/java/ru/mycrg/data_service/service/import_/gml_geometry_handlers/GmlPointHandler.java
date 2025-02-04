package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.PGgeometry;
import org.postgis.Point;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCoordinatesFromElement;
import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCrs;
import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_CURVE;
import static ru.mycrg.data_service_contract.enums.GeometryType.POINT;

@Component
public class GmlPointHandler implements IGmlImportGeometryHandler {

    public static final String GML_POINT = "gml:Point";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element attributeElement = (Element) element.getElementsByTagName(GML_POINT).item(0);
        Integer srid = getCrs(defaultEpsg, attributeElement);

        Point point = getCoordinatesFromElement(attributeElement, invertCoordinates).get(0);
        point.setSrid(srid);

        return Optional.of(new PGgeometry(point));
    }

    @Override
    public String getType() {
        return POINT.getType();
    }
}
