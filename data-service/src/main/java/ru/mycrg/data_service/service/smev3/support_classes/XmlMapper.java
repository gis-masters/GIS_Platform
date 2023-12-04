package ru.mycrg.data_service.service.smev3.support_classes;

import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rns_1_0_10.FIOType;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

public class XmlMapper {

    public static XMLGregorianCalendar mapCalendar(LocalDateTime source) throws SmevRequestException {
        if (source == null) {
            return null;
        }
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(source.toString());
        } catch (DatatypeConfigurationException e) {
            throw SmevRequestException.xmlMapping("mapCalendar", e);
        }
    }

    public static XMLGregorianCalendar mapCalendar(LocalDate source) throws SmevRequestException {
        if (source == null) {
            return null;
        }
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(source.toString());
        } catch (DatatypeConfigurationException e) {
            throw SmevRequestException.xmlMapping("mapCalendar", e);
        }
    }

    public static LocalDate mapLocalDate(XMLGregorianCalendar source) {
        if (source == null) {
            return null;
        }
        return LocalDate.of(source.getYear(), source.getMonth(), source.getDay());
    }

    /**
     * Порядок "фамилия имя отчество"
     */
    public static FIOType mapFio(String source) {
        if (source == null) {
            return null;
        }

        // Разбиваем на
        var strArr = new ArrayList<>(Arrays.asList(source.split(" ")));

        // добавляем недостающих элементов
        while (strArr.size() < 3) {
            strArr.add("_");
        }

        var fioType = new FIOType();
        fioType.setSurname(strArr.get(0));
        fioType.setName(strArr.get(1));
        fioType.setMiddleName(strArr.get(2));
        return fioType;
    }
}
