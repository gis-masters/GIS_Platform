package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.factory.OksUnderConstructionElementFactory;
import ru.mycrg.data_service.kpt_import.model.generated.ObjectUnderConstructionRecord;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;

@Component
public class OksUnderConstructionReader extends CommonKptXmlElementReader<OksUnderConstructionElement,
        ObjectUnderConstructionRecord>
{

    private static final Logger log = LoggerFactory.getLogger(OksUnderConstructionReader.class);

    private final OksUnderConstructionElementFactory oksUnderConstructionElementFactory;

    public OksUnderConstructionReader(
            OksUnderConstructionElementFactory oksUnderConstructionElementFactory) throws JAXBException {
        super(ObjectUnderConstructionRecord.class, OksUnderConstructionElement.XML_TAG);
        this.oksUnderConstructionElementFactory = oksUnderConstructionElementFactory;
    }

    @Override
    public OksUnderConstructionElement read(XMLStreamReader reader) {
        ObjectUnderConstructionRecord r;
        try {
            r = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения сооружения : " + ex.getMessage());
            return new OksUnderConstructionElement(Collections.emptyMap());
        }

        return oksUnderConstructionElementFactory.fromObjectUnderConstructionRecord(r);
    }
}
