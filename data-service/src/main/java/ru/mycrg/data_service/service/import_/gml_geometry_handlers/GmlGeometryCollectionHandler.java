package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.Geometry;
import org.postgis.GeometryCollection;
import org.postgis.PGgeometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import ru.mycrg.data_service.service.parsers.utils.GmlParserUtils;

import java.util.*;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.service.parsers.utils.GmlParserUtils.getCrs;
import static ru.mycrg.data_service_contract.enums.GeometryType.GEOMETRY_COLLECTION;

@Component
public class GmlGeometryCollectionHandler implements IGmlImportGeometryHandler {

    private static final String GML_GEOMETRY_COLLECTION = "gml:GeometryCollection";

    private static final String GML_GEOMETRY_MEMBER = "gml:geometryMember";

    private static final Logger log = LoggerFactory.getLogger(GmlGeometryCollectionHandler.class);

    private final Map<String, IGmlImportGeometryHandler> gmlImportGeometryHandlers;

    public GmlGeometryCollectionHandler(List<IGmlImportGeometryHandler> geomHandlers) {
        gmlImportGeometryHandlers = geomHandlers
                .stream()
                .collect(toMap(IGmlImportGeometryHandler::getType, Function.identity()));
    }

    @Override
    public Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg) {
        Element geometryCollectionElement = (Element) element.getElementsByTagName(GML_GEOMETRY_COLLECTION).item(0);
        if (geometryCollectionElement == null) {
            return Optional.empty();
        }

        String epsg = null;
        if (!geometryCollectionElement.getAttribute("srsName").isEmpty()) {
            epsg = geometryCollectionElement.getAttribute("srsName");
        }

        List<Geometry> geometries = new ArrayList<>();

        NodeList geometryMember = geometryCollectionElement.getElementsByTagName(GML_GEOMETRY_MEMBER);
        for (int i = 0; i < geometryMember.getLength(); i++) {
            Element nestedElement = (Element) geometryMember.item(i);

            IGmlImportGeometryHandler geometryHandler = gmlImportGeometryHandlers
                    .get(GmlParserUtils.getGeometryType(nestedElement));

            if (Objects.isNull(geometryHandler)) {
                log.warn("Не удалось обработать геометрию у элемента '{}'", element.getTextContent());
            } else {
                geometryHandler.generate(nestedElement, invertCoordinates, epsg == null ? defaultEpsg : epsg)
                               .ifPresent(pGgeometry -> {
                                   geometries.add(pGgeometry.getGeometry());
                               });
            }
        }

        GeometryCollection geometryCollection = new GeometryCollection(geometries.toArray(Geometry[]::new));
        geometryCollection.setSrid(getCrs(defaultEpsg, geometryCollectionElement));

        return Optional.of(new PGgeometry(geometryCollection));
    }

    @Override
    public String getType() {
        return GEOMETRY_COLLECTION.getType();
    }
}
