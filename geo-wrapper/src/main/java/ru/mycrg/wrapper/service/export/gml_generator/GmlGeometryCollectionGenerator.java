package ru.mycrg.wrapper.service.export.gml_generator;

import org.locationtech.jts.geom.Geometry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service_contract.enums.GeometryType.GEOMETRY_COLLECTION;

@Component
public class GmlGeometryCollectionGenerator implements IGmlGeometryGenerator {

    private final Logger log = LoggerFactory.getLogger(GmlGeometryCollectionGenerator.class);

    private final Map<String, IGmlGeometryGenerator> gmlGeometryGenerators;

    private final String GML_GEOMETRY_COLLECTION = "gml:GeometryCollection";
    private final String GEOMETRY_MEMBER = "gml:geometryMember";

    public GmlGeometryCollectionGenerator(List<IGmlGeometryGenerator> generators) {
        this.gmlGeometryGenerators = generators.stream()
                                               .collect(toMap(IGmlGeometryGenerator::getType, Function.identity()));
    }

    @Override
    public Optional<Element> generate(Document document, Geometry geometry, boolean inverted) {
        try {
            Element geometryCollection = document.createElement(GML_GEOMETRY_COLLECTION);

            int numGeometries = geometry.getNumGeometries();
            for (int i = 0; i < numGeometries; i++) {
                Geometry nestedGeometry = geometry.getGeometryN(i);
                String nestedGeometryType = nestedGeometry.getGeometryType();
                Element geometryMember = document.createElement(GEOMETRY_MEMBER);
                geometryCollection.appendChild(geometryMember);

                IGmlGeometryGenerator gmlGenerator = gmlGeometryGenerators.get(nestedGeometryType);
                if (gmlGenerator != null) {
                    Optional<Element> oElement = gmlGenerator.generate(document, geometry, inverted);
                    if (oElement.isPresent()) {
                        Element nestedElement = oElement.get();
                        geometryMember.appendChild(nestedElement);
                    }
                } else {
                    log.warn("Unsupported geometry type: {}", nestedGeometryType);
                }
            }

            return Optional.of(geometryCollection);
        } catch (Exception e) {
            log.warn("Failed to create {} element", GML_GEOMETRY_COLLECTION);

            return Optional.empty();
        }
    }

    @Override
    public String getType() {
        return GEOMETRY_COLLECTION.getType();
    }
}
