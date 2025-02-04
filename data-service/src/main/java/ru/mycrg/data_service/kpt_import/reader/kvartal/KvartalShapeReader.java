package ru.mycrg.data_service.kpt_import.reader.kvartal;

import org.postgis.Polygon;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry_parsers.BoundGeometryParser;
import ru.mycrg.data_service.kpt_import.model.generated.EntitySpatialBound;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialDataType;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialElementBound;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialsElementsBound;
import ru.mycrg.data_service.kpt_import.model.kvartal.KvartalShapeElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

@Component
public class KvartalShapeReader extends KvartalPartialDataReader<KvartalShapeElement, SpatialDataType> {

    private final BoundGeometryParser geometryParser;

    public KvartalShapeReader(BoundGeometryParser geometryParser) throws JAXBException {
        super(SpatialDataType.class, "spatial_data");

        this.geometryParser = geometryParser;
    }

    @Override
    public List<KvartalShapeElement> read(XMLStreamReader reader) {
        try {
            SpatialDataType spatialData = unmarshall(reader);

            List<SpatialElementBound> spatialElements = Optional.ofNullable(spatialData.getEntitySpatial())
                                                                .map(EntitySpatialBound::getSpatialsElements)
                                                                .map(SpatialsElementsBound::getSpatialElement)
                                                                .orElse(List.of());

            Optional<Polygon> shape = geometryParser.createPolygon(spatialElements);

            return shape.map(polygon -> List.of(new KvartalShapeElement(Map.of(DEFAULT_GEOMETRY_COLUMN_NAME, polygon))))
                        .orElseGet(List::of);
        } catch (JAXBException e) {
            return List.of();
        }
    }
}
