package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.MultiPoint;
import org.postgis.PGgeometry;
import org.postgis.Point;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCoordinatesFromElement;
import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCrs;
import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_POINT;

@Component
public class GmlMultiPointHandler implements IGmlImportGeometryHandler {

    public static final String GML_MULTI_POINT = "gml:MultiPoint";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element multiPointElement = (Element) element.getElementsByTagName(GML_MULTI_POINT).item(0);
        Integer srid = getCrs(defaultEpsg, multiPointElement);

        List<Point> points = getCoordinatesFromElement(multiPointElement, invertCoordinates);
        MultiPoint multiPoint = new MultiPoint(points.toArray(Point[]::new));
        multiPoint.setSrid(srid);

        return Optional.of(new PGgeometry(multiPoint));
    }

    @Override
    public String getType() {
        return MULTI_POINT.getType();
    }
}
