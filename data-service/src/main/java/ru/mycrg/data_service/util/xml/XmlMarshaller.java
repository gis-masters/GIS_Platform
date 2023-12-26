package ru.mycrg.data_service.util.xml;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import java.io.StringReader;
import java.io.StringWriter;

public class XmlMarshaller {

    private final NamespacePrefixMapper namespacePrefixMapper;

    public XmlMarshaller(NamespacePrefixMapper namespacePrefixMapper) {
        this.namespacePrefixMapper = namespacePrefixMapper;
    }

    public <T> String marshall(T object, Class<T> tClass) throws JAXBException {
        var marshaller = JAXBContext
                .newInstance(tClass)
                .createMarshaller();

        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        marshaller.setProperty("com.sun.xml.bind.namespacePrefixMapper", namespacePrefixMapper);

        StringWriter sw = new StringWriter();
        marshaller.marshal(object, sw);

        return sw.toString();
    }

    public <T> T unmarshall(String xml, Class<T> tClass) throws JAXBException {
        var jaxbUnmarshaller = JAXBContext
                .newInstance(tClass)
                .createUnmarshaller();

        return (T) jaxbUnmarshaller.unmarshal(new StringReader(xml));
    }
}
