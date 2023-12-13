package ru.mycrg.data_service.kpt_import.reader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectElement;
import ru.mycrg.data_service.kpt_import.model.factory.BorderWaterObjectElementFactory;
import ru.mycrg.data_service.kpt_import.model.generated.CoastlineBoundariesType;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;

@Component
public class BorderWaterObjectReader extends CommonKptXmlElementReader<BorderWaterObjectElement,
        CoastlineBoundariesType.CoastlineRecord>
{

    private static final Logger log = LoggerFactory.getLogger(BorderWaterObjectReader.class);

    private final BorderWaterObjectElementFactory factory;

    protected BorderWaterObjectReader(BorderWaterObjectElementFactory factory)
            throws JAXBException {
        super(CoastlineBoundariesType.CoastlineRecord.class, BorderWaterObjectElement.XML_TAG);
        this.factory = factory;
    }

    @Override
    public BorderWaterObjectElement read(XMLStreamReader reader) {
        CoastlineBoundariesType.CoastlineRecord r;
        try {
            r = unmarshall(reader);
        } catch (Exception ex) {
            log.warn("Ошибка чтения береговой линии: " + ex.getMessage());
            return new BorderWaterObjectElement(Collections.emptyMap());
        }

        return factory.fromCoastlineRecord(r);
    }
}
