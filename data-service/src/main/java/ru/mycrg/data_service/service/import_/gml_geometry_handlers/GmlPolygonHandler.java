package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.MultiPolygon;
import org.postgis.PGgeometry;
import org.postgis.Polygon;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCrs;
import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.makePolygonFromRing;
import static ru.mycrg.data_service_contract.enums.GeometryType.POLYGON;

@Component
public class GmlPolygonHandler implements IGmlImportGeometryHandler {

    public static final String GML_POLYGON = "gml:Polygon";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element polygonElement = (Element) element.getElementsByTagName(GML_POLYGON).item(0);
        if (polygonElement == null) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, polygonElement);
        Polygon polygon = makePolygonFromRing(invertCoordinates, polygonElement);
        polygon.setSrid(srid);

        return Optional.of(new PGgeometry(polygon));
    }

    @Override
    public String getType() {
        return POLYGON.getType();
    }
}
