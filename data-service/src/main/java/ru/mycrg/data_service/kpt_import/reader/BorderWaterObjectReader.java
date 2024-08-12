package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElement;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElementFactory;
import ru.mycrg.data_service.kpt_import.model.generated.CoastlineBoundariesType;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;

@Component

public class BorderWaterObjectReader extends CommonKptXmlElementReader<BorderWaterObjectElement, CoastlineBoundariesType.CoastlineRecord> {

    private static final Logger log = LoggerFactory.getLogger(BorderWaterObjectReader.class);

    private final BorderWaterObjectElementFactory factory;

    protected BorderWaterObjectReader(BorderWaterObjectElementFactory factory) throws JAXBException {
        super(CoastlineBoundariesType.CoastlineRecord.class, BorderWaterObjectElement.XML_TAG);

        this.factory = factory;
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
}
