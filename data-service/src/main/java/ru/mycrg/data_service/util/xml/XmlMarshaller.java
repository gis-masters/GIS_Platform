package ru.mycrg.data_service.util.xml;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import org.glassfish.jaxb.runtime.marshaller.NamespacePrefixMapper;

import java.io.StringReader;
import java.io.StringWriter;

public class XmlMarshaller {

    public XmlMarshaller() {
        throw new IllegalStateException("Utility class");
    }

    public static <T> String marshall(T object, Class<T> tClass, NamespacePrefixMapper namespacePrefixMapper)
            throws JAXBException {
        var marshaller = JAXBContext
                .newInstance(tClass)
                .createMarshaller();

        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        marshaller.setProperty("org.glassfish.jaxb.namespacePrefixMapper", namespacePrefixMapper);

        StringWriter sw = new StringWriter();
        marshaller.marshal(object, sw);

        return sw.toString();
    }

    public static <T> T unmarshall(String xml, Class<T> tClass) throws JAXBException {
        var jaxbUnmarshaller = JAXBContext
                .newInstance(tClass)
                .createUnmarshaller();

        return (T) jaxbUnmarshaller.unmarshal(new StringReader(xml));
    }
}
