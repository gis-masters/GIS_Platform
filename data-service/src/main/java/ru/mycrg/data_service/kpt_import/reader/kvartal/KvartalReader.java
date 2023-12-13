package ru.mycrg.data_service.kpt_import.reader.kvartal;

import org.postgis.Polygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.kpt_import.geometry.BoundGeometryParser;
import ru.mycrg.data_service.kpt_import.model.KvartalElement;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.kpt_import.reader.CommonKptXmlElementReader;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.math.BigDecimal;
import java.util.*;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

public class KvartalReader extends CommonKptXmlElementReader<KvartalElement, CadastralBlock> {

    private static final Logger log = LoggerFactory.getLogger(KvartalReader.class);
    private final BoundGeometryParser geometryParser;

    public KvartalReader(BoundGeometryParser geometryParser) throws JAXBException {
        super(CadastralBlock.class, KvartalElement.XML_TAG);
        this.geometryParser = geometryParser;
    }

    @Override
    public KvartalElement read(XMLStreamReader reader) {
        CadastralBlock r;
        try {
            r = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения квратала: " + ex.getMessage());
            return new KvartalElement(Collections.emptyMap());
        }

        String cadastralNum = extractCadastralNum(r);
        List<SpatialElementBound> spatialElements = extractSpatialElements(r);

        Optional<Polygon> shape;
        try {
            shape = geometryParser.createPolygon(spatialElements);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга геометрии для кадастрового квартала с номером {}: {}",
                     cadastralNum, ex.getMessage());
            shape = Optional.empty();
        }

        Map<String, Object> content = new HashMap<>();
        if (shape.isPresent()) {
            //парсим только объекты с геометрией
            content.put("cadastralnum", cadastralNum);
            content.put("aria_total", extractAriaTotal(r));
            content.put(DEFAULT_GEOMETRY_COLUMN_NAME, shape.get());
        }

        return new KvartalElement(content);
    }

    private String extractCadastralNum(CadastralBlock r) {
        return r.getCadastralNumber();
    }

    private List<SpatialElementBound> extractSpatialElements(CadastralBlock r) {
        return Optional.ofNullable(r.getSpatialData())
                .map(SpatialDataType::getEntitySpatial)
                .map(EntitySpatialBound::getSpatialsElements)
                .map(SpatialsElementsBound::getSpatialElement)
                .orElse(Collections.emptyList());

    }

    private BigDecimal extractAriaTotal(CadastralBlock r) {
        return Optional.ofNullable(r.getAreaQuarter())
                .map(AreaQuarter::getArea)
                .orElse(BigDecimal.ZERO);
    }
}
