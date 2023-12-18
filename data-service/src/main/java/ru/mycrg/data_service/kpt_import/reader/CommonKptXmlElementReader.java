package ru.mycrg.data_service.kpt_import.reader;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLStreamReader;

public abstract class CommonKptXmlElementReader<T extends KptElement, X> implements KptXmlElementReader<T> {
    private final JAXBContext jaxbContext;
    private ThreadLocal<Unmarshaller> unmarshaller;
    private final Class<X> xmlClass;
    private final String xmlTag;

    protected CommonKptXmlElementReader(Class<X> xmlClass, String xmlTag) throws JAXBException {
        this.jaxbContext = JAXBContext.newInstance(xmlClass);
        this.xmlClass = xmlClass;
        this.xmlTag = xmlTag;
        this.unmarshaller = new ThreadLocal<>();
    }

    protected X unmarshall(XMLStreamReader reader) throws JAXBException {
        if (unmarshaller.get() == null) {
            unmarshaller.set(jaxbContext.createUnmarshaller());
        }
        return unmarshaller.get().unmarshal(reader, xmlClass).getValue();
    }

    @Override
    public String getXmlTag() {
        return xmlTag;
    }
}
