package ru.mycrg.data_service.util.smev3;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.io.StringReader;
import java.io.StringWriter;
import java.time.LocalDate;

public class Smev3XmlUtils {

    public static XMLGregorianCalendar mapCalendar(LocalDate source) throws Exception {
        if (source == null) {
            return null;
        }
        return DatatypeFactory.newInstance().newXMLGregorianCalendar(source.toString());
    }

    public static LocalDate mapLocalDate(XMLGregorianCalendar source) {
        if (source == null) {
            return null;
        }
        return LocalDate.of(source.getYear(), source.getMonth(), source.getDay());
    }

    public static <T> String marshall(T object, Class<T> tClass) throws JAXBException {
        var marshaller = JAXBContext
                .newInstance(tClass)
                .createMarshaller();

        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        marshaller.setProperty("com.sun.xml.bind.namespacePrefixMapper", namespacePrefixMapper);

        StringWriter sw = new StringWriter();
        marshaller.marshal(object, sw);
        var xmlText = sw.toString();

        //По непонятной причине XML формируется некорректно
        xmlText = xmlText
                .replace("<typ:Request>", "<tns:Request>")
                .replace("</typ:Request>", "</tns:Request>");

        return xmlText;
    }

    public static <T> T unmarshall(String xml, Class<T> tClass) throws JAXBException {
        var jaxbUnmarshaller = JAXBContext
                .newInstance(tClass)
                .createUnmarshaller();

        //По непонятной причине XML формируется некорректно
        xml = xml
                .replace("<tns:Request>", "<typ:Request>")
                .replace("</tns:Request>", "</typ:Request>");

        T clientMessageUnmarshal = (T) jaxbUnmarshaller.unmarshal(new StringReader(xml));

        return clientMessageUnmarshal;
    }

    private static NamespacePrefixMapper namespacePrefixMapper = new NamespacePrefixMapper() {
        @Override
        public String getPreferredPrefix(String urn, String s1, boolean b) {
            switch (urn) {
                case "urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9":
                    return "tns";
                case "urn://x-artefacts-uishc.domrf.ru/receipt-rns/commons/1.0.9":
                    return "com";
                case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                    return "smev";
                default:
                    return "typ";
            }
        }
    };
}
