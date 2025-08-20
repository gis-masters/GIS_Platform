package ru.mycrg.data_service.util.xml;


import ru.mycrg.data_service.exceptions.XmlMarshallerException;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class XmlMapper {

    public static XMLGregorianCalendar mapCalendar(LocalDateTime source) {
        if (source == null) {
            return null;
        }
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(source.toString());
        } catch (DatatypeConfigurationException e) {
            throw XmlMarshallerException.mapping("mapCalendar", e);
        }
    }

    public static XMLGregorianCalendar mapCalendar(LocalDate source) {
        if (source == null) {
            return null;
        }
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(source.toString());
        } catch (DatatypeConfigurationException e) {
            throw XmlMarshallerException.mapping("mapCalendar", e);
        }
    }

    public static LocalDate mapLocalDate(XMLGregorianCalendar source) {
        if (source == null) {
            return null;
        }
        return LocalDate.of(source.getYear(), source.getMonth(), source.getDay());
    }

    public static LocalDateTime mapLocalDateTime(XMLGregorianCalendar source) {
        if (source == null) {
            return null;
        }
        return LocalDateTime.of(mapLocalDate(source), LocalTime.of(0, 0, 0));
    }
}
