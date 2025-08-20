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
import static ru.mycrg.data_service_contract.enums.GeometryType.MULTI_POLYGON;

@Component
public class GmlMultiPolygonHandler implements IGmlImportGeometryHandler {

    public static final String GML_POLYGON = "gml:Polygon";

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        NodeList polygonElements = element.getElementsByTagName(GML_POLYGON);
        if (polygonElements.getLength() == 0) {
            return Optional.empty();
        }

        Integer srid = getCrs(defaultEpsg, (Element) polygonElements.item(0));

        List<Polygon> polygons = new ArrayList<>();
        for (int i = 0; i < polygonElements.getLength(); i++) {
            Element polygonElement = (Element) polygonElements.item(i);
            Polygon polygon = makePolygonFromRing(invertCoordinates, polygonElement);
            polygons.add(polygon);
        }

        MultiPolygon multiPolygon = new MultiPolygon(polygons.toArray(Polygon[]::new));
        multiPolygon.setSrid(srid);

        return Optional.of(new PGgeometry(multiPolygon));
    }

    @Override
    public String getType() {
        return MULTI_POLYGON.getType();
    }
}