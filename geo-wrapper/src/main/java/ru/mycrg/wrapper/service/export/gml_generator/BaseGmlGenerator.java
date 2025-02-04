package ru.mycrg.wrapper.service.export.gml_generator;

import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Geometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.Optional;

import static ru.mycrg.wrapper.service.export.GmlUtil.convertToString;
import static ru.mycrg.wrapper.service.export.gml_generator.IGmlGeometryGenerator.GML_COORDINATES;

public class BaseGmlGenerator {

    private final Logger log = LoggerFactory.getLogger(BaseGmlGenerator.class);

    @NotNull
    public Optional<Element> createElement(Document document,
                                           Geometry geometry,
                                           boolean inverted,
                                           String gmlGeometryName) {
        try {
            Element element = document.createElement(gmlGeometryName);

            Element coordinate = document.createElement(GML_COORDINATES);
            coordinate.setTextContent(convertToString(geometry.getCoordinates(), inverted));
            element.appendChild(coordinate);

            return Optional.of(element);
        } catch (Exception e) {
            log.warn("Failed to create {} element", gmlGeometryName);

            return Optional.empty();
        }
    }
}
