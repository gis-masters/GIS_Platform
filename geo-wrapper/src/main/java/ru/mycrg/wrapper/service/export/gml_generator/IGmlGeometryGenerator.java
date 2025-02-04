package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

public interface IGmlGeometryGenerator {

    String GML_COORDINATES = "gml:coordinates";

    /**
     * Генерация нового GML элемента.
     *
     * @param document            GML Document
     * @param geometry            Geometry
     * @param invertedCoordinates Признак
     *
     * @return Сгенерированный GML Element
     */
    Optional<Element> generate(Document document, Geometry geometry, boolean invertedCoordinates);

    String getType();
}
