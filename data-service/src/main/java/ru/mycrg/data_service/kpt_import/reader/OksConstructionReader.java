package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.oks.parsers.OksConstructionElementParser;
import ru.mycrg.data_service.kpt_import.model.generated.ConstructionRecord;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;

@Component
public class OksConstructionReader extends CommonKptXmlElementReader<OksConstructionElement, ConstructionRecord> {

    private static final Logger log = LoggerFactory.getLogger(OksConstructionReader.class);

    private final OksConstructionElementParser oksConstructionElementFactory;

    public OksConstructionReader(OksConstructionElementParser oksConstructionElementFactory) throws JAXBException {
        super(ConstructionRecord.class, OksConstructionElement.XML_TAG);

        this.oksConstructionElementFactory = oksConstructionElementFactory;
    }

    @Override
    public List<OksConstructionElement> read(XMLStreamReader reader) {
        ConstructionRecord record;
        try {
            record = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения сооружения: {}", ex.getMessage());

            return Collections.emptyList();
        }

        return oksConstructionElementFactory.parseByGeometry(record);
    }
}
