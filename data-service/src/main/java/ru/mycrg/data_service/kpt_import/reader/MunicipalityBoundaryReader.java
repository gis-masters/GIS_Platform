package ru.mycrg.data_service.kpt_import.reader;

import org.postgis.MultiPolygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.geometry_parsers.BoundGeometryParser;
import ru.mycrg.data_service.kpt_import.model.MunicipalityBoundaryElement;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import javax.xml.bind.JAXBException;
import javax.xml.datatype.XMLGregorianCalendar;
import javax.xml.stream.XMLStreamReader;
import java.util.*;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.service.smev3.fields.KptFields.REGNUMBORDER;

@Component
public class MunicipalityBoundaryReader extends CommonKptXmlElementReader<MunicipalityBoundaryElement,
        InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord>
{

    private static final Logger log = LoggerFactory.getLogger(MunicipalityBoundaryReader.class);
    private final BoundGeometryParser geometryParser;

    public MunicipalityBoundaryReader(BoundGeometryParser geometryParser) throws JAXBException {
        super(InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord.class,
              MunicipalityBoundaryElement.XML_TAG);
        this.geometryParser = geometryParser;
    }

    @Override
    public List<MunicipalityBoundaryElement> read(XMLStreamReader reader) {
        InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord r;
        try {
            r = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения границы населенного пункта: " + ex.getMessage());
            return Collections.emptyList();
        }

        String number = extractRegNumBorder(r);
        List<BoundContourOut> contours = extractContours(r);

        Optional<MultiPolygon> shape;
        try {
            shape = geometryParser.createMultiPolygon(contours);
        } catch (Exception ex) {
            log.warn("Ошибка парсинга геометрии для границы населенного пункта с номером {}: {}",
                     number == null ? "null" : number, ex.getMessage());
            shape = Optional.empty();
        }

        Map<String, Object> content = new HashMap<>();
        if (shape.isPresent()) {
            //парсим только объекты с геометрией
            content.put(REGNUMBORDER, number);
            content.put("boundary_1", extractBoundary1(r));
            content.put("registrationdate", extractRegistrationDate(r));
            content.put(DEFAULT_GEOMETRY_COLUMN_NAME, shape.get());
        }
        return Collections.singletonList(new MunicipalityBoundaryElement(content));
    }

    private String extractRegNumBorder(InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord r) {
        return Optional.ofNullable(r.getBObjectInhabitedLocalityBoundary())
                       .map(BobjectMunicipalInhabitedBoundary::getBObject).map(Bobject::getRegNumbBorder).orElse(null);
    }

    private List<BoundContourOut> extractContours(InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord r) {
        return Optional.ofNullable(r.getBContoursLocation())
                       .map(BoundContoursLocationOut::getContours)
                       .map(BoundContoursOut::getContour)
                       .orElse(Collections.emptyList());
    }

    private String extractBoundary1(InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord r) {
        return Optional.ofNullable(r.getBObjectInhabitedLocalityBoundary())
                       .map(BobjectMunicipalInhabitedBoundary::getBObject)
                       .map(Bobject::getTypeBoundary)
                       .map(Dict::getValue)
                       .orElse(null);
    }

    private String extractRegistrationDate(InhabitedLocalityBoundariesType.InhabitedLocalityBoundaryRecord r) {
        return Optional.ofNullable(r.getRecordInfo())
                       .map(RecordInfoDate::getRegistrationDate)
                       .map(XMLGregorianCalendar::toString)
                       .orElse(null);
    }
}
