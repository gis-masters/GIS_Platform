package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElement;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElementFactory;
import ru.mycrg.data_service.kpt_import.model.generated.BobjectZonesAndTerritories;
import ru.mycrg.data_service.kpt_import.model.generated.BoundContoursLocationOut;
import ru.mycrg.data_service.kpt_import.model.generated.CoastlineBoundariesType;
import ru.mycrg.data_service.kpt_import.model.generated.RecordInfoDate;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;

@Component
public class BorderWaterObjectReader extends CommonKptXmlElementReader<BorderWaterObjectElement, CoastlineBoundariesType.CoastlineRecord> {

    private static final Logger log = LoggerFactory.getLogger(BorderWaterObjectReader.class);

    private final BorderWaterObjectElementFactory factory;

    private final ThreadLocal<Unmarshaller> unmarshaller;
    private final JAXBContext jaxbContext;

    protected BorderWaterObjectReader(BorderWaterObjectElementFactory factory) throws JAXBException {
        super(CoastlineBoundariesType.CoastlineRecord.class, BorderWaterObjectElement.XML_TAG);

        this.factory = factory;
        this.jaxbContext = JAXBContext.newInstance(InnerCoastlineRecord.class);
        this.unmarshaller = new ThreadLocal<>();
    }

    @Override
    public List<BorderWaterObjectElement> read(XMLStreamReader reader) {
        CoastlineBoundariesType.CoastlineRecord record;
        try {
            record = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения береговой линии: {}", ex.getMessage());

            return Collections.emptyList();
        }

        return factory.fromCoastlineRecord(record);
    }

    // ради объединения тегов b_object_zones_and_territories и b_contours_location в одну модель BobjectZonesAndTerritories
    // был переопределён unmarshall(XMLStreamReader reader) и введена промежуточная модель InnerCoastlineRecord

    @Override
    protected CoastlineBoundariesType.CoastlineRecord unmarshall(XMLStreamReader reader) throws JAXBException {
        if (unmarshaller.get() == null) {
            unmarshaller.set(jaxbContext.createUnmarshaller());
        }
        InnerCoastlineRecord innerRecord = unmarshaller.get().unmarshal(reader, InnerCoastlineRecord.class).getValue();
        return innerRecord.toCoastlineRecord();
    }

    private static class InnerCoastlineRecord {

        @XmlElement(name = "record_info", required = true)
        protected RecordInfoDate recordInfo;
        @XmlElement(name = "b_object_zones_and_territories", required = true)
        protected BobjectZonesAndTerritories bObjectZonesAndTerritories;
        @XmlElement(name = "b_object_coastline", required = true)
        protected BobjectZonesAndTerritories bObjectCoastline;
        @XmlElement(name = "b_contours_location")
        protected BoundContoursLocationOut bContoursLocation;

        CoastlineBoundariesType.CoastlineRecord toCoastlineRecord(){
            CoastlineBoundariesType.CoastlineRecord record = new CoastlineBoundariesType.CoastlineRecord();
            record.setRecordInfo(recordInfo);
            record.setBContoursLocation(bContoursLocation);
            record.setBObjectZonesAndTerritories(bObjectZonesAndTerritories != null ? bObjectZonesAndTerritories : bObjectCoastline);

            return  record;
        }
    }

}
