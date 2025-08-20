package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.LineString;
import org.postgis.MultiLineString;
import org.postgis.PGgeometry;
import org.postgis.Point;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(GmlCurveHandler.class);

    private final String GML_CURVE = "gml:Curve";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element curveElement = (Element) element.getElementsByTagName(GML_CURVE).item(0);
        if (curveElement == null) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, curveElement);
        log.info("Визуализация Curve пока не поддерживается, преобразуем объект в линии");

        int quantityOfPosList = element.getElementsByTagName("gml:posList").getLength();
        List<LineString> lineStrings = new ArrayList<>();
        for (int i = 0; i < quantityOfPosList; i++) {
            List<Point> coordinateList = getCoordinatesFromPosList(curveElement, i, invertCoordinates);
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
