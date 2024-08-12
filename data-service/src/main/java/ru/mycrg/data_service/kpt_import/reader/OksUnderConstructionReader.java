package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.oks.parsers.OksUnderConstructionElementParser;
import ru.mycrg.data_service.kpt_import.model.generated.ObjectUnderConstructionRecord;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;

@Component
public class OksUnderConstructionReader extends CommonKptXmlElementReader<OksUnderConstructionElement, ObjectUnderConstructionRecord> {

    private static final Logger log = LoggerFactory.getLogger(OksUnderConstructionReader.class);

    private final OksUnderConstructionElementParser oksUnderConstructionElementFactory;

    public OksUnderConstructionReader(OksUnderConstructionElementParser oksUnderConstructionElementFactory)
            throws JAXBException {
        super(ObjectUnderConstructionRecord.class, OksUnderConstructionElement.XML_TAG);

        this.oksUnderConstructionElementFactory = oksUnderConstructionElementFactory;
    }

    @Override
    public List<OksUnderConstructionElement> read(XMLStreamReader reader) {
        ObjectUnderConstructionRecord record;
        try {
            record = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения сооружения : {}", ex.getMessage());

            return Collections.emptyList();
        }

        return oksUnderConstructionElementFactory.parseByGeometry(record);
    }
}
