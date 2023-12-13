package ru.mycrg.data_service.kpt_import.reader.kvartal;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.kvartal.KvartalCadNumElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.Map;

@Component
public class KvartalCadastralNumberReader extends KvartalPartialDataReader<KvartalCadNumElement, String> {

    public KvartalCadastralNumberReader() throws JAXBException {
        super(String.class, "cadastral_number");
    }

    @Override
    public KvartalCadNumElement read(XMLStreamReader reader) {
        try {
            String cadNum =  unmarshall(reader);
            return new KvartalCadNumElement(Map.of("cadastralnum", cadNum));
        } catch (JAXBException e) {
            return new KvartalCadNumElement(Collections.emptyMap());
        }
    }
}
