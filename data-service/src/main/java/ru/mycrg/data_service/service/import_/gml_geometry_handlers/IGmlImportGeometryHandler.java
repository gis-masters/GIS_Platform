package ru.mycrg.data_service.service.import_.gml_geometry_handlers;

import org.postgis.PGgeometry;
import org.w3c.dom.Element;

import java.util.Optional;

public interface IGmlImportGeometryHandler {

    Optional<PGgeometry> generate(Element element, boolean invertCoordinates, String defaultEpsg);

    String getType();
}
