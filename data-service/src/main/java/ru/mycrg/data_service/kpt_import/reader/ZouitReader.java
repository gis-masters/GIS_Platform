package ru.mycrg.data_service.kpt_import.reader;

import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry_parsers.BoundGeometryParser;
import ru.mycrg.data_service.kpt_import.model.ZouitElement;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import javax.xml.bind.JAXBException;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.stream.XMLStreamReader;
import java.util.*;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.service.smev3.fields.KptFields.REGNUMBORD;

@Component
public class ZouitReader extends CommonKptXmlElementReader<ZouitElement, ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord> {

    private static final Logger log = LoggerFactory.getLogger(ZouitReader.class);

    private final BoundGeometryParser geometryParser;

    public ZouitReader(BoundGeometryParser geometryParser) throws JAXBException {
        super(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord.class, ZouitElement.XML_TAG);

        this.geometryParser = geometryParser;
    }

    @Override
    public List<ZouitElement> read(XMLStreamReader reader) {
        ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord record;
        try {
            record = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения ЗОУИТ: ", ex);
            return Collections.emptyList();
        }

        Map<String, Object> content = new HashMap<>();
        String number = extractNumber(record);
        List<BoundContourOut> contours = extractContours(record);

        Optional<MultiPolygon> oMultiPolygon;
        try {
            oMultiPolygon = geometryParser.createMultiPolygon(contours);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга геометрии для ЗОУИТ с номером {}: {}", number, ex.getMessage());
            oMultiPolygon = Optional.empty();
        }

        if (oMultiPolygon.isPresent()) {
            //парсим только объекты с геометрией
            content.put("number", number);
            content.put("zonetype", extractZoneType(record));
            content.put(REGNUMBORD, extractRegnumbord(record));
            content.put("registrati", extractRegistrati(record));
            content.put("boundary_1", extractBoundary_1(record));
            content.put("name_by_doc", extractNameByDoc(record));
            content.put(DEFAULT_GEOMETRY_COLUMN_NAME, oMultiPolygon.get());
        }

        return Collections.singletonList(new ZouitElement(content));
    }

    private String extractNumber(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return r.getBObjectZonesAndTerritories().getNumber();
    }

    private List<BoundContourOut> extractContours(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return Optional.ofNullable(r.getBContoursLocation())
                       .map(BoundContoursLocationOut::getContours)
                       .map(BoundContoursOut::getContour)
                       .orElse(Collections.emptyList());
    }

    private String extractZoneType(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return Optional.ofNullable(r.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getTypeZone)
                       .map(Dict::getValue)
                       .orElse(null);
    }

    private String extractRegnumbord(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return Optional.ofNullable(r.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getBObject)
                       .map(Bobject::getRegNumbBorder)
                       .orElse(null);
    }

    private String extractRegistrati(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return Optional.ofNullable(r.getRecordInfo())
                       .map(RecordInfoDate::getRegistrationDate)
                       .map(XMLGregorianCalendar::toString)
                       .orElse(null);
    }

    private String extractBoundary_1(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return Optional.ofNullable(r.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getBObject)
                       .map(Bobject::getTypeBoundary)
                       .map(Dict::getValue)
                       .orElse(null);
    }

    private Object extractNameByDoc(ZonesAndTerritoriesBoundariesType.ZonesAndTerritoriesRecord r) {
        return Optional.ofNullable(r.getBObjectZonesAndTerritories())
                       .map(BobjectZonesAndTerritories::getNameByDoc)
                       .orElse(null);
    }
}
