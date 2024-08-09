package ru.mycrg.data_service.kpt_import.reader.kvartal;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.kvartal.KvartalCadNumElement;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.service.smev3.fields.CommonFields.CADASTRALNUM;

@Component
public class KvartalCadastralNumberReader extends KvartalPartialDataReader<KvartalCadNumElement, String> {

    public KvartalCadastralNumberReader() throws JAXBException {
        super(String.class, "cadastral_number");
    }

    @Override
    public List<KvartalCadNumElement> read(XMLStreamReader reader) {
        try {
            String cadNum =  unmarshall(reader);
            return Collections.singletonList(new KvartalCadNumElement(Map.of(CADASTRALNUM, cadNum)));
        } catch (JAXBException e) {
            return Collections.emptyList();
        }
    }
}
