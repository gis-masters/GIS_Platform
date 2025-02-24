package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.LineString;
import org.postgis.MultiLineString;
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
import static ru.mycrg.data_service_contract.enums.GeometryType.LINE_STRING;

@Component
public class GmlLineStringHandler implements IGmlImportGeometryHandler {

    public static final String GML_LINE_STRING = "gml:LineString";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element lineStringElement = (Element) element.getElementsByTagName(GML_LINE_STRING).item(0);
        if (lineStringElement == null) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, lineStringElement);
        List<Point> coordinateList = getCoordinatesFromElement(lineStringElement, invertCoordinates);
        LineString lineString = new LineString(coordinateList.toArray(Point[]::new));
        lineString.setSrid(srid);

        return Optional.of(new PGgeometry(lineString));
    }

    @Override
    public String getType() {
        return LINE_STRING.getType();
    }
}
