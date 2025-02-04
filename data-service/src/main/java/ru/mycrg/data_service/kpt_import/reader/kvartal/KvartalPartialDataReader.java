package ru.mycrg.data_service.kpt_import.reader.kvartal;

import ru.mycrg.data_service.kpt_import.model.KvartalElement;
import ru.mycrg.data_service.kpt_import.model.kvartal.KvartalPartialDataElement;
import ru.mycrg.data_service.kpt_import.reader.CommonKptXmlElementReader;

import javax.xml.bind.JAXBException;
import javax.xml.stream.XMLStreamReader;
import java.util.List;

public abstract class KvartalPartialDataReader<T extends KvartalPartialDataElement, X> extends CommonKptXmlElementReader<T, X> {

    protected KvartalPartialDataReader(Class<X> xmlClass, String xmlTag) throws JAXBException {
        super(xmlClass, xmlTag);
    }

    public void readKvartalData(XMLStreamReader reader, KvartalElement kvartalElement) {
        List<T> partialDataList = read(reader);
        if (!partialDataList.isEmpty()) {
            kvartalElement.getContent().putAll(partialDataList.get(0).getContent());
        }
    }
}
