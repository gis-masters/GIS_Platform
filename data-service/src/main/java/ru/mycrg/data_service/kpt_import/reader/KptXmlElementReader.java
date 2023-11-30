package ru.mycrg.data_service.kpt_import.reader;

import ru.mycrg.data_service.kpt_import.model.KptElement;

import javax.xml.stream.XMLStreamReader;

/**
 * Обработчик xml элемента КПТ
 */
public interface KptXmlElementReader<T extends KptElement> {

    T read(XMLStreamReader reader);

    String getXmlTag();
}
