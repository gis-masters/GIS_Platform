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
import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_LINE_STRING;

@Component
public class GmlMultiLineStringHandler implements IGmlImportGeometryHandler {

    public static final String GML_LINE_STRING = "gml:LineString";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        NodeList lineStringElements = element.getElementsByTagName(GML_LINE_STRING);
        if (lineStringElements.getLength() == 0) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, (Element) lineStringElements.item(0));

        List<LineString> lineStrings = new ArrayList<>();
        for (int i = 0; i < lineStringElements.getLength(); i++) {
            Element lineStringElement = (Element) lineStringElements.item(i);
            List<Point> coordinateList = getCoordinatesFromElement(lineStringElement, invertCoordinates);
            LineString lineString = new LineString(coordinateList.toArray(Point[]::new));
            lineStrings.add(lineString);
        }

        MultiLineString multiLineString = new MultiLineString(lineStrings.toArray(LineString[]::new));
        multiLineString.setSrid(srid);

        return Optional.of(new PGgeometry(multiLineString));
    }

    @Override
    public String getType() {
        return MULTI_LINE_STRING.getType();
    }
}