package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.MultiPoint;
import org.postgis.PGgeometry;
import org.postgis.Point;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
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
        NodeList multiPointElements = element.getElementsByTagName(GML_MULTI_POINT);
        if (multiPointElements.getLength() == 0) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, (Element) multiPointElements.item(0));

        List<Point> allPoints = new ArrayList<>();
        for (int i = 0; i < multiPointElements.getLength(); i++) {
            Element multiPointElement = (Element) multiPointElements.item(i);
            List<Point> points = getCoordinatesFromElement(multiPointElement, invertCoordinates);
            allPoints.addAll(points);
        }

        MultiPoint multiPoint = new MultiPoint(allPoints.toArray(Point[]::new));
        multiPoint.setSrid(srid);

        return Optional.of(new PGgeometry(multiPoint));
    }

    @Override
    public String getType() {
        return MULTI_POINT.getType();
    }
}
