package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.oks.parsers.OksBuildingElementParser;
import ru.mycrg.data_service.kpt_import.model.generated.BuildRecord;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;

@Component
public class OksBuildingReader extends CommonKptXmlElementReader<OksBuildingElement, BuildRecord> {

    private static final Logger log = LoggerFactory.getLogger(OksBuildingReader.class);

    private final OksBuildingElementParser oksBuildingElementFactory;

    public OksBuildingReader(OksBuildingElementParser oksBuildingElementFactory) throws JAXBException {
        super(BuildRecord.class, OksBuildingElement.XML_TAG);
        this.oksBuildingElementFactory = oksBuildingElementFactory;
    }

    @Override
    public List<OksBuildingElement> read(XMLStreamReader reader) {
        BuildRecord record;
        try {
            record = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения здания: {}", ex.getMessage());

            return Collections.emptyList();
        }

        return Collections.singletonList(oksBuildingElementFactory.parseByGeometry(record));
    }
}
