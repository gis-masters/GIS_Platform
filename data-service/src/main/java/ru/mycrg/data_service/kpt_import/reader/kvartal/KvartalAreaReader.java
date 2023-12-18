package ru.mycrg.data_service.kpt_import.reader.kvartal;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.generated.AreaQuarter;
import ru.mycrg.data_service.kpt_import.model.kvartal.KvartalAreaElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class KvartalAreaReader extends KvartalPartialDataReader<KvartalAreaElement, AreaQuarter> {

    public KvartalAreaReader() throws JAXBException {
        super(AreaQuarter.class, "area_quarter");
    }

    @Override
    public List<KvartalAreaElement> read(XMLStreamReader reader) {
        try {
            AreaQuarter areaQuarter = unmarshall(reader);
            return Collections.singletonList(new KvartalAreaElement(Map.of("aria_total", areaQuarter.getArea())));
        } catch (JAXBException e) {
            return Collections.emptyList();
        }
    }
}
