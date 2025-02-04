package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.LineString;
import org.postgis.MultiLineString;
import org.postgis.PGgeometry;
import org.postgis.Point;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCoordinatesFromPosList;
import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCrs;
import static ru.mycrg.data_service_contract.enums.GeometryType.CURVE;

@Component
public class GmlCurveHandler implements IGmlImportGeometryHandler {

    private final String GML_CURVE = "gml:Curve";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element attributeElement = (Element) element.getElementsByTagName(GML_CURVE).item(0);
        Integer srid = getCrs(defaultEpsg, attributeElement);

        int quantityOfPosList = element.getElementsByTagName("gml:posList").getLength();
        List<LineString> lineStrings = new ArrayList<>();
        for (int i = 0; i < quantityOfPosList; i++) {
            List<Point> coordinateList = getCoordinatesFromPosList(attributeElement, i, invertCoordinates);
            LineString lineString = new LineString(coordinateList.toArray(Point[]::new));
            lineStrings.add(lineString);
        }

        MultiLineString multiLineString = new MultiLineString(lineStrings.toArray(LineString[]::new));
        multiLineString.setSrid(srid);

        return Optional.of(new PGgeometry(multiLineString));
    }

    @Override
    public String getType() {
        return CURVE.getType();
    }
}
