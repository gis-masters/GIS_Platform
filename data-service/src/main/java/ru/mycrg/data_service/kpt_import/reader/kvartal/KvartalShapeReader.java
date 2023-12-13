package ru.mycrg.data_service.kpt_import.reader.kvartal;

import org.postgis.Polygon;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry.BoundGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.EntitySpatialBound;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialDataType;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialElementBound;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialsElementsBound;
import ru.mycrg.data_service.kpt_import.model.kvartal.KvartalShapeElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class KvartalShapeReader extends KvartalPartialDataReader<KvartalShapeElement, SpatialDataType> {

    private final BoundGeometryParser geometryParser;

    public KvartalShapeReader(BoundGeometryParser geometryParser) throws JAXBException {
        super(SpatialDataType.class, "spatial_data");
        this.geometryParser = geometryParser;
    }

    @Override
    public KvartalShapeElement read(XMLStreamReader reader) {
        try {
            SpatialDataType spatialData = unmarshall(reader);

            List<SpatialElementBound> spatialElements = Optional.ofNullable(spatialData.getEntitySpatial())
                                                                .map(EntitySpatialBound::getSpatialsElements)
                                                                .map(SpatialsElementsBound::getSpatialElement)
                                                                .orElse(Collections.emptyList());

            Optional<Polygon> shape = geometryParser.createPolygon(spatialElements);

            return shape.map(polygon -> new KvartalShapeElement(Map.of("shape", polygon)))
                        .orElseGet(() -> new KvartalShapeElement(Collections.emptyMap()));
        } catch (JAXBException e) {
            return new KvartalShapeElement(Collections.emptyMap());
        }
    }
}
