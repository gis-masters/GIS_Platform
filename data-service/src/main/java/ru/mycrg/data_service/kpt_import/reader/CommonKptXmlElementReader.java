package ru.mycrg.data_service.kpt_import.reader;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLStreamReader;

public abstract class CommonKptXmlElementReader<T extends KptElement, X> implements KptXmlElementReader<T> {
    protected final Unmarshaller unmarshaller;
    private final Class<X> xmlClass;
    private final String xmlTag;

    protected CommonKptXmlElementReader(Class<X> xmlClass, String xmlTag) throws JAXBException {
        JAXBContext jaxbContext = JAXBContext.newInstance(xmlClass);
        this.unmarshaller = jaxbContext.createUnmarshaller();
        this.xmlClass = xmlClass;
        this.xmlTag = xmlTag;
    }

    protected X unmarshall(XMLStreamReader reader) throws JAXBException {
        return unmarshaller.unmarshal(reader, xmlClass).getValue();
    }

    @Override
    public String getXmlTag() {
        return xmlTag;
    }
}
